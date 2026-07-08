import 'package:dio/dio.dart';

import '../../domain/create_event_input.dart';
import '../../domain/event.dart';
import '../../domain/event_budget.dart';
import '../../domain/event_status.dart';
import '../../domain/events_failure.dart';
import '../models/event_budget_dto.dart';
import '../models/event_dto.dart';

/// Talks to event-service over the authenticated Dio client (EOS-002-P3-Part-04 §23).
class EventsApiDataSource {
  EventsApiDataSource(this._dio);
  final Dio _dio;

  Future<List<Event>> listEvents({int? limit, String? cursor}) async {
    try {
      final res = await _dio.get<dynamic>(
        '/api/v1/events',
        queryParameters: <String, dynamic>{
          if (limit != null) 'limit': limit,
          if (cursor != null) 'cursor': cursor,
        },
      );
      final data = _asMap(res.data);
      final items = (data['items'] as List<dynamic>?) ?? const <dynamic>[];
      return items.whereType<Map<String, dynamic>>().map(EventDto.fromJson).toList();
    } on DioException catch (e) {
      throw _map(e);
    }
  }

  Future<Event> getEvent(String id) async {
    try {
      final res = await _dio.get<dynamic>('/api/v1/events/$id');
      return EventDto.fromJson(_asMap(res.data));
    } on DioException catch (e) {
      throw _map(e);
    }
  }

  Future<(Event, EventBudget)> createEvent(CreateEventInput input) async {
    try {
      final res = await _dio.post<dynamic>('/api/v1/events', data: input.toJson());
      final data = _asMap(res.data);
      return (
        EventDto.fromJson(_asMap(data['event'])),
        EventBudgetDto.fromJson(_asMap(data['budget'])),
      );
    } on DioException catch (e) {
      throw _map(e);
    }
  }

  Future<Event> transition(String id, EventStatus target) async {
    try {
      final res = await _dio.post<dynamic>(
        '/api/v1/events/$id/status',
        data: <String, dynamic>{'status': target.wire},
      );
      return EventDto.fromJson(_asMap(res.data));
    } on DioException catch (e) {
      throw _map(e);
    }
  }

  Future<void> deleteEvent(String id) async {
    try {
      await _dio.delete<dynamic>('/api/v1/events/$id');
    } on DioException catch (e) {
      throw _map(e);
    }
  }

  Map<String, dynamic> _asMap(dynamic data) {
    if (data is Map<String, dynamic>) return data;
    throw const EventsApiException('Unexpected response from the server.');
  }

  EventsApiException _map(DioException e) {
    switch (e.type) {
      case DioExceptionType.connectionError:
      case DioExceptionType.connectionTimeout:
      case DioExceptionType.receiveTimeout:
      case DioExceptionType.sendTimeout:
        return const EventsApiException('Please check your internet connection and try again.');
      default:
        break;
    }
    final status = e.response?.statusCode;
    final serverMessage = _serverMessage(e);
    return switch (status) {
      401 => const EventsApiException('Your session has expired. Please sign in again.'),
      403 => const EventsApiException('You do not have access to this event.'),
      404 => const EventsApiException('Event not found.'),
      422 => EventsApiException(serverMessage ?? 'Please check the details and try again.'),
      409 => EventsApiException(
        serverMessage ?? "That action conflicts with the event's current state.",
      ),
      _ => const EventsApiException('Something went wrong. Please try again.'),
    };
  }

  String? _serverMessage(DioException e) {
    final data = e.response?.data;
    if (data is Map && data['error'] is Map) {
      final message = (data['error'] as Map)['message'];
      if (message is String) return message;
    }
    return null;
  }
}
