# venue-service

Venue Discovery (EOS-002-P3-Part-05). Ranked venue search that merges the HiLo catalogue
with the Location Service (Google Places, adapter-abstracted), plus compare-4 and favourites.

## Architecture (Clean Architecture — EOS-000 §18)

```
src/
├── domain/           # framework-free: Venue, ranking (configurable, explainable),
│                     #   geo (haversine), LocationService port, repo ports, favourite
├── application/      # SearchVenues, GetVenue, CompareVenues, Add/List/Remove favourite
├── infrastructure/   # Firestore repos, FakeLocationService (seeded), GooglePlaces stub,
│                     #   in-memory repos (tests), Admin SDK init
├── presentation/     # routes, DTO, validation
├── composition.ts · config.ts · server.ts · index.ts
```

Business code depends on the `LocationService` **port**, never the Google SDK (EOS-000 §117).

## API (all routes require `Authorization: Bearer <Firebase ID token>`)

| Method & path | Purpose |
|---------------|---------|
| `POST /api/v1/venues/search` | ranked search (filters, radius, budget) → items with score + breakdown |
| `POST /api/v1/venues/compare` | compare up to 4 (`venueIds`) |
| `POST /api/v1/venues/favourites` | save a favourite |
| `GET /api/v1/venues/favourites` | list the caller's favourites |
| `DELETE /api/v1/venues/favourites/:venueId` | remove a favourite |
| `GET /api/v1/venues/:id` | venue details |

## Ranking (EOS-002-P3-Part-05 §14, ADR-010)

Configurable weighted blend — budget 0.25 · capacity 0.20 · distance 0.15 · rating 0.15 ·
trustScore 0.10 · sentiment 0.05 · amenities 0.05 · preferences 0.05. Each result includes a
per-factor **breakdown** for explainability.

## Google Maps (deferred)

The real Places adapter needs **Maps Platform billing (Blaze) + an API key**. Until then the
seeded `FakeLocationService` is used. Set `GOOGLE_MAPS_API_KEY` to switch to
`GooglePlacesLocationService` (currently a stub — see ADR-010).

## Config

`FIREBASE_PROJECT_ID` (required), `GOOGLE_MAPS_API_KEY` (optional), `PORT`, `NODE_ENV`,
`LOG_LEVEL`. Emulator: set `FIRESTORE_EMULATOR_HOST`.

## Tests

`npm test -w @hilo/venue-service` — pure ranking unit tests, search use-case tests, and
supertest route tests (in-memory repos + fake location + fake verifier; no Firebase/Google).
