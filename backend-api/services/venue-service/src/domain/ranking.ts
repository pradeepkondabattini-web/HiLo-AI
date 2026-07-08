import type { Venue } from './venue.js';

/**
 * Venue ranking algorithm (EOS-002-P3-Part-05 §14). Produces a 0–1 recommendation score
 * from a weighted blend of factors, plus a per-factor breakdown for explainability
 * (§13 "Explanation for ranking"). Pure and deterministic — no I/O.
 *
 * Weights are configurable; the defaults are the bible's. They should sum to 1.
 */
export interface RankingWeights {
  budget: number;
  capacity: number;
  distance: number;
  rating: number;
  trustScore: number;
  sentiment: number;
  amenities: number;
  preferences: number;
}

export const DEFAULT_RANKING_WEIGHTS: RankingWeights = {
  budget: 0.25,
  capacity: 0.2,
  distance: 0.15,
  rating: 0.15,
  trustScore: 0.1,
  sentiment: 0.05,
  amenities: 0.05,
  preferences: 0.05,
};

/** Raw 0–1 score for each factor (before weighting). */
export type RankingBreakdown = Record<keyof RankingWeights, number>;

export interface RankingInput {
  venue: Venue;
  distanceKm: number;
  radiusKm: number;
  guestCount: number;
  /** Event budget per plate (INR), if known. */
  budgetPerPlate?: number;
  /** Amenities the user prefers (soft signal). */
  preferredAmenities?: string[];
}

export interface RankingResult {
  score: number;
  breakdown: RankingBreakdown;
}

function clamp01(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(1, value));
}

function capacityFactor(capacity: number, guestCount: number): number {
  if (capacity <= 0 || guestCount <= 0) return 0;
  if (capacity >= guestCount) {
    // Best when the venue fits the party closely; a much larger hall scores lower.
    return clamp01(0.6 + 0.4 * (guestCount / capacity));
  }
  // Undersized venues are penalized (can't comfortably host the party).
  return clamp01(0.4 * (capacity / guestCount));
}

function budgetFactor(venue: Venue, budgetPerPlate?: number): number {
  if (budgetPerPlate === undefined || budgetPerPlate <= 0) return 0.5; // neutral, no signal
  const price = venue.pricePerPlate;
  if (price === undefined || price <= 0) return 0.5;
  if (price <= budgetPerPlate) return 1; // within budget
  return clamp01(1 - (price - budgetPerPlate) / budgetPerPlate); // over budget → decays
}

function amenitiesFactor(venue: Venue, preferred?: string[]): number {
  if (!preferred || preferred.length === 0) return 0.5; // neutral, no signal
  const have = new Set(venue.amenities.map((a) => a.toLowerCase()));
  const matched = preferred.filter((a) => have.has(a.toLowerCase())).length;
  return clamp01(matched / preferred.length);
}

export function scoreVenue(
  input: RankingInput,
  weights: RankingWeights = DEFAULT_RANKING_WEIGHTS,
): RankingResult {
  const { venue, distanceKm, radiusKm, guestCount, budgetPerPlate, preferredAmenities } = input;

  const breakdown: RankingBreakdown = {
    budget: budgetFactor(venue, budgetPerPlate),
    capacity: capacityFactor(venue.capacity, guestCount),
    distance: clamp01(radiusKm > 0 ? 1 - distanceKm / radiusKm : 0),
    rating: clamp01(venue.rating / 5),
    trustScore: clamp01(venue.trustScore ?? 0.5),
    sentiment: clamp01(venue.reviewSentiment ?? venue.rating / 5),
    amenities: amenitiesFactor(venue, preferredAmenities),
    preferences: 0.5, // placeholder until user-preference signals land (Sprint 4 AI)
  };

  const score =
    breakdown.budget * weights.budget +
    breakdown.capacity * weights.capacity +
    breakdown.distance * weights.distance +
    breakdown.rating * weights.rating +
    breakdown.trustScore * weights.trustScore +
    breakdown.sentiment * weights.sentiment +
    breakdown.amenities * weights.amenities +
    breakdown.preferences * weights.preferences;

  return { score: clamp01(score), breakdown };
}
