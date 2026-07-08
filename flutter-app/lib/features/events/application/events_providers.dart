import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/config/app_environment.dart';
import '../../../core/network/authenticated_dio.dart';
import '../../authentication/application/auth_providers.dart';
import '../data/datasources/events_api_datasource.dart';
import '../data/repositories/events_repository_impl.dart';
import '../domain/event.dart';
import '../domain/events_repository.dart';
import 'events_list_controller.dart';

/// DI graph for Event Management (EOS-003-P2 §10). Reuses the Firebase identity from the
/// authentication feature to authorize event-service calls.

final eventsApiDataSourceProvider = Provider<EventsApiDataSource>((ref) {
  final firebase = ref.watch(firebaseAuthDataSourceProvider);
  final dio = createAuthenticatedDio(
    baseUrl: AppEnvironment.apiBaseUrl,
    idTokenProvider: firebase.currentIdToken,
  );
  return EventsApiDataSource(dio);
});

final eventsRepositoryProvider = Provider<EventsRepository>(
  (ref) => EventsRepositoryImpl(ref.watch(eventsApiDataSourceProvider)),
);

/// The caller's events for the dashboard (loading/error/data).
final eventsListControllerProvider =
    AsyncNotifierProvider<EventsListController, List<Event>>(EventsListController.new);

/// One event by id, for the workspace/detail screen.
final eventDetailProvider = FutureProvider.family<Event, String>(
  (ref, id) => ref.watch(eventsRepositoryProvider).getEvent(id),
);
