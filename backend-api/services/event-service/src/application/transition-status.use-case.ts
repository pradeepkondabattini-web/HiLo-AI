import { AppError, touchDocumentMetadata } from '@hilo/backend-shared';
import type { Clock, EventRepository } from '../domain/ports.js';
import type { Event } from '../domain/event.js';
import { canManage } from '../domain/authorization.js';
import {
  allowedTransitions,
  canTransition,
  isReadOnly,
  type EventStatus,
} from '../domain/event-status.js';

/**
 * Advance an event through its lifecycle (EOS-002-P3-Part-04 §7). Owner/co-host only;
 * only transitions permitted by the state machine are allowed.
 */
export class TransitionStatusUseCase {
  constructor(
    private readonly events: EventRepository,
    private readonly clock: Clock,
  ) {}

  async execute(actorUid: string, eventId: string, target: EventStatus): Promise<Event> {
    const event = await this.events.findById(eventId);
    if (!event || event.deleted) throw AppError.notFound('Event not found');
    if (!canManage(event, actorUid)) {
      throw AppError.forbidden('Only the owner or a co-host can change the event status');
    }
    if (isReadOnly(event.status)) {
      throw AppError.conflict('Archived events are read-only');
    }
    if (!canTransition(event.status, target)) {
      throw AppError.badRequest(
        `Cannot transition from "${event.status}" to "${target}". Allowed: ${allowedTransitions(event.status).join(', ') || 'none'}`,
      );
    }

    const patched: Event = { ...event, status: target };
    return this.events.update(touchDocumentMetadata(patched, actorUid, this.clock.now()));
  }
}
