import '../../domain/ranked_venue.dart';
import '../../domain/venue.dart';

class VenueDto {
  const VenueDto._();

  static Venue fromJson(Map<String, dynamic> json) {
    return Venue(
      id: json['id'] as String,
      source: json['source'] as String? ?? 'hilo',
      googlePlaceId: json['googlePlaceId'] as String?,
      name: json['name'] as String? ?? '',
      address: json['address'] as String? ?? '',
      city: json['city'] as String?,
      category: json['category'] as String?,
      latitude: (json['latitude'] as num?)?.toDouble() ?? 0,
      longitude: (json['longitude'] as num?)?.toDouble() ?? 0,
      capacity: (json['capacity'] as num?)?.toInt() ?? 0,
      rating: (json['rating'] as num?)?.toDouble() ?? 0,
      reviewCount: (json['reviewCount'] as num?)?.toInt(),
      priceLevel: (json['priceLevel'] as num?)?.toInt(),
      pricePerPlate: json['pricePerPlate'] as num?,
      amenities: _strings(json['amenities']),
      photos: _strings(json['photos']),
      verified: json['verified'] as bool? ?? false,
      trustScore: (json['trustScore'] as num?)?.toDouble(),
      indoor: json['indoor'] as bool?,
    );
  }

  static List<String> _strings(dynamic value) =>
      (value as List<dynamic>?)?.whereType<String>().toList(growable: false) ?? const <String>[];
}

class RankedVenueDto {
  const RankedVenueDto._();

  static RankedVenue fromJson(Map<String, dynamic> json) {
    return RankedVenue(
      venue: VenueDto.fromJson(json['venue'] as Map<String, dynamic>),
      distanceKm: (json['distanceKm'] as num?)?.toDouble() ?? 0,
      score: (json['score'] as num?)?.toDouble() ?? 0,
      breakdown: _breakdown(json['breakdown']),
    );
  }

  static Map<String, double> _breakdown(dynamic value) {
    if (value is Map) {
      return value.map(
        (k, v) => MapEntry(k.toString(), (v as num?)?.toDouble() ?? 0),
      );
    }
    return const <String, double>{};
  }
}
