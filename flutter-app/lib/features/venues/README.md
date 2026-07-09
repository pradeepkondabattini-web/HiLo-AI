# features/venues/

**Sprint 2 (Flutter slice)** — EOS-002-P3-Part-05 (Venue Discovery). Search with filters →
ranked venue cards (distance, rating, capacity, price, **% match**) → favourite toggle →
venue detail. Reachable from the events dashboard ("Find venues").

## Structure (EOS-003-P2 §6)

```
venues/
├── domain/            # Venue, RankedVenue, VenueSearchRequest/Filters, repository, failure
├── data/              # DTOs, VenuesApiDataSource (Dio → venue-service), repository impl
├── application/       # DI providers, VenueSearchController, favourites + detail providers
└── presentation/
    ├── pages/         # venue_discovery, venue_detail
    └── widgets/       # venue_card
```

## Notes

- Talks to **venue-service** (`/api/v1/venues/*`) via the shared authenticated Dio; the UI
  never calls Google/Firestore directly (EOS-000 §30, §117).
- Ranked results show the venue-service **score** as a "% match"; the per-factor breakdown
  is available on each result for a future "why this venue" view.
- **Interactive map, device geolocation, and live Google Places** are deferred until Google
  Maps Platform billing + key (ADR-010); search defaults to Hyderabad, and the detail page
  shows a map placeholder.
