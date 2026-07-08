import 'create_event_input.dart';
import 'event.dart';
import 'event_budget.dart';
import 'event_status.dart';

/// Repository contract for Event Management (EOS-002-P3-Part-04). Talks to event-service;
/// the UI never accesses Firestore directly (EOS-000 §30). Framework-free.
abstract interface class EventsRepository {
  /// Events the caller belongs to (cursor pagination).
  Future<List<Event>> listEvents({int? limit, String? cursor});

  Future<Event> getEvent(String id);

  /// Create an event (owner = caller); returns the event and its default budget.
  Future<(Event, EventBudget)> createEvent(CreateEventInput input);

  /// Advance the lifecycle (owner/co-host).
  Future<Event> transition(String id, EventStatus target);

  /// Soft-delete an event (owner).
  Future<void> deleteEvent(String id);
}
