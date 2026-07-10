import 'ai_models.dart';

/// Repository contract for the AI assistant (EOS-002-P3-Part-07). Talks to
/// ai-gateway-service; the UI never calls an LLM or Firestore directly (EOS-000 §92).
abstract interface class AiRepository {
  Future<AiChatResponse> chat({required String message, String? sessionId, String? eventId});
  Future<ReadinessResult> readiness(String eventId);
}
