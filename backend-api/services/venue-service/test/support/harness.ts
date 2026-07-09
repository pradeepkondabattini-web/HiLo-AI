import { createLogger, type TokenVerifier, type VerifiedIdentity } from '@hilo/backend-shared';
import { CompareVenuesUseCase } from '../../src/application/compare-venues.use-case.js';
import {
  AddFavouriteUseCase,
  ListFavouritesUseCase,
  RemoveFavouriteUseCase,
} from '../../src/application/favourites.use-cases.js';
import { GetVenueUseCase } from '../../src/application/get-venue.use-case.js';
import { SearchVenuesUseCase } from '../../src/application/search-venues.use-case.js';
import { FakeLocationService } from '../../src/infrastructure/fake-location-service.js';
import { InMemoryFavouriteRepository } from '../../src/infrastructure/in-memory-favourite-repository.js';
import { InMemoryVenueRepository } from '../../src/infrastructure/in-memory-venue-repository.js';
import type { VenueRouteDeps } from '../../src/presentation/venue.routes.js';
import { buildApp } from '../../src/server.js';

/** Verifier that accepts any token as user "u1" (except "bad"). */
export class FakeTokenVerifier implements TokenVerifier {
  constructor(private readonly uid = 'u1') {}
  async verify(token: string): Promise<VerifiedIdentity> {
    if (token === 'bad') {
      const { AppError } = await import('@hilo/backend-shared');
      throw AppError.unauthorized('Invalid token');
    }
    return { uid: this.uid, emailVerified: true };
  }
}

export function buildTestApp() {
  const venues = new InMemoryVenueRepository();
  const favourites = new InMemoryFavouriteRepository();
  const location = new FakeLocationService();
  const clock = { now: () => new Date('2026-07-08T00:00:00.000Z') };
  const getVenue = new GetVenueUseCase(venues, location);

  const deps: VenueRouteDeps = {
    verifier: new FakeTokenVerifier(),
    searchVenues: new SearchVenuesUseCase(venues, location),
    getVenue,
    compareVenues: new CompareVenuesUseCase(getVenue),
    addFavourite: new AddFavouriteUseCase(favourites, clock),
    listFavourites: new ListFavouritesUseCase(favourites),
    removeFavourite: new RemoveFavouriteUseCase(favourites),
  };

  const logger = createLogger({
    serviceName: 'venue-service',
    environment: 'test',
    level: 'error',
    sink: () => {},
  });

  return { app: buildApp(logger, deps), venues, favourites };
}

/** Hyderabad city centre — reference point for search tests. */
export const HYDERABAD = { latitude: 17.385, longitude: 78.4867 };
