import { AppError } from '@hilo/backend-shared';
import type { EventRepository } from '../domain/ports.js';
import type { Event } from '../domain/event.js';
import { isMember } from '../domain/authorization.js';

/** Retrieve an event the caller participates in (EOS-002-P3-Part-04 §24 — members only). */
export class GetEventUseCase {
  constructor(private readonly events: EventRepository) {}

  async execute(actorUid: string, eventId: string): Promise<Event> {
    const event = await this.events.findById(eventId);
    if (!event || event.deleted) {
      throw AppError.notFound('Event not found');
    }
    if (!isMember(event, actorUid)) {
      throw AppError.forbidden('You do not have access to this event');
    }
    return event;
  }
}
