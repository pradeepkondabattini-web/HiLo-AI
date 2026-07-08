import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/router/app_router.dart';
import '../../../../shared/widgets/app_loading_indicator.dart';
import '../../../authentication/application/auth_providers.dart';
import '../../application/events_list_controller.dart';
import '../../application/events_providers.dart';
import '../widgets/event_card.dart';

/// The authenticated home: the user's event dashboard (EOS-002-P3-Part-04 §8).
class EventsDashboardPage extends ConsumerWidget {
  const EventsDashboardPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final eventsAsync = ref.watch(eventsListControllerProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('My Events'),
        actions: <Widget>[
          IconButton(
            tooltip: 'Sign out',
            onPressed: () => ref.read(authControllerProvider.notifier).signOut(),
            icon: const Icon(Icons.logout),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => context.push(AppRoutes.createEvent),
        icon: const Icon(Icons.add),
        label: const Text('Create event'),
      ),
      body: RefreshIndicator(
        onRefresh: () => ref.read(eventsListControllerProvider.notifier).refresh(),
        child: eventsAsync.when(
          loading: () => const AppLoadingIndicator(),
          error: (error, _) => _CenteredScroll(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: <Widget>[
                const Icon(Icons.error_outline, size: 48),
                const SizedBox(height: 12),
                Text(eventsErrorMessage(error), textAlign: TextAlign.center),
                const SizedBox(height: 8),
                const Text('Pull down to retry.'),
              ],
            ),
          ),
          data: (events) {
            if (events.isEmpty) {
              return const _CenteredScroll(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: <Widget>[
                    Icon(Icons.event_available_outlined, size: 64),
                    SizedBox(height: 16),
                    Text('No events yet', style: TextStyle(fontSize: 18)),
                    SizedBox(height: 8),
                    Text('Tap “Create event” to plan your first one.', textAlign: TextAlign.center),
                  ],
                ),
              );
            }
            return ListView.builder(
              padding: const EdgeInsets.fromLTRB(12, 12, 12, 96),
              itemCount: events.length,
              itemBuilder: (context, i) {
                final event = events[i];
                return EventCard(
                  event: event,
                  onTap: () => context.push('/events/${event.id}'),
                );
              },
            );
          },
        ),
      ),
    );
  }
}

/// A vertically-centered child that is still scrollable, so pull-to-refresh works on the
/// empty and error states.
class _CenteredScroll extends StatelessWidget {
  const _CenteredScroll({required this.child});
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        return SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          child: ConstrainedBox(
            constraints: BoxConstraints(minHeight: constraints.maxHeight),
            child: Center(child: Padding(padding: const EdgeInsets.all(24), child: child)),
          ),
        );
      },
    );
  }
}
