import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../domain/vendor_models.dart';
import 'vendors_providers.dart';

/// Runs ranked vendor searches (EOS-002-P3-Part-06 §4). Holds the latest results.
class VendorSearchController extends AsyncNotifier<List<RankedVendor>> {
  @override
  Future<List<RankedVendor>> build() async => const <RankedVendor>[];

  Future<void> search(VendorSearchRequest request) async {
    state = const AsyncLoading<List<RankedVendor>>().copyWithPrevious(state);
    state = await AsyncValue.guard(() => ref.read(vendorsRepositoryProvider).search(request));
  }
}

/// User-facing message for a vendors error.
String vendorsErrorMessage(Object? error) =>
    error is VendorsApiException ? error.message : 'Something went wrong. Please try again.';
