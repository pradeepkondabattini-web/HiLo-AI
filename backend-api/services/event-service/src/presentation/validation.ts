import { AppError } from '@hilo/backend-shared';
import type { CreateEventInput } from '../application/create-event.use-case.js';
import type { UpdateBudgetInput } from '../application/update-budget.use-case.js';
import type { EventUpdateInput } from '../domain/event.js';
import { isEventStatus, type EventStatus } from '../domain/event-status.js';
import { isEventMemberRole, type EventMemberRole } from '../domain/event-member.js';

function obj(body: unknown): Record<string, unknown> {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    throw AppError.validation('Request body must be a JSON object');
  }
  return body as Record<string, unknown>;
}

function str(v: unknown, field: string, { required = false, max = 500 } = {}): string | undefined {
  if (v === undefined || v === null) {
    if (required) throw AppError.validation(`${field} is required`);
    return undefined;
  }
  if (typeof v !== 'string') throw AppError.validation(`${field} must be a string`);
  if (v.length > max) throw AppError.validation(`${field} exceeds ${max} characters`);
  return v;
}

function num(v: unknown, field: string, { required = false } = {}): number | undefined {
  if (v === undefined || v === null) {
    if (required) throw AppError.validation(`${field} is required`);
    return undefined;
  }
  if (typeof v !== 'number' || !Number.isFinite(v)) {
    throw AppError.validation(`${field} must be a number`);
  }
  return v;
}

function stringArray(v: unknown, field: string): string[] | undefined {
  if (v === undefined) return undefined;
  if (!Array.isArray(v) || v.some((x) => typeof x !== 'string')) {
    throw AppError.validation(`${field} must be an array of strings`);
  }
  return v as string[];
}

export function parseCreateEvent(body: unknown): CreateEventInput {
  const b = obj(body);
  return {
    title: str(b.title, 'title', { required: true, max: 200 })!,
    category: str(b.category, 'category', { required: true, max: 60 })!,
    eventDate: str(b.eventDate, 'eventDate', { required: true })!,
    startTime: str(b.startTime, 'startTime'),
    endTime: str(b.endTime, 'endTime'),
    city: str(b.city, 'city', { required: true, max: 120 })!,
    guestCount: num(b.guestCount, 'guestCount', { required: true })!,
    totalBudget: num(b.totalBudget, 'totalBudget', { required: true })!,
    description: str(b.description, 'description', { max: 5000 }),
    dressCode: str(b.dressCode, 'dressCode', { max: 200 }),
    tags: stringArray(b.tags, 'tags'),
    notes: str(b.notes, 'notes', { max: 5000 }),
  };
}

export function parseUpdateEvent(body: unknown): EventUpdateInput {
  const b = obj(body);
  return {
    title: str(b.title, 'title', { max: 200 }),
    category: str(b.category, 'category', { max: 60 }),
    eventDate: str(b.eventDate, 'eventDate'),
    startTime: str(b.startTime, 'startTime'),
    endTime: str(b.endTime, 'endTime'),
    city: str(b.city, 'city', { max: 120 }),
    guestCount: num(b.guestCount, 'guestCount'),
    description: str(b.description, 'description', { max: 5000 }),
    dressCode: str(b.dressCode, 'dressCode', { max: 200 }),
    tags: stringArray(b.tags, 'tags'),
    notes: str(b.notes, 'notes', { max: 5000 }),
    venueId: str(b.venueId, 'venueId'),
  };
}

export function parseStatus(body: unknown): EventStatus {
  const b = obj(body);
  if (!isEventStatus(b.status)) {
    throw AppError.validation('status must be a valid event lifecycle state');
  }
  return b.status;
}

export function parseAddMember(body: unknown): { userId: string; role: EventMemberRole } {
  const b = obj(body);
  const userId = str(b.userId, 'userId', { required: true, max: 128 })!;
  if (!isEventMemberRole(b.role)) {
    throw AppError.validation('role must be one of: owner, cohost, guest');
  }
  return { userId, role: b.role };
}

export function parseUpdateBudget(body: unknown): UpdateBudgetInput {
  const b = obj(body);
  let allocations: { category: string; percentage: number }[] | undefined;
  if (b.allocations !== undefined) {
    if (!Array.isArray(b.allocations)) {
      throw AppError.validation('allocations must be an array');
    }
    allocations = b.allocations.map((a) => {
      const item = obj(a);
      return {
        category: str(item.category, 'allocation.category', { required: true, max: 60 })!,
        percentage: num(item.percentage, 'allocation.percentage', { required: true })!,
      };
    });
  }
  return {
    totalAmount: num(b.totalAmount, 'totalAmount'),
    contingencyAmount: num(b.contingencyAmount, 'contingencyAmount'),
    allocations,
  };
}

export function parseListQuery(query: Record<string, unknown>): {
  limit?: number;
  cursor?: string | null;
} {
  const limitRaw = query.limit;
  let limit: number | undefined;
  if (typeof limitRaw === 'string' && limitRaw.length > 0) {
    const parsed = Number.parseInt(limitRaw, 10);
    if (Number.isNaN(parsed)) throw AppError.validation('limit must be an integer');
    limit = parsed;
  }
  const cursor = typeof query.cursor === 'string' ? query.cursor : null;
  return { limit, cursor };
}
