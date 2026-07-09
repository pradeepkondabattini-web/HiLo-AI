import type { Venue } from './venue.js';

/**
 * Repository for HiLo's own venue catalogue (Firestore `venues/`). Distinct from the
 * {@link LocationService} (Google Places). Geospatial narrowing is applied in the
 * application layer for now; a geohash query is added when the catalogue grows.
 */
export interface VenueRepository {
  findById(id: string): Promise<Venue | null>;
  /** HiLo catalogue venues (optionally scoped by city) for merge + ranking. */
  listCatalogue(params?: { city?: string; limit?: number }): Promise<Venue[]>;
}
