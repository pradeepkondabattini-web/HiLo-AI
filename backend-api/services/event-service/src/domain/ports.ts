import type { Event } from './event.js';
import type { EventMember } from './event-member.js';
import type { EventBudget } from './event-budget.js';

/** A page of results with an opaque cursor (EOS-000 §45 — cursor pagination only). */
export interface Page<T> {
  items: T[];
  nextCursor: string | null;
}

export interface ListOptions {
  limit: number;
  cursor?: string | null;
}

/** Repository ports (EOS-000 §24, §56). Infrastructure supplies the implementations. */
export interface EventRepository {
  findById(id: string): Promise<Event | null>;
  create(event: Event): Promise<Event>;
  update(event: Event): Promise<Event>;
  /** Events the user participates in, newest first, cursor-paginated. */
  listByMember(uid: string, options: ListOptions): Promise<Page<Event>>;
}

export interface EventMemberRepository {
  create(member: EventMember): Promise<EventMember>;
  findByEventAndUser(eventId: string, userId: string): Promise<EventMember | null>;
  listByEvent(eventId: string): Promise<EventMember[]>;
}

export interface EventBudgetRepository {
  findById(id: string): Promise<EventBudget | null>;
  findByEventId(eventId: string): Promise<EventBudget | null>;
  create(budget: EventBudget): Promise<EventBudget>;
  update(budget: EventBudget): Promise<EventBudget>;
}

/** Opaque identifier generator — abstracts Firestore id generation for testability. */
export interface IdGenerator {
  newId(): string;
}

/** Injected clock — keeps time deterministic in tests. */
export interface Clock {
  now(): Date;
}

export const systemClock: Clock = { now: () => new Date() };
