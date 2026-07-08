import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:hilo/app/app.dart';
import 'package:hilo/features/authentication/application/auth_providers.dart';
import 'package:hilo/features/authentication/domain/auth_repository.dart';
import 'package:hilo/features/authentication/domain/hilo_user.dart';

/// A signed-out repository so the widget tree never touches Firebase.
class _SignedOutAuthRepository implements AuthRepository {
  @override
  Stream<String?> authStateChanges() => Stream<String?>.value(null);

  @override
  String? get currentUid => null;

  @override
  Future<void> signInWithGoogle() async {}

  @override
  Future<void> signInWithEmail({required String email, required String password}) async {}

  @override
  Future<void> registerWithEmail({required String email, required String password}) async {}

  @override
  Future<String> startPhoneVerification({required String phoneNumber}) async => 'vid';

  @override
  Future<void> confirmPhoneCode({
    required String verificationId,
    required String smsCode,
  }) async {}

  @override
  Future<HiloUser> bootstrap() async => throw UnimplementedError();

  @override
  Future<HiloUser> fetchMe() async => throw UnimplementedError();

  @override
  Future<HiloUser> updateProfile({
    String? displayName,
    String? city,
    String? preferredLanguage,
    String? profilePhoto,
  }) async => throw UnimplementedError();

  @override
  Future<void> signOut() async {}
}

void main() {
  testWidgets('unauthenticated app routes to the welcome screen', (tester) async {
    await tester.pumpWidget(
      ProviderScope(
        overrides: [
          authRepositoryProvider.overrideWithValue(_SignedOutAuthRepository()),
        ],
        child: const HiLoApp(),
      ),
    );

    // Let the auth-state stream emit (signed out) and the router settle to /welcome.
    // We pump fixed frames rather than pumpAndSettle: the transient loading screen shows
    // a CircularProgressIndicator (a continuous animation) that never "settles".
    for (var i = 0; i < 5; i++) {
      await tester.pump(const Duration(milliseconds: 50));
    }

    expect(find.text('Continue with Google'), findsOneWidget);
    expect(find.text('Continue with Phone'), findsOneWidget);
    expect(find.text('Continue with Email'), findsOneWidget);
  });
}
