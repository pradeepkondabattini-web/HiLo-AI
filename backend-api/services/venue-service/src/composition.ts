import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { FirebaseTokenVerifier } from '@hilo/backend-shared';
import { CompareVenuesUseCase } from './application/compare-venues.use-case.js';
import {
  AddFavouriteUseCase,
  ListFavouritesUseCase,
  RemoveFavouriteUseCase,
} from './application/favourites.use-cases.js';
import { GetVenueUseCase } from './application/get-venue.use-case.js';
import { SearchVenuesUseCase } from './application/search-venues.use-case.js';
import type { LocationService } from './domain/location-service.js';
import { systemClock } from './domain/ports.js';
import { FakeLocationService } from './infrastructure/fake-location-service.js';
import { getFirebaseApp } from './infrastructure/firebase.js';
import { FirestoreFavouriteRepository } from './infrastructure/firestore-favourite-repository.js';
import { FirestoreVenueRepository } from './infrastructure/firestore-venue-repository.js';
import { GooglePlacesLocationService } from './infrastructure/google-places-location-service.js';
import type { VenueRouteDeps } from './presentation/venue.routes.js';

/**
 * Composition root (EOS-000 §24). Uses the real Google Places adapter only when a Maps
 * key is configured; otherwise the seeded fake (local dev / Spark plan).
 */
export function buildVenueDeps(config: {
  projectId: string;
  googleMapsApiKey?: string;
}): VenueRouteDeps {
  const app = getFirebaseApp(config.projectId);
  const auth = getAuth(app);
  const db = getFirestore(app);
  // Optional domain fields may be undefined — never persist them as Firestore errors
  // (rejects undefined values by default).
  db.settings({ ignoreUndefinedProperties: true });

  const venues = new FirestoreVenueRepository(db);
  const favourites = new FirestoreFavouriteRepository(db);
  const location: LocationService = config.googleMapsApiKey
    ? new GooglePlacesLocationService(config.googleMapsApiKey)
    : new FakeLocationService();
  const getVenue = new GetVenueUseCase(venues, location);

  return {
    verifier: new FirebaseTokenVerifier(auth),
    searchVenues: new SearchVenuesUseCase(venues, location),
    getVenue,
    compareVenues: new CompareVenuesUseCase(getVenue),
    addFavourite: new AddFavouriteUseCase(favourites, systemClock),
    listFavourites: new ListFavouritesUseCase(favourites),
    removeFavourite: new RemoveFavouriteUseCase(favourites),
  };
}
