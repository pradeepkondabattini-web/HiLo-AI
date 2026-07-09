import type { Venue } from '../domain/venue.js';
import type { VenueRepository } from '../domain/venue-repository.js';
import { HILO_SEED_VENUES } from './hyderabad-seed.js';

/** In-memory HiLo catalogue for tests and local dev (seeded with Hyderabad venues). */
export class InMemoryVenueRepository implements VenueRepository {
  constructor(private readonly seed: Venue[] = HILO_SEED_VENUES) {}

  async findById(id: string): Promise<Venue | null> {
    return this.seed.find((v) => v.id === id) ?? null;
  }

  async listCatalogue(params: { city?: string; limit?: number } = {}): Promise<Venue[]> {
    let result = this.seed;
    if (params.city) result = result.filter((v) => v.city === params.city);
    return params.limit ? result.slice(0, params.limit) : [...result];
  }
}
