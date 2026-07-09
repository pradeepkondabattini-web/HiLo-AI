import '../../domain/ranked_venue.dart';
import '../../domain/venue.dart';
import '../../domain/venue_search.dart';
import '../../domain/venues_repository.dart';
import '../datasources/venues_api_datasource.dart';

class VenuesRepositoryImpl implements VenuesRepository {
  VenuesRepositoryImpl(this._api);
  final VenuesApiDataSource _api;

  @override
  Future<List<RankedVenue>> search(VenueSearchRequest request) => _api.search(request);

  @override
  Future<Venue> getVenue(String id) => _api.getVenue(id);

  @override
  Future<void> addFavourite({required String venueId, String? eventId, String? note}) =>
      _api.addFavourite(<String, dynamic>{
        'venueId': venueId,
        if (eventId != null) 'eventId': eventId,
        if (note != null) 'note': note,
      });

  @override
  Future<Set<String>> favouriteVenueIds() => _api.favouriteVenueIds();

  @override
  Future<void> removeFavourite(String venueId) => _api.removeFavourite(venueId);
}
