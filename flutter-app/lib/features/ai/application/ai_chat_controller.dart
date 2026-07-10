import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../domain/ai_models.dart';
import 'ai_providers.dart';

/// State of one assistant conversation.
class AiChatState {
  const AiChatState({
    this.messages = const <AiChatMessage>[],
    this.sessionId,
    this.sending = false,
    this.error,
  });

  final List<AiChatMessage> messages;
  final String? sessionId;
  final bool sending;
  final String? error;

  AiChatState copyWith({
    List<AiChatMessage>? messages,
    String? sessionId,
    bool? sending,
    String? error,
  }) {
    return AiChatState(
      messages: messages ?? this.messages,
      sessionId: sessionId ?? this.sessionId,
      sending: sending ?? this.sending,
      error: error,
    );
  }
}

/// Drives the chat: optimistic user turn → ai-gateway → assistant turn.
class AiChatController extends Notifier<AiChatState> {
  @override
  AiChatState build() => const AiChatState();

  Future<void> send(String message, {String? eventId}) async {
    final text = message.trim();
    if (text.isEmpty || state.sending) return;

    state = state.copyWith(
      messages: <AiChatMessage>[...state.messages, AiChatMessage.user(text)],
      sending: true,
    );
    try {
      final response = await ref
          .read(aiRepositoryProvider)
          .chat(message: text, sessionId: state.sessionId, eventId: eventId);
      state = state.copyWith(
        messages: <AiChatMessage>[
          ...state.messages,
          AiChatMessage.assistant(
            response.reply,
            explanation: response.explanation,
            data: response.data,
          ),
        ],
        sessionId: response.sessionId,
        sending: false,
      );
    } catch (e) {
      state = state.copyWith(sending: false, error: e.toString());
    }
  }
}
