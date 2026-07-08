import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/router/app_router.dart';
import '../../application/auth_providers.dart';
import '../widgets/auth_error_listener.dart';

/// Entry screen of the registration flow (EOS-002-P3-Part-02 §5). Offers the three
/// Phase-1 providers: Google, Phone (OTP), and Email.
class WelcomePage extends ConsumerWidget {
  const WelcomePage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    listenForAuthErrors(ref, context);
    final theme = Theme.of(context);
    final busy = ref.watch(authControllerProvider).isLoading;

    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            children: <Widget>[
              const Spacer(),
              Icon(Icons.celebration_outlined, size: 72, color: theme.colorScheme.primary),
              const SizedBox(height: 24),
              Text('HiLo', style: theme.textTheme.displaySmall, textAlign: TextAlign.center),
              const SizedBox(height: 8),
              Text(
                'Plan events effortlessly, with AI by your side.',
                style: theme.textTheme.bodyLarge
                    ?.copyWith(color: theme.colorScheme.onSurfaceVariant),
                textAlign: TextAlign.center,
              ),
              const Spacer(),
              FilledButton.icon(
                onPressed: busy
                    ? null
                    : () => ref.read(authControllerProvider.notifier).signInWithGoogle(),
                icon: const Icon(Icons.g_mobiledata),
                label: const Text('Continue with Google'),
              ),
              const SizedBox(height: 12),
              OutlinedButton.icon(
                onPressed: busy ? null : () => context.push(AppRoutes.phoneSignIn),
                icon: const Icon(Icons.phone_outlined),
                label: const Text('Continue with Phone'),
              ),
              const SizedBox(height: 12),
              OutlinedButton.icon(
                onPressed: busy ? null : () => context.push(AppRoutes.emailSignIn),
                icon: const Icon(Icons.mail_outline),
                label: const Text('Continue with Email'),
              ),
              const SizedBox(height: 24),
              if (busy) const LinearProgressIndicator(),
              const SizedBox(height: 8),
              Text(
                'By continuing you agree to the Terms & Privacy Policy.',
                style: theme.textTheme.bodySmall
                    ?.copyWith(color: theme.colorScheme.onSurfaceVariant),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
