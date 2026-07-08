import 'dart:async';

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../domain/auth_failure.dart';
import '../domain/hilo_user.dart';
import 'auth_providers.dart';

/// Owns the authentication session (EOS-003-P2 §8 — business logic outside widgets).
///
/// The session tracks the Firebase auth state: signed out → `null`; signed in → the
/// platform [HiloUser] (bootstrapped/fetched from auth-service). Sign-in/out actions
/// mutate Firebase auth, and the resulting auth-state change rebuilds this notifier.
class AuthController extends AsyncNotifier<HiloUser?> {
  @override
  Future<HiloUser?> build() {
    final uidAsync = ref.watch(authUidStreamProvider);
    return switch (uidAsync) {
      // Signed in with Firebase → ensure the platform profile exists and load it.
      AsyncData(:final value) => value == null
          ? Future<HiloUser?>.value(null)
          : ref.read(authRepositoryProvider).bootstrap(),
      AsyncError(:final error, :final stackTrace) =>
        Future<HiloUser?>.error(error, stackTrace),
      // Before Firebase reports the first auth state, stay loading (avoids a
      // false signed-out flash). The next emission rebuilds this notifier.
      _ => Completer<HiloUser?>().future,
    };
  }

  Future<void> signInWithGoogle() =>
      _runAuthAction(() => ref.read(authRepositoryProvider).signInWithGoogle());

  Future<void> signInWithEmail(String email, String password) => _runAuthAction(
    () => ref.read(authRepositoryProvider).signInWithEmail(email: email, password: password),
  );

  Future<void> registerWithEmail(String email, String password) => _runAuthAction(
    () => ref.read(authRepositoryProvider).registerWithEmail(email: email, password: password),
  );

  /// Start phone verification; returns the `verificationId` for the code step.
  /// (Kept off the session state — it's a transient step, not an auth state change.)
  Future<String> startPhoneVerification(String phoneNumber) =>
      ref.read(authRepositoryProvider).startPhoneVerification(phoneNumber: phoneNumber);

  Future<void> confirmPhoneCode({
    required String verificationId,
    required String smsCode,
  }) => _runAuthAction(
    () => ref.read(authRepositoryProvider).confirmPhoneCode(
      verificationId: verificationId,
      smsCode: smsCode,
    ),
  );

  /// Persist onboarding profile fields (EOS-002-P3-Part-02 §7). Setting the city marks
  /// onboarding complete, which the route guard uses to route into the app.
  Future<void> completeOnboarding({
    required String displayName,
    required String city,
    required String preferredLanguage,
  }) async {
    state = const AsyncLoading<HiloUser?>().copyWithPrevious(state);
    state = await AsyncValue.guard(
      () => ref.read(authRepositoryProvider).updateProfile(
        displayName: displayName,
        city: city,
        preferredLanguage: preferredLanguage,
      ),
    );
  }

  Future<void> signOut() =>
      _runAuthAction(() => ref.read(authRepositoryProvider).signOut());

  /// Runs an action that changes Firebase auth state. On success, [authUidStreamProvider]
  /// emits and [build] repopulates the session; on failure, the error surfaces on state.
  Future<void> _runAuthAction(Future<void> Function() action) async {
    state = const AsyncLoading<HiloUser?>().copyWithPrevious(state);
    try {
      await action();
      // The auth-state stream drives the subsequent rebuild().
    } catch (error, stackTrace) {
      state = AsyncError<HiloUser?>(error, stackTrace);
    }
  }
}

/// User-facing message for an auth error (never leaks internals — EOS-002-P3-Part-02 §15).
String authErrorMessage(Object? error) =>
    error is AuthException ? error.failure.message : 'Something went wrong. Please try again.';
