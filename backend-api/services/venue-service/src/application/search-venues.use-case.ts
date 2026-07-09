import { haversineKm } from '../domain/geo.js';
import type { LocationService } from '../domain/location-service.js';
import { DEFAULT_RANKING_WEIGHTS, scoreVenue, type RankingWeights } from '../domain/ranking.js';
import { matchesFilters, type RankedVenue, type VenueSearchRequest } from '../domain/search.js';
import type { Venue } from '../domain/venue.js';
import type { VenueRepository } from '../domain/venue-repository.js';

/**
 * Venue search (EOS-002-P3-Part-05 §7, §14): merge HiLo catalogue + Location Service
 * (Google) results, compute distance, apply hard filters + radius, rank, and return the
 * top matches with an explainable score breakdown. Ranking weights are configurable.
 */
export class SearchVenuesUseCase {
  constructor(
    private readonly venues: VenueRepository,
    private readonly location: LocationService,
    private readonly weights: RankingWeights = DEFAULT_RANKING_WEIGHTS,
  ) {}

  async execute(request: VenueSearchRequest): Promise<RankedVenue[]> {
    const [catalogue, nearby] = await Promise.all([
      this.venues.listCatalogue(),
      this.location.searchNearby({
        latitude: request.latitude,
        longitude: request.longitude,
        radiusKm: request.radiusKm,
        categories: request.filters?.categories,
      }),
    ]);

    const limit = request.limit ?? 20;

    return dedupe([...catalogue, ...nearby])
      .map((venue) => ({
        venue,
        distanceKm: haversineKm(
          request.latitude,
          request.longitude,
          venue.latitude,
          venue.longitude,
        ),
      }))
      .filter(
        ({ venue, distanceKm }) =>
          distanceKm <= request.radiusKm && matchesFilters(venue, request.filters),
      )
      .map(({ venue, distanceKm }): RankedVenue => {
        const { score, breakdown } = scoreVenue(
          {
            venue,
            distanceKm,
            radiusKm: request.radiusKm,
            guestCount: request.guestCount,
            budgetPerPlate: request.budgetPerPlate,
            preferredAmenities: request.preferredAmenities,
          },
          this.weights,
        );
        return { venue, distanceKm, score, breakdown };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }
}

/** Merge sources, keyed by Google place id (or venue id); prefer the HiLo catalogue entry. */
function dedupe(venues: Venue[]): Venue[] {
  const byKey = new Map<string, Venue>();
  for (const venue of venues) {
    const key = venue.googlePlaceId ?? venue.id;
    const existing = byKey.get(key);
    if (!existing || (existing.source === 'google' && venue.source === 'hilo')) {
      byKey.set(key, venue);
    }
  }
  return [...byKey.values()];
}
