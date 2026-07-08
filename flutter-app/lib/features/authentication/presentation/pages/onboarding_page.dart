import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../application/auth_providers.dart';
import '../../domain/user_role.dart';
import '../widgets/auth_error_listener.dart';

/// First-time onboarding (EOS-002-P3-Part-02 §7): profile + role selection + language.
///
/// Roles are backend-managed and cannot be self-assigned (ADR-008, no self-escalation):
/// choosing "Business" records intent and points the user to verification later; the
/// account proceeds as Consumer until a Business profile is verified (Part-02 §8).
class OnboardingPage extends ConsumerStatefulWidget {
  const OnboardingPage({super.key});

  @override
  ConsumerState<OnboardingPage> createState() => _OnboardingPageState();
}

class _OnboardingPageState extends ConsumerState<OnboardingPage> {
  final _formKey = GlobalKey<FormState>();
  late final TextEditingController _name;
  final _city = TextEditingController();
  String _language = 'en';
  UserRole _role = UserRole.consumer;

  static const Map<String, String> _languages = {
    'en': 'English',
    'hi': 'हिन्दी',
    'te': 'తెలుగు',
  };

  @override
  void initState() {
    super.initState();
    final user = ref.read(authControllerProvider).valueOrNull;
    _name = TextEditingController(text: user?.displayName ?? '');
  }

  @override
  void dispose() {
    _name.dispose();
    _city.dispose();
    super.dispose();
  }

  void _submit() {
    if (!_formKey.currentState!.validate()) return;
    if (_role == UserRole.business) {
      ScaffoldMessenger.of(context)
        ..hideCurrentSnackBar()
        ..showSnackBar(
          const SnackBar(
            content: Text(
              'Business accounts require verification — you can set that up later in Settings.',
            ),
          ),
        );
    }
    ref.read(authControllerProvider.notifier).completeOnboarding(
      displayName: _name.text.trim(),
      city: _city.text.trim(),
      preferredLanguage: _language,
    );
  }

  @override
  Widget build(BuildContext context) {
    listenForAuthErrors(ref, context);
    final busy = ref.watch(authControllerProvider).isLoading;
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(title: const Text('Complete your profile')),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: <Widget>[
                TextFormField(
                  controller: _name,
                  textCapitalization: TextCapitalization.words,
                  decoration: const InputDecoration(labelText: 'Full name'),
                  validator: (v) =>
                      (v ?? '').trim().isEmpty ? 'Please enter your name' : null,
                ),
                const SizedBox(height: 16),
                TextFormField(
                  controller: _city,
                  textCapitalization: TextCapitalization.words,
                  decoration: const InputDecoration(
                    labelText: 'City',
                    hintText: 'Hyderabad',
                  ),
                  validator: (v) =>
                      (v ?? '').trim().isEmpty ? 'Please enter your city' : null,
                ),
                const SizedBox(height: 16),
                DropdownButtonFormField<String>(
                  initialValue: _language,
                  decoration: const InputDecoration(labelText: 'Preferred language'),
                  items: _languages.entries
                      .map((e) => DropdownMenuItem(value: e.key, child: Text(e.value)))
                      .toList(),
                  onChanged: busy ? null : (v) => setState(() => _language = v ?? 'en'),
                ),
                const SizedBox(height: 24),
                Text('I am joining as', style: theme.textTheme.labelLarge),
                const SizedBox(height: 8),
                Wrap(
                  spacing: 8,
                  children: UserRole.selectableAtOnboarding.map((role) {
                    return ChoiceChip(
                      label: Text(role.label),
                      selected: _role == role,
                      onSelected: busy ? null : (_) => setState(() => _role = role),
                    );
                  }).toList(),
                ),
                const SizedBox(height: 32),
                FilledButton(
                  onPressed: busy ? null : _submit,
                  child: busy
                      ? const SizedBox.square(
                          dimension: 20,
                          child: CircularProgressIndicator(strokeWidth: 2),
                        )
                      : const Text('Continue'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
