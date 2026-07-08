import type { Event } from '../domain/event.js';
import type { EventBudget } from '../domain/event-budget.js';
import type { EventMember } from '../domain/event-member.js';

export interface EventDto {
  id: string;
  status: string;
  title: string;
  category: string;
  eventDate: string;
  startTime?: string;
  endTime?: string;
  city: string;
  guestCount: number;
  ownerId: string;
  coHostIds: string[];
  memberIds: string[];
  budgetId?: string;
  venueId?: string;
  description?: string;
  dressCode?: string;
  tags?: string[];
  notes?: string;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export function toEventDto(event: Event): EventDto {
  return {
    id: event.id,
    status: event.status,
    title: event.title,
    category: event.category,
    eventDate: event.eventDate,
    startTime: event.startTime,
    endTime: event.endTime,
    city: event.city,
    guestCount: event.guestCount,
    ownerId: event.ownerId,
    coHostIds: event.coHostIds,
    memberIds: event.memberIds,
    budgetId: event.budgetId,
    venueId: event.venueId,
    description: event.description,
    dressCode: event.dressCode,
    tags: event.tags,
    notes: event.notes,
    version: event.version,
    createdAt: event.createdAt,
    updatedAt: event.updatedAt,
  };
}

export function toBudgetDto(budget: EventBudget) {
  return {
    id: budget.id,
    eventId: budget.eventId,
    currency: budget.currency,
    totalAmount: budget.totalAmount,
    contingencyAmount: budget.contingencyAmount,
    allocations: budget.allocations,
    version: budget.version,
  };
}

export function toMemberDto(member: EventMember) {
  return {
    id: member.id,
    eventId: member.eventId,
    userId: member.userId,
    role: member.role,
  };
}
