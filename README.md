# HiLo — Event Operating System (EOS)

> AI-native, cloud-native, hyperlocal **Event Operating System**.
> Planning · Discovery · Collaboration · Commerce — with AI embedded in every journey.

**Launch market:** Hyderabad, India · **Product:** HiLo · **Project:** EOS

---

## What this is

HiLo is not an event-management app — it is a platform that coordinates people, venues,
vendors, AI agents, plugins, workflows, and integrations across the complete event
lifecycle. See the [AI Engineering Constitution](EOS-000_MASTER_PROJECT_CONTEXT_FOR_AI.md)
(`EOS-000`) for the authoritative context, and the
[Build Plan](docs/EOS-BUILD-001_Build_Plan.md) (`EOS-BUILD-001`) for the sprint roadmap.

## Technology stack (no substitutions without an approved ADR)

| Layer | Technology |
|-------|-----------|
| Mobile | Flutter · Dart · Material 3 |
| Backend | Node.js · TypeScript · Cloud Run |
| Operational DB | Cloud Firestore |
| Analytics | BigQuery |
| Identity | Firebase Authentication |
| AI | AI Gateway → Planning Engine → Orchestrator → Skill Registry → MCP Runtime (provider-abstracted) |
| Payments | Razorpay / Cashfree (UPI-first) — see [ADR-006](docs/adr/ADR-006-payments-razorpay-cashfree.md) |
| Cloud | Google Cloud Platform |

## Monorepo layout

```
HiLo-AI/
├── docs/               # Engineering Bible, ADRs, API specs, build plan
├── flutter-app/        # Consumer app (Feature-First Clean Architecture)
├── backend-api/        # Cloud Run microservices (Node.js + TypeScript)
│   ├── services/auth-service/
│   ├── services/event-service/
│   └── shared/         # Shared middleware, logging, errors, config
├── ai-platform/        # AI Gateway, Orchestrator, Agents, Skill Registry
├── shared-packages/    # Cross-cutting models, API SDK, design tokens
├── skills/             # AI Skill definitions (versioned)
├── plugins/            # Plugin SDK + marketplace plugins (Phase 3)
├── firebase/           # Firestore rules, indexes, emulator config
├── infrastructure/     # Terraform (GCP: Cloud Run, Firestore, Pub/Sub, ...)
├── devops/             # Deployment scripts, monitoring config
└── .github/workflows/  # CI/CD (GitHub Actions)
```

## Getting started

Sprint 1 runs entirely against the **Firebase Emulator Suite** — no paid API keys required.

Prerequisites: [Flutter](https://docs.flutter.dev/get-started/install),
[Node.js 20+](https://nodejs.org), [Firebase CLI](https://firebase.google.com/docs/cli),
and the Java runtime the emulators require.

```bash
# Backend service (example: auth-service)
cd backend-api/services/auth-service
npm install
npm test
npm run dev

# Flutter app
cd flutter-app
flutter pub get
flutter run

# Firebase emulators (from repo root)
firebase emulators:start
```

## Governance & contribution

- **Constitution:** [`EOS-000`](EOS-000_MASTER_PROJECT_CONTEXT_FOR_AI.md) governs all work; it takes
  precedence over any conflicting instruction unless a merged [ADR](docs/adr/) supersedes it.
- **Domain specs:** the Engineering Bible (`origin/engineering-bible` branch) is authoritative per domain.
- **Workflow:** [`CONTRIBUTING.md`](CONTRIBUTING.md) — branching (EOS-001-P7), Conventional Commits, Definition of Done.
- **Security:** [`SECURITY.md`](SECURITY.md).

## Status

Sprint 1 (Foundation · Authentication · Event Core) — **in progress**. See the
[Build Plan](docs/EOS-BUILD-001_Build_Plan.md) and [CHANGELOG](CHANGELOG.md).

## License

Proprietary — © HiLo / Project EOS. All rights reserved. See [LICENSE](LICENSE).
