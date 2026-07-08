# Event domain — Firestore collections (Sprint 1C)

Canonical schemas for the Event Management domain, owned by **event-service**.
Sources: EOS-002-P3-Part-04, EOS-004-P4 §6, EOS-004-P6; access model per
[ADR-009](../adr/ADR-009-event-writes-api-mediated.md).

Every document carries the mandatory metadata envelope (EOS-000 §35): `id, schemaVersion,
version, status, deleted, createdAt, updatedAt, createdBy, updatedBy` (+ `deletedAt/
deletedBy` on soft delete).

## `events/` — Aggregate root: Event (owner: event-service)

| Field | Type | Req | Notes |
|-------|------|-----|-------|
| `status` | string | ✓ | **lifecycle state** (see below); stored in the metadata `status` field |
| `title` | string | ✓ | editable until completion (§24) |
| `category` | string | ✓ | event type (birthday, wedding, corporate, …) |
| `eventDate` | string (ISO) | ✓ | |
| `startTime` / `endTime` | string (ISO) |  | |
| `city` | string | ✓ | |
| `guestCount` | int | ✓ | must be > 0 |
| `ownerId` | string | ✓ | exactly one owner (§24) |
| `coHostIds` | string[] | ✓ | denormalized co-hosts |
| `memberIds` | string[] | ✓ | owner + co-hosts + guests; powers reads/ABAC (EOS-000 §41) |
| `budgetId` | string |  | → `event_budgets/` |
| `venueId` | string |  | set in later sprints (venue discovery) |
| `description`, `dressCode`, `themeId`, `coverImage`, `tags`, `notes` | | | optional |

### Lifecycle (EOS-002-P3-Part-04 §7)

```
draft → planning → venue_reserved → vendor_confirmed → invitations_sent
      → rsvp_collection → payments → ready → live_event → completed → archived
```

`cancelled` is reachable from any active state; `archived` (from `completed` or
`cancelled`) is terminal and **read-only**. Transitions are validated by the state machine
in event-service; illegal jumps are rejected.

## `event_members/` — membership (owner: event-service)

Doc id = `${eventId}_${userId}`.

| Field | Type | Notes |
|-------|------|-------|
| `eventId` | string | |
| `userId` | string | |
| `role` | string | `owner` \| `cohost` \| `guest` |

## `event_budgets/` — budget (owner: event-service)

| Field | Type | Notes |
|-------|------|-------|
| `eventId` | string | |
| `currency` | string | default `INR` (launch market) |
| `totalAmount` | number | |
| `contingencyAmount` | number | optional |
| `allocations` | array | `{ category, percentage, amount }` |

**Default allocations (§10, configurable):** Venue 40 · Food 30 · Decoration 10 ·
Photography 8 · Entertainment 5 · Invitations 2 · Miscellaneous 5 (= 100%). Amounts are
recomputed from `totalAmount` × percentage on every budget change.

## Access model (ADR-009)

- **Writes:** all three collections are written **only by event-service** (Admin SDK);
  client Firestore writes are **denied**. The service enforces the lifecycle, ownership,
  and validation.
- **Reads:** members may read `events/` directly; users may read their own
  `event_members/`; `event_budgets/` is served via the API.

## Indexes (`firebase/firestore.indexes.json`)

- `events`: `deleted` (==) + `memberIds` (array-contains) + `createdAt` (desc) — list a
  user's events.
- `event_members`: `eventId` (==) + `deleted` (==).
- `event_budgets`: `eventId` (==) + `deleted` (==).
