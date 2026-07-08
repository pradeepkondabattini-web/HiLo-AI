import '../../domain/create_event_input.dart';
import '../../domain/event.dart';
import '../../domain/event_budget.dart';
import '../../domain/event_status.dart';
import '../../domain/events_repository.dart';
import '../datasources/events_api_datasource.dart';

/// [EventsRepository] backed by event-service (EOS-000 §56).
class EventsRepositoryImpl implements EventsRepository {
  EventsRepositoryImpl(this._api);
  final EventsApiDataSource _api;

  @override
  Future<List<Event>> listEvents({int? limit, String? cursor}) =>
      _api.listEvents(limit: limit, cursor: cursor);

  @override
  Future<Event> getEvent(String id) => _api.getEvent(id);

  @override
  Future<(Event, EventBudget)> createEvent(CreateEventInput input) => _api.createEvent(input);

  @override
  Future<Event> transition(String id, EventStatus target) => _api.transition(id, target);

  @override
  Future<void> deleteEvent(String id) => _api.deleteEvent(id);
}
