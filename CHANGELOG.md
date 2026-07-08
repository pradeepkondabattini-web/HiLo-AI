# Changelog

All notable changes to the HiLo Event Operating System are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html)
per [EOS-001-P7 §14](docs/) (Git Workflow & Version Control).

## [Unreleased]

### Added
- Monorepo scaffold: component folders per the approved layout (EOS-000 §15, EOS-BUILD-001).
- Root governance docs: `README`, `LICENSE`, `CONTRIBUTING`, `SECURITY`, `CODEOWNERS`,
  `.gitignore`, `.editorconfig` (per EOS-001-P7 §16).
- Architecture Decision Records ADR-001 … ADR-007 recording the bible's foundational
  technology decisions and the monorepo layout.
- Firebase configuration: deny-by-default Firestore security rules, indexes baseline,
  and Emulator Suite config.
- Backend service template (`backend-api/`): shared library (`@hilo/backend-shared`) with
  Express app factory, structured JSON logger with redaction, standard error envelope,
  DI container, correlation-ID/request-logging/error middleware, and `/health` + `/ready`;
  `auth-service` and `event-service` skeletons with Dockerfiles and passing unit tests.
- Flutter app shell (`flutter-app/`): Material 3 theming, GoRouter navigation, Riverpod,
  and localization (en/hi/te) wired end-to-end, verified by a widget test.
- CI (`.github/workflows/ci.yml`): path-filtered lint, format, typecheck, test, build for
  backend and Flutter, plus secret scanning; Dependabot for npm/pub/actions.
- **Authentication (Sprint 1B, EOS-002-P3-Part-02):** `auth-service` in Clean Architecture —
  Firebase ID-token verification, first-login user bootstrap, RBAC role claims, and
  `/me` + profile update + admin role assignment. Shared document-metadata envelope,
  ADR-008 (multi-role `roles[]`), and deny-by-default rules for `users`/`roles`/`sessions`.
- **Shared auth (`@hilo/backend-shared`):** provider-agnostic token verifier, auth
  middleware, RBAC guard, `FirebaseTokenVerifier`, and Firebase Admin app bootstrap —
  consumed by all services.
- **Event Management (Sprint 1C, EOS-002-P3-Part-04):** `event-service` in Clean
  Architecture — event CRUD, the lifecycle state machine (Draft → … → Archived + Cancelled),
  membership (owner/co-host/guest, ABAC), and budgets with configurable allocation defaults.
  Cursor pagination, soft delete, ADR-009 (API-mediated writes), rules + composite indexes
  for `events`/`event_members`/`event_budgets`.
- **Flutter authentication (Sprint 1B-4):** `features/authentication/` in Feature-First
  Clean Architecture — welcome → Google / Phone (OTP) / Email sign-in → onboarding
  (profile, language, role) → dashboard. Riverpod session (`AsyncNotifier`), GoRouter auth
  guard, Dio client to auth-service with Firebase ID-token injection. Widget test stubs
  Firebase via a fake repository.
- **Flutter events (Sprint 1C slice):** `features/events/` — dashboard (list, empty/error
  states, pull-to-refresh), create-event wizard (type → details → budget → guests →
  location, 5-step `Stepper`), and event workspace shell. Talks to event-service via a
  shared authenticated Dio (`core/network/authenticated_dio.dart`). The dashboard is the
  authenticated home. `flutter analyze` clean; dashboard + welcome widget tests passing.
- Deployed the validated Firestore rules + composite indexes to project `hilo-23078`
  (Firestore database in **asia-south1 / Mumbai**).

- **Venue Discovery — venue-service (Sprint 2, EOS-002-P3-Part-05):** ranked venue search
  merging the HiLo catalogue with a provider-abstracted **Location Service** (Google Places
  behind an adapter — fake used until Maps billing/key), a **configurable, explainable
  ranking algorithm** (budget/capacity/distance/rating/trust/sentiment/amenities/prefs),
  rich filters, radius (default 10 km), compare-4, and favourites. Rules + indexes for
  `venues`/`venue_favourites`/`venue_shortlists`/`venue_votes` (deployed). ADR-010. Clean
  Architecture; 18 unit/route tests (86 backend total).

_Sprint 1 (Foundation · Authentication · Event Core) is complete and running end-to-end
locally; Sprint 2 (Venue Discovery) backend is in progress. See
[EOS-BUILD-001](docs/EOS-BUILD-001_Build_Plan.md)._

[Unreleased]: https://github.com/
