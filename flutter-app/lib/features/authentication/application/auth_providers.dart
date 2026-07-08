import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/config/app_environment.dart';
import '../data/datasources/auth_api_datasource.dart';
import '../data/datasources/firebase_auth_datasource.dart';
import '../data/repositories/auth_repository_impl.dart';
import '../domain/auth_repository.dart';
import '../domain/hilo_user.dart';
import 'auth_controller.dart';

/// Dependency-injection graph for authentication (EOS-003-P2 §10 — Riverpod providers,
/// no service locator). Each layer is wired here; widgets depend only on the controller.

final firebaseAuthDataSourceProvider = Provider<FirebaseAuthDataSource>(
  (ref) => FirebaseAuthDataSource(),
);

/// Dio client pointed at the backend API gateway (base URL is environment-injected).
final dioProvider = Provider<Dio>((ref) {
  return Dio(
    BaseOptions(
      baseUrl: AppEnvironment.apiBaseUrl,
      connectTimeout: const Duration(seconds: 10),
      receiveTimeout: const Duration(seconds: 15),
      sendTimeout: const Duration(seconds: 10),
      contentType: 'application/json',
    ),
  );
});

final authApiDataSourceProvider = Provider<AuthApiDataSource>((ref) {
  final firebase = ref.watch(firebaseAuthDataSourceProvider);
  return AuthApiDataSource(
    dio: ref.watch(dioProvider),
    idTokenProvider: firebase.currentIdToken,
  );
});

final authRepositoryProvider = Provider<AuthRepository>((ref) {
  return AuthRepositoryImpl(
    firebase: ref.watch(firebaseAuthDataSourceProvider),
    api: ref.watch(authApiDataSourceProvider),
  );
});

/// Emits the current Firebase uid (or null). Drives session rebuilds and route guards.
final authUidStreamProvider = StreamProvider<String?>((ref) {
  return ref.watch(authRepositoryProvider).authStateChanges();
});

/// The authenticated platform user (or null). Loading while the profile is fetched.
final authControllerProvider = AsyncNotifierProvider<AuthController, HiloUser?>(
  AuthController.new,
);
