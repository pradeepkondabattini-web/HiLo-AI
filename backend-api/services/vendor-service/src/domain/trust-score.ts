import { clamp01 } from '@hilo/backend-shared';
import { VerificationLevel, type Vendor } from './vendor.js';

/**
 * HiLo Marketplace Trust Score (EOS-002-P3-Part-06 §18). Proprietary, 0–1, calculated
 * internally from marketplace behaviour and recalculated on a schedule (§24). Pure — the
 * scheduled recalculation job feeds vendors through this function.
 */
export interface TrustSignals {
  /** Bookings completed through HiLo. */
  verifiedBookings?: number;
  /** 0–1 average customer satisfaction. */
  customerSatisfaction?: number;
  /** Complaints per 100 bookings. */
  complaintRate?: number;
  /** 0–1 profile completeness (photos, pricing, availability filled in). */
  profileCompleteness?: number;
}

export interface TrustScoreWeights {
  rating: number;
  bookings: number;
  satisfaction: number;
  repeat: number;
  cancellations: number;
  complaints: number;
  responseTime: number;
  profile: number;
  verification: number;
}

export const DEFAULT_TRUST_WEIGHTS: TrustScoreWeights = {
  rating: 0.2,
  bookings: 0.15,
  satisfaction: 0.15,
  repeat: 0.1,
  cancellations: 0.1,
  complaints: 0.1,
  responseTime: 0.05,
  profile: 0.05,
  verification: 0.1,
};

/** Booking volume saturates at 50 verified bookings. */
function bookingsFactor(count?: number): number {
  if (count === undefined || count <= 0) return 0;
  return clamp01(count / 50);
}

export function calculateTrustScore(
  vendor: Vendor,
  signals: TrustSignals = {},
  weights: TrustScoreWeights = DEFAULT_TRUST_WEIGHTS,
): number {
  const factors: Record<keyof TrustScoreWeights, number> = {
    rating: clamp01(vendor.rating / 5),
    bookings: bookingsFactor(signals.verifiedBookings),
    satisfaction: clamp01(signals.customerSatisfaction ?? 0.5),
    repeat: clamp01(vendor.repeatBookingRate ?? 0.3),
    cancellations: clamp01(1 - (vendor.cancellationRate ?? 0.1)),
    complaints: clamp01(1 - (signals.complaintRate ?? 2) / 20),
    responseTime:
      vendor.responseTimeHours === undefined
        ? 0.5
        : clamp01(1 - Math.max(0, vendor.responseTimeHours - 1) / 47),
    profile: clamp01(signals.profileCompleteness ?? 0.5),
    verification: clamp01(vendor.verificationLevel / VerificationLevel.HiLoVerifiedPartner),
  };

  const score = (Object.keys(factors) as (keyof TrustScoreWeights)[]).reduce(
    (sum, key) => sum + factors[key] * weights[key],
    0,
  );
  return clamp01(score);
}
