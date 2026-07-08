import { describe, it, expect } from 'vitest';
import {
  EventStatus,
  allowedTransitions,
  canTransition,
  isNameEditable,
  isReadOnly,
} from '../src/domain/event-status.js';

describe('event lifecycle state machine', () => {
  it('allows the forward pipeline step and cancellation from active states', () => {
    expect(canTransition(EventStatus.Draft, EventStatus.Planning)).toBe(true);
    expect(canTransition(EventStatus.Draft, EventStatus.Cancelled)).toBe(true);
    expect(canTransition(EventStatus.Ready, EventStatus.LiveEvent)).toBe(true);
    expect(canTransition(EventStatus.Completed, EventStatus.Archived)).toBe(true);
    expect(canTransition(EventStatus.Cancelled, EventStatus.Archived)).toBe(true);
  });

  it('rejects skipping states and going backwards', () => {
    expect(canTransition(EventStatus.Draft, EventStatus.Ready)).toBe(false);
    expect(canTransition(EventStatus.Planning, EventStatus.Draft)).toBe(false);
    expect(canTransition(EventStatus.Completed, EventStatus.Cancelled)).toBe(false);
  });

  it('treats archived as terminal and read-only', () => {
    expect(allowedTransitions(EventStatus.Archived)).toEqual([]);
    expect(isReadOnly(EventStatus.Archived)).toBe(true);
    expect(isReadOnly(EventStatus.Planning)).toBe(false);
  });

  it('allows name edits only until completion', () => {
    expect(isNameEditable(EventStatus.Planning)).toBe(true);
    expect(isNameEditable(EventStatus.Completed)).toBe(false);
    expect(isNameEditable(EventStatus.Cancelled)).toBe(false);
    expect(isNameEditable(EventStatus.Archived)).toBe(false);
  });
});
