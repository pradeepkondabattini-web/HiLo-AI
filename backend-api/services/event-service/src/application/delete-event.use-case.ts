import { AppError, softDeleteDocumentMetadata } from '@hilo/backend-shared';
import type { Clock, EventRepository } from '../domain/ports.js';
import { isOwner } from '../domain/authorization.js';

/**
 * Soft-delete an event (EOS-000 §37). Owner only. The document is tombstoned, never
 * physically removed.
 */
export class DeleteEventUseCase {
  constructor(
    private readonly events: EventRepository,
    private readonly clock: Clock,
  ) {}

  async execute(actorUid: string, eventId: string): Promise<void> {
    const event = await this.events.findById(eventId);
    if (!event || event.deleted) throw AppError.notFound('Event not found');
    if (!isOwner(event, actorUid)) {
      throw AppError.forbidden('Only the owner can delete this event');
    }
    await this.events.update(softDeleteDocumentMetadata(event, actorUid, this.clock.now()));
  }
}
