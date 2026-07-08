# backend-api/

Cloud Run microservices — Node.js · TypeScript. One service per business capability;
each owns its own API surface and never touches another service's private data (EOS-000 §20).

```
backend-api/
├── shared/                  # shared middleware, logging, errors, config, DI
└── services/
    ├── auth-service/        # Sprint 1B — identity, token verification, RBAC
    └── event-service/       # Sprint 1C — event CRUD + lifecycle
```

Every service is stateless, exposes `/health` + `/ready`, emits structured logs with
correlation IDs, validates inputs, uses Dependency Injection, and returns the standard
error envelope (EOS-000 §23, §26; EOS-001-P6 §22).

## Workspace

npm workspaces: `shared` (`@hilo/backend-shared`) provides the app factory, structured
logger, error envelope, DI container, and HTTP middleware; each service under
`services/*` builds on it. Services are bundled with **tsup** (shared inlined; express
external) and tested with **vitest + supertest**.

```
shared/src/
├── app/          # createApp factory + startServer (graceful shutdown)
├── config/       # env loader (fail-fast, no hardcoded secrets)
├── container/    # minimal typed DI container
├── errors/       # AppError + standard client error envelope
├── http/         # correlation-id, request-logger, error-handler, health router
└── logging/      # structured JSON logger with redaction
```

## Commands (run from `backend-api/`)

```bash
npm install                      # install all workspaces
npm test                         # vitest — all workspaces
npm run typecheck                # tsc --build (project references)
npm run lint                     # eslint (flat config)
npm run format:check             # prettier --check
npm run build                    # tsup bundle every service to dist/

# a single service
npm run dev   -w @hilo/auth-service    # tsx watch (hot reload)
npm run build -w @hilo/event-service   # bundle one service
```

Container images (built from `backend-api/` as context):

```bash
docker build -f services/auth-service/Dockerfile  -t hilo/auth-service  .
docker build -f services/event-service/Dockerfile -t hilo/event-service .
```

## Security note — dependency audit

Known, tracked advisories (none directly fixable without a breaking upgrade):

- **Dev toolchain** (esbuild → vite → vitest): moderate, and the esbuild advisory affects
  the local dev server only. Fix requires a breaking `vitest` major bump — deferred.
- **Production** (`firebase-admin` → gaxios/google-gax → `uuid <11.1.1`): 8 **moderate**
  transitive advisories in the official Firebase Admin SDK tree. No safe direct fix
  (`audit fix --force` would change the `firebase-admin` major; a forced `uuid` override
  across google-gax is unverified). Tracked upstream.

**CI gate:** `npm audit --omit=dev --audit-level=high` — the pipeline blocks on
**high/critical** production advisories while the moderate transitive ones above are
tracked. Re-check when bumping `firebase-admin` / `vitest`. Do **not** `npm audit fix
--force` casually — it changes major versions.

## What's here vs. coming next

This is the **service template** (health, observability, error handling, graceful
shutdown) with a versioned API stub per service. Business logic lands with its domain
spec: identity/RBAC in **Sprint 1B** (EOS-002-P3-Part-02), event CRUD + lifecycle in
**Sprint 1C** (EOS-002-P3-Part-04).
