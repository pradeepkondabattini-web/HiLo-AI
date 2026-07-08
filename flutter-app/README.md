# flutter-app/

The HiLo consumer mobile application — Flutter · Dart 3 · Material 3.

**Stack (EOS-003-P2 §4):** Riverpod (state + DI), GoRouter (routing), Dio (networking),
`logger`, `intl`/gen-l10n. Feature-First Clean Architecture.

## Structure

```
lib/
├── main.dart              # entry point — single ProviderScope
├── app/                   # root widget (MaterialApp.router)
├── core/                  # cross-cutting
│   ├── config/            # AppEnvironment (dart-define, no secrets)
│   ├── logging/           # AppLogger
│   ├── router/            # GoRouter provider + route constants
│   └── theme/             # Material 3 light/dark from a brand seed
├── shared/                # shared widgets/utils across features
├── l10n/                  # ARB files (en, hi, te) + generated localizations
└── features/
    ├── home/              # temporary landing screen (Sprint 1A)
    ├── authentication/    # Sprint 1B — EOS-002-P3-Part-02
    └── events/            # Sprint 1C — EOS-002-P3-Part-04
```

Each feature module: `presentation/ · domain/ · data/ · application/ · services/`
(EOS-003-P2 §6). **Rules:** the domain layer has zero framework/SDK dependencies; the UI
never touches Firestore directly; business logic never lives in widgets.

## Getting started

This folder is a hand-authored source. Some things are **generated** by the toolchain:

1. **Platform folders** (`android/`, `ios/`, `web/`, ...) — generate once:
   ```bash
   cd flutter-app
   flutter create . --org ai.hilo --project-name hilo
   ```
2. **Firebase config** — `lib/firebase_options.dart` is a committed **placeholder**;
   regenerate it (and register the Android/iOS/Web apps) with:
   ```bash
   dart pub global activate flutterfire_cli
   flutterfire configure --project=hilo-23078
   ```
   For **Google Sign-In on Android**, also add your app's SHA-1/SHA-256 in the Firebase
   console (Project settings → Your apps).
3. **Localizations** (`lib/l10n/app_localizations.dart`) — generated from the ARB files on
   `flutter pub get` (because `generate: true` in `pubspec.yaml`).

Then:

```bash
flutter pub get      # installs deps + runs gen-l10n
flutter analyze      # static analysis (analysis_options.yaml)
flutter test         # runs widget tests (Firebase is stubbed)
```

### Run fully locally against the Firebase Emulator Suite (no billing/credentials)

1. **Emulators** (repo root): `firebase emulators:start` (Auth `:9099`, Firestore `:8080`).
2. **Backend + dev gateway** (one command, from repo root):
   ```bash
   node devops/dev-gateway/dev-backend.mjs
   ```
   Starts auth-service (`:8081`) + event-service (`:8082`) + a local API gateway (`:8000`)
   that routes `/api/v1/auth` and `/api/v1/events` to the right service and adds CORS for
   the web build. (The gateway stands in for the production BFF — see
   [devops/dev-gateway](../devops/dev-gateway/README.md).)
3. **App** (from `flutter-app/`):
   ```bash
   flutter run -d chrome \
     --dart-define=USE_FIREBASE_EMULATOR=true \
     --dart-define=API_BASE_URL=http://localhost:8000
   ```
   Click through: welcome → sign in → onboarding → dashboard → create event.

### Run against real Firebase

Enable Auth providers (Google/Phone/Email) in the console, run/deploy the backend with real
Admin credentials, then `flutter run -d chrome --dart-define=API_BASE_URL=<backend-url>`.
For Google Sign-In on **web**, add the OAuth web client id to `web/index.html`.

> `flutter analyze` / `flutter test` pass without any of the above (widget tests stub Firebase).

> The generated platform folders are git-ignored so this scaffold stays toolchain-free.
> Once your team needs platform-specific config (signing, `Info.plist`, permissions),
> un-ignore `flutter-app/android/` and `flutter-app/ios/` in the root `.gitignore` and
> commit them.

## Status

- **Sprint 1A shell** ✓ — Material 3 theming, GoRouter, localization.
- **Sprint 1B-4 authentication** ✓ — welcome → Google/Phone/Email sign-in → onboarding
  (profile, language, role) → dashboard, with a GoRouter auth guard, Riverpod session, and
  Dio calls to auth-service. See [`features/authentication`](lib/features/authentication/README.md).
  Requires `flutterfire configure` + a running auth-service to exercise end-to-end.
- **Events (1C) Flutter slice** — pending.
