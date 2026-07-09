import { haversineKm } from '@hilo/backend-shared';
import type { VendorRepository } from '../domain/repositories.js';
import {
  DEFAULT_VENDOR_WEIGHTS,
  scoreVendor,
  type VendorScoreBreakdown,
  type VendorScoreWeights,
} from '../domain/vendor-score.js';
import type { Vendor } from '../domain/vendor.js';

/** Default hyperlocal radius, km (EOS-002-P3-Part-06 §10). */
export const DEFAULT_VENDOR_RADIUS_KM = 10;

export interface VendorSearchRequest {
  latitude: number;
  longitude: number;
  radiusKm: number;
  category?: string;
  city?: string;
  budget?: number;
  minVerificationLevel?: number;
  limit?: number;
}

export interface RankedVendor {
  vendor: Vendor;
  distanceKm: number;
  score: number;
  breakdown: VendorScoreBreakdown;
}

/**
 * Ranked vendor search (EOS-002-P3-Part-06 §4, §9–10): hyperlocal filter (a vendor matches
 * if within the search radius OR the venue is within the vendor's own service radius),
 * then the Vendor Intelligence Score with an explainable breakdown.
 */
export class SearchVendorsUseCase {
  constructor(
    private readonly vendors: VendorRepository,
    private readonly weights: VendorScoreWeights = DEFAULT_VENDOR_WEIGHTS,
  ) {}

  async execute(request: VendorSearchRequest): Promise<RankedVendor[]> {
    const candidates = await this.vendors.list({
      category: request.category,
      city: request.city,
    });
    const limit = request.limit ?? 20;
    const minLevel = request.minVerificationLevel ?? 0;

    return candidates
      .filter((vendor) => !vendor.deleted && vendor.verificationLevel >= minLevel)
      .map((vendor) => ({
        vendor,
        distanceKm: haversineKm(
          request.latitude,
          request.longitude,
          vendor.latitude,
          vendor.longitude,
        ),
      }))
      .filter(
        ({ vendor, distanceKm }) =>
          distanceKm <= Math.max(request.radiusKm, vendor.serviceRadiusKm),
      )
      .map(({ vendor, distanceKm }): RankedVendor => {
        const { score, breakdown } = scoreVendor(
          { vendor, distanceKm, radiusKm: request.radiusKm, budget: request.budget },
          this.weights,
        );
        return { vendor, distanceKm, score, breakdown };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }
}
