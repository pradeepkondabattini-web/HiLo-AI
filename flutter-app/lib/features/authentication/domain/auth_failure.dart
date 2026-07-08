/// Domain failures for authentication (EOS-002-P3-Part-02 §15). Framework-free.
///
/// Data-layer errors (FirebaseAuthException, Dio errors) are translated into these so the
/// presentation layer shows user-friendly messages without leaking implementation detail.
sealed class AuthFailure {
  const AuthFailure(this.message);
  final String message;
}

class InvalidCredentialsFailure extends AuthFailure {
  const InvalidCredentialsFailure([super.message = 'The email or password is incorrect.']);
}

class EmailAlreadyInUseFailure extends AuthFailure {
  const EmailAlreadyInUseFailure([super.message = 'An account already exists with this email.']);
}

class WeakPasswordFailure extends AuthFailure {
  const WeakPasswordFailure([super.message = 'Please choose a stronger password.']);
}

class InvalidOtpFailure extends AuthFailure {
  const InvalidOtpFailure([super.message = 'The verification code is incorrect or has expired.']);
}

class AccountDisabledFailure extends AuthFailure {
  const AccountDisabledFailure([
    super.message = 'Your account has been temporarily disabled. Contact support.',
  ]);
}

class NetworkFailure extends AuthFailure {
  const NetworkFailure([
    super.message = 'Please check your internet connection and try again.',
  ]);
}

class CancelledByUserFailure extends AuthFailure {
  const CancelledByUserFailure([super.message = 'Sign-in was cancelled.']);
}

class UnknownAuthFailure extends AuthFailure {
  const UnknownAuthFailure([super.message = 'Something went wrong. Please try again.']);
}

/// Thrown by the data/repository layer; carries a typed {@link AuthFailure}.
class AuthException implements Exception {
  const AuthException(this.failure);
  final AuthFailure failure;

  @override
  String toString() => 'AuthException(${failure.runtimeType}: ${failure.message})';
}
