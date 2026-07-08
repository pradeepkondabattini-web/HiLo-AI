# Contributing to HiLo (EOS)

Thank you for contributing. HiLo is an enterprise platform; every contribution must be
production-quality. This guide summarizes the workflow. The authoritative sources are
[`EOS-000`](EOS-000_MASTER_PROJECT_CONTEXT_FOR_AI.md), and — on the `origin/engineering-bible`
branch — **EOS-001-P6** (Coding Standards) and **EOS-001-P7** (Git Workflow).

## Before you write code

1. Read [`EOS-000`](EOS-000_MASTER_PROJECT_CONTEXT_FOR_AI.md) — the AI Engineering Constitution.
2. Read the **domain spec** for the area you're touching (the individual Engineering Bible
   document is authoritative for its domain; `EOS-000` provides overall context only).
3. Record any deviation or new technology choice as an [ADR](docs/adr/).

## Branching model (EOS-001-P7)

```
main (protected)  ←  develop  ←  feature/* | bugfix/* | hotfix/* | release/*
```

- `main` — production-ready, protected. No direct commits, no force pushes.
- `develop` — integration branch.
- Branch names: lowercase-with-hyphens, e.g. `feature/event-management`, `bugfix/login-timeout`.

## Commits — Conventional Commits

```
<type>(<scope>): <description>
```

Types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `perf`, `build`, `ci`.

Examples:
```
feat(auth): add Firebase ID token verification middleware
fix(events): resolve duplicate event creation on retry
docs(adr): record payments provider decision (ADR-006)
```

## Pull requests (EOS-001-P7 §11–12)

Every PR must include: a summary, linked issue/task, testing performed, screenshots for UI
changes, doc updates, and breaking-change notes. Keep PRs small and focused.

A PR may merge only when: CI is green, tests pass, static analysis passes, secret scanning
passes, and at least one reviewer (per [CODEOWNERS](.github/CODEOWNERS)) approves. Significant
changes require architecture review.

## Definition of Done (EOS-001-P6 §25)

- [ ] Requirements implemented
- [ ] Tests pass (unit / integration / widget as applicable)
- [ ] Static analysis passes (Dart analyzer / ESLint)
- [ ] Formatting applied (dart format / Prettier)
- [ ] Documentation updated (incl. ADRs for deviations)
- [ ] Security reviewed (authn/authz, input validation, no secrets, no PII in logs)
- [ ] CI/CD pipeline succeeds

## Architectural non-negotiables (from EOS-000)

- Clean Architecture; dependencies point inward; the **domain layer has zero framework/SDK deps**.
- **UI never touches Firestore directly.** No business logic in presentation layers.
- Repository pattern + Dependency Injection everywhere.
- Every AI request goes through the pipeline: **AI Gateway → Planning Engine → Orchestrator →
  Skill Registry → MCP Runtime**. Never call an LLM from application code. Never hardcode prompts.
- Every Firestore document carries `id, createdAt, updatedAt, createdBy, updatedBy, status,
  version, deleted`. **Soft delete only.** Cursor pagination only. Every query indexed.
- Secrets live only in Secret Manager / GitHub Secrets — never in code. Never log PII/tokens/secrets.

## Local development

Sprint 1 runs against the Firebase Emulator Suite; no paid keys required. See the
[README](README.md#getting-started).
