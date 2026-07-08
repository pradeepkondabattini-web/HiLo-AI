# ADR-010: Venue ranking weights + Location Service adapter (Google Maps deferred)

- **Status:** Accepted
- **Date:** 2026-07-08
- **Deciders:** Pradeep, AI Engineering
- **Related:** EOS-002-P3-Part-05 §5, §14, §22; EOS-000 §117; ADR-005

## Context

Venue Discovery (Sprint 2) ranks venues and sources them from Google Maps Platform plus
HiLo's own catalogue. Two forces:

1. Google Maps Platform requires **billing (Blaze) + an API key**; the project is currently
   on the Spark plan, so the live Places/Maps APIs cannot be called yet.
2. EOS-000 §117 mandates that business code **never depends on the Google Maps SDK
   directly** — it must go through a Location Service abstraction.

## Decision

- **Location Service adapter.** `venue-service` depends on a `LocationService` **port**
  (`searchNearby` / `getPlace`). Two implementations: a seeded **`FakeLocationService`**
  (used now — local dev, tests, Spark) and **`GooglePlacesLocationService`** (a stub until
  Maps billing + key are available). The composition root selects Google only when
  `GOOGLE_MAPS_API_KEY` is set; otherwise the fake. This keeps ranking, filtering, and the
  API fully functional and testable today, and swaps in Google with **zero changes to
  business code** later.
- **Configurable ranking weights.** The recommendation score is a weighted blend
  (EOS-002-P3-Part-05 §14): budget 0.25, capacity 0.20, distance 0.15, rating 0.15,
  trustScore 0.10, sentiment 0.05, amenities 0.05, preferences 0.05 (sum = 1). Weights are
  injected (`RankingWeights`) so they can become master data / experiment config without
  code changes. Every result carries a per-factor **breakdown** for explainability (§13).

## Consequences

- Sprint 2 ships a working, tested venue-service now, independent of billing.
- Deferred work (tracked): implement `GooglePlacesLocationService` (Nearby/Text Search,
  Place Details, Geocoding) and the Flutter map rendering — both need Blaze + a Maps key.
- The `preferences` factor is a neutral placeholder until user-preference signals land with
  the AI platform (Sprint 4).
- AI-generated ranking explanations (§13, §22) route through the AI Gateway per ADR-005 when
  the AI platform exists; the deterministic breakdown is the interim.

## Alternatives considered

- **Call Google Places directly from business code** — rejected; violates EOS-000 §117 and
  couples ranking to a provider.
- **Block Sprint 2 until Blaze is enabled** — rejected; the adapter lets us build and verify
  the whole domain now.

## References

- EOS-002-P3-Part-05 §5 (Google APIs), §14 (ranking), §22 (MCP); EOS-000 §117; ADR-005.
