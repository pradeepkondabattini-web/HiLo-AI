# Vendor domain — Firestore collections (Sprint 3)

Collections for the Vendor Marketplace (EOS-002-P3-Part-06), owned by **vendor-service**.
Consolidation rationale: [ADR-011](../adr/ADR-011-consolidated-vendor-service.md).

## `vendors/` — vendor listings (owner: vendor-service)

| Field | Type | Notes |
|-------|------|-------|
| `ownerUid` | string | business account managing the listing (one per account, id `vnd_{ownerUid}`) |
| `businessName`, `category`, `description`, `contactPerson` | string | category from the curated set |
| `city`, `address` | string | |
| `latitude`, `longitude`, `serviceRadiusKm` | number | hyperlocal matching (§10) |
| `yearsOfExperience`, `teamSize`, `startingPrice` | number? | |
| `rating`, `reviewCount` | number | Google rating read-only (§23) |
| `verificationLevel` | int 0–4 | §6 — granted by backend/admin only, never self-assigned |
| `trustScore` | 0–1? | §18 — recalculated by the trust job |
| `reviewSentiment`, `responseTimeHours`, `cancellationRate`, `repeatBookingRate`, `availabilityScore` | number? | scoring signals (§9) |
| `portfolio` | string[] | media URLs |
| `workingDays` | string[]? | |
| + metadata envelope | | (EOS-000 §35) |

- **Security:** any signed-in user may read (marketplace); writes backend-only.

## `vendor_quotes/` — quotations (owner: vendor-service)

| Field | Type | Notes |
|-------|------|-------|
| `vendorId` | string | |
| `requesterUid` | string | consumer party |
| `vendorOwnerUid` | string | business party (denormalized for authz + rules) |
| `eventId`, `message` | string? | |
| `proposedAmount` | number? | set on submit/negotiate |
| `status` | string | `requested → submitted ↔ negotiating → accepted / declined / expired` (§12) |
| `expiresAt` | timestamp | auto-expiry after validity (default 7 days, configurable §24) |
| + metadata envelope | | |

- **Security:** readable only by the two parties; writes backend-only (the state machine
  lives in vendor-service — role-gated transitions: only the vendor submits, only the
  requester accepts, only the system expires).

## Indexes

`vendors` by `deleted`+`category`; `vendor_quotes` by `requesterUid`+`deleted` and
`vendorOwnerUid`+`deleted` (`firebase/firestore.indexes.json`).

## Deferred collections (later sprints)

`vendor_reviews/`, `vendor_promotions/`, `vendor_availability/`, `vendor_bookings/`,
`vendor_analytics/` — per Part-06 §20 as those features land.
