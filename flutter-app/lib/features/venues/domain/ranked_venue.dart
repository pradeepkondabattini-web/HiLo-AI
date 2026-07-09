import 'venue.dart';

/// A venue with its computed distance, ranking score, and per-factor breakdown
/// (EOS-002-P3-Part-05 §13–14).
class RankedVenue {
  const RankedVenue({
    required this.venue,
    required this.distanceKm,
    required this.score,
    required this.breakdown,
  });

  final Venue venue;
  final double distanceKm;
  final double score;
  final Map<String, double> breakdown;
}
