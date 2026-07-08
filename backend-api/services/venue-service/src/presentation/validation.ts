import { AppError } from '@hilo/backend-shared';
import {
  DEFAULT_RADIUS_KM,
  MAX_COMPARE,
  type SearchFilters,
  type VenueSearchRequest,
} from '../domain/search.js';

function obj(body: unknown): Record<string, unknown> {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    throw AppError.validation('Request body must be a JSON object');
  }
  return body as Record<string, unknown>;
}

function num(v: unknown, field: string, { required = false } = {}): number | undefined {
  if (v === undefined || v === null) {
    if (required) throw AppError.validation(`${field} is required`);
    return undefined;
  }
  if (typeof v !== 'number' || !Number.isFinite(v)) {
    throw AppError.validation(`${field} must be a number`);
  }
  return v;
}

function strArray(v: unknown, field: string): string[] | undefined {
  if (v === undefined) return undefined;
  if (!Array.isArray(v) || v.some((x) => typeof x !== 'string')) {
    throw AppError.validation(`${field} must be an array of strings`);
  }
  return v as string[];
}

function bool(v: unknown, field: string): boolean | undefined {
  if (v === undefined) return undefined;
  if (typeof v !== 'boolean') throw AppError.validation(`${field} must be a boolean`);
  return v;
}

function parseFilters(v: unknown): SearchFilters | undefined {
  if (v === undefined) return undefined;
  const f = obj(v);
  return {
    minCapacity: num(f.minCapacity, 'filters.minCapacity'),
    maxPricePerPlate: num(f.maxPricePerPlate, 'filters.maxPricePerPlate'),
    minRating: num(f.minRating, 'filters.minRating'),
    categories: strArray(f.categories, 'filters.categories'),
    requiredAmenities: strArray(f.requiredAmenities, 'filters.requiredAmenities'),
    indoorOnly: bool(f.indoorOnly, 'filters.indoorOnly'),
    verifiedOnly: bool(f.verifiedOnly, 'filters.verifiedOnly'),
  };
}

export function parseSearch(body: unknown): VenueSearchRequest {
  const b = obj(body);
  const latitude = num(b.latitude, 'latitude', { required: true })!;
  const longitude = num(b.longitude, 'longitude', { required: true })!;
  const guestCount = num(b.guestCount, 'guestCount', { required: true })!;
  if (guestCount <= 0) throw AppError.validation('guestCount must be greater than 0');

  const radiusKm = num(b.radiusKm, 'radiusKm') ?? DEFAULT_RADIUS_KM;
  if (radiusKm <= 0 || radiusKm > 50) {
    throw AppError.validation('radiusKm must be between 1 and 50');
  }
  const limit = num(b.limit, 'limit');

  return {
    latitude,
    longitude,
    guestCount,
    radiusKm,
    budgetPerPlate: num(b.budgetPerPlate, 'budgetPerPlate'),
    filters: parseFilters(b.filters),
    preferredAmenities: strArray(b.preferredAmenities, 'preferredAmenities'),
    limit: limit === undefined ? undefined : Math.max(1, Math.min(50, Math.trunc(limit))),
  };
}

export function parseCompare(body: unknown): string[] {
  const b = obj(body);
  const ids = strArray(b.venueIds, 'venueIds');
  if (!ids || ids.length === 0) {
    throw AppError.validation('venueIds must be a non-empty array');
  }
  if (ids.length > MAX_COMPARE) {
    throw AppError.validation(`Compare at most ${MAX_COMPARE} venues`);
  }
  return ids;
}

export function parseAddFavourite(body: unknown): {
  venueId: string;
  eventId?: string;
  note?: string;
} {
  const b = obj(body);
  if (typeof b.venueId !== 'string' || b.venueId.length === 0) {
    throw AppError.validation('venueId is required');
  }
  if (b.eventId !== undefined && typeof b.eventId !== 'string') {
    throw AppError.validation('eventId must be a string');
  }
  if (b.note !== undefined && (typeof b.note !== 'string' || b.note.length > 500)) {
    throw AppError.validation('note must be a string up to 500 characters');
  }
  return {
    venueId: b.venueId,
    eventId: b.eventId as string | undefined,
    note: b.note as string | undefined,
  };
}
