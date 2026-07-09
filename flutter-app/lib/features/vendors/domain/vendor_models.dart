import 'vendor.dart';

/// A vendor with distance, Intelligence Score, and per-factor breakdown (§9).
class RankedVendor {
  const RankedVendor({
    required this.vendor,
    required this.distanceKm,
    required this.score,
    required this.breakdown,
  });

  final Vendor vendor;
  final double distanceKm;
  final double score;
  final Map<String, double> breakdown;
}

/// Hyperlocal search request (§10 — default radius 10 km, Hyderabad origin for now).
class VendorSearchRequest {
  const VendorSearchRequest({
    required this.latitude,
    required this.longitude,
    required this.radiusKm,
    this.category,
    this.budget,
    this.minVerificationLevel,
    this.limit,
  });

  final double latitude;
  final double longitude;
  final double radiusKm;
  final String? category;
  final num? budget;
  final int? minVerificationLevel;
  final int? limit;

  Map<String, dynamic> toJson() => <String, dynamic>{
    'latitude': latitude,
    'longitude': longitude,
    'radiusKm': radiusKm,
    if (category != null) 'category': category,
    if (budget != null) 'budget': budget,
    if (minVerificationLevel != null) 'minVerificationLevel': minVerificationLevel,
    if (limit != null) 'limit': limit,
  };
}

/// A quotation between the caller and a vendor (§12).
class VendorQuote {
  const VendorQuote({
    required this.id,
    required this.vendorId,
    required this.status,
    required this.expiresAt,
    this.message,
    this.proposedAmount,
  });

  final String id;
  final String vendorId;
  final String status; // requested|submitted|negotiating|accepted|declined|expired
  final String expiresAt;
  final String? message;
  final num? proposedAmount;
}

/// User-facing failure from the vendors domain (§25).
class VendorsApiException implements Exception {
  const VendorsApiException(this.message);
  final String message;
  @override
  String toString() => 'VendorsApiException: $message';
}
