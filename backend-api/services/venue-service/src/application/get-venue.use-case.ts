import { AppError } from '@hilo/backend-shared';
import type { LocationService } from '../domain/location-service.js';
import type { Venue } from '../domain/venue.js';
import type { VenueRepository } from '../domain/venue-repository.js';

/** Fetch one venue — HiLo catalogue first, then the Location Service (Google). */
export class GetVenueUseCase {
  constructor(
    private readonly venues: VenueRepository,
    private readonly location: LocationService,
  ) {}

  async execute(id: string): Promise<Venue> {
    const local = await this.venues.findById(id);
    if (local) return local;
    const place = await this.location.getPlace(id);
    if (place) return place;
    throw AppError.notFound('Venue not found');
  }
}
