import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../domain/event.dart';
import '../domain/events_failure.dart';
import 'events_providers.dart';

/// Loads and refreshes the caller's events for the dashboard (EOS-002-P3-Part-04 §8).
class EventsListController extends AsyncNotifier<List<Event>> {
  @override
  Future<List<Event>> build() => ref.watch(eventsRepositoryProvider).listEvents();

  /// Pull-to-refresh / post-create reload.
  Future<void> refresh() async {
    state = const AsyncLoading<List<Event>>().copyWithPrevious(state);
    state = await AsyncValue.guard(() => ref.read(eventsRepositoryProvider).listEvents());
  }
}

/// User-facing message for an events error.
String eventsErrorMessage(Object? error) =>
    error is EventsApiException ? error.message : 'Something went wrong. Please try again.';
