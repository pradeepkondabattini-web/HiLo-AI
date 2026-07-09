import 'package:dio/dio.dart';

import '../../domain/ranked_venue.dart';
import '../../domain/venue.dart';
import '../../domain/venue_search.dart';
import '../../domain/venues_failure.dart';
import '../models/venue_dto.dart';

/// Talks to venue-service over the authenticated Dio client (EOS-002-P3-Part-05 §21).
class VenuesApiDataSource {
  VenuesApiDataSource(this._dio);
  final Dio _dio;

  Future<List<RankedVenue>> search(VenueSearchRequest request) async {
    try {
      final res = await _dio.post<dynamic>('/api/v1/venues/search', data: request.toJson());
      final items = (_asMap(res.data)['items'] as List<dynamic>?) ?? const <dynamic>[];
      return items.whereType<Map<String, dynamic>>().map(RankedVenueDto.fromJson).toList();
    } on DioException catch (e) {
      throw _map(e);
    }
  }

  Future<Venue> getVenue(String id) async {
    try {
      final res = await _dio.get<dynamic>('/api/v1/venues/$id');
      return VenueDto.fromJson(_asMap(res.data));
    } on DioException catch (e) {
      throw _map(e);
    }
  }

  Future<void> addFavourite(Map<String, dynamic> body) async {
    try {
      await _dio.post<dynamic>('/api/v1/venues/favourites', data: body);
    } on DioException catch (e) {
      throw _map(e);
    }
  }

  Future<Set<String>> favouriteVenueIds() async {
    try {
      final res = await _dio.get<dynamic>('/api/v1/venues/favourites');
      final items = (_asMap(res.data)['items'] as List<dynamic>?) ?? const <dynamic>[];
      return items
          .whereType<Map<String, dynamic>>()
          .map((m) => m['venueId'])
          .whereType<String>()
          .toSet();
    } on DioException catch (e) {
      throw _map(e);
    }
  }

  Future<void> removeFavourite(String venueId) async {
    try {
      await _dio.delete<dynamic>('/api/v1/venues/favourites/$venueId');
    } on DioException catch (e) {
      throw _map(e);
    }
  }

  Map<String, dynamic> _asMap(dynamic data) {
    if (data is Map<String, dynamic>) return data;
    throw const VenuesApiException('Unexpected response from the server.');
  }

  VenuesApiException _map(DioException e) {
    switch (e.type) {
      case DioExceptionType.connectionError:
      case DioExceptionType.connectionTimeout:
      case DioExceptionType.receiveTimeout:
      case DioExceptionType.sendTimeout:
        return const VenuesApiException('Please check your internet connection and try again.');
      default:
        break;
    }
    return switch (e.response?.statusCode) {
      401 => const VenuesApiException('Your session has expired. Please sign in again.'),
      404 => const VenuesApiException('Venue not found.'),
      422 => const VenuesApiException('Please adjust your search and try again.'),
      _ => const VenuesApiException('Something went wrong. Please try again.'),
    };
  }
}
