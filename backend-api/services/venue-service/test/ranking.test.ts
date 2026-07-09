import { describe, it, expect } from 'vitest';
import { DEFAULT_RANKING_WEIGHTS, scoreVenue, type RankingInput } from '../src/domain/ranking.js';
import type { Venue } from '../src/domain/venue.js';

function venue(overrides: Partial<Venue> = {}): Venue {
  return {
    id: 'v',
    source: 'hilo',
    name: 'V',
    address: 'A',
    latitude: 17.4,
    longitude: 78.45,
    capacity: 200,
    rating: 4.5,
    amenities: ['parking', 'ac'],
    photos: [],
    verified: true,
    trustScore: 0.9,
    reviewSentiment: 0.85,
    pricePerPlate: 1000,
    ...overrides,
  };
}

function input(overrides: Partial<RankingInput> = {}): RankingInput {
  return {
    venue: venue(),
    distanceKm: 2,
    radiusKm: 10,
    guestCount: 150,
    budgetPerPlate: 1500,
    preferredAmenities: ['parking', 'ac'],
    ...overrides,
  };
}

describe('DEFAULT_RANKING_WEIGHTS', () => {
  it('sum to 1 (EOS-002-P3-Part-05 §14)', () => {
    const sum = Object.values(DEFAULT_RANKING_WEIGHTS).reduce((a, b) => a + b, 0);
    expect(sum).toBeCloseTo(1, 6);
  });
});

describe('scoreVenue', () => {
  it('scores a well-matched, affordable, close venue highly', () => {
    const { score, breakdown } = scoreVenue(input());
    expect(score).toBeGreaterThan(0.75);
    expect(breakdown.budget).toBe(1); // within budget
    expect(breakdown.amenities).toBe(1); // both preferred present
    expect(breakdown.distance).toBeCloseTo(0.8, 5); // 1 - 2/10
    expect(Object.values(breakdown).every((v) => v >= 0 && v <= 1)).toBe(true);
  });

  it('penalizes an undersized venue on capacity', () => {
    const small = scoreVenue(input({ venue: venue({ capacity: 100 }), guestCount: 200 }));
    expect(small.breakdown.capacity).toBeCloseTo(0.2, 5); // 0.4 * (100/200)
    const fits = scoreVenue(input({ guestCount: 150 }));
    expect(fits.score).toBeGreaterThan(small.score);
  });

  it('penalizes over-budget venues', () => {
    const overBudget = scoreVenue(
      input({ venue: venue({ pricePerPlate: 3000 }), budgetPerPlate: 1500 }),
    );
    expect(overBudget.breakdown.budget).toBeCloseTo(0, 5); // 1 - (3000-1500)/1500 = 0
  });

  it('is neutral (0.5) on budget/amenities when no signal is given', () => {
    const r = scoreVenue(input({ budgetPerPlate: undefined, preferredAmenities: undefined }));
    expect(r.breakdown.budget).toBe(0.5);
    expect(r.breakdown.amenities).toBe(0.5);
  });

  it('drops distance factor to 0 at/after the radius edge', () => {
    const r = scoreVenue(input({ distanceKm: 12, radiusKm: 10 }));
    expect(r.breakdown.distance).toBe(0);
  });
});
