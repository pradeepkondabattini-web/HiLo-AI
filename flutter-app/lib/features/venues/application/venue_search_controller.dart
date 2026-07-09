import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../domain/ranked_venue.dart';
import '../domain/venue_search.dart';
import '../domain/venues_failure.dart';
import 'venues_providers.dart';

/// Runs ranked venue searches (EOS-002-P3-Part-05 §7). Holds the latest results.
class VenueSearchController extends AsyncNotifier<List<RankedVenue>> {
  @override
  Future<List<RankedVenue>> build() async => const <RankedVenue>[];

  Future<void> search(VenueSearchRequest request) async {
    state = const AsyncLoading<List<RankedVenue>>().copyWithPrevious(state);
    state = await AsyncValue.guard(() => ref.read(venuesRepositoryProvider).search(request));
  }
}

/// User-facing message for a venues error.
String venuesErrorMessage(Object? error) =>
    error is VenuesApiException ? error.message : 'Something went wrong. Please try again.';
