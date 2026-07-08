import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../application/auth_controller.dart';
import '../../application/auth_providers.dart';
import '../widgets/auth_error_listener.dart';

/// Phone (OTP) sign-in (EOS-002-P3-Part-02 §6). Two steps: enter number → enter the
/// SMS code. Phone numbers are entered in E.164 form (e.g. +9198…).
class PhoneSignInPage extends ConsumerStatefulWidget {
  const PhoneSignInPage({super.key});

  @override
  ConsumerState<PhoneSignInPage> createState() => _PhoneSignInPageState();
}

enum _Step { enterNumber, enterCode }

class _PhoneSignInPageState extends ConsumerState<PhoneSignInPage> {
  final _phone = TextEditingController(text: '+91');
  final _code = TextEditingController();
  _Step _step = _Step.enterNumber;
  String? _verificationId;
  bool _sending = false;

  @override
  void dispose() {
    _phone.dispose();
    _code.dispose();
    super.dispose();
  }

  Future<void> _sendCode() async {
    final phone = _phone.text.trim();
    if (phone.length < 8) {
      _snack('Enter a valid phone number in international format (e.g. +9198…).');
      return;
    }
    setState(() => _sending = true);
    try {
      final id = await ref
          .read(authControllerProvider.notifier)
          .startPhoneVerification(phone);
      if (!mounted) return;
      setState(() {
        _verificationId = id;
        _step = _Step.enterCode;
      });
    } catch (error) {
      if (!mounted) return;
      _snack(authErrorMessage(error));
    } finally {
      if (mounted) setState(() => _sending = false);
    }
  }

  void _confirm() {
    final id = _verificationId;
    final code = _code.text.trim();
    if (id == null || code.isEmpty) return;
    ref
        .read(authControllerProvider.notifier)
        .confirmPhoneCode(verificationId: id, smsCode: code);
  }

  void _snack(String message) {
    ScaffoldMessenger.of(context)
      ..hideCurrentSnackBar()
      ..showSnackBar(SnackBar(content: Text(message)));
  }

  @override
  Widget build(BuildContext context) {
    listenForAuthErrors(ref, context);
    final busy = ref.watch(authControllerProvider).isLoading || _sending;
    final onCodeStep = _step == _Step.enterCode;

    return Scaffold(
      appBar: AppBar(title: const Text('Sign in with phone')),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: <Widget>[
              if (!onCodeStep) ...[
                TextField(
                  controller: _phone,
                  keyboardType: TextInputType.phone,
                  autofillHints: const [AutofillHints.telephoneNumber],
                  decoration: const InputDecoration(
                    labelText: 'Phone number',
                    hintText: '+9198XXXXXXXX',
                  ),
                ),
                const SizedBox(height: 24),
                FilledButton(
                  onPressed: busy ? null : _sendCode,
                  child: const Text('Send code'),
                ),
              ] else ...[
                Text('Enter the 6-digit code sent to ${_phone.text.trim()}'),
                const SizedBox(height: 16),
                TextField(
                  controller: _code,
                  keyboardType: TextInputType.number,
                  autofillHints: const [AutofillHints.oneTimeCode],
                  decoration: const InputDecoration(labelText: 'Verification code'),
                ),
                const SizedBox(height: 24),
                FilledButton(
                  onPressed: busy ? null : _confirm,
                  child: const Text('Verify'),
                ),
                TextButton(
                  onPressed: busy ? null : () => setState(() => _step = _Step.enterNumber),
                  child: const Text('Change number'),
                ),
              ],
              const SizedBox(height: 16),
              if (busy) const LinearProgressIndicator(),
            ],
          ),
        ),
      ),
    );
  }
}
