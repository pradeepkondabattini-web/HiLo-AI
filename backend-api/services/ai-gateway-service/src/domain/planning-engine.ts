/**
 * Planning Engine (EOS-005-P8, EOS-002-P3-Part-07 §8–9). Determines what the user wants
 * and produces an execution plan — it never performs business operations itself
 * (EOS-000 §94). MVP classification is deterministic (keyword rules): auditable, free,
 * and instant; LLM-assisted classification can replace it behind the same interface.
 *
 * Low-confidence plans ask for clarification instead of guessing (Part-07 §20).
 */
export type Intent =
  | 'create_event'
  | 'search_venue'
  | 'search_vendor'
  | 'manage_budget'
  | 'generate_checklist'
  | 'readiness'
  | 'list_events'
  | 'general_help';

export type Confidence = 'high' | 'medium' | 'low';

export interface PlanStep {
  kind: 'skill' | 'llm';
  /** Skill id for skill steps; prompt id for llm steps. */
  ref: string;
  input?: Record<string, unknown>;
}

export interface ExecutionPlan {
  intent: Intent;
  confidence: Confidence;
  steps: PlanStep[];
  /** Set when confidence is low — returned to the user instead of executing. */
  clarification?: string;
}

interface Rule {
  intent: Intent;
  /** Any of these phrases (case-insensitive) signals the intent. */
  phrases: string[];
}

/** Order matters — first match wins; more specific intents come first. */
const RULES: Rule[] = [
  { intent: 'readiness', phrases: ['readiness', 'how ready', 'am i ready', 'on track'] },
  {
    intent: 'search_venue',
    phrases: ['venue', 'hall', 'banquet', 'place to host', 'location for'],
  },
  {
    intent: 'search_vendor',
    phrases: [
      'vendor',
      'caterer',
      'catering',
      'photographer',
      'photography',
      'decorator',
      'decoration',
      'dj',
      'makeup',
    ],
  },
  {
    intent: 'manage_budget',
    phrases: ['budget', 'allocate', 'allocation', 'spend', 'cost split', 'how much should'],
  },
  {
    intent: 'generate_checklist',
    phrases: [
      'checklist',
      'to-do',
      'todo',
      'tasks',
      'what should i do',
      'plan steps',
      'planning list',
    ],
  },
  {
    intent: 'create_event',
    phrases: ['create event', 'new event', 'plan a ', 'organize a ', 'organise a ', 'host a '],
  },
  {
    intent: 'list_events',
    phrases: ['my events', 'list events', 'show events', 'upcoming events'],
  },
];

export function classifyIntent(message: string): { intent: Intent; confidence: Confidence } {
  const text = message.toLowerCase();
  const hits = RULES.filter((rule) => rule.phrases.some((p) => text.includes(p)));
  if (hits.length === 0) return { intent: 'general_help', confidence: 'low' };
  // Multiple distinct intents in one message → act on the first but flag medium confidence.
  const confidence: Confidence = hits.length === 1 ? 'high' : 'medium';
  return { intent: hits[0]!.intent, confidence };
}

/** Map an intent to the plan the orchestrator executes (skills first, reasoning last). */
export function buildPlan(message: string, eventId?: string): ExecutionPlan {
  const { intent, confidence } = classifyIntent(message);

  const reason = (promptId: string): PlanStep => ({ kind: 'llm', ref: promptId });
  const step = (ref: string, input?: Record<string, unknown>): PlanStep => ({
    kind: 'skill',
    ref,
    input,
  });

  switch (intent) {
    case 'search_venue':
      return {
        intent,
        confidence,
        steps: [step('skill.search_venues', { message }), reason('prompt.venue_recommendation')],
      };
    case 'search_vendor':
      return {
        intent,
        confidence,
        steps: [step('skill.search_vendors', { message }), reason('prompt.vendor_recommendation')],
      };
    case 'manage_budget':
      return {
        intent,
        confidence,
        steps: [step('skill.budget_allocation', { message }), reason('prompt.budget_advice')],
      };
    case 'generate_checklist':
      return {
        intent,
        confidence,
        steps: [
          step('skill.generate_checklist', { message }),
          reason('prompt.checklist_narration'),
        ],
      };
    case 'readiness':
      return {
        intent,
        confidence: eventId ? confidence : 'low',
        clarification: eventId
          ? undefined
          : 'Which event should I check? Open an event and ask again, or tell me its name.',
        steps: eventId
          ? [step('skill.readiness_score', { eventId }), reason('prompt.readiness_narration')]
          : [],
      };
    case 'list_events':
      return {
        intent,
        confidence,
        steps: [step('skill.list_my_events', {}), reason('prompt.events_summary')],
      };
    case 'create_event':
      // Event creation is a sensitive external action — AI proposes, the user acts
      // through the wizard (Part-07 §24: approval before actions).
      return { intent, confidence, steps: [reason('prompt.create_event_guidance')] };
    case 'general_help':
      return {
        intent,
        confidence,
        clarification: undefined,
        steps: [reason('prompt.general_help')],
      };
  }
}
