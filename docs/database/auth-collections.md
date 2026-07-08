# Auth domain — Firestore collections (Sprint 1B)

Canonical schemas for the Authentication & Identity domain, owned by **auth-service**.
Sources: EOS-002-P3-Part-02, EOS-004-P4, EOS-004-P6; reconciled by
[ADR-008](../adr/ADR-008-multi-role-user-schema.md).

Every document carries the **mandatory metadata envelope** (EOS-000 §35, EOS-004-P4 §3):

| Field | Type | Notes |
|-------|------|-------|
| `id` | string | mirrors the document id |
| `schemaVersion` | int | schema contract version |
| `version` | int | optimistic concurrency; +1 per update |
| `status` | string | `active` \| `suspended` \| `archived` … |
| `deleted` | bool | soft-delete flag (no hard deletes) |
| `createdAt` / `updatedAt` | timestamp | **server-generated** |
| `createdBy` / `updatedBy` | string | actor uid / service id |
| `deletedAt?` / `deletedBy?` | timestamp/string | set on soft delete |

## `users/` — Aggregate root: User (owner: auth-service)

| Field | Type | Req | Notes |
|-------|------|-----|-------|
| `email` | string | ✓ | unique |
| `phone` | string |  | E.164 |
| `displayName` | string | ✓ | |
| `authProvider` | string | ✓ | `google` \| `phone` \| `email` |
| `roles` | string[] | ✓ | non-empty subset of `consumer,guest,business,admin`; default `[consumer]` (ADR-008) |
| `accountStatus` | string | ✓ | `active` \| `suspended` (mirrors `status`) |
| `city` | string |  | |
| `preferredLanguage` | string |  | `en` \| `hi` \| `te` |
| `profilePhoto` | string |  | Cloud Storage URL |
| `emailVerified` | bool | ✓ | verification level 1 |
| `phoneVerified` | bool | ✓ | verification level 2 |
| `lastLoginAt` | timestamp |  | |

- **Ownership/security (EOS-004-P6 §8):** read/write **self only**. `roles` are **not**
  client-writable — set by auth-service via Admin SDK + Firebase custom claims. Clients
  cannot self-escalate (enforced in rules).
- Detailed profile/preferences (favorite event types, budget range, notification prefs)
  live in `profiles/` (EOS-004-P4 §5), owned by the User/Profile domain (Part-03).

## `roles/` — role → permission definitions (owner: auth-service / admin)

| Field | Type | Notes |
|-------|------|-------|
| `key` | string | `consumer` \| `guest` \| `business` \| `admin` |
| `displayName` | string | |
| `permissions` | string[] | e.g. `event.create`, `vendor.manage` (EOS-000 §67) |

- **Security:** client **read-only**; writes are admin/backend-only. Reference/master data.

## `sessions/` — session + device records (owner: auth-service)

| Field | Type | Notes |
|-------|------|-------|
| `userId` | string | owner uid |
| `deviceId` | string | |
| `platform` | string | `android` \| `ios` \| `web` |
| `lastActiveAt` | timestamp | |
| `revoked` | bool | supports "logout from all devices" (Part-02 §10) |

- **Security:** backend-managed. Firebase itself manages auth tokens/refresh; this
  collection tracks device/session state for revocation and admin timeout.

## Indexes

Baseline queries are single-field (by `id`/`userId`) and need no composite index yet.
Composite indexes are added in `firebase/firestore.indexes.json` when list/filter queries
are introduced (e.g. sessions by `userId` + `revoked`).
