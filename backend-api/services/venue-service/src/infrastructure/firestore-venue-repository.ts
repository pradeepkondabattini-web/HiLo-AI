import type { DocumentData, Firestore } from 'firebase-admin/firestore';
import type { Venue } from '../domain/venue.js';
import type { VenueRepository } from '../domain/venue-repository.js';

const COLLECTION = 'venues';

/** Firestore-backed HiLo venue catalogue. */
export class FirestoreVenueRepository implements VenueRepository {
  constructor(private readonly db: Firestore) {}

  async findById(id: string): Promise<Venue | null> {
    const snap = await this.db.collection(COLLECTION).doc(id).get();
    if (!snap.exists) return null;
    const venue = fromDoc(id, snap.data()!);
    return venue.deleted ? null : venue.venue;
  }

  async listCatalogue(params: { city?: string; limit?: number } = {}): Promise<Venue[]> {
    let query = this.db.collection(COLLECTION).where('deleted', '==', false);
    if (params.city) query = query.where('city', '==', params.city);
    const snap = await query.limit(params.limit ?? 50).get();
    return snap.docs.map((d) => fromDoc(d.id, d.data()).venue);
  }
}

function fromDoc(id: string, data: DocumentData): { venue: Venue; deleted: boolean } {
  return { venue: { ...(data as Venue), id }, deleted: data.deleted === true };
}
