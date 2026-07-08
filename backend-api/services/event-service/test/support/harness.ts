import { createLogger, type TokenVerifier, type VerifiedIdentity } from '@hilo/backend-shared';
import type { Clock, IdGenerator } from '../../src/domain/ports.js';
import { InMemoryEventRepository } from '../../src/infrastructure/in-memory-event-repository.js';
import { InMemoryEventMemberRepository } from '../../src/infrastructure/in-memory-event-member-repository.js';
import { InMemoryEventBudgetRepository } from '../../src/infrastructure/in-memory-event-budget-repository.js';
import { CreateEventUseCase } from '../../src/application/create-event.use-case.js';
import { GetEventUseCase } from '../../src/application/get-event.use-case.js';
import { ListEventsUseCase } from '../../src/application/list-events.use-case.js';
import { UpdateEventUseCase } from '../../src/application/update-event.use-case.js';
import { TransitionStatusUseCase } from '../../src/application/transition-status.use-case.js';
import { AddMemberUseCase } from '../../src/application/add-member.use-case.js';
import { UpdateBudgetUseCase } from '../../src/application/update-budget.use-case.js';
import { DeleteEventUseCase } from '../../src/application/delete-event.use-case.js';
import type { EventRouteDeps } from '../../src/presentation/event.routes.js';
import { buildApp } from '../../src/server.js';

/** Deterministic ids: id-1, id-2, ... so tests can assert exact ids. */
export class SequentialIdGenerator implements IdGenerator {
  private n = 0;
  newId(): string {
    return `id-${++this.n}`;
  }
}

/** Controllable clock for deterministic timestamps. */
export class TestClock implements Clock {
  private t: Date;
  constructor(iso = '2026-07-05T10:00:00.000Z') {
    this.t = new Date(iso);
  }
  now(): Date {
    return new Date(this.t);
  }
  advance(ms: number): void {
    this.t = new Date(this.t.getTime() + ms);
  }
}

export function buildHarness() {
  const events = new InMemoryEventRepository();
  const members = new InMemoryEventMemberRepository();
  const budgets = new InMemoryEventBudgetRepository();
  const ids = new SequentialIdGenerator();
  const clock = new TestClock();

  return {
    events,
    members,
    budgets,
    ids,
    clock,
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

export const validCreateInput = {
  title: 'Birthday Party',
  category: 'birthday',
  eventDate: '2026-08-01',
  city: 'Hyderabad',
  guestCount: 40,
  totalBudget: 100_000,
};

/** Verifier that resolves preset identities keyed by token string; unknown → throws. */
export class FakeTokenVerifier implements TokenVerifier {
  private readonly registry = new Map<string, VerifiedIdentity>();

  register(token: string, identity: VerifiedIdentity): this {
    this.registry.set(token, identity);
    return this;
  }

  /** Convenience: register a plain user whose token equals their uid. */
  registerUser(uid: string): this {
    return this.register(uid, { uid, emailVerified: true, signInProvider: 'password' });
  }

  async verify(token: string): Promise<VerifiedIdentity> {
    const identity = this.registry.get(token);
    if (!identity) {
      const { AppError } = await import('@hilo/backend-shared');
      throw AppError.unauthorized('Invalid or expired authentication token');
    }
    return identity;
  }
}

/** Build the event-service app wired to in-memory fakes — no Firebase required. */
export function buildTestApp() {
  const h = buildHarness();
  const verifier = new FakeTokenVerifier();
  const deps: EventRouteDeps = {
    verifier,
    createEvent: h.createEvent,
    getEvent: h.getEvent,
    listEvents: h.listEvents,
    updateEvent: h.updateEvent,
    transition: h.transition,
    addMember: h.addMember,
    updateBudget: h.updateBudget,
    deleteEvent: h.deleteEvent,
  };
  const logger = createLogger({
    serviceName: 'event-service',
    environment: 'test',
    level: 'error',
    sink: () => {},
  });
  return { app: buildApp(logger, deps), verifier, ...h };
}
