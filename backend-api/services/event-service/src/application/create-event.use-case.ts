import { AppError, createDocumentMetadata, DocumentStatus } from '@hilo/backend-shared';
import type {
  Clock,
  EventBudgetRepository,
  EventMemberRepository,
  EventRepository,
  IdGenerator,
} from '../domain/ports.js';
import type { Event } from '../domain/event.js';
import type { EventBudget } from '../domain/event-budget.js';
import { computeAllocations } from '../domain/event-budget.js';
import { EventMemberRole, memberId, type EventMember } from '../domain/event-member.js';
import { EventStatus } from '../domain/event-status.js';
import { DEFAULT_BUDGET_ALLOCATIONS, DEFAULT_CURRENCY } from '../domain/budget-defaults.js';

export interface CreateEventInput {
  title: string;
  category: string;
  eventDate: string;
  startTime?: string;
  endTime?: string;
  city: string;
  guestCount: number;
  totalBudget: number;
  description?: string;
  dressCode?: string;
  tags?: string[];
  notes?: string;
}

export interface CreateEventResult {
  event: Event;
  budget: EventBudget;
}

/**
 * Creates a Draft event with its owner membership and a default budget
 * (EOS-002-P3-Part-04 §4, §10). The creator becomes the sole owner.
 */
export class CreateEventUseCase {
  constructor(
    private readonly events: EventRepository,
    private readonly members: EventMemberRepository,
    private readonly budgets: EventBudgetRepository,
    private readonly ids: IdGenerator,
    private readonly clock: Clock,
  ) {}

  async execute(actorUid: string, input: CreateEventInput): Promise<CreateEventResult> {
    const title = input.title?.trim();
    if (!title) throw AppError.validation('title is required');
    if (!Number.isFinite(input.guestCount) || input.guestCount <= 0) {
      throw AppError.validation('guestCount must be greater than 0');
    }
    if (!Number.isFinite(input.totalBudget) || input.totalBudget < 0) {
      throw AppError.validation('totalBudget must be zero or greater');
    }
    if (!input.eventDate) throw AppError.validation('eventDate is required');
    if (!input.city?.trim()) throw AppError.validation('city is required');

    const now = this.clock.now();
    const eventId = this.ids.newId();
    const budgetId = this.ids.newId();

    const event: Event = {
      ...createDocumentMetadata({ id: eventId, actorId: actorUid, status: EventStatus.Draft, now }),
      status: EventStatus.Draft,
      title,
      category: input.category,
      eventDate: input.eventDate,
      startTime: input.startTime,
      endTime: input.endTime,
      city: input.city,
      guestCount: input.guestCount,
      ownerId: actorUid,
      coHostIds: [],
      memberIds: [actorUid],
      budgetId,
      description: input.description,
      dressCode: input.dressCode,
      tags: input.tags,
      notes: input.notes,
    };

    const budget: EventBudget = {
      ...createDocumentMetadata({
        id: budgetId,
        actorId: actorUid,
        status: DocumentStatus.Active,
        now,
      }),
      eventId,
      currency: DEFAULT_CURRENCY,
      totalAmount: input.totalBudget,
      allocations: computeAllocations(input.totalBudget, DEFAULT_BUDGET_ALLOCATIONS),
    };

    const ownerMember: EventMember = {
      ...createDocumentMetadata({
        id: memberId(eventId, actorUid),
        actorId: actorUid,
        status: DocumentStatus.Active,
        now,
      }),
      eventId,
      userId: actorUid,
      role: EventMemberRole.Owner,
    };

    const created = await this.events.create(event);
    const createdBudget = await this.budgets.create(budget);
    await this.members.create(ownerMember);

    return { event: created, budget: createdBudget };
  }
}
