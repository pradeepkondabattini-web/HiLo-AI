# features/authentication/

**Sprint 1B-4** — EOS-002-P3-Part-02 (Authentication & Identity). Implemented.

Welcome → Google / Phone (OTP) / Email (Firebase Auth) → onboarding (profile, language,
role) → dashboard. The route guard enforces the flow.

## Structure (EOS-003-P2 §6)

```
authentication/
├── domain/            # framework-free
│   ├── user_role.dart          # roles enum (ADR-008)
│   ├── hilo_user.dart          # platform user aggregate
│   ├── auth_failure.dart       # sealed failures + AuthException
│   └── auth_repository.dart     # repository contract
├── data/
│   ├── datasources/
│   │   ├── firebase_auth_datasource.dart  # Firebase Auth + Google Sign-In
│   │   └── auth_api_datasource.dart       # Dio → auth-service (ID token injected)
│   ├── models/hilo_user_dto.dart          # JSON ↔ HiloUser
│   └── repositories/auth_repository_impl.dart
├── application/
│   ├── auth_providers.dart      # Riverpod DI graph
│   └── auth_controller.dart     # AsyncNotifier session + authErrorMessage()
└── presentation/
    ├── pages/                   # welcome, email_sign_in, phone_sign_in, onboarding
    └── widgets/auth_error_listener.dart
```

## How it works

- **Identity** via `firebase_auth` + `google_sign_in`; **profile** via auth-service
  (`POST /bootstrap`, `GET /me`, `PATCH /me`) over Dio, with the Firebase ID token attached
  by a request interceptor. The UI never touches Firestore directly (EOS-000 §30).
- **Session**: `authControllerProvider` (AsyncNotifier) tracks Firebase auth state → loads
  the `HiloUser`. Sign-in/out mutate Firebase; the auth-state stream rebuilds the session.
- **Routing**: `GoRouter` guard (see `core/router/app_router.dart`) redirects signed-out →
  `/welcome`, signed-in-not-onboarded → `/onboarding`, else the app.
- **Roles**: chosen at onboarding but **not self-assigned** — Business requires verification
  (ADR-008, no self-escalation); the account proceeds as Consumer until verified.

## Before running

`firebase_options.dart` is a **placeholder** — regenerate real config with
`flutterfire configure --project=hilo-23078` (see [flutter-app/README](../../../README.md)).
Tests stub Firebase via a fake `AuthRepository`, so `flutter test` needs no real config.
