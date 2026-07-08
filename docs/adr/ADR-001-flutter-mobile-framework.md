# ADR-001: Flutter as the mobile framework

- **Status:** Accepted
- **Date:** 2026-07-05
- **Deciders:** Pradeep, AI Engineering (per EOS-000)
- **Related:** EOS-000 §8–9, §17–18; EOS-003-P2 (Flutter Application Architecture)

## Context

HiLo requires a single cross-platform mobile codebase delivering a high-fidelity,
Material 3 experience on Android and iOS, with strong support for feature-first Clean
Architecture, localization (English, Telugu, Hindi), and a rich widget ecosystem.

## Decision

We will build the HiLo consumer application with **Flutter (Dart)** using **Material 3**.
Flutter is the *only* approved mobile framework. The app follows Feature-First Clean
Architecture: `core/`, `shared/`, `features/<feature>/{presentation, application, domain,
infrastructure}`, `app/`. The domain layer carries zero framework/SDK dependencies, and
the UI never accesses Firestore directly.

## Consequences

- Single codebase for Android and iOS; consistent Material 3 design language.
- Team standardizes on Dart tooling (analyzer, `dart format`) enforced in CI.
- Native platform folders are generated locally (`flutter create .`) and git-ignored.
- Any alternative framework for a specific surface requires a new ADR.

## Alternatives considered

- **React Native / Kotlin Multiplatform** — rejected; Flutter chosen in EOS-000 for UI
  fidelity, single-codebase productivity, and Material 3 alignment.
- **Native Android + iOS** — rejected; duplicated effort, slower delivery for MVP.

## References

- EOS-000 Master Project Context §8 (Technology Stack), §9 (Technology Decisions), §17–18.
- Engineering Bible EOS-003-P2 Flutter Application Architecture.
