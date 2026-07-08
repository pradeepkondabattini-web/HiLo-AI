import type { DocumentMetadata } from '@hilo/backend-shared';
import type { EventStatus } from './event-status.js';

/**
 * The Event aggregate root (owner: event-service). Combines the mandatory metadata
 * envelope (EOS-000 §35) with event fields (EOS-002-P3-Part-04 §5, EOS-004-P4 §6).
 *
 * The lifecycle state is carried in the metadata `status` field (values from
 * {@link EventStatus}). Ownership/membership are denormalized onto the document
 * (`ownerId`, `coHostIds`, `memberIds`) for O(1) authorization and rule-based reads
 * (EOS-000 §41 — documented denormalization).
 */
export interface Event extends DocumentMetadata {
  status: EventStatus;

  title: string;
  category: string;
  /** ISO-8601 event date. */
  eventDate: string;
  /** ISO-8601 start/end timestamps. */
  startTime?: string;
  endTime?: string;
  city: string;
  guestCount: number;

  ownerId: string;
  coHostIds: string[];
  /** All participants (owner + co-hosts + guests) — powers membership checks/reads. */
  memberIds: string[];

  budgetId?: string;
  venueId?: string;

  description?: string;
  dressCode?: string;
  themeId?: string;
  coverImage?: string;
  tags?: string[];
  notes?: string;
}

/** Whitelisted fields a co-host/owner may patch via update (never ownership/lifecycle). */
export interface EventUpdateInput {
  title?: string;
  category?: string;
  eventDate?: string;
  startTime?: string;
  endTime?: string;
  city?: string;
  guestCount?: number;
  description?: string;
  dressCode?: string;
  tags?: string[];
  notes?: string;
  venueId?: string;
}
