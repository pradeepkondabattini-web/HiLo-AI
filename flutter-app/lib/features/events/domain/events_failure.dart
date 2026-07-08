/// User-facing failure from the events domain (EOS-002-P3-Part-04 §25). The data layer
/// translates transport/HTTP errors into this so the UI shows friendly messages.
class EventsApiException implements Exception {
  const EventsApiException(this.message);
  final String message;
  @override
  String toString() => 'EventsApiException: $message';
}
