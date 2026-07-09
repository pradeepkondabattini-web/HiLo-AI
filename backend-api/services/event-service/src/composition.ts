import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { FirebaseTokenVerifier, getFirebaseApp } from '@hilo/backend-shared';
import { CreateEventUseCase } from './application/create-event.use-case.js';
import { GetEventUseCase } from './application/get-event.use-case.js';
import { ListEventsUseCase } from './application/list-events.use-case.js';
import { UpdateEventUseCase } from './application/update-event.use-case.js';
import { TransitionStatusUseCase } from './application/transition-status.use-case.js';
import { AddMemberUseCase } from './application/add-member.use-case.js';
import { UpdateBudgetUseCase } from './application/update-budget.use-case.js';
import { DeleteEventUseCase } from './application/delete-event.use-case.js';
import { systemClock } from './domain/ports.js';
import { FirestoreEventRepository } from './infrastructure/firestore-event-repository.js';
import { FirestoreEventMemberRepository } from './infrastructure/firestore-event-member-repository.js';
import { FirestoreEventBudgetRepository } from './infrastructure/firestore-event-budget-repository.js';
import { UuidIdGenerator } from './infrastructure/uuid-id-generator.js';
import type { EventRouteDeps } from './presentation/event.routes.js';

/**
 * Composition root (EOS-000 §24). The only place infrastructure is instantiated; use
 * cases receive their dependencies via constructor injection. Tests build
 * {@link EventRouteDeps} from in-memory fakes instead of calling this.
 */
export function buildEventDeps(projectId: string): EventRouteDeps {
  const app = getFirebaseApp(projectId);
  const auth = getAuth(app);
  const db = getFirestore(app);
  // Optional domain fields (startTime, description, …) may be undefined — never persist
  // them as Firestore errors (rejects undefined values by default).
  db.settings({ ignoreUndefinedProperties: true });

  const events = new FirestoreEventRepository(db);
  const members = new FirestoreEventMemberRepository(db);
  const budgets = new FirestoreEventBudgetRepository(db);
  const ids = new UuidIdGenerator();
  const clock = systemClock;

  return {
    verifier: new FirebaseTokenVerifier(auth),
    createEvent: new CreateEventUseCase(events, members, budgets, ids, clock),
    getEvent: new GetEventUseCase(events),
    listEvents: new ListEventsUseCase(events),
    updateEvent: new UpdateEventUseCase(events, clock),
    transition: new TransitionStatusUseCase(events, clock),
    addMember: new AddMemberUseCase(events, members, clock),
    updateBudget: new UpdateBudgetUseCase(events, budgets, clock),
    deleteEvent: new DeleteEventUseCase(events, clock),
  };
}
