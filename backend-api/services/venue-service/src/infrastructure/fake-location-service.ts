import type { LocationService, NearbyQuery } from '../domain/location-service.js';
import type { Venue } from '../domain/venue.js';
import { GOOGLE_SEED_VENUES } from './hyderabad-seed.js';

/**
 * Fake {@link LocationService} standing in for Google Places during local dev/tests (no
 * Maps Platform billing/key). Returns seeded "Google" venues; distance/radius filtering is
 * applied by the search use case.
 */
export class FakeLocationService implements LocationService {
  constructor(private readonly seed: Venue[] = GOOGLE_SEED_VENUES) {}

  async searchNearby(query: NearbyQuery): Promise<Venue[]> {
    if (query.categories && query.categories.length > 0) {
      return this.seed.filter(
        (v) => v.category !== undefined && query.categories!.includes(v.category),
      );
    }
    return [...this.seed];
  }

  async getPlace(placeId: string): Promise<Venue | null> {
    return this.seed.find((v) => v.googlePlaceId === placeId || v.id === placeId) ?? null;
  }
}
