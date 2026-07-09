# vendor-service

Vendor Marketplace (EOS-002-P3-Part-06): ranked vendor discovery, onboarding + 4-level
verification, the Smart Quotations state machine, and the HiLo Trust Score. Consolidated
into one service for MVP ([ADR-011](../../../docs/adr/ADR-011-consolidated-vendor-service.md)).

## Architecture (Clean Architecture — EOS-000 §18)

```
src/
├── domain/           # Vendor (+verification levels), Vendor Intelligence Score (§9),
│                     #   Trust Score calculator (§18), Quote + state machine (§12), ports
├── application/      # SearchVendors, Get/Compare, Onboard, RecalculateTrustScores,
│                     #   RequestQuote, TransitionQuote (role-gated), ListMyQuotes
├── infrastructure/   # Firestore repos, in-memory repos + Hyderabad seed (tests/dev)
├── presentation/     # routes, DTO, validation
├── composition.ts · config.ts · server.ts · index.ts
```

## API (all routes require `Authorization: Bearer <Firebase ID token>`)

| Method & path | Purpose | Authz |
|---------------|---------|-------|
| `POST /api/v1/vendors/search` | ranked hyperlocal search → items with score + breakdown | any |
| `POST /api/v1/vendors/compare` | compare up to 4 | any |
| `GET /api/v1/vendors/:id` | vendor details | any |
| `POST /api/v1/vendors/onboard` | create own listing (starts unverified) | **business** |
| `POST /api/v1/vendors/:id/quote` | request a quotation | any (not own listing) |
| `GET /api/v1/vendors/quotes` | my quotes (requested + received) | parties |
| `POST /api/v1/vendors/quotes/:id/status` | drive the quote state machine | parties (role-gated) |
| `POST /api/v1/vendors/trust/recalculate` | trust recalculation (Cloud Scheduler target) | **admin** |

## Scoring & trust

- **Vendor Intelligence Score** (§9, configurable, sums to 1): budget 0.20 · distance 0.15 ·
  rating 0.15 · trust 0.15 · availability 0.10 · sentiment 0.10 · responseTime 0.05 ·
  cancellation 0.05 · repeatBooking 0.05 — every result carries a per-factor breakdown.
- **HiLo Trust Score** (§18, 0–1): rating, verified bookings, satisfaction, repeats,
  cancellations, complaints, response time, profile completeness, verification level.

## Quote state machine (§12)

`requested → submitted ↔ negotiating → accepted / declined / expired` — only the vendor
submits, only the requester accepts, only the system expires (lazily, after the validity
period — `QUOTE_VALIDITY_DAYS`, default 7).

## Config

`FIREBASE_PROJECT_ID` (required), `QUOTE_VALIDITY_DAYS`, `PORT`, `NODE_ENV`, `LOG_LEVEL`.
Emulator: set `FIRESTORE_EMULATOR_HOST`.

## Tests

`npm test -w @hilo/vendor-service` — scoring/trust/FSM unit tests + supertest route tests
(RBAC onboarding, quote lifecycle incl. lazy expiry via a mutable clock). No Firebase needed.
