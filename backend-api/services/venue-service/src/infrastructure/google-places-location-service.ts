import type { LocationService, NearbyQuery } from '../domain/location-service.js';
import type { Venue } from '../domain/venue.js';

/**
 * Real Google Places adapter (EOS-002-P3-Part-05 §5, §22) — PLACEHOLDER.
 *
 * Implementing this requires Google Maps Platform **billing (Blaze) + an API key** and the
 * Places/Nearby-Search/Place-Details/Geocoding APIs (see the venue-service README / ADR).
 * Until then the composition root uses {@link FakeLocationService}. The port keeps business
 * code independent of Google (EOS-000 §117).
 */
export class GooglePlacesLocationService implements LocationService {
  constructor(private readonly apiKey: string) {}

  private notImplemented(): never {
    throw new Error(
      'GooglePlacesLocationService is not implemented yet — requires Google Maps Platform ' +
        'billing and an API key. Configure GOOGLE_MAPS_API_KEY and implement per the ADR.',
    );
  }

  async searchNearby(_query: NearbyQuery): Promise<Venue[]> {
    return this.notImplemented();
  }

  async getPlace(_placeId: string): Promise<Venue | null> {
    return this.notImplemented();
  }
}
