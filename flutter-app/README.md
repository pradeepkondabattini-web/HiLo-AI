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
flutter test         # runs test/widget_test.dart (Firebase is stubbed)
# Point the app at the backend (auth-service) via a compile-time define:
flutter run --dart-define=API_BASE_URL=http://10.0.2.2:8080   # Android emulator → host
```

> `flutter analyze` / `flutter test` work with the placeholder Firebase config; the app
> only connects to Firebase after `flutterfire configure`. Run auth-service (or deploy it)
> and set `API_BASE_URL` for the profile calls (`/bootstrap`, `/me`) to succeed.

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
