import '../../domain/event.dart';
import '../../domain/event_status.dart';

/// Maps the event-service `EventDto` JSON into the domain [Event].
class EventDto {
  const EventDto._();

  static Event fromJson(Map<String, dynamic> json) {
    return Event(
      id: json['id'] as String,
      status: EventStatus.fromWire(json['status'] as String? ?? 'draft'),
      title: json['title'] as String? ?? '',
      category: json['category'] as String? ?? '',
      eventDate: json['eventDate'] as String? ?? '',
      startTime: json['startTime'] as String?,
      endTime: json['endTime'] as String?,
      city: json['city'] as String? ?? '',
      guestCount: (json['guestCount'] as num?)?.toInt() ?? 0,
      ownerId: json['ownerId'] as String? ?? '',
      coHostIds: _stringList(json['coHostIds']),
      memberIds: _stringList(json['memberIds']),
      budgetId: json['budgetId'] as String?,
      venueId: json['venueId'] as String?,
      description: json['description'] as String?,
      dressCode: json['dressCode'] as String?,
      tags: json['tags'] == null ? null : _stringList(json['tags']),
      notes: json['notes'] as String?,
      version: (json['version'] as num?)?.toInt() ?? 1,
      createdAt: json['createdAt'] as String? ?? '',
      updatedAt: json['updatedAt'] as String? ?? '',
    );
  }

  static List<String> _stringList(dynamic value) =>
      (value as List<dynamic>?)?.whereType<String>().toList(growable: false) ?? const <String>[];
}
