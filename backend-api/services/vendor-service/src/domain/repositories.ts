import type { Quote } from './quote.js';
import type { Vendor } from './vendor.js';

/** Repository port for the vendor catalogue (Firestore `vendors/`). */
export interface VendorRepository {
  findById(id: string): Promise<Vendor | null>;
  findByOwner(ownerUid: string): Promise<Vendor | null>;
  list(params?: { category?: string; city?: string; limit?: number }): Promise<Vendor[]>;
  create(vendor: Vendor): Promise<Vendor>;
  update(vendor: Vendor): Promise<Vendor>;
}

/** Repository port for quotations (Firestore `vendor_quotes/`). */
export interface QuoteRepository {
  findById(id: string): Promise<Quote | null>;
  create(quote: Quote): Promise<Quote>;
  update(quote: Quote): Promise<Quote>;
  listByRequester(uid: string): Promise<Quote[]>;
  listByVendorOwner(uid: string): Promise<Quote[]>;
}

/** Injected clock — keeps time deterministic in tests. */
export interface Clock {
  now(): Date;
}

export const systemClock: Clock = { now: () => new Date() };
