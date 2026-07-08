import type { Firestore } from 'firebase-admin/firestore';
import type { EventBudgetRepository } from '../domain/ports.js';
import type { EventBudget } from '../domain/event-budget.js';
import { fromFirestore, toFirestore } from './firestore-mapping.js';

const COLLECTION = 'event_budgets';

/** Firestore-backed {@link EventBudgetRepository}. */
export class FirestoreEventBudgetRepository implements EventBudgetRepository {
  constructor(private readonly db: Firestore) {}

  private col() {
    return this.db.collection(COLLECTION);
  }

  async findById(id: string): Promise<EventBudget | null> {
    const snap = await this.col().doc(id).get();
    return snap.exists ? fromFirestore<EventBudget>(snap.data()!) : null;
  }

  async findByEventId(eventId: string): Promise<EventBudget | null> {
    const snap = await this.col()
      .where('eventId', '==', eventId)
      .where('deleted', '==', false)
      .limit(1)
      .get();
    const doc = snap.docs[0];
    return doc ? fromFirestore<EventBudget>(doc.data()) : null;
  }

  async create(budget: EventBudget): Promise<EventBudget> {
    const ref = this.col().doc(budget.id);
    await ref.set(toFirestore(budget, { create: true }));
    const created = await ref.get();
    return fromFirestore<EventBudget>(created.data()!);
  }

  async update(budget: EventBudget): Promise<EventBudget> {
    const ref = this.col().doc(budget.id);
    await ref.set(toFirestore(budget, { create: false }), { merge: true });
    const updated = await ref.get();
    return fromFirestore<EventBudget>(updated.data()!);
  }
}
