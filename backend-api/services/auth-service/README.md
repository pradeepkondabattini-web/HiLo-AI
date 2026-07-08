# auth-service

Authentication & Identity service (EOS-002-P3-Part-02). Verifies Firebase ID tokens,
bootstraps the `users/` record on first login, and manages RBAC roles via custom claims.

## Architecture (Clean Architecture — EOS-000 §18)

```
src/
├── domain/           # framework-free: User, Role, ports (UserRepository, TokenVerifier,
│                     #   RoleClaimsManager, Clock)
├── application/      # use cases: BootstrapUser, GetMe, UpdateProfile, AssignRoles
├── infrastructure/   # Firestore repo, Firebase token verifier, role-claims manager,
│                     #   in-memory repo (tests), Admin SDK init
├── presentation/     # routes, DTO, input validation
│                     #   (token-verify middleware + RBAC guard live in @hilo/backend-shared)
├── composition.ts    # composition root (the only place infra is constructed)
├── config.ts         # env config (adds Firebase projectId)
└── server.ts/index.ts
```

Dependencies point inward; the domain has zero framework/SDK dependencies. Use cases
receive ports via constructor injection, so tests run against in-memory fakes with **no
Firebase required**.

## API (all routes require `Authorization: Bearer <Firebase ID token>`)

| Method & path | Purpose | Authz |
|---------------|---------|-------|
| `POST /api/v1/auth/bootstrap` | First-login upsert of `users/`; assigns default role, mirrors claims | any authenticated |
| `GET /api/v1/auth/me` | The caller's own profile | self |
| `PATCH /api/v1/auth/me` | Update own profile (onboarding); cannot change roles | self |
| `POST /api/v1/auth/users/:uid/roles` | Assign roles + propagate claims | **admin** |

Plus shared `GET /health` and `GET /ready`. Responses use the standard error envelope;
roles cannot be self-escalated (RBAC guard + Firestore rules).

## Configuration (environment only — never hardcode; EOS-000 §25, §71)

| Var | Purpose |
|-----|---------|
| `FIREBASE_PROJECT_ID` (or `GCLOUD_PROJECT`) | Firebase/GCP project id — **required** |
| `PORT` | listen port (Cloud Run injects; default 8080) |
| `NODE_ENV`, `LOG_LEVEL` | runtime env / log verbosity |

Against the Emulator Suite, set `FIREBASE_AUTH_EMULATOR_HOST` and `FIRESTORE_EMULATOR_HOST`;
the Admin SDK auto-detects them and needs only the project id (no credentials).

## Tests

`npm test -w @hilo/auth-service` — unit (domain/use cases) + route integration (supertest)
against in-memory fakes. An emulator-backed integration test is added when the Firebase CLI
is available locally.
