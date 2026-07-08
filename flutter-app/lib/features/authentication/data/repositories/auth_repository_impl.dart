import '../../domain/auth_repository.dart';
import '../../domain/hilo_user.dart';
import '../datasources/auth_api_datasource.dart';
import '../datasources/firebase_auth_datasource.dart';

/// [AuthRepository] implementation composing the Firebase identity provider with the
/// auth-service backend (EOS-000 §56 — repository encapsulates all data access).
class AuthRepositoryImpl implements AuthRepository {
  AuthRepositoryImpl({
    required FirebaseAuthDataSource firebase,
    required AuthApiDataSource api,
  }) : _firebase = firebase,
       _api = api;

  final FirebaseAuthDataSource _firebase;
  final AuthApiDataSource _api;

  @override
  Stream<String?> authStateChanges() => _firebase.authStateChanges();

  @override
  String? get currentUid => _firebase.currentUid;

  @override
  Future<void> signInWithGoogle() => _firebase.signInWithGoogle();

  @override
  Future<void> signInWithEmail({required String email, required String password}) =>
      _firebase.signInWithEmail(email: email, password: password);

  @override
  Future<void> registerWithEmail({required String email, required String password}) =>
      _firebase.registerWithEmail(email: email, password: password);

  @override
  Future<String> startPhoneVerification({required String phoneNumber}) =>
      _firebase.startPhoneVerification(phoneNumber: phoneNumber);

  @override
  Future<void> confirmPhoneCode({
    required String verificationId,
    required String smsCode,
  }) => _firebase.confirmPhoneCode(verificationId: verificationId, smsCode: smsCode);

  @override
  Future<HiloUser> bootstrap() => _api.bootstrap();

  @override
  Future<HiloUser> fetchMe() => _api.fetchMe();

  @override
  Future<HiloUser> updateProfile({
    String? displayName,
    String? city,
    String? preferredLanguage,
    String? profilePhoto,
  }) {
    final body = <String, dynamic>{
      if (displayName != null) 'displayName': displayName,
      if (city != null) 'city': city,
      if (preferredLanguage != null) 'preferredLanguage': preferredLanguage,
      if (profilePhoto != null) 'profilePhoto': profilePhoto,
    };
    return _api.updateProfile(body);
  }

  @override
  Future<void> signOut() => _firebase.signOut();
}
