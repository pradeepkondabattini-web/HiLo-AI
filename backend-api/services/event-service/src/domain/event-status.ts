/**
 * Event lifecycle state machine (EOS-002-P3-Part-04 §7).
 *
 * The event's business lifecycle is stored in the document's `status` field. Progression
 * is forward-only through the pipeline, with `cancelled` reachable from any active state
 * and `archived` as the terminal, read-only state.
 */
export const EventStatus = {
  Draft: 'draft',
  Planning: 'planning',
  VenueReserved: 'venue_reserved',
  VendorConfirmed: 'vendor_confirmed',
  InvitationsSent: 'invitations_sent',
  RsvpCollection: 'rsvp_collection',
  Payments: 'payments',
  Ready: 'ready',
  LiveEvent: 'live_event',
  Completed: 'completed',
  Archived: 'archived',
  Cancelled: 'cancelled',
} as const;

export type EventStatus = (typeof EventStatus)[keyof typeof EventStatus];

/** Allowed forward transitions. `cancelled` is added to every active state below. */
const FORWARD: Partial<Record<EventStatus, EventStatus[]>> = {
  [EventStatus.Draft]: [EventStatus.Planning],
  [EventStatus.Planning]: [EventStatus.VenueReserved],
  [EventStatus.VenueReserved]: [EventStatus.VendorConfirmed],
  [EventStatus.VendorConfirmed]: [EventStatus.InvitationsSent],
  [EventStatus.InvitationsSent]: [EventStatus.RsvpCollection],
  [EventStatus.RsvpCollection]: [EventStatus.Payments],
  [EventStatus.Payments]: [EventStatus.Ready],
  [EventStatus.Ready]: [EventStatus.LiveEvent],
  [EventStatus.LiveEvent]: [EventStatus.Completed],
  [EventStatus.Completed]: [EventStatus.Archived],
  [EventStatus.Cancelled]: [EventStatus.Archived],
};

/** States from which an event may still be cancelled (everything active). */
const CANCELLABLE: readonly EventStatus[] = [
  EventStatus.Draft,
  EventStatus.Planning,
  EventStatus.VenueReserved,
  EventStatus.VendorConfirmed,
  EventStatus.InvitationsSent,
  EventStatus.RsvpCollection,
  EventStatus.Payments,
  EventStatus.Ready,
  EventStatus.LiveEvent,
];

export function isEventStatus(value: unknown): value is EventStatus {
  return typeof value === 'string' && (Object.values(EventStatus) as string[]).includes(value);
}

/** The set of states reachable from `from` in one transition. */
export function allowedTransitions(from: EventStatus): EventStatus[] {
  const forward = FORWARD[from] ?? [];
  const canCancel = CANCELLABLE.includes(from) ? [EventStatus.Cancelled] : [];
  return [...forward, ...canCancel];
}

export function canTransition(from: EventStatus, to: EventStatus): boolean {
  return allowedTransitions(from).includes(to);
}

/** Archived events are read-only (EOS-002-P3-Part-04 §24). */
export function isReadOnly(status: EventStatus): boolean {
  return status === EventStatus.Archived;
}

/** Event names are editable only until completion (EOS-002-P3-Part-04 §24). */
export function isNameEditable(status: EventStatus): boolean {
  return (
    status !== EventStatus.Completed &&
    status !== EventStatus.Archived &&
    status !== EventStatus.Cancelled
  );
}
