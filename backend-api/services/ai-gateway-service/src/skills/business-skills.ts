import { calculateReadiness } from '../domain/readiness.js';
import type { Skill, SkillContext, SkillResult } from '../domain/skill.js';
import type { ServiceHttp } from './http-client.js';

/**
 * Sprint-4 business skills (EOS-005-P5 §6 "business"). Each is deterministic, declares
 * its contract, and acts with the caller's own authorization. Registered in the
 * SkillRegistry at composition time.
 */

/** Hyderabad city centre — default search origin until user location lands. */
const DEFAULT_ORIGIN = { latitude: 17.385, longitude: 78.4867, radiusKm: 10 };

function ok(data: unknown, source: string): SkillResult {
  return { ok: true, data, source };
}

export function searchVenuesSkill(http: ServiceHttp): Skill {
  return {
    definition: {
      skillId: 'skill.search_venues',
      name: 'Search venues',
      category: 'business',
      description: 'Ranked venue search around the event city (venue-service).',
      version: 1,
      status: 'active',
      inputSchema: { message: 'string' },
      outputSchema: { items: 'RankedVenue[]' },
      permissions: ['venue.read'],
    },
    async execute(_input, context: SkillContext): Promise<SkillResult> {
      const data = await http.post('/api/v1/venues/search', context.bearerToken, {
        ...DEFAULT_ORIGIN,
        limit: 5,
      });
      return ok(data, 'venue-service ranked search (top 5, 10 km around Hyderabad)');
    },
  };
}

export function searchVendorsSkill(http: ServiceHttp): Skill {
  return {
    definition: {
      skillId: 'skill.search_vendors',
      name: 'Search vendors',
      category: 'business',
      description: 'Ranked vendor search with trust scores (vendor-service).',
      version: 1,
      status: 'active',
      inputSchema: { message: 'string' },
      outputSchema: { items: 'RankedVendor[]' },
      permissions: ['vendor.read'],
    },
    async execute(input, context): Promise<SkillResult> {
      const message = String(input.message ?? '').toLowerCase();
      const category = message.includes('cater')
        ? 'Catering'
        : message.includes('photo')
          ? 'Photography'
          : message.includes('decor')
            ? 'Decoration'
            : undefined;
      const data = await http.post('/api/v1/vendors/search', context.bearerToken, {
        ...DEFAULT_ORIGIN,
        ...(category ? { category } : {}),
        limit: 5,
      });
      return ok(data, `vendor-service ranked search${category ? ` (${category})` : ''}`);
    },
  };
}

export function listMyEventsSkill(http: ServiceHttp): Skill {
  return {
    definition: {
      skillId: 'skill.list_my_events',
      name: 'List my events',
      category: 'business',
      description: "The caller's events (event-service).",
      version: 1,
      status: 'active',
      inputSchema: {},
      outputSchema: { items: 'Event[]' },
      permissions: ['event.read'],
    },
    async execute(_input, context): Promise<SkillResult> {
      const data = await http.get('/api/v1/events?limit=10', context.bearerToken);
      return ok(data, 'event-service (your events)');
    },
  };
}

/** Budget allocation defaults (EOS-002-P3-Part-04 §10) — configurable master data. */
export const DEFAULT_BUDGET_ALLOCATIONS = [
  { category: 'Venue', percentage: 40 },
  { category: 'Food', percentage: 30 },
  { category: 'Decoration', percentage: 10 },
  { category: 'Photography', percentage: 8 },
  { category: 'Entertainment', percentage: 5 },
  { category: 'Invitations', percentage: 2 },
  { category: 'Miscellaneous', percentage: 5 },
] as const;

export function budgetAllocationSkill(): Skill {
  return {
    definition: {
      skillId: 'skill.budget_allocation',
      name: 'Budget allocation',
      category: 'business',
      description: 'Recommended budget split across categories (Part-04 §10 defaults).',
      version: 1,
      status: 'active',
      inputSchema: { message: 'string' },
      outputSchema: { allocations: 'Allocation[]' },
      permissions: [],
    },
    async execute(input): Promise<SkillResult> {
      // If the user mentioned an amount, translate percentages into rupees.
      const match = /(\d[\d,]{2,})/.exec(String(input.message ?? '').replace(/[₹\s]/g, ''));
      const total = match ? Number(match[1]!.replace(/,/g, '')) : undefined;
      const allocations = DEFAULT_BUDGET_ALLOCATIONS.map((a) => ({
        ...a,
        ...(total ? { amount: Math.round((total * a.percentage) / 100) } : {}),
      }));
      return ok({ total, allocations }, 'HiLo budget master data (Part-04 §10 defaults)');
    },
  };
}

/** Category-aware planning checklist (EOS-002-P3-Part-07 §13 "Planning checklist"). */
export function generateChecklistSkill(): Skill {
  return {
    definition: {
      skillId: 'skill.generate_checklist',
      name: 'Generate checklist',
      category: 'business',
      description: 'Planning checklist tailored to the event type.',
      version: 1,
      status: 'active',
      inputSchema: { message: 'string' },
      outputSchema: { items: 'string[]' },
      permissions: [],
    },
    async execute(input): Promise<SkillResult> {
      const message = String(input.message ?? '').toLowerCase();
      const base = [
        'Confirm date, time, and guest count',
        'Set the total budget and split it by category',
        'Shortlist and reserve a venue',
        'Book catering and confirm the menu',
        'Arrange decoration and theme',
        'Send invitations and track RSVPs',
        'Plan the day-of timeline',
      ];
      const extras = message.includes('wedding')
        ? [
            'Book photographer & videographer',
            'Arrange mehndi/sangeet vendors',
            'Plan guest accommodation & transport',
          ]
        : message.includes('birthday')
          ? ['Order the cake', 'Plan games or entertainment', 'Prepare return gifts']
          : message.includes('corporate') || message.includes('conference')
            ? [
                'Arrange AV and projection',
                'Prepare agenda & speaker list',
                'Plan badges and registration desk',
              ]
            : [];
      return ok({ items: [...base, ...extras] }, 'HiLo planning templates');
    },
  };
}

/** Fetch the event + budget and compute the Readiness Score (Part-07 §19). */
export function readinessScoreSkill(http: ServiceHttp): Skill {
  return {
    definition: {
      skillId: 'skill.readiness_score',
      name: 'Event readiness score',
      category: 'business',
      description: '0–100 readiness with an explainable factor breakdown.',
      version: 1,
      status: 'active',
      inputSchema: { eventId: 'string' },
      outputSchema: { score: 'number', factors: 'Factor[]' },
      permissions: ['event.read'],
    },
    async execute(input, context): Promise<SkillResult> {
      const eventId = String(input.eventId ?? context.eventId ?? '');
      const event = (await http.get(`/api/v1/events/${eventId}`, context.bearerToken)) as {
        status?: string;
        venueId?: string;
        budgetId?: string;
        guestCount?: number;
        eventDate?: string;
        title?: string;
      };
      const eventDate = event.eventDate ? new Date(event.eventDate) : null;
      const daysUntilEvent =
        eventDate === null || Number.isNaN(eventDate.getTime())
          ? null
          : Math.floor((eventDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000));

      const result = calculateReadiness({
        status: event.status ?? 'draft',
        hasVenue: Boolean(event.venueId),
        hasBudget: Boolean(event.budgetId),
        budgetHealth: 1,
        guestCount: event.guestCount ?? 0,
        daysUntilEvent,
      });
      return ok({ title: event.title, ...result }, 'event-service data + HiLo readiness model');
    },
  };
}
