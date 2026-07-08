import { AppError, touchDocumentMetadata } from '@hilo/backend-shared';
import type { Clock, EventRepository } from '../domain/ports.js';
import type { Event, EventUpdateInput } from '../domain/event.js';
import { canManage } from '../domain/authorization.js';
import { isNameEditable, isReadOnly } from '../domain/event-status.js';

/**
 * Update whitelisted event fields (EOS-002-P3-Part-04 §5, §24). Owner/co-host only.
 * Archived events are read-only; the title is editable only until completion.
 */
export class UpdateEventUseCase {
  constructor(
    private readonly events: EventRepository,
    private readonly clock: Clock,
  ) {}

  async execute(actorUid: string, eventId: string, input: EventUpdateInput): Promise<Event> {
    const event = await this.events.findById(eventId);
    if (!event || event.deleted) throw AppError.notFound('Event not found');
    if (!canManage(event, actorUid)) {
      throw AppError.forbidden('Only the owner or a co-host can modify this event');
    }
    if (isReadOnly(event.status)) {
      throw AppError.conflict('Archived events are read-only');
    }

    if (input.title !== undefined) {
      if (!isNameEditable(event.status)) {
        throw AppError.conflict('The event name can no longer be changed');
      }
      if (!input.title.trim()) throw AppError.validation('title cannot be empty');
    }
    if (
      input.guestCount !== undefined &&
      (!Number.isFinite(input.guestCount) || input.guestCount <= 0)
    ) {
      throw AppError.validation('guestCount must be greater than 0');
    }

    const patched: Event = {
      ...event,
      ...(input.title !== undefined ? { title: input.title.trim() } : {}),
      ...(input.category !== undefined ? { category: input.category } : {}),
      ...(input.eventDate !== undefined ? { eventDate: input.eventDate } : {}),
      ...(input.startTime !== undefined ? { startTime: input.startTime } : {}),
      ...(input.endTime !== undefined ? { endTime: input.endTime } : {}),
      ...(input.city !== undefined ? { city: input.city } : {}),
      ...(input.guestCount !== undefined ? { guestCount: input.guestCount } : {}),
      ...(input.description !== undefined ? { description: input.description } : {}),
      ...(input.dressCode !== undefined ? { dressCode: input.dressCode } : {}),
      ...(input.tags !== undefined ? { tags: input.tags } : {}),
      ...(input.notes !== undefined ? { notes: input.notes } : {}),
      ...(input.venueId !== undefined ? { venueId: input.venueId } : {}),
    };

    return this.events.update(touchDocumentMetadata(patched, actorUid, this.clock.now()));
  }
}
