import { Router } from 'express';
import {
  AppError,
  asyncHandler,
  createAuthMiddleware,
  requireRoles,
  type TokenVerifier,
} from '@hilo/backend-shared';
import type { SearchVendorsUseCase } from '../application/search-vendors.use-case.js';
import type {
  CompareVendorsUseCase,
  GetVendorUseCase,
  OnboardVendorUseCase,
  RecalculateTrustScoresUseCase,
} from '../application/vendor.use-cases.js';
import type {
  ListMyQuotesUseCase,
  RequestQuoteUseCase,
  TransitionQuoteUseCase,
} from '../application/quote.use-cases.js';
import { toQuoteDto, toRankedVendorDto, toVendorDto } from './dto.js';
import {
  parseCompare,
  parseOnboarding,
  parseQuoteRequest,
  parseQuoteTransition,
  parseSearch,
} from './validation.js';

export interface VendorRouteDeps {
  verifier: TokenVerifier;
  searchVendors: SearchVendorsUseCase;
  getVendor: GetVendorUseCase;
  compareVendors: CompareVendorsUseCase;
  onboardVendor: OnboardVendorUseCase;
  recalculateTrustScores: RecalculateTrustScoresUseCase;
  requestQuote: RequestQuoteUseCase;
  transitionQuote: TransitionQuoteUseCase;
  listMyQuotes: ListMyQuotesUseCase;
}

/**
 * Vendor Marketplace API (EOS-002-P3-Part-06 §22). All routes require a verified Firebase
 * ID token; role-gated routes use RBAC (business/admin).
 *
 *   POST   /api/v1/vendors/search               ranked search
 *   POST   /api/v1/vendors/compare              compare up to 4
 *   POST   /api/v1/vendors/onboard              create own listing (business role)
 *   POST   /api/v1/vendors/trust/recalculate    scheduled trust recalculation (admin)
 *   GET    /api/v1/vendors/quotes               my quotes (requested + received)
 *   POST   /api/v1/vendors/quotes/:id/status    drive the quote state machine
 *   POST   /api/v1/vendors/:id/quote            request a quotation
 *   GET    /api/v1/vendors/:id                  vendor details
 */
export function createVendorRouter(deps: VendorRouteDeps): Router {
  const router = Router();
  const authenticate = createAuthMiddleware(deps.verifier);

  router.post(
    '/search',
    authenticate,
    asyncHandler(async (req, res) => {
      const results = await deps.searchVendors.execute(parseSearch(req.body));
      res.status(200).json({ items: results.map(toRankedVendorDto) });
    }),
  );

  router.post(
    '/compare',
    authenticate,
    asyncHandler(async (req, res) => {
      const vendors = await deps.compareVendors.execute(parseCompare(req.body));
      res.status(200).json({ items: vendors.map(toVendorDto) });
    }),
  );

  router.post(
    '/onboard',
    authenticate,
    requireRoles('business', 'admin'),
    asyncHandler(async (req, res) => {
      const vendor = await deps.onboardVendor.execute(
        res.locals.auth!.identity.uid,
        parseOnboarding(req.body),
      );
      res.status(201).json(toVendorDto(vendor));
    }),
  );

  router.post(
    '/trust/recalculate',
    authenticate,
    requireRoles('admin'),
    asyncHandler(async (_req, res) => {
      const result = await deps.recalculateTrustScores.execute(res.locals.auth!.identity.uid);
      res.status(200).json(result);
    }),
  );

  // Quotes — static segments declared before '/:id'.
  router.get(
    '/quotes',
    authenticate,
    asyncHandler(async (_req, res) => {
      const { requested, received } = await deps.listMyQuotes.execute(
        res.locals.auth!.identity.uid,
      );
      res.status(200).json({
        requested: requested.map(toQuoteDto),
        received: received.map(toQuoteDto),
      });
    }),
  );

  router.post(
    '/quotes/:id/status',
    authenticate,
    asyncHandler(async (req, res) => {
      const quoteId = req.params.id;
      if (!quoteId) throw AppError.badRequest('Missing quote id');
      const { target, proposedAmount } = parseQuoteTransition(req.body);
      const quote = await deps.transitionQuote.execute({
        actorUid: res.locals.auth!.identity.uid,
        quoteId,
        target,
        proposedAmount,
      });
      res.status(200).json(toQuoteDto(quote));
    }),
  );

  router.post(
    '/:id/quote',
    authenticate,
    asyncHandler(async (req, res) => {
      const vendorId = req.params.id;
      if (!vendorId) throw AppError.badRequest('Missing vendor id');
      const { eventId, message } = parseQuoteRequest(req.body);
      const quote = await deps.requestQuote.execute({
        requesterUid: res.locals.auth!.identity.uid,
        vendorId,
        eventId,
        message,
      });
      res.status(201).json(toQuoteDto(quote));
    }),
  );

  router.get(
    '/:id',
    authenticate,
    asyncHandler(async (req, res) => {
      const id = req.params.id;
      if (!id) throw AppError.badRequest('Missing vendor id');
      const vendor = await deps.getVendor.execute(id);
      res.status(200).json(toVendorDto(vendor));
    }),
  );

  return router;
}
