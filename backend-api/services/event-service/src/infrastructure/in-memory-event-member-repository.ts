import { AppError } from '@hilo/backend-shared';
import type { EventMemberRepository } from '../domain/ports.js';
import { memberId, type EventMember } from '../domain/event-member.js';

/** In-memory {@link EventMemberRepository} for tests and local development. */
export class InMemoryEventMemberRepository implements EventMemberRepository {
  private readonly store = new Map<string, EventMember>();

  async create(member: EventMember): Promise<EventMember> {
    if (this.store.has(member.id)) {
      throw AppError.conflict(`Member already exists: ${member.id}`);
    }
    this.store.set(member.id, structuredClone(member));
    return structuredClone(member);
  }

  async findByEventAndUser(eventId: string, userId: string): Promise<EventMember | null> {
    const found = this.store.get(memberId(eventId, userId));
    return found ? structuredClone(found) : null;
  }

  async listByEvent(eventId: string): Promise<EventMember[]> {
    return [...this.store.values()]
      .filter((m) => m.eventId === eventId && !m.deleted)
      .map((m) => structuredClone(m));
  }
}
