import { AppError } from '@hilo/backend-shared';
import {
  DEFAULT_VENDOR_RADIUS_KM,
  type VendorSearchRequest,
} from '../application/search-vendors.use-case.js';
import { isQuoteStatus, type QuoteStatus } from '../domain/quote.js';
import type { VendorOnboardingInput } from '../domain/vendor.js';

function obj(body: unknown): Record<string, unknown> {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    throw AppError.validation('Request body must be a JSON object');
  }
  return body as Record<string, unknown>;
}

function str(v: unknown, field: string, { required = false, max = 500 } = {}): string | undefined {
  if (v === undefined || v === null) {
    if (required) throw AppError.validation(`${field} is required`);
    return undefined;
  }
  if (typeof v !== 'string') throw AppError.validation(`${field} must be a string`);
  if (v.length > max) throw AppError.validation(`${field} exceeds ${max} characters`);
  return v;
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

export function parseSearch(body: unknown): VendorSearchRequest {
  const b = obj(body);
  const radiusKm = num(b.radiusKm, 'radiusKm') ?? DEFAULT_VENDOR_RADIUS_KM;
  if (radiusKm <= 0 || radiusKm > 100) {
    throw AppError.validation('radiusKm must be between 1 and 100');
  }
  const limit = num(b.limit, 'limit');
  return {
    latitude: num(b.latitude, 'latitude', { required: true })!,
    longitude: num(b.longitude, 'longitude', { required: true })!,
    radiusKm,
    category: str(b.category, 'category', { max: 60 }),
    city: str(b.city, 'city', { max: 120 }),
    budget: num(b.budget, 'budget'),
    minVerificationLevel: num(b.minVerificationLevel, 'minVerificationLevel'),
    limit: limit === undefined ? undefined : Math.max(1, Math.min(50, Math.trunc(limit))),
  };
}

export function parseCompare(body: unknown): string[] {
  const b = obj(body);
  if (!Array.isArray(b.vendorIds) || b.vendorIds.some((x) => typeof x !== 'string')) {
    throw AppError.validation('vendorIds must be an array of strings');
  }
  return b.vendorIds as string[];
}

export function parseOnboarding(body: unknown): VendorOnboardingInput {
  const b = obj(body);
  return {
    businessName: str(b.businessName, 'businessName', { required: true, max: 200 })!,
    category: str(b.category, 'category', { required: true, max: 60 })!,
    description: str(b.description, 'description', { max: 5000 }),
    contactPerson: str(b.contactPerson, 'contactPerson', { max: 120 }),
    city: str(b.city, 'city', { required: true, max: 120 })!,
    address: str(b.address, 'address', { max: 500 }),
    latitude: num(b.latitude, 'latitude', { required: true })!,
    longitude: num(b.longitude, 'longitude', { required: true })!,
    serviceRadiusKm: num(b.serviceRadiusKm, 'serviceRadiusKm'),
    yearsOfExperience: num(b.yearsOfExperience, 'yearsOfExperience'),
    teamSize: num(b.teamSize, 'teamSize'),
    startingPrice: num(b.startingPrice, 'startingPrice'),
    workingDays: Array.isArray(b.workingDays)
      ? (b.workingDays as unknown[]).filter((d): d is string => typeof d === 'string')
      : undefined,
  };
}

export function parseQuoteRequest(body: unknown): { eventId?: string; message?: string } {
  const b = obj(body);
  return {
    eventId: str(b.eventId, 'eventId', { max: 128 }),
    message: str(b.message, 'message', { max: 2000 }),
  };
}

export function parseQuoteTransition(body: unknown): {
  target: QuoteStatus;
  proposedAmount?: number;
} {
  const b = obj(body);
  if (!isQuoteStatus(b.status)) {
    throw AppError.validation('status must be a valid quote state');
  }
  return { target: b.status, proposedAmount: num(b.proposedAmount, 'proposedAmount') };
}
