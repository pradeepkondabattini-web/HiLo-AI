/// A venue (mirrors venue-service `VenueDto`). EOS-002-P3-Part-05.
class Venue {
  const Venue({
    required this.id,
    required this.source,
    required this.name,
    required this.address,
    required this.latitude,
    required this.longitude,
    required this.capacity,
    required this.rating,
    required this.amenities,
    required this.photos,
    required this.verified,
    this.googlePlaceId,
    this.city,
    this.category,
    this.reviewCount,
    this.priceLevel,
    this.pricePerPlate,
    this.trustScore,
    this.indoor,
  });

  final String id;
  final String source; // 'hilo' | 'google'
  final String? googlePlaceId;
  final String name;
  final String address;
  final String? city;
  final String? category;
  final double latitude;
  final double longitude;
  final int capacity;
  final double rating;
  final int? reviewCount;
  final int? priceLevel;
  final num? pricePerPlate;
  final List<String> amenities;
  final List<String> photos;
  final bool verified;
  final double? trustScore;
  final bool? indoor;
}
