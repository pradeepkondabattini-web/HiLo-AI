import 'event_status.dart';

/// The Event aggregate as seen by the app (mirrors the event-service `EventDto`).
class Event {
  const Event({
    required this.id,
    required this.status,
    required this.title,
    required this.category,
    required this.eventDate,
    required this.city,
    required this.guestCount,
    required this.ownerId,
    required this.coHostIds,
    required this.memberIds,
    required this.version,
    required this.createdAt,
    required this.updatedAt,
    this.startTime,
    this.endTime,
    this.budgetId,
    this.venueId,
    this.description,
    this.dressCode,
    this.tags,
    this.notes,
  });

  final String id;
  final EventStatus status;
  final String title;
  final String category;

  /// ISO-8601 string as stored by the backend. Use [eventDateTime] for display.
  final String eventDate;
  final String? startTime;
  final String? endTime;
  final String city;
  final int guestCount;
  final String ownerId;
  final List<String> coHostIds;
  final List<String> memberIds;
  final String? budgetId;
  final String? venueId;
  final String? description;
  final String? dressCode;
  final List<String>? tags;
  final String? notes;
  final int version;
  final String createdAt;
  final String updatedAt;

  DateTime? get eventDateTime => DateTime.tryParse(eventDate);

  bool isOwnedBy(String uid) => ownerId == uid;
}
