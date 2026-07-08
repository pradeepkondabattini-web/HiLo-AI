import { AppError } from '@hilo/backend-shared';
import type { Firestore } from 'firebase-admin/firestore';
import type { EventRepository, ListOptions, Page } from '../domain/ports.js';
import type { Event } from '../domain/event.js';
import { fromFirestore, toFirestore } from './firestore-mapping.js';

const COLLECTION = 'events';

/**
 * Firestore-backed {@link EventRepository}. `listByMember` uses an `array-contains` on
 * `memberIds` ordered by `createdAt` desc (composite index required — see
 * firebase/firestore.indexes.json) with document-snapshot cursor pagination (EOS-000 §45).
 */
export class FirestoreEventRepository implements EventRepository {
  constructor(private readonly db: Firestore) {}

  private col() {
    return this.db.collection(COLLECTION);
  }

  async findById(id: string): Promise<Event | null> {
    const snap = await this.col().doc(id).get();
    return snap.exists ? fromFirestore<Event>(snap.data()!) : null;
  }

  async create(event: Event): Promise<Event> {
    const ref = this.col().doc(event.id);
    await this.db.runTransaction(async (tx) => {
      const existing = await tx.get(ref);
      if (existing.exists) throw AppError.conflict(`Event already exists: ${event.id}`);
      tx.set(ref, toFirestore(event, { create: true }));
    });
    const created = await ref.get();
    return fromFirestore<Event>(created.data()!);
  }

  async update(event: Event): Promise<Event> {
    const ref = this.col().doc(event.id);
    await ref.set(toFirestore(event, { create: false }), { merge: true });
    const updated = await ref.get();
    return fromFirestore<Event>(updated.data()!);
  }

  async listByMember(uid: string, options: ListOptions): Promise<Page<Event>> {
    let query = this.col()
      .where('deleted', '==', false)
      .where('memberIds', 'array-contains', uid)
      .orderBy('createdAt', 'desc')
      .limit(options.limit);

    if (options.cursor) {
      const cursorSnap = await this.col().doc(options.cursor).get();
      if (cursorSnap.exists) query = query.startAfter(cursorSnap);
    }

    const snap = await query.get();
    const items = snap.docs.map((d) => fromFirestore<Event>(d.data()));
    const nextCursor = snap.size === options.limit ? (snap.docs.at(-1)?.id ?? null) : null;
    return { items, nextCursor };
  }
}
