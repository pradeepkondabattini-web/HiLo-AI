# event-service

Event Management core (EOS-002-P3-Part-04): event CRUD, the lifecycle state machine,
membership (owner/co-host/guest), and budgets. Firestore writes are API-mediated
([ADR-009](../../../docs/adr/ADR-009-event-writes-api-mediated.md)).

## Architecture (Clean Architecture — EOS-000 §18)

```
src/
├── domain/           # framework-free: Event, EventStatus state machine, EventMember,
│                     #   EventBudget + allocation defaults, ABAC helpers, ports
├── application/      # use cases: Create/Get/List/Update/TransitionStatus/AddMember/
│                     #   UpdateBudget/DeleteEvent
├── infrastructure/   # Firestore repos + in-memory repos (tests) + id generator
├── presentation/     # routes, DTOs, input validation
│                     #   (token-verify middleware + RBAC guard from @hilo/backend-shared)
├── composition.ts    # composition root (only place infra is constructed)
├── config.ts         # env config (adds Firebase projectId)
└── server.ts/index.ts
```

Authorization is **ABAC** (EOS-000 §68): a caller's role within a specific event
(owner / co-host / guest) is resolved from the denormalized `ownerId`/`coHostIds`/
`memberIds` fields. Owner/co-host may manage; only the owner may add co-hosts or delete.

## API (all routes require `Authorization: Bearer <Firebase ID token>`)

| Method & path | Purpose | Authz |
|---------------|---------|-------|
| `POST /api/v1/events` | Create event (+ default budget); caller becomes owner | authenticated |
| `GET /api/v1/events` | List events the caller belongs to (`?limit=&cursor=`) | member |
| `GET /api/v1/events/:id` | Read one event | member |
| `PATCH /api/v1/events/:id` | Update fields (title locked after completion) | owner/co-host |
| `POST /api/v1/events/:id/status` | Lifecycle transition `{ status }` | owner/co-host |
| `POST /api/v1/events/:id/members` | Add participant `{ userId, role }` | owner/co-host* |
| `PUT /api/v1/events/:id/budget` | Update budget total/allocations | owner/co-host |
| `DELETE /api/v1/events/:id` | Soft delete | owner |

\* Only the owner may add co-hosts. Archived events are read-only. Plus shared
`GET /health` and `GET /ready`.

## Configuration (environment only — EOS-000 §25, §71)

| Var | Purpose |
|-----|---------|
| `FIREBASE_PROJECT_ID` (or `GCLOUD_PROJECT`) | Firebase/GCP project id — **required** |
| `PORT`, `NODE_ENV`, `LOG_LEVEL` | runtime |

Against the emulator, set `FIRESTORE_EMULATOR_HOST` / `FIREBASE_AUTH_EMULATOR_HOST`.

## Tests

`npm test -w @hilo/event-service` — domain (state machine, budget math), use cases, and
route integration (supertest) against in-memory fakes; **no Firebase required**. An
emulator-backed integration test is added when the Firebase CLI is available locally.
