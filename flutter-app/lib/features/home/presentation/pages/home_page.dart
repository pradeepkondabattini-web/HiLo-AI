import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../l10n/app_localizations.dart';
import '../../../../shared/widgets/app_loading_indicator.dart';
import '../../../authentication/application/auth_providers.dart';

/// Authenticated landing / dashboard shell (Sprint 1B). The event dashboard and
/// create-event wizard land in Sprint 1C's Flutter slice; for now this confirms the
/// signed-in session and offers sign-out.
class HomePage extends ConsumerWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = AppLocalizations.of(context);
    final theme = Theme.of(context);
    final auth = ref.watch(authControllerProvider);

    return Scaffold(
      appBar: AppBar(
        title: Text(l10n.appTitle),
        actions: <Widget>[
          IconButton(
            tooltip: 'Sign out',
            onPressed: () => ref.read(authControllerProvider.notifier).signOut(),
            icon: const Icon(Icons.logout),
          ),
        ],
      ),
      body: auth.when(
        loading: () => const AppLoadingIndicator(),
        error: (error, _) => const Center(
          child: Padding(
            padding: EdgeInsets.all(24),
            child: Text('Could not load your profile. Please try again.', textAlign: TextAlign.center),
          ),
        ),
        data: (user) {
          if (user == null) {
            // Signed out — the router guard redirects to /welcome.
            return const AppLoadingIndicator();
          }
          return Center(
            child: Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: <Widget>[
                  Icon(Icons.celebration_outlined, size: 64, color: theme.colorScheme.primary),
                  const SizedBox(height: 16),
                  Text(
                    'Welcome, ${user.displayName}',
                    style: theme.textTheme.headlineSmall,
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 4),
                  Text(
                    user.email,
                    style: theme.textTheme.bodyMedium
                        ?.copyWith(color: theme.colorScheme.onSurfaceVariant),
                  ),
                  const SizedBox(height: 16),
                  Wrap(
                    spacing: 8,
                    children: user.roles
                        .map((role) => Chip(label: Text(role.label)))
                        .toList(),
                  ),
                  const SizedBox(height: 24),
                  Text(
                    'Your event dashboard will appear here.',
                    style: theme.textTheme.bodyLarge,
                    textAlign: TextAlign.center,
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
