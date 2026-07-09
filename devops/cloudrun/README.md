# Cloud Run deployment

Production backend: 4 Cloud Run services in **asia-south1** (next to Firestore), fronted by
**Firebase Hosting rewrites** so app + API share one origin (no CORS):

| Route (https://hilo-23078.web.app) | Cloud Run service |
|------------------------------------|-------------------|
| `/api/v1/auth/**` | auth-service |
| `/api/v1/events/**` | event-service |
| `/api/v1/venues/**` | venue-service |
| `/api/v1/vendors/**` | vendor-service |
| everything else | Flutter web app (SPA fallback) |

Hosting stands in for the production API Gateway/BFF (EOS-000 §14) until a dedicated
gateway lands. Services do their own Firebase ID-token auth; Cloud Run ingress is public
(`--allow-unauthenticated`) by design.

## Deploy a service

```bash
# 1) build the image remotely (no local Docker needed)
gcloud builds submit backend-api \
  --config devops/cloudrun/cloudbuild.yaml \
  --substitutions=_SERVICE=auth-service

# 2) roll it out
gcloud run deploy auth-service \
  --image asia-south1-docker.pkg.dev/hilo-23078/hilo/auth-service:latest \
  --region asia-south1 --allow-unauthenticated \
  --set-env-vars FIREBASE_PROJECT_ID=hilo-23078 --min-instances 0
```

## Deploy the web app + rewrites

```bash
cd flutter-app && flutter build web --dart-define=API_BASE_URL=https://hilo-23078.web.app
cd .. && firebase deploy --only hosting
```

## Notes

- Images live in Artifact Registry repo `hilo` (asia-south1). `backend-api/.gcloudignore`
  keeps source uploads small.
- **Gotcha:** every service package.json must list `firebase-admin` in `dependencies`,
  or tsup bundles it into the ESM output and the container crashes with
  `Dynamic require of "fs" is not supported`.
- Scale-to-zero (`--min-instances 0`): idle cost ≈ 0; first request pays a ~0.5–1s cold start.
- Runtime identity is the default compute service account (Editor) — acceptable for dev;
  switch to least-privilege per-service SAs before real users.
