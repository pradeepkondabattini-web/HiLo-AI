import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { FirebaseTokenVerifier } from '@hilo/backend-shared';
import {
  ListMyQuotesUseCase,
  RequestQuoteUseCase,
  TransitionQuoteUseCase,
} from './application/quote.use-cases.js';
import { SearchVendorsUseCase } from './application/search-vendors.use-case.js';
import {
  CompareVendorsUseCase,
  GetVendorUseCase,
  OnboardVendorUseCase,
  RecalculateTrustScoresUseCase,
} from './application/vendor.use-cases.js';
import { systemClock } from './domain/repositories.js';
import { getFirebaseApp } from './infrastructure/firebase.js';
import {
  FirestoreQuoteRepository,
  FirestoreVendorRepository,
} from './infrastructure/firestore-repositories.js';
import type { VendorRouteDeps } from './presentation/vendor.routes.js';

/** Composition root (EOS-000 §24) — the only place infrastructure is constructed. */
export function buildVendorDeps(config: {
  projectId: string;
  quoteValidityDays?: number;
}): VendorRouteDeps {
  const app = getFirebaseApp(config.projectId);
  const auth = getAuth(app);
  const db = getFirestore(app);
  // Optional domain fields may be undefined — never persist them as Firestore errors
  // (rejects undefined values by default).
  db.settings({ ignoreUndefinedProperties: true });

  const vendors = new FirestoreVendorRepository(db);
  const quotes = new FirestoreQuoteRepository(db);
  const clock = systemClock;
  const getVendor = new GetVendorUseCase(vendors);

  return {
    verifier: new FirebaseTokenVerifier(auth),
    searchVendors: new SearchVendorsUseCase(vendors),
    getVendor,
    compareVendors: new CompareVendorsUseCase(getVendor),
    onboardVendor: new OnboardVendorUseCase(vendors, clock),
    recalculateTrustScores: new RecalculateTrustScoresUseCase(vendors, clock),
    requestQuote: new RequestQuoteUseCase(quotes, vendors, clock, config.quoteValidityDays),
    transitionQuote: new TransitionQuoteUseCase(quotes, clock),
    listMyQuotes: new ListMyQuotesUseCase(quotes),
  };
}
