import { describe, it, expect } from 'vitest';
import { buildPlan, classifyIntent } from '../src/domain/planning-engine.js';
import { calculateReadiness } from '../src/domain/readiness.js';

describe('classifyIntent (Part-07 §8)', () => {
  it.each([
    ['find me a banquet hall near Hitech City', 'search_venue'],
    ['I need a caterer for 200 guests', 'search_vendor'],
    ['how should I allocate my budget of 2 lakh', 'manage_budget'],
    ['give me a checklist for a wedding', 'generate_checklist'],
    ['am I ready for the party?', 'readiness'],
    ['show my events', 'list_events'],
    ['I want to plan a birthday party', 'create_event'],
  ])('"%s" → %s', (message, intent) => {
    expect(classifyIntent(message).intent).toBe(intent);
  });

  it('unknown input → general_help with low confidence', () => {
    const result = classifyIntent('what is the weather like');
    expect(result.intent).toBe('general_help');
    expect(result.confidence).toBe('low');
  });

  it('multiple intents in one message → medium confidence', () => {
    expect(classifyIntent('find a venue and a caterer').confidence).toBe('medium');
  });
});

describe('buildPlan', () => {
  it('search_venue plans skill then reasoning', () => {
    const plan = buildPlan('find me a venue');
    expect(plan.steps.map((s) => s.kind)).toEqual(['skill', 'llm']);
    expect(plan.steps[0]!.ref).toBe('skill.search_venues');
  });

  it('readiness without an event asks for clarification instead of guessing (§20)', () => {
    const plan = buildPlan('am I ready?');
    expect(plan.confidence).toBe('low');
    expect(plan.clarification).toBeTruthy();
    expect(plan.steps).toHaveLength(0);
  });

  it('readiness with an event runs the readiness skill', () => {
    const plan = buildPlan('am I ready?', 'evt1');
    expect(plan.steps[0]).toMatchObject({ kind: 'skill', ref: 'skill.readiness_score' });
  });

  it('create_event is reasoning-only — AI proposes, the user acts (§24)', () => {
    const plan = buildPlan('create event for my anniversary');
    expect(plan.steps).toHaveLength(1);
    expect(plan.steps[0]!.kind).toBe('llm');
  });
});

describe('calculateReadiness (Part-07 §19)', () => {
  it('scores a well-prepared event highly with a factor breakdown', () => {
    const result = calculateReadiness({
      status: 'ready',
      hasVenue: true,
      hasBudget: true,
      budgetHealth: 1,
      guestCount: 100,
      daysUntilEvent: 10,
    });
    expect(result.score).toBe(100);
    expect(result.factors).toHaveLength(5);
    expect(result.factors.every((f) => f.earned <= f.max)).toBe(true);
  });

  it('scores a bare draft low', () => {
    const result = calculateReadiness({
      status: 'draft',
      hasVenue: false,
      hasBudget: false,
      budgetHealth: 0,
      guestCount: 0,
      daysUntilEvent: null,
    });
    expect(result.score).toBeLessThan(20);
  });

  it('cancelled events earn no lifecycle points', () => {
    const cancelled = calculateReadiness({
      status: 'cancelled',
      hasVenue: true,
      hasBudget: true,
      budgetHealth: 1,
      guestCount: 10,
      daysUntilEvent: 5,
    });
    expect(cancelled.factors[0]!.earned).toBe(0);
  });
});
