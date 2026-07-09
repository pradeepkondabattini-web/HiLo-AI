import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/config/app_environment.dart';
import '../../../core/network/authenticated_dio.dart';
import '../../authentication/application/auth_providers.dart';
import '../data/vendors_api_datasource.dart';
import '../domain/vendor.dart';
import '../domain/vendor_models.dart';
import '../domain/vendors_repository.dart';
import 'vendor_search_controller.dart';

/// DI graph for the Vendor Marketplace (EOS-003-P2 §10).

final vendorsRepositoryProvider = Provider<VendorsRepository>((ref) {
  final firebase = ref.watch(firebaseAuthDataSourceProvider);
  final dio = createAuthenticatedDio(
    baseUrl: AppEnvironment.apiBaseUrl,
    idTokenProvider: firebase.currentIdToken,
  );
  return VendorsRepositoryImpl(VendorsApiDataSource(dio));
});

/// Ranked vendor search results.
final vendorSearchControllerProvider =
    AsyncNotifierProvider<VendorSearchController, List<RankedVendor>>(
      VendorSearchController.new,
    );

/// One vendor by id, for the detail screen.
final vendorDetailProvider = FutureProvider.family<Vendor, String>(
  (ref, id) => ref.watch(vendorsRepositoryProvider).getVendor(id),
);

/// The caller's quotes (requested + received).
final myQuotesProvider =
    FutureProvider<({List<VendorQuote> requested, List<VendorQuote> received})>(
      (ref) => ref.watch(vendorsRepositoryProvider).myQuotes(),
    );
