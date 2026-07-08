---
title: HiLo EOS – Build Plan & Sprint Order
document_id: EOS-BUILD-001
version: 1.0.0
status: Draft for Approval
project: EOS (Event Operating System)
product: HiLo
owner: Pradeep + AI Engineering
created: 2026-07-05
governing_documents: EOS-000, Engineering Bible (Books 1–5)
---

# HiLo EOS – Build Plan & Sprint Order

> Execution roadmap for building the HiLo platform from the Engineering Bible.
> EOS-000 governs overall context; detailed specs in each bible document govern their domain.

---

# 1. Foundational Decisions (Approved 2026-07-05)

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Code layout | **Monorepo — folders on `main`** | Matches EOS-000 §15; single history, simplest CI; branches follow EOS-001-P7 (develop + feature/*) |
| Sprint 1 scope | **Scaffold + Auth + Event core** | Traceability matrix (PRD §16): Sprint 1 = Auth, Sprint 2 = Events — combined into first milestone |
| Payments | Razorpay / Cashfree (UPI-first) | Bible detail overrides EOS-000's Stripe mention |
| Launch market | Hyderabad, India | Per Project Charter |
| Existing branches | `eos-*` branches retired after content merged into monorepo folders | Branches reserved for feature/release flow per EOS-001-P7 |

Repository structure (target):

```
HiLo-AI/
├── docs/                  # Engineering Bible + ADRs + API specs
├── flutter-app/           # Consumer app (Feature-First Clean Architecture)
├── backend-api/           # Cloud Run microservices (Node.js + TypeScript)
│   ├── services/auth-service/
│   ├── services/event-service/
│   └── shared/            # Shared middleware, logging, errors, config
├── ai-platform/           # AI Gateway, Orchestrator, Agents, Skill Registry
├── shared-packages/       # Cross-cutting models, API SDK, design tokens
├── skills/                # AI Skill definitions (versioned)
├── plugins/               # Plugin SDK + marketplace plugins (Phase 3)
├── firebase/              # Firestore rules, indexes, emulator config
├── infrastructure/        # Terraform (GCP: Cloud Run, Firestore, Pub/Sub...)
├── devops/                # Deployment scripts, monitoring config
└── .github/workflows/     # CI/CD (GitHub Actions)
```

Branching per EOS-001-P7: `main` (protected) ← `develop` ← `feature/*`; Conventional Commits; SemVer tags.

---

# 2. Build Phases

## Sprint 1 — Foundation, Auth & Event Core  ◄ CURRENT

**Goal:** A runnable skeleton with two real end-to-end slices.

### 1A. Monorepo scaffold
- Folder structure above, with README/CHANGELOG/CONTRIBUTING/CODEOWNERS/SECURITY per EOS-001-P7 §16
- Flutter app shell: Material 3, feature-first layout (core/ shared/ features/ app/), routing, theme, localization stub (en + te/hi ready)
- Backend service template: TypeScript, Express, DI container, structured logging (correlation IDs), standard error envelope, /health + /ready endpoints, Dockerfile
- Firebase config: Firestore security rules baseline (deny-by-default), emulator suite for local dev
- CI: GitHub Actions — lint, format check, unit tests, build (Flutter + Node), secret scanning
- ADR log started: ADR-001..006 recorded from bible decisions + ADR-007 (monorepo layout, this plan)

### 1B. Authentication & Identity slice (EOS-002-P3-Part-02)
- Flutter `features/authentication/`: welcome → Google Sign-In / Phone OTP / Email — Firebase Auth
- Onboarding flow: profile creation (name, mobile, email, city, language), role selection (Consumer/Business), preferences
- `auth-service` (Cloud Run): Firebase ID token verification middleware, user bootstrap (users/ collection with mandatory metadata fields per EOS-000 §35), RBAC role claims
- Firestore: users/, roles/, sessions/ + security rules + indexes
- Multi-role support (one account, many roles) per spec §4

### 1C. Event Management core (EOS-002-P3-Part-04)
- Flutter `features/events/`: dashboard, create-event wizard (<5 min flow: type → details → budget → guests → location), event workspace shell
- `event-service` (Cloud Run): CRUD + lifecycle state machine (Draft → Planning → ... → Archived), one-owner rule, co-hosts, soft delete, versioning
- Firestore: events/, event_members/, event_budgets/ + rules + indexes
- Budget allocation defaults (Venue 40% / Food 30% / ...) as configurable master data

**Definition of Done (per EOS-001-P6 §25):** tests pass, static analysis clean, docs updated, security rules reviewed, CI green.

---

## Sprint 2 — Venue Discovery + Google Maps (EOS-002-P3-Part-05)
- venue-service; Google Places integration behind Location Service adapter (never direct SDK in business code)
- Map UI, filters, radius search (10 km default), venue cards, compare-4, favourites, shortlists
- Ranking algorithm with documented configurable weights (budget 25%, capacity 20%, distance 15%...)
- Firestore: venues/, venue_shortlists/, venue_votes/, venue_favourites/

## Sprint 3 — Vendor Marketplace (EOS-002-P3-Part-06)
- vendor-service + marketplace collections; vendor onboarding & 4-level verification
- Vendor discovery, compare, quotations workflow (Requested → ... → Accepted/Expired)
- Marketplace Trust Score service (scheduled recalculation)
- Business Portal shell (Flutter web or responsive) for listings/bookings

## Sprint 4 — AI Platform Core (EOS-002-P3-Parts-07/08/09 + Book 5)
- AI Gateway (sole LLM entry point) → Planning Engine → Orchestrator
- Prompt Registry + Skill Registry (Firestore-backed, versioned)
- First agents: Planner, Venue, Vendor, Budget — orchestrator-mediated only
- MCP adapters: Google Maps first; explainability envelope on every recommendation
- AI Event Readiness Score; conversational planning endpoint /ai/chat
- Human-approval framework for external actions

## Sprint 5 — Collaboration + Notifications (Parts 04/08)
- Event workspace: chat, polls/voting, task board, RSVP dashboard, shared gallery
- notification-service: FCM push + email; centralized routing
- Guest management: invites, RSVP tracking, statuses

## Sprint 6 — External MCPs & Commerce
- WhatsApp Business integration (template messages, preview-before-send)
- Canva MCP (invitations/themes), Swiggy APIs (catering/grocery)
- Payment service: Razorpay/Cashfree UPI, contributions, group discount engine (5/10/15/20%)

## Sprint 7 — Media, Analytics, Admin
- Media gallery + Cloud Storage; AI highlights (via platform)
- analytics-service → BigQuery export; Admin Portal (verification, moderation, AI monitoring)

## Phase 3+ (post-MVP, per roadmap)
- Skill Marketplace, Plugin SDK + Marketplace (Part 10), enterprise connectors, multi-tenancy

---

# 3. Working Model

1. I build in the cloud workspace, following bible specs read per-domain before coding.
2. This sandbox cannot push to GitHub (network policy), so delivery is through your machine: finished files are written into your local clone (`C:\Users\prade\Documents\Project_EventOS\HiLo-AI` — local disk, not OneDrive, to avoid sync conflicts with git) via the desktop bridge — you review, commit, and push.
3. Conventional Commits, feature branches, small focused changes.
4. Each sprint ends with: working code + tests + updated docs + ADRs for any deviation from the bible.

# 4. Prerequisites You'll Need (before things can run live)

- Firebase project (Auth providers enabled: Google, Phone, Email) + GCP project
- google-services.json / firebase config (never committed; env/Secret Manager)
- Google Maps Platform API key (Sprint 2)
- OpenAI API key (Sprint 4) · WhatsApp/Canva/Swiggy/Razorpay credentials (Sprint 6)

Everything in Sprint 1 can be built and unit-tested against the Firebase Emulator Suite without any paid keys.

---

*Approval: reply "approved" (or request changes) and Sprint 1 construction begins.*
