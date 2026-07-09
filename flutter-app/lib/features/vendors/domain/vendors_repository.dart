import 'vendor.dart';
import 'vendor_models.dart';

/// Repository contract for the Vendor Marketplace (EOS-002-P3-Part-06). Talks to
/// vendor-service; the UI never calls Firestore directly (EOS-000 §30). Framework-free.
abstract interface class VendorsRepository {
  Future<List<RankedVendor>> search(VendorSearchRequest request);
  Future<Vendor> getVendor(String id);
  Future<VendorQuote> requestQuote({required String vendorId, String? eventId, String? message});
  Future<({List<VendorQuote> requested, List<VendorQuote> received})> myQuotes();
  Future<VendorQuote> transitionQuote({
    required String quoteId,
    required String status,
    num? proposedAmount,
  });
}
