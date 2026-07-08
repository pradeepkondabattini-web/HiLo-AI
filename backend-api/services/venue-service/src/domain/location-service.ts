import type { Venue } from './venue.js';

/** A nearby-venue query for the {@link LocationService}. */
export interface NearbyQuery {
  latitude: number;
  longitude: number;
  radiusKm: number;
  keyword?: string;
  categories?: string[];
}

/**
 * Provider-abstracted venue discovery (EOS-000 §117, EOS-002-P3-Part-05 §22).
 *
 * Business code depends on this port, never on the Google Maps SDK. Implementations:
 * a Firebase-emulator-friendly fake (seeded), and the real Google Places adapter (added
 * when Google Maps Platform billing + an API key are available).
 */
export interface LocationService {
  searchNearby(query: NearbyQuery): Promise<Venue[]>;
  getPlace(placeId: string): Promise<Venue | null>;
}
