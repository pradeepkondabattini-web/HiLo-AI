import 'package:dio/dio.dart';

import '../domain/vendor.dart';
import '../domain/vendor_models.dart';
import '../domain/vendors_repository.dart';

/// Talks to vendor-service over the authenticated Dio client (EOS-002-P3-Part-06 §22).
class VendorsApiDataSource {
  VendorsApiDataSource(this._dio);
  final Dio _dio;

  Future<List<RankedVendor>> search(VendorSearchRequest request) async {
    try {
      final res = await _dio.post<dynamic>('/api/v1/vendors/search', data: request.toJson());
      final items = (_asMap(res.data)['items'] as List<dynamic>?) ?? const <dynamic>[];
      return items.whereType<Map<String, dynamic>>().map(_rankedFromJson).toList();
    } on DioException catch (e) {
      throw _map(e);
    }
  }

  Future<Vendor> getVendor(String id) async {
    try {
      final res = await _dio.get<dynamic>('/api/v1/vendors/$id');
      return _vendorFromJson(_asMap(res.data));
    } on DioException catch (e) {
      throw _map(e);
    }
  }

  Future<VendorQuote> requestQuote(String vendorId, Map<String, dynamic> body) async {
    try {
      final res = await _dio.post<dynamic>('/api/v1/vendors/$vendorId/quote', data: body);
      return _quoteFromJson(_asMap(res.data));
    } on DioException catch (e) {
      throw _map(e);
    }
  }

  Future<({List<VendorQuote> requested, List<VendorQuote> received})> myQuotes() async {
    try {
      final res = await _dio.get<dynamic>('/api/v1/vendors/quotes');
      final data = _asMap(res.data);
      return (
        requested: _quotes(data['requested']),
        received: _quotes(data['received']),
      );
    } on DioException catch (e) {
      throw _map(e);
    }
  }

  Future<VendorQuote> transitionQuote(
    String quoteId,
    String status,
    num? proposedAmount,
  ) async {
    try {
      final res = await _dio.post<dynamic>(
        '/api/v1/vendors/quotes/$quoteId/status',
        data: <String, dynamic>{
          'status': status,
          if (proposedAmount != null) 'proposedAmount': proposedAmount,
        },
      );
      return _quoteFromJson(_asMap(res.data));
    } on DioException catch (e) {
      throw _map(e);
    }
  }

  // ── JSON mapping ────────────────────────────────────────────────────────────

  Vendor _vendorFromJson(Map<String, dynamic> json) {
    return Vendor(
      id: json['id'] as String,
      businessName: json['businessName'] as String? ?? '',
      category: json['category'] as String? ?? '',
      description: json['description'] as String?,
      city: json['city'] as String? ?? '',
      address: json['address'] as String?,
      latitude: (json['latitude'] as num?)?.toDouble() ?? 0,
      longitude: (json['longitude'] as num?)?.toDouble() ?? 0,
      serviceRadiusKm: (json['serviceRadiusKm'] as num?)?.toDouble() ?? 0,
      yearsOfExperience: (json['yearsOfExperience'] as num?)?.toInt(),
      teamSize: (json['teamSize'] as num?)?.toInt(),
      startingPrice: json['startingPrice'] as num?,
      rating: (json['rating'] as num?)?.toDouble() ?? 0,
      reviewCount: (json['reviewCount'] as num?)?.toInt(),
      verificationLevel: (json['verificationLevel'] as num?)?.toInt() ?? 0,
      trustScore: (json['trustScore'] as num?)?.toDouble(),
      responseTimeHours: (json['responseTimeHours'] as num?)?.toDouble(),
      portfolio:
          (json['portfolio'] as List<dynamic>?)?.whereType<String>().toList(growable: false) ??
              const <String>[],
      workingDays: (json['workingDays'] as List<dynamic>?)?.whereType<String>().toList(),
    );
  }

  RankedVendor _rankedFromJson(Map<String, dynamic> json) {
    final breakdown = json['breakdown'];
    return RankedVendor(
      vendor: _vendorFromJson(json['vendor'] as Map<String, dynamic>),
      distanceKm: (json['distanceKm'] as num?)?.toDouble() ?? 0,
      score: (json['score'] as num?)?.toDouble() ?? 0,
      breakdown: breakdown is Map
          ? breakdown.map((k, v) => MapEntry(k.toString(), (v as num?)?.toDouble() ?? 0))
          : const <String, double>{},
    );
  }

  VendorQuote _quoteFromJson(Map<String, dynamic> json) {
    return VendorQuote(
      id: json['id'] as String,
      vendorId: json['vendorId'] as String? ?? '',
      status: json['status'] as String? ?? 'requested',
      expiresAt: json['expiresAt'] as String? ?? '',
      message: json['message'] as String?,
      proposedAmount: json['proposedAmount'] as num?,
    );
  }

  List<VendorQuote> _quotes(dynamic value) =>
      (value as List<dynamic>?)
          ?.whereType<Map<String, dynamic>>()
          .map(_quoteFromJson)
          .toList(growable: false) ??
      const <VendorQuote>[];

  Map<String, dynamic> _asMap(dynamic data) {
    if (data is Map<String, dynamic>) return data;
    throw const VendorsApiException('Unexpected response from the server.');
  }

  VendorsApiException _map(DioException e) {
    switch (e.type) {
      case DioExceptionType.connectionError:
      case DioExceptionType.connectionTimeout:
      case DioExceptionType.receiveTimeout:
      case DioExceptionType.sendTimeout:
        return const VendorsApiException('Please check your internet connection and try again.');
      default:
        break;
    }
    final serverMessage = _serverMessage(e);
    return switch (e.response?.statusCode) {
      401 => const VendorsApiException('Your session has expired. Please sign in again.'),
      403 => const VendorsApiException('You do not have access to this.'),
      404 => const VendorsApiException('Vendor not found.'),
      409 => VendorsApiException(serverMessage ?? 'That action conflicts with the current state.'),
      422 => VendorsApiException(serverMessage ?? 'Please check the details and try again.'),
      _ => const VendorsApiException('Something went wrong. Please try again.'),
    };
  }

  String? _serverMessage(DioException e) {
    final data = e.response?.data;
    if (data is Map && data['error'] is Map) {
      final message = (data['error'] as Map)['message'];
      if (message is String) return message;
    }
    return null;
  }
}

/// Repository implementation backed by the API datasource.
class VendorsRepositoryImpl implements VendorsRepository {
  VendorsRepositoryImpl(this._api);
  final VendorsApiDataSource _api;

  @override
  Future<List<RankedVendor>> search(VendorSearchRequest request) => _api.search(request);

  @override
  Future<Vendor> getVendor(String id) => _api.getVendor(id);

  @override
  Future<VendorQuote> requestQuote({
    required String vendorId,
    String? eventId,
    String? message,
  }) =>
      _api.requestQuote(vendorId, <String, dynamic>{
        if (eventId != null) 'eventId': eventId,
        if (message != null) 'message': message,
      });

  @override
  Future<({List<VendorQuote> requested, List<VendorQuote> received})> myQuotes() =>
      _api.myQuotes();

  @override
  Future<VendorQuote> transitionQuote({
    required String quoteId,
    required String status,
    num? proposedAmount,
  }) =>
      _api.transitionQuote(quoteId, status, proposedAmount);
}
