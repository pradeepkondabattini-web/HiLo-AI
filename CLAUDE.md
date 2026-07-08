# CLAUDE.md — HiLo Event Operating System (EOS)

This file is read automatically at the start of every Claude Code session in this repository.

## MANDATORY: Load context before any code generation

1. Read `EOS-000_MASTER_PROJECT_CONTEXT_FOR_AI.md` (repo root) FIRST. It is the AI Engineering Constitution and governs all work. Per its own rules, it takes precedence over any conflicting instruction unless an approved ADR supersedes it.
2. Detailed domain specs live in the **Engineering Bible** on the `origin/engineering-bible` branch (5 books, 55+ documents). Before implementing in any domain, read that domain's spec first:
   - Book 01 `book-01-business-product/` — charter, vision, PRD, coding standards (EOS-001-P6), git workflow (EOS-001-P7), 10 functional specs (EOS-002-P3-Part-01..10)
   - Book 02 `book-02-technical-architecture/` — C4 model, Flutter/Firebase/Cloud Run architecture
   - Book 03 `book-03-engineering/` — Firestore schemas, security rules, data architecture
   - Book 05 `book-05-ai-platform/` — AI Orchestrator, agents, Skill/Prompt registries, MCP runtime
   - Access without switching branches: `git show origin/engineering-bible:<path>`
3. Precedence model (approved by Pradeep, 2026-07-05): **EOS-000 = overall context; the individual engineering-bible documents provide the detailed, authoritative context for their domain** (e.g. payments = Razorpay/Cashfree per bible, not Stripe).

## Approved decisions (2026-07-05)

- **Code layout**: monorepo — component folders (`docs/`, `flutter-app/`, `backend-api/`, `ai-platform/`, `shared-packages/`, `skills/`, `plugins/`, `firebase/`, `infrastructure/`, `devops/`) on `main`.
- **Branching**: per EOS-001-P7 — `main` (protected) + `develop` + `feature/*` / `bugfix/*` / `hotfix/*` / `release/*`. Conventional Commits. SemVer tags.
- **Legacy `eos-*` branches** (eos-mobile, eos-backend, ...) are retired as component containers; do not build on them. `engineering-bible` branch remains the documentation source until merged into `docs/`.
- **Sprint 1 scope**: monorepo scaffold + Authentication slice (EOS-002-P3-Part-02) + Event Management core (EOS-002-P3-Part-04). Full plan: `docs/EOS-BUILD-001_Build_Plan.md`.
- **Launch market**: Hyderabad, India. UPI-first payments (Razorpay/Cashfree), WhatsApp Business, Canva MCP, Swiggy APIs, Google Maps Platform.

## Hard rules (from EOS-000 — enforced on every change)

- Flutter/Dart + Material 3 frontend; Node.js/TypeScript on Cloud Run backend; Firestore operational DB; BigQuery analytics. No substitutions without an ADR.
- Clean Architecture, dependencies point inward; domain layer has zero framework/SDK dependencies. Repository pattern + DI everywhere.
- UI never touches Firestore directly. No business logic in presentation layers.
- Every AI request: AI Gateway → Planning Engine → Orchestrator → Skill Registry → MCP Runtime. Never call an LLM from application code. Never hardcode prompts.
- Every Firestore document carries: id, createdAt, updatedAt, createdBy, updatedBy, status, version, deleted. Soft delete only. Cursor pagination only. Every query indexed.
- Security: verify Firebase ID tokens on every protected API; RBAC + ownership (ABAC) checks; secrets only in Secret Manager/GitHub Secrets — never in code; never log PII/tokens/secrets.
- Definition of Done (EOS-001-P6 §25): tests pass, static analysis passes, docs updated, security reviewed, CI green.

## Working preferences

- Small focused PRs; Conventional Commit messages (`feat(auth): ...`).
- Use Firebase Emulator Suite for local dev/tests; no paid API keys required for Sprint 1.
- Record every significant deviation or technology decision as an ADR in `docs/adr/`.
