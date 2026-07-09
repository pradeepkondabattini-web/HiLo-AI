import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:hilo/features/venues/application/venues_providers.dart';
import 'package:hilo/features/venues/domain/ranked_venue.dart';
import 'package:hilo/features/venues/domain/venue.dart';
import 'package:hilo/features/venues/domain/venue_search.dart';
import 'package:hilo/features/venues/domain/venues_repository.dart';
import 'package:hilo/features/venues/presentation/pages/venue_discovery_page.dart';

class _FakeVenuesRepository implements VenuesRepository {
  @override
  Future<List<RankedVenue>> search(VenueSearchRequest request) async => const <RankedVenue>[
    RankedVenue(
      venue: Venue(
        id: 'v1',
        source: 'hilo',
        name: 'Taj Banquet',
        address: 'Banjara Hills',
        latitude: 17.41,
        longitude: 78.43,
        capacity: 500,
        rating: 4.6,
        amenities: [],
        photos: [],
        verified: true,
      ),
      distanceKm: 2,
      score: 0.9,
      breakdown: {},
    ),
  ];

  @override
  Future<Venue> getVenue(String id) async => throw UnimplementedError();
  @override
  Future<void> addFavourite({required String venueId, String? eventId, String? note}) async {}
  @override
  Future<Set<String>> favouriteVenueIds() async => <String>{};
  @override
  Future<void> removeFavourite(String venueId) async {}
}

void main() {
  testWidgets('discovery auto-searches and shows a ranked venue', (tester) async {
    await tester.pumpWidget(
      ProviderScope(
        overrides: [venuesRepositoryProvider.overrideWithValue(_FakeVenuesRepository())],
        child: const MaterialApp(home: VenueDiscoveryPage()),
      ),
    );

    // Initial frame schedules the auto-search; let it resolve.
    for (var i = 0; i < 5; i++) {
      await tester.pump(const Duration(milliseconds: 50));
    }

    expect(find.text('Taj Banquet'), findsOneWidget);
    expect(find.textContaining('% match'), findsOneWidget);
    expect(find.text('Find venues'), findsOneWidget); // app bar
  });
}
