# dev-gateway

**Local development only.** A tiny, zero-dependency API gateway + backend orchestrator so
the Flutter app can reach every microservice through **one origin** (`http://localhost:8000`).

It stands in for the production **API Gateway / BFF** (EOS-000 §14) — it has no auth, rate
limiting, or TLS and must never be used in production. The real gateway is a separate,
governed Cloud Run component.

## One command (recommended)

```bash
# 1) start the emulators first (repo root):
firebase emulators:start
# 2) then, in another terminal (repo root):
node devops/dev-gateway/dev-backend.mjs
```

Starts, all pointed at the Firebase Emulator Suite:

| Process | Port | Notes |
|---------|------|-------|
| dev gateway | `8000` | app's `API_BASE_URL` |
| auth-service | `8081` | `/api/v1/auth/*` |
| event-service | `8082` | `/api/v1/events/*` |
| venue-service | `8083` | `/api/v1/venues/*` |
| vendor-service | `8084` | `/api/v1/vendors/*` |
| _(Firestore emulator)_ | `8080` | started separately |
| _(Auth emulator)_ | `9099` | started separately |

Ctrl-C stops everything (if any child exits, all are torn down).

## Gateway only

```bash
node devops/dev-gateway/gateway.mjs
```

Routes by path prefix and adds permissive CORS (echoes `Origin`, allows `Authorization`).
Env: `GATEWAY_PORT` (8000), `AUTH_TARGET` (`http://localhost:8081`), `EVENTS_TARGET`
(`http://localhost:8082`). `GET /health` returns the gateway's own status.

## Then run the app

```bash
cd flutter-app
flutter run -d chrome \
  --dart-define=USE_FIREBASE_EMULATOR=true \
  --dart-define=API_BASE_URL=http://localhost:8000
```
