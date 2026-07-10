/// AI assistant models (EOS-002-P3-Part-07). Framework-free domain types.
library;

/// Why the assistant answered the way it did — the explainability envelope
/// every AI response carries (EOS-000 §101).
class AiExplanation {
  const AiExplanation({
    required this.intent,
    required this.confidence,
    required this.skillsUsed,
    required this.dataSources,
    this.model,
  });

  final String intent;
  final String confidence;
  final List<String> skillsUsed;
  final List<String> dataSources;
  final String? model;
}

/// One turn returned by POST /api/v1/ai/chat.
class AiChatResponse {
  const AiChatResponse({
    required this.sessionId,
    required this.reply,
    required this.explanation,
    required this.data,
  });

  final String sessionId;
  final String reply;
  final AiExplanation explanation;

  /// Structured skill outputs keyed by skill id (rendered natively where useful).
  final Map<String, dynamic> data;
}

/// A message in the on-screen conversation.
class AiChatMessage {
  const AiChatMessage.user(this.content)
      : isUser = true,
        explanation = null,
        data = const <String, dynamic>{};

  const AiChatMessage.assistant(this.content, {this.explanation, this.data = const {}})
      : isUser = false;

  final String content;
  final bool isUser;
  final AiExplanation? explanation;
  final Map<String, dynamic> data;
}

/// One factor of the AI Event Readiness Score (Part-07 §19).
class ReadinessFactor {
  const ReadinessFactor({
    required this.factor,
    required this.earned,
    required this.max,
    required this.note,
  });

  final String factor;
  final int earned;
  final int max;
  final String note;
}

class ReadinessResult {
  const ReadinessResult({required this.score, required this.factors, this.title});

  final int score;
  final List<ReadinessFactor> factors;
  final String? title;
}
