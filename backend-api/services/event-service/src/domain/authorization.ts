import type { Event } from './event.js';
import { EventMemberRole } from './event-member.js';

/**
 * ABAC authorization for events (EOS-000 §68). Resolves a user's effective role within a
 * specific event from the denormalized ownership fields.
 */
export function memberRoleOf(event: Event, uid: string): EventMemberRole | null {
  if (event.ownerId === uid) return EventMemberRole.Owner;
  if (event.coHostIds.includes(uid)) return EventMemberRole.CoHost;
  if (event.memberIds.includes(uid)) return EventMemberRole.Guest;
  return null;
}

export function isMember(event: Event, uid: string): boolean {
  return memberRoleOf(event, uid) !== null;
}

/** Owner or co-host — the roles permitted to modify an event. */
export function canManage(event: Event, uid: string): boolean {
  const role = memberRoleOf(event, uid);
  return role === EventMemberRole.Owner || role === EventMemberRole.CoHost;
}

export function isOwner(event: Event, uid: string): boolean {
  return event.ownerId === uid;
}
