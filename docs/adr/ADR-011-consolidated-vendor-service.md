# ADR-011: Consolidated vendor-service for MVP (marketplace capabilities in one service)

- **Status:** Accepted
- **Date:** 2026-07-09
- **Deciders:** Pradeep, AI Engineering
- **Related:** EOS-002-P3-Part-06 §21; EOS-000 §20; ADR-007

## Context

EOS-002-P3-Part-06 §21 prescribes **seven** dedicated Cloud Run services for the vendor
marketplace (Vendor, Marketplace, Recommendation Engine, Quote, Availability, Analytics,
Trust Score). At MVP scale — one team, no traffic — seven deployables would multiply
operational surface (deploys, monitoring, IAM) without an isolation benefit.

## Decision

Sprint 3 ships **one `vendor-service`** hosting the marketplace capabilities: ranked
search (Vendor Intelligence Score §9), onboarding + verification levels, the quotation
state machine (§12), and the Trust Score calculator (§18) with an admin/scheduler
recalculation endpoint. Internal seams stay clean — scoring, trust, and quotes are
separate domain modules behind use cases — so any capability can be split into its own
service later without domain changes.

Also deferred from the sprint plan:

- **Business Portal shell** (vendor-side web UI) — the consumer app covers browse/quote
  flows; vendor-side management currently uses the same app's "My quotes" (received)
  view. A dedicated portal lands with a later sprint.
- **Scheduled Trust Score recalculation** exists as an admin-gated endpoint
  (`POST /vendors/trust/recalculate`); wiring Cloud Scheduler to it happens at deploy time.
- **Reviews, promotions, availability calendars, bookings, Swiggy/WhatsApp integrations**
  (§13–17) — later sprints per the build plan.

## Consequences

- One deployable, one pipeline; all Sprint-3 capabilities tested together (20 tests).
- The §21 topology remains the target at scale; splitting is additive (new service +
  route), not a rewrite, because domain modules are already isolated.

## Alternatives considered

- **Seven services now** — rejected: operational overhead without benefit at MVP scale.
- **Folding vendors into venue-service** — rejected: separate business domains (EOS-000
  §20 — services organized by business capability).

## References

- EOS-002-P3-Part-06 §9, §12, §18, §21, §24; EOS-000 §20.
