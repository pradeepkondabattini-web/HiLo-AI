import { Router } from 'express';
import {
  AppError,
  asyncHandler,
  createAuthMiddleware,
  type TokenVerifier,
} from '@hilo/backend-shared';
import type { SearchVenuesUseCase } from '../application/search-venues.use-case.js';
import type { GetVenueUseCase } from '../application/get-venue.use-case.js';
import type { CompareVenuesUseCase } from '../application/compare-venues.use-case.js';
import type {
  AddFavouriteUseCase,
  ListFavouritesUseCase,
  RemoveFavouriteUseCase,
} from '../application/favourites.use-cases.js';
import { toFavouriteDto, toRankedVenueDto, toVenueDto } from './dto.js';
import { parseAddFavourite, parseCompare, parseSearch } from './validation.js';

export interface VenueRouteDeps {
  verifier: TokenVerifier;
  searchVenues: SearchVenuesUseCase;
  getVenue: GetVenueUseCase;
  compareVenues: CompareVenuesUseCase;
  addFavourite: AddFavouriteUseCase;
  listFavourites: ListFavouritesUseCase;
  removeFavourite: RemoveFavouriteUseCase;
}

/**
 * Venue Discovery API (EOS-002-P3-Part-05 §21). All routes require a verified Firebase ID
 * token. Search combines the HiLo catalogue + Location Service and returns ranked results
 * with an explainable score breakdown.
 *
 *   POST   /api/v1/venues/search             ranked search
 *   POST   /api/v1/venues/compare            compare up to 4 (by venueIds)
 *   POST   /api/v1/venues/favourites         save a favourite
 *   GET    /api/v1/venues/favourites         list the caller's favourites
 *   DELETE /api/v1/venues/favourites/:venueId  remove a favourite
 *   GET    /api/v1/venues/:id                venue details
 */
export function createVenueRouter(deps: VenueRouteDeps): Router {
  const router = Router();
  const authenticate = createAuthMiddleware(deps.verifier);

  router.post(
    '/search',
    authenticate,
    asyncHandler(async (req, res) => {
      const results = await deps.searchVenues.execute(parseSearch(req.body));
      res.status(200).json({ items: results.map(toRankedVenueDto) });
    }),
  );

  router.post(
    '/compare',
    authenticate,
    asyncHandler(async (req, res) => {
      const venues = await deps.compareVenues.execute(parseCompare(req.body));
      res.status(200).json({ items: venues.map(toVenueDto) });
    }),
  );

  // Favourites — declared before '/:id' so "favourites" isn't captured as an id.
  router.post(
    '/favourites',
    authenticate,
    asyncHandler(async (req, res) => {
      const { venueId, eventId, note } = parseAddFavourite(req.body);
      const favourite = await deps.addFavourite.execute({
        userId: res.locals.auth!.identity.uid,
        venueId,
        eventId,
        note,
      });
      res.status(201).json(toFavouriteDto(favourite));
    }),
  );

  router.get(
    '/favourites',
    authenticate,
    asyncHandler(async (_req, res) => {
      const favourites = await deps.listFavourites.execute(res.locals.auth!.identity.uid);
      res.status(200).json({ items: favourites.map(toFavouriteDto) });
    }),
  );

  router.delete(
    '/favourites/:venueId',
    authenticate,
    asyncHandler(async (req, res) => {
      const venueId = req.params.venueId;
      if (!venueId) throw AppError.badRequest('Missing venue id');
      await deps.removeFavourite.execute(res.locals.auth!.identity.uid, venueId);
      res.status(204).send();
    }),
  );

  router.get(
    '/:id',
    authenticate,
    asyncHandler(async (req, res) => {
      const id = req.params.id;
      if (!id) throw AppError.badRequest('Missing venue id');
      const venue = await deps.getVenue.execute(id);
      res.status(200).json(toVenueDto(venue));
    }),
  );

  return router;
}
