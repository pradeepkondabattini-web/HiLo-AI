/// Event lifecycle states (EOS-002-P3-Part-04 §7). Wire values match the event-service.
enum EventStatus {
  draft,
  planning,
  venueReserved,
  vendorConfirmed,
  invitationsSent,
  rsvpCollection,
  payments,
  ready,
  liveEvent,
  completed,
  archived,
  cancelled;

  /// Backend wire value (snake_case).
  String get wire => switch (this) {
    EventStatus.draft => 'draft',
    EventStatus.planning => 'planning',
    EventStatus.venueReserved => 'venue_reserved',
    EventStatus.vendorConfirmed => 'vendor_confirmed',
    EventStatus.invitationsSent => 'invitations_sent',
    EventStatus.rsvpCollection => 'rsvp_collection',
    EventStatus.payments => 'payments',
    EventStatus.ready => 'ready',
    EventStatus.liveEvent => 'live_event',
    EventStatus.completed => 'completed',
    EventStatus.archived => 'archived',
    EventStatus.cancelled => 'cancelled',
  };

  String get label => switch (this) {
    EventStatus.draft => 'Draft',
    EventStatus.planning => 'Planning',
    EventStatus.venueReserved => 'Venue reserved',
    EventStatus.vendorConfirmed => 'Vendor confirmed',
    EventStatus.invitationsSent => 'Invitations sent',
    EventStatus.rsvpCollection => 'Collecting RSVPs',
    EventStatus.payments => 'Payments',
    EventStatus.ready => 'Ready',
    EventStatus.liveEvent => 'Live',
    EventStatus.completed => 'Completed',
    EventStatus.archived => 'Archived',
    EventStatus.cancelled => 'Cancelled',
  };

  static EventStatus fromWire(String value) => switch (value) {
    'draft' => EventStatus.draft,
    'planning' => EventStatus.planning,
    'venue_reserved' => EventStatus.venueReserved,
    'vendor_confirmed' => EventStatus.vendorConfirmed,
    'invitations_sent' => EventStatus.invitationsSent,
    'rsvp_collection' => EventStatus.rsvpCollection,
    'payments' => EventStatus.payments,
    'ready' => EventStatus.ready,
    'live_event' => EventStatus.liveEvent,
    'completed' => EventStatus.completed,
    'archived' => EventStatus.archived,
    'cancelled' => EventStatus.cancelled,
    _ => EventStatus.draft,
  };
}
