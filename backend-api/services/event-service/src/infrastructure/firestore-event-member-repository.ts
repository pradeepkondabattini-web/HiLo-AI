import { AppError } from '@hilo/backend-shared';
import type { Firestore } from 'firebase-admin/firestore';
import type { EventMemberRepository } from '../domain/ports.js';
import { memberId, type EventMember } from '../domain/event-member.js';
import { fromFirestore, toFirestore } from './firestore-mapping.js';

const COLLECTION = 'event_members';

/** Firestore-backed {@link EventMemberRepository}. Doc id is `${eventId}_${userId}`. */
export class FirestoreEventMemberRepository implements EventMemberRepository {
  constructor(private readonly db: Firestore) {}

  private col() {
    return this.db.collection(COLLECTION);
  }

  async create(member: EventMember): Promise<EventMember> {
    const ref = this.col().doc(member.id);
    await this.db.runTransaction(async (tx) => {
      const existing = await tx.get(ref);
      if (existing.exists) throw AppError.conflict(`Member already exists: ${member.id}`);
      tx.set(ref, toFirestore(member, { create: true }));
    });
    const created = await ref.get();
    return fromFirestore<EventMember>(created.data()!);
  }

  async findByEventAndUser(eventId: string, userId: string): Promise<EventMember | null> {
    const snap = await this.col().doc(memberId(eventId, userId)).get();
    return snap.exists ? fromFirestore<EventMember>(snap.data()!) : null;
  }

  async listByEvent(eventId: string): Promise<EventMember[]> {
    const snap = await this.col()
      .where('eventId', '==', eventId)
      .where('deleted', '==', false)
      .get();
    return snap.docs.map((d) => fromFirestore<EventMember>(d.data()));
  }
}
