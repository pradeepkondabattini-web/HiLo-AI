import { describe, it, expect } from 'vitest';
import { createDocumentMetadata, DocumentStatus } from '@hilo/backend-shared';
import { canTransitionQuote, QuoteStatus } from '../src/domain/quote.js';
import { calculateTrustScore } from '../src/domain/trust-score.js';
import { DEFAULT_VENDOR_WEIGHTS, scoreVendor } from '../src/domain/vendor-score.js';
import { VerificationLevel, type Vendor } from '../src/domain/vendor.js';

function vendor(overrides: Partial<Vendor> = {}): Vendor {
  return {
    ...createDocumentMetadata({
      id: 'v',
      actorId: 'seed',
      status: DocumentStatus.Active,
      now: new Date('2026-07-01T00:00:00.000Z'),
    }),
    ownerUid: 'o',
    businessName: 'V',
    category: 'Catering',
    city: 'Hyderabad',
    latitude: 17.4,
    longitude: 78.45,
    serviceRadiusKm: 10,
    startingPrice: 500,
    rating: 4.5,
    verificationLevel: VerificationLevel.DocumentsVerified,
    trustScore: 0.85,
    reviewSentiment: 0.8,
    responseTimeHours: 2,
    cancellationRate: 0.03,
    repeatBookingRate: 0.5,
    availabilityScore: 0.7,
    portfolio: [],
    ...overrides,
  };
}

describe('DEFAULT_VENDOR_WEIGHTS', () => {
  it('sum to 1 (EOS-002-P3-Part-06 §9)', () => {
    const sum = Object.values(DEFAULT_VENDOR_WEIGHTS).reduce((a, b) => a + b, 0);
    expect(sum).toBeCloseTo(1, 6);
  });
});

describe('scoreVendor', () => {
  it('scores a strong nearby vendor highly with a full breakdown', () => {
    const { score, breakdown } = scoreVendor({
      vendor: vendor(),
      distanceKm: 2,
      radiusKm: 10,
      budget: 600,
    });
    expect(score).toBeGreaterThan(0.75);
    expect(breakdown.budget).toBe(1);
    expect(Object.keys(breakdown)).toHaveLength(9);
    expect(Object.values(breakdown).every((v) => v >= 0 && v <= 1)).toBe(true);
  });

  it('penalizes over-budget and high-cancellation vendors', () => {
    const good = scoreVendor({ vendor: vendor(), distanceKm: 2, radiusKm: 10, budget: 600 });
    const bad = scoreVendor({
      vendor: vendor({ startingPrice: 2000, cancellationRate: 0.4 }),
      distanceKm: 2,
      radiusKm: 10,
      budget: 600,
    });
    expect(bad.score).toBeLessThan(good.score);
    expect(bad.breakdown.cancellationRate).toBeCloseTo(0.6, 5);
  });
});

describe('calculateTrustScore', () => {
  it('is higher for verified partners with strong signals', () => {
    const strong = calculateTrustScore(vendor(), {
      verifiedBookings: 50,
      customerSatisfaction: 0.95,
      complaintRate: 0,
      profileCompleteness: 1,
    });
    const weak = calculateTrustScore(
      vendor({ verificationLevel: VerificationLevel.None, rating: 2.5, cancellationRate: 0.3 }),
      {
        verifiedBookings: 1,
        customerSatisfaction: 0.3,
        complaintRate: 15,
        profileCompleteness: 0.2,
      },
    );
    expect(strong).toBeGreaterThan(0.8);
    expect(weak).toBeLessThan(0.4);
    expect(strong).toBeLessThanOrEqual(1);
  });
});

describe('quote state machine', () => {
  it('vendor submits a requested quote; requester cannot', () => {
    expect(canTransitionQuote(QuoteStatus.Requested, QuoteStatus.Submitted, 'vendor')).toBe(true);
    expect(canTransitionQuote(QuoteStatus.Requested, QuoteStatus.Submitted, 'requester')).toBe(
      false,
    );
  });

  it('only the requester can accept', () => {
    expect(canTransitionQuote(QuoteStatus.Submitted, QuoteStatus.Accepted, 'requester')).toBe(true);
    expect(canTransitionQuote(QuoteStatus.Submitted, QuoteStatus.Accepted, 'vendor')).toBe(false);
  });

  it('terminal states allow no transitions', () => {
    for (const from of [QuoteStatus.Accepted, QuoteStatus.Declined, QuoteStatus.Expired]) {
      for (const to of Object.values(QuoteStatus)) {
        expect(canTransitionQuote(from, to, 'requester')).toBe(false);
        expect(canTransitionQuote(from, to, 'vendor')).toBe(false);
        expect(canTransitionQuote(from, to, 'system')).toBe(false);
      }
    }
  });

  it('only the system can expire', () => {
    expect(canTransitionQuote(QuoteStatus.Requested, QuoteStatus.Expired, 'system')).toBe(true);
    expect(canTransitionQuote(QuoteStatus.Requested, QuoteStatus.Expired, 'vendor')).toBe(false);
  });
});
