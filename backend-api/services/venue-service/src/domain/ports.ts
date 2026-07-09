/** Injected clock — keeps time deterministic in tests. */
export interface Clock {
  now(): Date;
}

export const systemClock: Clock = { now: () => new Date() };
