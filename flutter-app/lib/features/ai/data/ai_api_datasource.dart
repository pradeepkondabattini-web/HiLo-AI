import 'package:dio/dio.dart';

import '../domain/ai_models.dart';
import '../domain/ai_repository.dart';

/// User-facing failure from the AI assistant API.
class AiApiException implements Exception {
  const AiApiException(this.message);
  final String message;

  @override
  String toString() => message;
}

/// Talks to ai-gateway-service over the authenticated Dio client.
class AiApiDataSource implements AiRepository {
  AiApiDataSource(this._dio);
  final Dio _dio;

  @override
  Future<AiChatResponse> chat({required String message, String? sessionId, String? eventId}) async {
    try {
      final res = await _dio.post<dynamic>('/api/v1/ai/chat', data: <String, dynamic>{
        'message': message,
        if (sessionId != null) 'sessionId': sessionId,
        if (eventId != null) 'eventId': eventId,
      });
      final json = _asMap(res.data);
      return AiChatResponse(
        sessionId: json['sessionId'] as String? ?? '',
        reply: json['reply'] as String? ?? '',
        explanation: _explanationFromJson(_asMap(json['explanation'])),
        data: json['data'] is Map<String, dynamic>
            ? json['data'] as Map<String, dynamic>
            : const <String, dynamic>{},
      );
    } on DioException catch (e) {
      throw _map(e);
    }
  }

  @override
  Future<ReadinessResult> readiness(String eventId) async {
    try {
      final res = await _dio.get<dynamic>('/api/v1/ai/readiness/$eventId');
      final json = _asMap(res.data);
      final factors = (json['factors'] as List<dynamic>? ?? const <dynamic>[])
          .whereType<Map<String, dynamic>>()
          .map(
            (f) => ReadinessFactor(
              factor: f['factor'] as String? ?? '',
              earned: (f['earned'] as num?)?.toInt() ?? 0,
              max: (f['max'] as num?)?.toInt() ?? 0,
              note: f['note'] as String? ?? '',
            ),
          )
          .toList(growable: false);
      return ReadinessResult(
        score: (json['score'] as num?)?.toInt() ?? 0,
        factors: factors,
        title: json['title'] as String?,
      );
    } on DioException catch (e) {
      throw _map(e);
    }
  }

  AiExplanation _explanationFromJson(Map<String, dynamic> json) {
    return AiExplanation(
      intent: json['intent'] as String? ?? 'general_help',
      confidence: json['confidence'] as String? ?? 'low',
      skillsUsed:
          (json['skillsUsed'] as List<dynamic>?)?.whereType<String>().toList(growable: false) ??
              const <String>[],
      dataSources:
          (json['dataSources'] as List<dynamic>?)?.whereType<String>().toList(growable: false) ??
              const <String>[],
      model: json['model'] as String?,
    );
  }

  Map<String, dynamic> _asMap(dynamic data) {
    if (data is Map<String, dynamic>) return data;
    throw const AiApiException('Unexpected response from the server.');
  }

  AiApiException _map(DioException e) {
    switch (e.type) {
      case DioExceptionType.connectionError:
      case DioExceptionType.connectionTimeout:
      case DioExceptionType.receiveTimeout:
      case DioExceptionType.sendTimeout:
        return const AiApiException('Network problem — check your connection and try again.');
      case DioExceptionType.badResponse:
        final body = e.response?.data;
        final message = body is Map<String, dynamic>
            ? ((body['error'] as Map<String, dynamic>?)?['message'] as String?)
            : null;
        return AiApiException(message ?? 'The assistant could not process that request.');
      case DioExceptionType.cancel:
      case DioExceptionType.badCertificate:
      case DioExceptionType.transformTimeout:
      case DioExceptionType.unknown:
        return const AiApiException('Something went wrong talking to the assistant.');
    }
  }
}
