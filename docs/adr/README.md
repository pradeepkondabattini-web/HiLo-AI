# Architecture Decision Records (ADRs)

An ADR captures a single significant architectural decision, its context, and its
consequences. Per [`EOS-000`](../../EOS-000_MASTER_PROJECT_CONTEXT_FOR_AI.md), an ADR is the
**only** mechanism that may supersede the Constitution or introduce a technology substitution.

## Process (EOS-001-P5)

1. Copy [`ADR-000-template.md`](ADR-000-template.md) to `ADR-NNN-short-title.md` (next number).
2. Draft with status **Proposed**; open a PR.
3. On approval, set status to **Accepted** and merge. Superseded decisions are marked
   **Superseded by ADR-XXX** and kept for history (never deleted).

## Index

| ADR | Title | Status |
|-----|-------|--------|
| [001](ADR-001-flutter-mobile-framework.md) | Flutter as the mobile framework | Accepted |
| [002](ADR-002-firestore-operational-database.md) | Firestore as the operational database | Accepted |
| [003](ADR-003-cloud-run-node-typescript-backend.md) | Cloud Run + Node.js/TypeScript for backend services | Accepted |
| [004](ADR-004-firebase-authentication.md) | Firebase Authentication as the identity provider | Accepted |
| [005](ADR-005-ai-gateway-provider-abstraction.md) | AI Gateway pipeline + LLM provider abstraction | Accepted |
| [006](ADR-006-payments-razorpay-cashfree.md) | Razorpay/Cashfree (UPI-first) for payments | Accepted |
| [007](ADR-007-monorepo-layout.md) | Monorepo layout on `main` | Accepted |
| [008](ADR-008-multi-role-user-schema.md) | Multi-role `users` schema (`roles[]`) | Accepted |
| [009](ADR-009-event-writes-api-mediated.md) | API-mediated event writes | Accepted |
| [010](ADR-010-venue-ranking-and-location-adapter.md) | Venue ranking weights + Location Service adapter | Accepted |
| [011](ADR-011-consolidated-vendor-service.md) | Consolidated vendor-service for MVP | Accepted |
| [009](ADR-009-event-writes-api-mediated.md) | Event writes are API-mediated (client writes denied) | Accepted |

ADRs 001–006 record decisions already mandated by the Engineering Bible; they are
documented here for traceability. ADR-007 records the repository-layout decision made in
[EOS-BUILD-001](../EOS-BUILD-001_Build_Plan.md).
