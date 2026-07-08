import 'hilo_user.dart';

/// Repository contract for authentication & identity (EOS-002-P3-Part-02).
///
/// Combines the identity provider (Firebase Auth: Google, Phone, Email) with the HiLo
/// backend (auth-service) for the platform profile. Implementations translate provider
/// errors into [AuthException]. The domain has zero framework dependencies.
abstract interface class AuthRepository {
  /// Emits the current Firebase uid, or null when signed out.
  Stream<String?> authStateChanges();

  /// The signed-in uid, or null.
  String? get currentUid;

  // ── Sign-in / registration (EOS-002-P3-Part-02 §6) ──────────────────────────
  Future<void> signInWithGoogle();
  Future<void> signInWithEmail({required String email, required String password});
  Future<void> registerWithEmail({required String email, required String password});

  /// Begin phone verification; returns a `verificationId` to pair with the SMS code.
  /// On some platforms auto-retrieval may complete sign-in without a manual code.
  Future<String> startPhoneVerification({required String phoneNumber});

  /// Complete phone sign-in with the SMS code and the `verificationId`.
  Future<void> confirmPhoneCode({
    required String verificationId,
    required String smsCode,
  });

  // ── Backend profile (auth-service) ──────────────────────────────────────────
  /// First-login upsert of the platform user (POST /bootstrap).
  Future<HiloUser> bootstrap();

  /// Fetch the caller's profile (GET /me).
  Future<HiloUser> fetchMe();

  /// Update the caller's profile during onboarding (PATCH /me).
  Future<HiloUser> updateProfile({
    String? displayName,
    String? city,
    String? preferredLanguage,
    String? profilePhoto,
  });

  Future<void> signOut();
}
