/// User-facing failure from the venues domain (EOS-002-P3-Part-05 §24).
class VenuesApiException implements Exception {
  const VenuesApiException(this.message);
  final String message;
  @override
  String toString() => 'VenuesApiException: $message';
}
