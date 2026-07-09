import type { DocumentMetadata } from '@hilo/backend-shared';

/**
 * Smart Quotations (EOS-002-P3-Part-06 §12). A quote is a conversation between the
 * requesting user and a vendor, progressing through a state machine. Quotes expire
 * automatically after the configured validity period (§24).
 */
export const QuoteStatus = {
  Requested: 'requested',
  Submitted: 'submitted',
  Negotiating: 'negotiating',
  Accepted: 'accepted',
  Declined: 'declined',
  Expired: 'expired',
} as const;

export type QuoteStatus = (typeof QuoteStatus)[keyof typeof QuoteStatus];

export function isQuoteStatus(value: unknown): value is QuoteStatus {
  return typeof value === 'string' && (Object.values(QuoteStatus) as string[]).includes(value);
}

/** Who may drive a given transition. */
export type QuoteActor = 'requester' | 'vendor' | 'system';

interface Transition {
  to: QuoteStatus;
  by: readonly QuoteActor[];
}

/** Allowed transitions per state (terminal: accepted/declined/expired). */
const TRANSITIONS: Partial<Record<QuoteStatus, readonly Transition[]>> = {
  [QuoteStatus.Requested]: [
    { to: QuoteStatus.Submitted, by: ['vendor'] },
    { to: QuoteStatus.Declined, by: ['vendor', 'requester'] },
    { to: QuoteStatus.Expired, by: ['system'] },
  ],
  [QuoteStatus.Submitted]: [
    { to: QuoteStatus.Negotiating, by: ['requester', 'vendor'] },
    { to: QuoteStatus.Accepted, by: ['requester'] },
    { to: QuoteStatus.Declined, by: ['requester', 'vendor'] },
    { to: QuoteStatus.Expired, by: ['system'] },
  ],
  [QuoteStatus.Negotiating]: [
    { to: QuoteStatus.Submitted, by: ['vendor'] },
    { to: QuoteStatus.Accepted, by: ['requester'] },
    { to: QuoteStatus.Declined, by: ['requester', 'vendor'] },
    { to: QuoteStatus.Expired, by: ['system'] },
  ],
};

export function canTransitionQuote(from: QuoteStatus, to: QuoteStatus, actor: QuoteActor): boolean {
  return (TRANSITIONS[from] ?? []).some((t) => t.to === to && t.by.includes(actor));
}

/** Default quote validity, days (configurable via env). */
export const DEFAULT_QUOTE_VALIDITY_DAYS = 7;

export interface Quote extends DocumentMetadata {
  vendorId: string;
  /** uid of the consumer who requested the quote. */
  requesterUid: string;
  /** uid of the business account owning the vendor (denormalized for authz). */
  vendorOwnerUid: string;
  eventId?: string;
  message?: string;
  /** Vendor's proposed amount, INR (set on submit/negotiate). */
  proposedAmount?: number;
  /** ISO timestamp after which the quote auto-expires. */
  expiresAt: string;
}
