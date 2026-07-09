import { clamp01 } from '@hilo/backend-shared';
import type { Vendor } from './vendor.js';

/**
 * Vendor Intelligence Score (EOS-002-P3-Part-06 §9). A configurable weighted blend with an
 * explainable per-factor breakdown (§24 — recommendations always explain). Pure — no I/O.
 * Default weights are the bible's; they sum to 1.
 */
export interface VendorScoreWeights {
  budget: number;
  distance: number;
  rating: number;
  trustScore: number;
  availability: number;
  sentiment: number;
  responseTime: number;
  cancellationRate: number;
  repeatBookingRate: number;
}

export const DEFAULT_VENDOR_WEIGHTS: VendorScoreWeights = {
  budget: 0.2,
  distance: 0.15,
  rating: 0.15,
  trustScore: 0.15,
  availability: 0.1,
  sentiment: 0.1,
  responseTime: 0.05,
  cancellationRate: 0.05,
  repeatBookingRate: 0.05,
};

export type VendorScoreBreakdown = Record<keyof VendorScoreWeights, number>;

export interface VendorScoreInput {
  vendor: Vendor;
  distanceKm: number;
  radiusKm: number;
  /** User's budget for this category, INR (optional signal). */
  budget?: number;
}

export interface VendorScoreResult {
  score: number;
  breakdown: VendorScoreBreakdown;
}

function budgetFactor(vendor: Vendor, budget?: number): number {
  if (budget === undefined || budget <= 0) return 0.5; // neutral, no signal
  const price = vendor.startingPrice;
  if (price === undefined || price <= 0) return 0.5;
  if (price <= budget) return 1;
  return clamp01(1 - (price - budget) / budget);
}

/** Response time: ≤1h → 1; decays linearly to 0 at 48h. */
function responseTimeFactor(hours?: number): number {
  if (hours === undefined) return 0.5;
  if (hours <= 1) return 1;
  return clamp01(1 - (hours - 1) / 47);
}

export function scoreVendor(
  input: VendorScoreInput,
  weights: VendorScoreWeights = DEFAULT_VENDOR_WEIGHTS,
): VendorScoreResult {
  const { vendor, distanceKm, radiusKm, budget } = input;

  const breakdown: VendorScoreBreakdown = {
    budget: budgetFactor(vendor, budget),
    distance: clamp01(radiusKm > 0 ? 1 - distanceKm / radiusKm : 0),
    rating: clamp01(vendor.rating / 5),
    trustScore: clamp01(vendor.trustScore ?? 0.5),
    availability: clamp01(vendor.availabilityScore ?? 0.5),
    sentiment: clamp01(vendor.reviewSentiment ?? vendor.rating / 5),
    responseTime: responseTimeFactor(vendor.responseTimeHours),
    cancellationRate: clamp01(1 - (vendor.cancellationRate ?? 0.1)),
    repeatBookingRate: clamp01(vendor.repeatBookingRate ?? 0.3),
  };

  const score = (Object.keys(breakdown) as (keyof VendorScoreWeights)[]).reduce(
    (sum, key) => sum + breakdown[key] * weights[key],
    0,
  );

  return { score: clamp01(score), breakdown };
}
