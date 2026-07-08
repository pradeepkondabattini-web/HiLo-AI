# ADR-007: Monorepo layout on `main`

- **Status:** Accepted
- **Date:** 2026-07-05
- **Deciders:** Pradeep, AI Engineering
- **Related:** EOS-000 §15–16; EOS-001-P7 §3 (Repository Strategy); EOS-BUILD-001

## Context

EOS-000 §15 and EOS-001-P7 §3 describe a *multi-repository* strategy. For the current team
size and delivery velocity, a single repository with clear component boundaries provides one
history, the simplest CI, and easy cross-component refactoring, while preserving the same
component separation the multi-repo model intends.

## Decision

We will use a **monorepo** on the `main` branch, with top-level component folders that mirror
the intended repository boundaries:

```
docs/  flutter-app/  backend-api/  ai-platform/  shared-packages/
skills/  plugins/  firebase/  infrastructure/  devops/  .github/
```

This **supersedes the multi-repository language in EOS-000 §15 / EOS-001-P7 §3**. Component
cohesion rules still apply: unrelated domains are not mixed within a folder, and each backend
service under `backend-api/services/*` owns its own API surface and data.

Branching follows EOS-001-P7 unchanged: `main` (protected) ← `develop` ← `feature/*` /
`bugfix/*` / `hotfix/*` / `release/*`; Conventional Commits; SemVer tags. `CODEOWNERS` maps
review ownership per component folder. Legacy `eos-*` branches are retired as component
containers.

## Consequences

- Single clone, single CI configuration, atomic cross-component changes.
- CI must use path filters so component pipelines run only on relevant changes.
- If a component later needs independent release cadence or access control, it can be split
  out via a follow-up ADR.

## Alternatives considered

- **Multi-repo (as literally written in EOS-000 §15)** — rejected for now; higher coordination
  overhead and cross-repo change friction at current scale.

## References

- EOS-000 §15–16; EOS-001-P7 §3, §16 (Repository Standards).
- EOS-BUILD-001 Foundational Decisions (Code layout).
