import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:hilo/features/vendors/application/vendors_providers.dart';
import 'package:hilo/features/vendors/domain/vendor.dart';
import 'package:hilo/features/vendors/domain/vendor_models.dart';
import 'package:hilo/features/vendors/domain/vendors_repository.dart';
import 'package:hilo/features/vendors/presentation/pages/vendor_browse_page.dart';

class _FakeVendorsRepository implements VendorsRepository {
  @override
  Future<List<RankedVendor>> search(VendorSearchRequest request) async => const <RankedVendor>[
    RankedVendor(
      vendor: Vendor(
        id: 'vnd1',
        businessName: 'Paradise Caterers',
        category: 'Catering',
        city: 'Hyderabad',
        latitude: 17.44,
        longitude: 78.5,
        serviceRadiusKm: 25,
        rating: 4.5,
        verificationLevel: 4,
        portfolio: [],
        startingPrice: 450,
      ),
      distanceKm: 3.2,
      score: 0.87,
      breakdown: {},
    ),
  ];

  @override
  Future<Vendor> getVendor(String id) async => throw UnimplementedError();
  @override
  Future<VendorQuote> requestQuote({
    required String vendorId,
    String? eventId,
    String? message,
  }) async =>
      throw UnimplementedError();
  @override
  Future<({List<VendorQuote> requested, List<VendorQuote> received})> myQuotes() async =>
      (requested: const <VendorQuote>[], received: const <VendorQuote>[]);
  @override
  Future<VendorQuote> transitionQuote({
    required String quoteId,
    required String status,
    num? proposedAmount,
  }) async =>
      throw UnimplementedError();
}

void main() {
  testWidgets('vendor browse auto-searches and shows a ranked vendor', (tester) async {
    await tester.pumpWidget(
      ProviderScope(
        overrides: [vendorsRepositoryProvider.overrideWithValue(_FakeVendorsRepository())],
        child: const MaterialApp(home: VendorBrowsePage()),
      ),
    );

    for (var i = 0; i < 5; i++) {
      await tester.pump(const Duration(milliseconds: 50));
    }

    expect(find.text('Paradise Caterers'), findsOneWidget);
    expect(find.textContaining('% match'), findsOneWidget);
    expect(find.text('Catering'), findsWidgets); // category chip + card subtitle
  });
}
