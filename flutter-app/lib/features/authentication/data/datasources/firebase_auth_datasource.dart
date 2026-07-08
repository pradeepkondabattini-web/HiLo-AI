import 'dart:async';

import 'package:firebase_auth/firebase_auth.dart';
import 'package:google_sign_in/google_sign_in.dart';

import '../../domain/auth_failure.dart';

/// Wraps Firebase Authentication and Google Sign-In (EOS-002-P3-Part-02 §6). Translates
/// [FirebaseAuthException]s into typed [AuthException]s. Infrastructure layer.
class FirebaseAuthDataSource {
  FirebaseAuthDataSource({FirebaseAuth? auth, GoogleSignIn? googleSignIn})
    : _auth = auth ?? FirebaseAuth.instance,
      _googleSignIn = googleSignIn ?? GoogleSignIn();

  final FirebaseAuth _auth;
  final GoogleSignIn _googleSignIn;

  Stream<String?> authStateChanges() =>
      _auth.authStateChanges().map((user) => user?.uid);

  String? get currentUid => _auth.currentUser?.uid;

  /// Current Firebase ID token, or null when signed out. Used to authorize backend calls.
  Future<String?> currentIdToken({bool forceRefresh = false}) async {
    final user = _auth.currentUser;
    if (user == null) return null;
    return user.getIdToken(forceRefresh);
  }

  Future<void> signInWithGoogle() async {
    try {
      final googleUser = await _googleSignIn.signIn();
      if (googleUser == null) {
        throw const AuthException(CancelledByUserFailure());
      }
      final googleAuth = await googleUser.authentication;
      final credential = GoogleAuthProvider.credential(
        accessToken: googleAuth.accessToken,
        idToken: googleAuth.idToken,
      );
      await _auth.signInWithCredential(credential);
    } on FirebaseAuthException catch (e) {
      throw _map(e);
    }
  }

  Future<void> signInWithEmail({required String email, required String password}) async {
    try {
      await _auth.signInWithEmailAndPassword(email: email, password: password);
    } on FirebaseAuthException catch (e) {
      throw _map(e);
    }
  }

  Future<void> registerWithEmail({required String email, required String password}) async {
    try {
      final credential = await _auth.createUserWithEmailAndPassword(
        email: email,
        password: password,
      );
      await credential.user?.sendEmailVerification();
    } on FirebaseAuthException catch (e) {
      throw _map(e);
    }
  }

  /// Starts phone verification, resolving with the `verificationId` once the SMS is sent
  /// (or auto-retrieval times out). Verification failures reject the returned future.
  Future<String> startPhoneVerification({required String phoneNumber}) async {
    final completer = Completer<String>();
    await _auth.verifyPhoneNumber(
      phoneNumber: phoneNumber,
      verificationCompleted: (credential) async {
        // Android instant validation / auto-retrieval — sign in directly.
        try {
          await _auth.signInWithCredential(credential);
        } catch (_) {
          // Ignored: the manual code path (codeSent) remains available.
        }
      },
      verificationFailed: (e) {
        if (!completer.isCompleted) completer.completeError(_map(e));
      },
      codeSent: (verificationId, _) {
        if (!completer.isCompleted) completer.complete(verificationId);
      },
      codeAutoRetrievalTimeout: (verificationId) {
        if (!completer.isCompleted) completer.complete(verificationId);
      },
    );
    return completer.future;
  }

  Future<void> confirmPhoneCode({
    required String verificationId,
    required String smsCode,
  }) async {
    try {
      final credential = PhoneAuthProvider.credential(
        verificationId: verificationId,
        smsCode: smsCode,
      );
      await _auth.signInWithCredential(credential);
    } on FirebaseAuthException catch (e) {
      throw _map(e);
    }
  }

  Future<void> signOut() async {
    await _googleSignIn.signOut().catchError((_) => null);
    await _auth.signOut();
  }

  AuthException _map(FirebaseAuthException e) {
    final failure = switch (e.code) {
      'invalid-credential' ||
      'wrong-password' ||
      'user-not-found' ||
      'invalid-email' => const InvalidCredentialsFailure(),
      'email-already-in-use' => const EmailAlreadyInUseFailure(),
      'weak-password' => const WeakPasswordFailure(),
      'invalid-verification-code' ||
      'invalid-verification-id' => const InvalidOtpFailure(),
      'user-disabled' => const AccountDisabledFailure(),
      'network-request-failed' => const NetworkFailure(),
      _ => const UnknownAuthFailure(),
    };
    return AuthException(failure);
  }
}
