import type { RankingBreakdown } from './ranking.js';
import type { Venue } from './venue.js';

/** Search radius (EOS-002-P3-Part-05 §9). */
export const DEFAULT_RADIUS_KM = 10;
export const ALLOWED_RADII_KM = [2, 5, 10, 20, 50] as const;

/** Users may compare up to four venues at once (§15). */
export const MAX_COMPARE = 4;

/** Structured search filters (EOS-002-P3-Part-05 §8). */
export interface SearchFilters {
  minCapacity?: number;
  maxPricePerPlate?: number;
  minRating?: number;
  categories?: string[];
  requiredAmenities?: string[];
  indoorOnly?: boolean;
  verifiedOnly?: boolean;
}

export interface VenueSearchRequest {
  latitude: number;
  longitude: number;
  radiusKm: number;
  guestCount: number;
  budgetPerPlate?: number;
  filters?: SearchFilters;
  preferredAmenities?: string[];
  /** Max results to return after ranking. */
  limit?: number;
}

/** A venue with its computed distance, ranking score, and factor breakdown. */
export interface RankedVenue {
  venue: Venue;
  distanceKm: number;
  score: number;
  breakdown: RankingBreakdown;
}

/** Hard filters (a venue that fails these is excluded, not just ranked low). */
export function matchesFilters(venue: Venue, filters: SearchFilters | undefined): boolean {
  if (!filters) return true;
  if (filters.minCapacity !== undefined && venue.capacity < filters.minCapacity) return false;
  if (filters.verifiedOnly && !venue.verified) return false;
  if (filters.minRating !== undefined && venue.rating < filters.minRating) return false;
  if (
    filters.maxPricePerPlate !== undefined &&
    venue.pricePerPlate !== undefined &&
    venue.pricePerPlate > filters.maxPricePerPlate
  ) {
    return false;
  }
  if (filters.indoorOnly && venue.indoor === false) return false;
  if (
    filters.categories &&
    filters.categories.length > 0 &&
    (venue.category === undefined || !filters.categories.includes(venue.category))
  ) {
    return false;
  }
  if (filters.requiredAmenities && filters.requiredAmenities.length > 0) {
    const have = new Set(venue.amenities.map((a) => a.toLowerCase()));
    if (!filters.requiredAmenities.every((a) => have.has(a.toLowerCase()))) return false;
  }
  return true;
}
