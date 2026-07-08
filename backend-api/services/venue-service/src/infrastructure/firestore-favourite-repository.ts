import type { DocumentData, Firestore } from 'firebase-admin/firestore';
import { favouriteId, type FavouriteRepository, type VenueFavourite } from '../domain/favourite.js';

const COLLECTION = 'venue_favourites';

/** Firestore-backed {@link FavouriteRepository}. Soft-deletes on remove (EOS-000 §37). */
export class FirestoreFavouriteRepository implements FavouriteRepository {
  constructor(private readonly db: Firestore) {}

  async add(favourite: VenueFavourite): Promise<VenueFavourite> {
    await this.db.collection(COLLECTION).doc(favourite.id).set(favourite);
    return favourite;
  }

  async find(userId: string, venueId: string): Promise<VenueFavourite | null> {
    const snap = await this.db.collection(COLLECTION).doc(favouriteId(userId, venueId)).get();
    if (!snap.exists) return null;
    const fav = snap.data() as VenueFavourite;
    return fav.deleted ? null : fav;
  }

  async listByUser(userId: string): Promise<VenueFavourite[]> {
    const snap = await this.db
      .collection(COLLECTION)
      .where('userId', '==', userId)
      .where('deleted', '==', false)
      .get();
    return snap.docs.map((d) => d.data() as VenueFavourite);
  }

  async remove(userId: string, venueId: string): Promise<void> {
    const ref = this.db.collection(COLLECTION).doc(favouriteId(userId, venueId));
    const now = new Date().toISOString();
    const patch: DocumentData = { deleted: true, deletedAt: now, updatedAt: now };
    await ref.set(patch, { merge: true });
  }
}
