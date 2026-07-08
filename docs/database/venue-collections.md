# Venue domain — Firestore collections (Sprint 2)

Collections for Venue Discovery (EOS-002-P3-Part-05), owned by **venue-service**. Sources:
EOS-004-P4 §7, Part-05 §20; ranking/adapter reconciled by
[ADR-010](../adr/ADR-010-venue-ranking-and-location-adapter.md).

## `venues/` — HiLo venue catalogue (owner: venue-service)

| Field | Type | Notes |
|-------|------|-------|
| `id` | string | document id |
| `source` | string | `hilo` \| `google` |
| `googlePlaceId` | string? | when sourced from Google |
| `name`, `address`, `city`, `category` | string | |
| `latitude`, `longitude` | double | |
| `capacity` | int | ≥ 1 |
| `rating` | double | 0–5, Google (read-only) |
| `priceLevel` | int? | 1–4 (Google) |
| `pricePerPlate` | number? | INR (HiLo) |
| `amenities`, `photos` | string[] | |
| `verified` | bool | |
| `trustScore`, `reviewSentiment` | double? | 0–1, HiLo-internal |
| + metadata envelope | | (EOS-000 §35) for HiLo-managed rows |

- **Security:** any signed-in user may **read** (public discovery); writes are
  backend/admin only. Google ratings are never client-writable.

## `venue_favourites/` — saved venues (owner: venue-service)

| Field | Type | Notes |
|-------|------|-------|
| `userId` | string | owner |
| `venueId` | string | |
| `eventId` | string? | optional link to an event workspace |
| `note` | string? | |
| + metadata envelope | | id = `fav_{userId}_{venueId}` (one per user+venue) |

- **Security:** read own only; writes via venue-service (Admin SDK). Soft-delete on remove.

## `venue_shortlists/` · `venue_votes/` — event-workspace collaboration (§16–17)

Backend-managed; a user may read records they created. Full membership-scoped rules land
with the shortlist/vote feature (they need a per-event membership lookup).

## Indexes

`venue_favourites` by `userId` + `deleted`; `venues` by `deleted` + `city`
(`firebase/firestore.indexes.json`).

## Not yet in Firestore

The live Google Places results are fetched through the Location Service adapter, not
persisted; the real adapter is wired when Google Maps Platform billing + key are available
(ADR-010).
