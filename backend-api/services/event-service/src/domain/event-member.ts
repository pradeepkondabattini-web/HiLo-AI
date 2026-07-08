import type { DocumentMetadata } from '@hilo/backend-shared';

/**
 * Membership roles within a single event (EOS-002-P3-Part-04 §15, §24). Exactly one
 * owner; multiple co-hosts; guests are invited participants.
 */
export const EventMemberRole = {
  Owner: 'owner',
  CoHost: 'cohost',
  Guest: 'guest',
} as const;

export type EventMemberRole = (typeof EventMemberRole)[keyof typeof EventMemberRole];

export function isEventMemberRole(value: unknown): value is EventMemberRole {
  return typeof value === 'string' && (Object.values(EventMemberRole) as string[]).includes(value);
}

/** A membership record in `event_members/` (owner: event-service). */
export interface EventMember extends DocumentMetadata {
  eventId: string;
  userId: string;
  role: EventMemberRole;
}

/** Deterministic membership id — one record per (event, user). */
export function memberId(eventId: string, userId: string): string {
  return `${eventId}_${userId}`;
}
