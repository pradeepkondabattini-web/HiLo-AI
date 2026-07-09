import { AppError } from '@hilo/backend-shared';
import type { Quote } from '../domain/quote.js';
import type { QuoteRepository, VendorRepository } from '../domain/repositories.js';
import type { Vendor } from '../domain/vendor.js';
import { HYDERABAD_SEED_VENDORS } from './hyderabad-seed.js';

/** In-memory {@link VendorRepository} for tests and local dev (seeded). */
export class InMemoryVendorRepository implements VendorRepository {
  private readonly store = new Map<string, Vendor>();

  constructor(seed: Vendor[] = HYDERABAD_SEED_VENDORS) {
    for (const vendor of seed) this.store.set(vendor.id, structuredClone(vendor));
  }

  async findById(id: string): Promise<Vendor | null> {
    const found = this.store.get(id);
    return found ? structuredClone(found) : null;
  }

  async findByOwner(ownerUid: string): Promise<Vendor | null> {
    for (const vendor of this.store.values()) {
      if (vendor.ownerUid === ownerUid) return structuredClone(vendor);
    }
    return null;
  }

  async list(params: { category?: string; city?: string; limit?: number } = {}): Promise<Vendor[]> {
    let result = [...this.store.values()].filter((v) => !v.deleted);
    if (params.category) result = result.filter((v) => v.category === params.category);
    if (params.city) result = result.filter((v) => v.city === params.city);
    return (params.limit ? result.slice(0, params.limit) : result).map((v) => structuredClone(v));
  }

  async create(vendor: Vendor): Promise<Vendor> {
    if (this.store.has(vendor.id)) throw AppError.conflict(`Vendor exists: ${vendor.id}`);
    this.store.set(vendor.id, structuredClone(vendor));
    return structuredClone(vendor);
  }

  async update(vendor: Vendor): Promise<Vendor> {
    this.store.set(vendor.id, structuredClone(vendor));
    return structuredClone(vendor);
  }
}

/** In-memory {@link QuoteRepository} for tests and local dev. */
export class InMemoryQuoteRepository implements QuoteRepository {
  private readonly store = new Map<string, Quote>();

  async findById(id: string): Promise<Quote | null> {
    const found = this.store.get(id);
    return found ? structuredClone(found) : null;
  }

  async create(quote: Quote): Promise<Quote> {
    if (this.store.has(quote.id)) throw AppError.conflict(`Quote exists: ${quote.id}`);
    this.store.set(quote.id, structuredClone(quote));
    return structuredClone(quote);
  }

  async update(quote: Quote): Promise<Quote> {
    this.store.set(quote.id, structuredClone(quote));
    return structuredClone(quote);
  }

  async listByRequester(uid: string): Promise<Quote[]> {
    return [...this.store.values()]
      .filter((q) => q.requesterUid === uid && !q.deleted)
      .map((q) => structuredClone(q));
  }

  async listByVendorOwner(uid: string): Promise<Quote[]> {
    return [...this.store.values()]
      .filter((q) => q.vendorOwnerUid === uid && !q.deleted)
      .map((q) => structuredClone(q));
  }
}
