import type { EventRepository, ListOptions, Page } from '../domain/ports.js';
import type { Event } from '../domain/event.js';

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

/** List events the caller participates in, cursor-paginated (EOS-000 §45). */
export class ListEventsUseCase {
  constructor(private readonly events: EventRepository) {}

  async execute(actorUid: string, options: Partial<ListOptions> = {}): Promise<Page<Event>> {
    const limit = Math.min(Math.max(options.limit ?? DEFAULT_LIMIT, 1), MAX_LIMIT);
    return this.events.listByMember(actorUid, { limit, cursor: options.cursor ?? null });
  }
}
