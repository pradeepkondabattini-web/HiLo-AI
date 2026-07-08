import { AppError } from '@hilo/backend-shared';
import type { EventRepository, ListOptions, Page } from '../domain/ports.js';
import type { Event } from '../domain/event.js';

/**
 * In-memory {@link EventRepository} for tests and local development. Records are cloned in
 * and out so callers cannot mutate internal state. `listByMember` returns non-deleted
 * events the user belongs to, newest first, with id-based cursor pagination.
 */
export class InMemoryEventRepository implements EventRepository {
  private readonly store = new Map<string, Event>();

  async findById(id: string): Promise<Event | null> {
    const found = this.store.get(id);
    return found ? structuredClone(found) : null;
  }

  async create(event: Event): Promise<Event> {
    if (this.store.has(event.id)) {
      throw AppError.conflict(`Event already exists: ${event.id}`);
    }
    this.store.set(event.id, structuredClone(event));
    return structuredClone(event);
  }

  async update(event: Event): Promise<Event> {
    this.store.set(event.id, structuredClone(event));
    return structuredClone(event);
  }

  async listByMember(uid: string, options: ListOptions): Promise<Page<Event>> {
    const ordered = [...this.store.values()]
      .filter((e) => !e.deleted && e.memberIds.includes(uid))
      .sort(byCreatedAtDesc);

    let start = 0;
    if (options.cursor) {
      const idx = ordered.findIndex((e) => e.id === options.cursor);
      start = idx >= 0 ? idx + 1 : 0;
    }
    const items = ordered.slice(start, start + options.limit);
    const hasMore = start + options.limit < ordered.length;
    const last = items.at(-1);
    return {
      items: items.map((e) => structuredClone(e)),
      nextCursor: hasMore && last ? last.id : null,
    };
  }
}

function byCreatedAtDesc(a: Event, b: Event): number {
  if (a.createdAt !== b.createdAt) return a.createdAt < b.createdAt ? 1 : -1;
  return a.id < b.id ? 1 : -1;
}
