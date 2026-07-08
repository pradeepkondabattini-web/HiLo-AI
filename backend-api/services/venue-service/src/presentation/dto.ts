import type { VenueFavourite } from '../domain/favourite.js';
import type { RankedVenue } from '../domain/search.js';
import type { Venue } from '../domain/venue.js';

function round(value: number, dp: number): number {
  const f = 10 ** dp;
  return Math.round(value * f) / f;
}

export function toVenueDto(venue: Venue) {
  return {
    id: venue.id,
    source: venue.source,
    googlePlaceId: venue.googlePlaceId,
    name: venue.name,
    address: venue.address,
    city: venue.city,
    category: venue.category,
    latitude: venue.latitude,
    longitude: venue.longitude,
    capacity: venue.capacity,
    rating: venue.rating,
    reviewCount: venue.reviewCount,
    priceLevel: venue.priceLevel,
    pricePerPlate: venue.pricePerPlate,
    amenities: venue.amenities,
    photos: venue.photos,
    verified: venue.verified,
    trustScore: venue.trustScore,
    indoor: venue.indoor,
  };
}

export function toRankedVenueDto(ranked: RankedVenue) {
  return {
    venue: toVenueDto(ranked.venue),
    distanceKm: round(ranked.distanceKm, 2),
    score: round(ranked.score, 3),
    breakdown: ranked.breakdown,
  };
}

export function toFavouriteDto(favourite: VenueFavourite) {
  return {
    id: favourite.id,
    userId: favourite.userId,
    venueId: favourite.venueId,
    eventId: favourite.eventId,
    note: favourite.note,
    createdAt: favourite.createdAt,
  };
}
