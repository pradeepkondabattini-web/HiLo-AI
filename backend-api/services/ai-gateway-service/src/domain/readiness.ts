import { clamp01 } from '@hilo/backend-shared';

/**
 * AI Event Readiness Score, 0–100 (EOS-002-P3-Part-07 §19). Pure and explainable: each
 * factor contributes its weight when satisfied; the breakdown ships in the explanation
 * envelope. Factors unavailable until later sprints (RSVP, payments, catering) score
 * from lifecycle progress so early events aren't unfairly penalized.
 */
export interface ReadinessInput {
  /** Event lifecycle status (wire value). */
  status: string;
  hasVenue: boolean;
  hasBudget: boolean;
  /** 0–1 how much of the budget is allocated (defaults applied → 1). */
  budgetHealth: number;
  guestCount: number;
  daysUntilEvent: number | null;
}

export interface ReadinessFactor {
  factor: string;
  earned: number;
  max: number;
  note: string;
}

export interface ReadinessResult {
  score: number;
  factors: ReadinessFactor[];
}

/** Lifecycle progress: how far along the Part-04 §7 pipeline the event has moved. */
const STATUS_PROGRESS: Record<string, number> = {
  draft: 0.1,
  planning: 0.25,
  venue_reserved: 0.4,
  vendor_confirmed: 0.55,
  invitations_sent: 0.7,
  rsvp_collection: 0.8,
  payments: 0.9,
  ready: 1,
  live_event: 1,
  completed: 1,
  archived: 1,
  cancelled: 0,
};

export function calculateReadiness(input: ReadinessInput): ReadinessResult {
  const factors: ReadinessFactor[] = [];
  const add = (factor: string, earned: number, max: number, note: string) => {
    factors.push({ factor, earned: Math.round(earned), max, note });
  };

  const progress = STATUS_PROGRESS[input.status] ?? 0.1;
  add('Lifecycle progress', progress * 30, 30, `Event is in "${input.status}"`);
  add(
    'Venue',
    input.hasVenue ? 25 : 0,
    25,
    input.hasVenue ? 'Venue selected' : 'No venue selected yet',
  );
  add(
    'Budget',
    input.hasBudget ? clamp01(input.budgetHealth) * 25 : 0,
    25,
    input.hasBudget ? 'Budget defined' : 'No budget defined',
  );
  add(
    'Guests',
    input.guestCount > 0 ? 10 : 0,
    10,
    input.guestCount > 0 ? `${input.guestCount} guests expected` : 'Guest count missing',
  );

  const timeNote =
    input.daysUntilEvent === null
      ? 'Event date missing'
      : input.daysUntilEvent < 0
        ? 'Event date has passed'
        : `${input.daysUntilEvent} days to go`;
  const timeEarned =
    input.daysUntilEvent === null
      ? 0
      : input.daysUntilEvent >= 7
        ? 10
        : input.daysUntilEvent >= 0
          ? 5
          : 0;
  add('Runway', timeEarned, 10, timeNote);

  const score = Math.min(100, Math.round(factors.reduce((sum, f) => sum + f.earned, 0)));
  return { score, factors };
}
