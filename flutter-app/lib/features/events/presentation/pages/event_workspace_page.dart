import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';

import '../../../../shared/widgets/app_loading_indicator.dart';
import '../../application/events_list_controller.dart';
import '../../application/events_providers.dart';
import '../../domain/event.dart';

/// Event workspace shell (EOS-002-P3-Part-04 §9). Shows the event summary; collaboration
/// tools (chat, tasks, guests, budget) arrive in later sprints.
class EventWorkspacePage extends ConsumerWidget {
  const EventWorkspacePage({super.key, required this.eventId});

  final String eventId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final eventAsync = ref.watch(eventDetailProvider(eventId));

    return Scaffold(
      appBar: AppBar(title: Text(eventAsync.valueOrNull?.title ?? 'Event')),
      body: eventAsync.when(
        loading: () => const AppLoadingIndicator(),
        error: (error, _) => Center(
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Text(eventsErrorMessage(error), textAlign: TextAlign.center),
          ),
        ),
        data: (event) => _EventDetail(event: event),
      ),
    );
  }
}

class _EventDetail extends StatelessWidget {
  const _EventDetail({required this.event});
  final Event event;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final date = event.eventDateTime;
    final dateLabel = date != null ? DateFormat.yMMMMEEEEd().format(date) : event.eventDate;

    return ListView(
      padding: const EdgeInsets.all(16),
      children: <Widget>[
        Row(
          children: <Widget>[
            Chip(label: Text(event.status.label)),
            const SizedBox(width: 8),
            Text(event.category, style: theme.textTheme.labelLarge),
          ],
        ),
        const SizedBox(height: 16),
        Text(event.title, style: theme.textTheme.headlineSmall),
        const SizedBox(height: 12),
        _InfoRow(icon: Icons.event_outlined, text: dateLabel),
        _InfoRow(icon: Icons.location_city_outlined, text: event.city),
        _InfoRow(icon: Icons.group_outlined, text: '${event.guestCount} guests'),
        if ((event.description ?? '').isNotEmpty) ...<Widget>[
          const SizedBox(height: 16),
          Text('About', style: theme.textTheme.titleMedium),
          const SizedBox(height: 4),
          Text(event.description!),
        ],
        const SizedBox(height: 24),
        Text(
          'Workspace tools (chat, tasks, guests, budget) arrive in a later update.',
          style: theme.textTheme.bodySmall
              ?.copyWith(color: theme.colorScheme.onSurfaceVariant),
        ),
      ],
    );
  }
}

class _InfoRow extends StatelessWidget {
  const _InfoRow({required this.icon, required this.text});
  final IconData icon;
  final String text;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        children: <Widget>[
          Icon(icon, size: 20),
          const SizedBox(width: 12),
          Expanded(child: Text(text)),
        ],
      ),
    );
  }
}
