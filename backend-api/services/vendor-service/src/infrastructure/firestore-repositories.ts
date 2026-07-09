import { AppError } from '@hilo/backend-shared';
import type { Firestore } from 'firebase-admin/firestore';
import type { Quote } from '../domain/quote.js';
import type { QuoteRepository, VendorRepository } from '../domain/repositories.js';
import type { Vendor } from '../domain/vendor.js';

const VENDORS = 'vendors';
const QUOTES = 'vendor_quotes';

/** Firestore-backed {@link VendorRepository}. */
export class FirestoreVendorRepository implements VendorRepository {
  constructor(private readonly db: Firestore) {}

  async findById(id: string): Promise<Vendor | null> {
    const snap = await this.db.collection(VENDORS).doc(id).get();
    return snap.exists ? (snap.data() as Vendor) : null;
  }

  async findByOwner(ownerUid: string): Promise<Vendor | null> {
    const snap = await this.db.collection(VENDORS).where('ownerUid', '==', ownerUid).limit(1).get();
    const doc = snap.docs[0];
    return doc ? (doc.data() as Vendor) : null;
  }

  async list(params: { category?: string; city?: string; limit?: number } = {}): Promise<Vendor[]> {
    let query = this.db.collection(VENDORS).where('deleted', '==', false);
    if (params.category) query = query.where('category', '==', params.category);
    if (params.city) query = query.where('city', '==', params.city);
    const snap = await query.limit(params.limit ?? 100).get();
    return snap.docs.map((d) => d.data() as Vendor);
  }

  async create(vendor: Vendor): Promise<Vendor> {
    const ref = this.db.collection(VENDORS).doc(vendor.id);
    await this.db.runTransaction(async (tx) => {
      const existing = await tx.get(ref);
      if (existing.exists) throw AppError.conflict(`Vendor exists: ${vendor.id}`);
      tx.set(ref, vendor);
    });
    return vendor;
  }

  async update(vendor: Vendor): Promise<Vendor> {
    await this.db.collection(VENDORS).doc(vendor.id).set(vendor, { merge: true });
    return vendor;
  }
}

/** Firestore-backed {@link QuoteRepository}. */
export class FirestoreQuoteRepository implements QuoteRepository {
  constructor(private readonly db: Firestore) {}

  async findById(id: string): Promise<Quote | null> {
    const snap = await this.db.collection(QUOTES).doc(id).get();
    return snap.exists ? (snap.data() as Quote) : null;
  }

  async create(quote: Quote): Promise<Quote> {
    await this.db.collection(QUOTES).doc(quote.id).set(quote);
    return quote;
  }

  async update(quote: Quote): Promise<Quote> {
    await this.db.collection(QUOTES).doc(quote.id).set(quote, { merge: true });
    return quote;
  }

  async listByRequester(uid: string): Promise<Quote[]> {
    const snap = await this.db
      .collection(QUOTES)
      .where('requesterUid', '==', uid)
      .where('deleted', '==', false)
      .get();
    return snap.docs.map((d) => d.data() as Quote);
  }

  async listByVendorOwner(uid: string): Promise<Quote[]> {
    const snap = await this.db
      .collection(QUOTES)
      .where('vendorOwnerUid', '==', uid)
      .where('deleted', '==', false)
      .get();
    return snap.docs.map((d) => d.data() as Quote);
  }
}
