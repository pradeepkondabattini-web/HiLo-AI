import 'ranked_venue.dart';
import 'venue.dart';
import 'venue_search.dart';

/// Repository contract for Venue Discovery (EOS-002-P3-Part-05). Talks to venue-service;
/// the UI never calls Google/Firestore directly (EOS-000 §30, §117). Framework-free.
abstract interface class VenuesRepository {
  Future<List<RankedVenue>> search(VenueSearchRequest request);
  Future<Venue> getVenue(String id);

  Future<void> addFavourite({required String venueId, String? eventId, String? note});
  /// The venue ids the caller has favourited (for toggling UI state).
  Future<Set<String>> favouriteVenueIds();
  Future<void> removeFavourite(String venueId);
}
