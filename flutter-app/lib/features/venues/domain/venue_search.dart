/// Structured search filters (EOS-002-P3-Part-05 §8).
class VenueFilters {
  const VenueFilters({
    this.minCapacity,
    this.maxPricePerPlate,
    this.minRating,
    this.verifiedOnly,
    this.indoorOnly,
    this.requiredAmenities,
  });

  final int? minCapacity;
  final num? maxPricePerPlate;
  final double? minRating;
  final bool? verifiedOnly;
  final bool? indoorOnly;
  final List<String>? requiredAmenities;

  Map<String, dynamic> toJson() => <String, dynamic>{
    if (minCapacity != null) 'minCapacity': minCapacity,
    if (maxPricePerPlate != null) 'maxPricePerPlate': maxPricePerPlate,
    if (minRating != null) 'minRating': minRating,
    if (verifiedOnly != null) 'verifiedOnly': verifiedOnly,
    if (indoorOnly != null) 'indoorOnly': indoorOnly,
    if (requiredAmenities != null) 'requiredAmenities': requiredAmenities,
  };
}

/// Allowed search radii in km (EOS-002-P3-Part-05 §9). Default 10.
const List<double> kAllowedRadiiKm = [2, 5, 10, 20, 50];
const double kDefaultRadiusKm = 10;

/// Hyderabad city centre — default search origin until device geolocation/geocoding lands
/// with Google Maps.
const double kHyderabadLat = 17.385;
const double kHyderabadLng = 78.4867;

class VenueSearchRequest {
  const VenueSearchRequest({
    required this.latitude,
    required this.longitude,
    required this.radiusKm,
    required this.guestCount,
    this.budgetPerPlate,
    this.filters,
    this.preferredAmenities,
    this.limit,
  });

  final double latitude;
  final double longitude;
  final double radiusKm;
  final int guestCount;
  final num? budgetPerPlate;
  final VenueFilters? filters;
  final List<String>? preferredAmenities;
  final int? limit;

  Map<String, dynamic> toJson() => <String, dynamic>{
    'latitude': latitude,
    'longitude': longitude,
    'radiusKm': radiusKm,
    'guestCount': guestCount,
    if (budgetPerPlate != null) 'budgetPerPlate': budgetPerPlate,
    if (filters != null) 'filters': filters!.toJson(),
    if (preferredAmenities != null) 'preferredAmenities': preferredAmenities,
    if (limit != null) 'limit': limit,
  };
}
