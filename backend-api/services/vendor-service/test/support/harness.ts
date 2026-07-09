import { createLogger, type TokenVerifier, type VerifiedIdentity } from '@hilo/backend-shared';
import {
  ListMyQuotesUseCase,
  RequestQuoteUseCase,
  TransitionQuoteUseCase,
} from '../../src/application/quote.use-cases.js';
import { SearchVendorsUseCase } from '../../src/application/search-vendors.use-case.js';
import {
  CompareVendorsUseCase,
  GetVendorUseCase,
  OnboardVendorUseCase,
  RecalculateTrustScoresUseCase,
} from '../../src/application/vendor.use-cases.js';
import type { Clock } from '../../src/domain/repositories.js';
import {
  InMemoryQuoteRepository,
  InMemoryVendorRepository,
} from '../../src/infrastructure/in-memory-repositories.js';
import type { VendorRouteDeps } from '../../src/presentation/vendor.routes.js';
import { buildApp } from '../../src/server.js';

/** Verifier keyed by token: "consumer" → u1, "business" → biz1 (business role), "admin" → adm1. */
export class FakeTokenVerifier implements TokenVerifier {
  async verify(token: string): Promise<VerifiedIdentity> {
    const identities: Record<string, VerifiedIdentity> = {
      consumer: { uid: 'u1', emailVerified: true, roles: ['consumer'] },
      consumer2: { uid: 'u2', emailVerified: true, roles: ['consumer'] },
      business: { uid: 'biz1', emailVerified: true, roles: ['business'] },
      // The seeded caterer's owner account, for vendor-side quote actions.
      caterer: { uid: 'seed_owner_caterer', emailVerified: true, roles: ['business'] },
      admin: { uid: 'adm1', emailVerified: true, roles: ['admin'] },
    };
    const identity = identities[token];
    if (!identity) {
      const { AppError } = await import('@hilo/backend-shared');
      throw AppError.unauthorized('Invalid token');
    }
    return identity;
  }
}

/** Mutable clock so tests can fast-forward past quote expiry. */
export class MutableClock implements Clock {
  constructor(private current = new Date('2026-07-09T00:00:00.000Z')) {}
  now(): Date {
    return new Date(this.current);
  }
  advanceDays(days: number): void {
    this.current = new Date(this.current.getTime() + days * 24 * 60 * 60 * 1000);
  }
}

export function buildTestApp() {
  const vendors = new InMemoryVendorRepository();
  const quotes = new InMemoryQuoteRepository();
  const clock = new MutableClock();
  const getVendor = new GetVendorUseCase(vendors);

  const deps: VendorRouteDeps = {
    verifier: new FakeTokenVerifier(),
    searchVendors: new SearchVendorsUseCase(vendors),
    getVendor,
    compareVendors: new CompareVendorsUseCase(getVendor),
    onboardVendor: new OnboardVendorUseCase(vendors, clock),
    recalculateTrustScores: new RecalculateTrustScoresUseCase(vendors, clock),
    requestQuote: new RequestQuoteUseCase(quotes, vendors, clock),
    transitionQuote: new TransitionQuoteUseCase(quotes, clock),
    listMyQuotes: new ListMyQuotesUseCase(quotes),
  };

  const logger = createLogger({
    serviceName: 'vendor-service',
    environment: 'test',
    level: 'error',
    sink: () => {},
  });

  return { app: buildApp(logger, deps), vendors, quotes, clock };
}

/** Hyderabad city centre — reference point for search tests. */
export const HYDERABAD = { latitude: 17.385, longitude: 78.4867 };
