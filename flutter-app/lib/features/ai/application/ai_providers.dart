import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/config/app_environment.dart';
import '../../../core/network/authenticated_dio.dart';
import '../../authentication/application/auth_providers.dart';
import '../data/ai_api_datasource.dart';
import '../domain/ai_models.dart';
import '../domain/ai_repository.dart';
import 'ai_chat_controller.dart';

/// DI graph for the AI assistant feature.

final aiRepositoryProvider = Provider<AiRepository>((ref) {
  final firebase = ref.watch(firebaseAuthDataSourceProvider);
  final dio = createAuthenticatedDio(
    baseUrl: AppEnvironment.apiBaseUrl,
    idTokenProvider: firebase.currentIdToken,
  );
  return AiApiDataSource(dio);
});

final aiChatControllerProvider = NotifierProvider<AiChatController, AiChatState>(
  AiChatController.new,
);

/// Readiness score for one event (used by the event workspace).
final readinessProvider = FutureProvider.family<ReadinessResult, String>(
  (ref, eventId) => ref.watch(aiRepositoryProvider).readiness(eventId),
);
