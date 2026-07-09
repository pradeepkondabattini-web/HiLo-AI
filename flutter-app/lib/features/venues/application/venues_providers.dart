import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/config/app_environment.dart';
import '../../../core/network/authenticated_dio.dart';
import '../../authentication/application/auth_providers.dart';
import '../data/datasources/venues_api_datasource.dart';
import '../data/repositories/venues_repository_impl.dart';
import '../domain/ranked_venue.dart';
import '../domain/venue.dart';
import '../domain/venues_repository.dart';
import 'venue_search_controller.dart';

/// DI graph for Venue Discovery (EOS-003-P2 §10). Reuses the Firebase identity from the
/// authentication feature to authorize venue-service calls.

final venuesApiDataSourceProvider = Provider<VenuesApiDataSource>((ref) {
  final firebase = ref.watch(firebaseAuthDataSourceProvider);
  final dio = createAuthenticatedDio(
    baseUrl: AppEnvironment.apiBaseUrl,
    idTokenProvider: firebase.currentIdToken,
  );
  return VenuesApiDataSource(dio);
});

final venuesRepositoryProvider = Provider<VenuesRepository>(
  (ref) => VenuesRepositoryImpl(ref.watch(venuesApiDataSourceProvider)),
);

/// Ranked venue search results (empty until the first search is run).
final venueSearchControllerProvider =
    AsyncNotifierProvider<VenueSearchController, List<RankedVenue>>(VenueSearchController.new);

/// Set of venue ids the caller has favourited (for toggling card state).
final favouriteVenueIdsProvider = FutureProvider<Set<String>>(
  (ref) => ref.watch(venuesRepositoryProvider).favouriteVenueIds(),
);

/// One venue by id, for the detail screen.
final venueDetailProvider = FutureProvider.family<Venue, String>(
  (ref, id) => ref.watch(venuesRepositoryProvider).getVenue(id),
);
