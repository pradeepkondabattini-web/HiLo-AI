import {
  AppError,
  createDocumentMetadata,
  DocumentStatus,
  touchDocumentMetadata,
} from '@hilo/backend-shared';
import type { Clock, EventMemberRepository, EventRepository } from '../domain/ports.js';
import { canManage, isOwner } from '../domain/authorization.js';
import { EventMemberRole, memberId, type EventMember } from '../domain/event-member.js';
import { isReadOnly } from '../domain/event-status.js';

export interface AddMemberInput {
  actorUid: string;
  eventId: string;
  userId: string;
  role: EventMemberRole;
}

/**
 * Add a participant to an event (EOS-002-P3-Part-04 §14–15, §24). Owner/co-host may add
 * guests; only the owner may add co-hosts. An event has exactly one owner, so `owner`
 * cannot be assigned here. Updates the denormalized membership arrays on the event.
 */
export class AddMemberUseCase {
  constructor(
    private readonly events: EventRepository,
    private readonly members: EventMemberRepository,
    private readonly clock: Clock,
  ) {}

  async execute(input: AddMemberInput): Promise<EventMember> {
    const { actorUid, eventId, userId, role } = input;
    const event = await this.events.findById(eventId);
    if (!event || event.deleted) throw AppError.notFound('Event not found');
    if (isReadOnly(event.status)) throw AppError.conflict('Archived events are read-only');
    if (!canManage(event, actorUid)) {
      throw AppError.forbidden('Only the owner or a co-host can add members');
    }
    if (role === EventMemberRole.Owner) {
      throw AppError.badRequest('An event has exactly one owner');
    }
    if (role === EventMemberRole.CoHost && !isOwner(event, actorUid)) {
      throw AppError.forbidden('Only the owner can add co-hosts');
    }

    const existing = await this.members.findByEventAndUser(eventId, userId);
    if (existing) throw AppError.conflict('User is already a member of this event');

    const now = this.clock.now();
    const member: EventMember = {
      ...createDocumentMetadata({
        id: memberId(eventId, userId),
        actorId: actorUid,
        status: DocumentStatus.Active,
        now,
      }),
      eventId,
      userId,
      role,
    };
    const created = await this.members.create(member);

    const memberIds = [...new Set([...event.memberIds, userId])];
    const coHostIds =
      role === EventMemberRole.CoHost
        ? [...new Set([...event.coHostIds, userId])]
        : event.coHostIds;
    await this.events.update(
      touchDocumentMetadata({ ...event, memberIds, coHostIds }, actorUid, now),
    );

    return created;
  }
}
