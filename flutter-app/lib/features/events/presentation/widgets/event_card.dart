import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

import '../../domain/event.dart';

/// Summary card for one event on the dashboard (EOS-002-P3-Part-04 §8).
class EventCard extends StatelessWidget {
  const EventCard({super.key, required this.event, this.onTap});

  final Event event;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final date = event.eventDateTime;
    final dateLabel = date != null ? DateFormat.yMMMEd().format(date) : event.eventDate;

    return Card(
      clipBehavior: Clip.antiAlias,
      child: ListTile(
        onTap: onTap,
        leading: CircleAvatar(child: Text('${event.guestCount}')),
        title: Text(event.title, maxLines: 1, overflow: TextOverflow.ellipsis),
        subtitle: Text(
          '${event.category} · $dateLabel · ${event.city}',
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
        ),
        trailing: Chip(
          label: Text(event.status.label),
          visualDensity: VisualDensity.compact,
        ),
      ),
    );
  }
}
