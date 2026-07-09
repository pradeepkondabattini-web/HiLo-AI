import { createDocumentMetadata, DocumentStatus } from '@hilo/backend-shared';
import { VerificationLevel, type Vendor } from '../domain/vendor.js';

const seededAt = new Date('2026-07-01T00:00:00.000Z');

function seedVendor(
  id: string,
  fields: Omit<
    Vendor,
    | 'id'
    | 'schemaVersion'
    | 'version'
    | 'status'
    | 'deleted'
    | 'createdAt'
    | 'updatedAt'
    | 'createdBy'
    | 'updatedBy'
  >,
): Vendor {
  return {
    ...createDocumentMetadata({
      id,
      actorId: 'system-seed',
      status: DocumentStatus.Active,
      now: seededAt,
    }),
    ...fields,
  };
}

/** Seed vendors around Hyderabad for local development and tests. */
export const HYDERABAD_SEED_VENDORS: Vendor[] = [
  seedVendor('vnd_seed_caterer', {
    ownerUid: 'seed_owner_caterer',
    businessName: 'Paradise Caterers',
    category: 'Catering',
    description: 'Hyderabadi wedding catering, veg & non-veg.',
    city: 'Hyderabad',
    latitude: 17.4399,
    longitude: 78.4983,
    serviceRadiusKm: 25,
    yearsOfExperience: 15,
    startingPrice: 450,
    rating: 4.5,
    reviewCount: 800,
    verificationLevel: VerificationLevel.HiLoVerifiedPartner,
    trustScore: 0.88,
    reviewSentiment: 0.85,
    responseTimeHours: 2,
    cancellationRate: 0.02,
    repeatBookingRate: 0.55,
    availabilityScore: 0.8,
    portfolio: [],
    workingDays: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
  }),
  seedVendor('vnd_seed_photo', {
    ownerUid: 'seed_owner_photo',
    businessName: 'Lens & Light Studio',
    category: 'Photography',
    description: 'Candid wedding & event photography.',
    city: 'Hyderabad',
    latitude: 17.4239,
    longitude: 78.4738,
    serviceRadiusKm: 40,
    yearsOfExperience: 8,
    startingPrice: 25000,
    rating: 4.7,
    reviewCount: 320,
    verificationLevel: VerificationLevel.DocumentsVerified,
    trustScore: 0.82,
    reviewSentiment: 0.9,
    responseTimeHours: 5,
    cancellationRate: 0.05,
    repeatBookingRate: 0.35,
    availabilityScore: 0.6,
    portfolio: [],
  }),
  seedVendor('vnd_seed_decor', {
    ownerUid: 'seed_owner_decor',
    businessName: 'Blossom Decor',
    category: 'Decoration',
    description: 'Floral and theme decoration for all events.',
    city: 'Hyderabad',
    latitude: 17.4933,
    longitude: 78.3915,
    serviceRadiusKm: 15,
    yearsOfExperience: 5,
    startingPrice: 15000,
    rating: 4.1,
    reviewCount: 140,
    verificationLevel: VerificationLevel.MobileVerified,
    reviewSentiment: 0.72,
    responseTimeHours: 12,
    cancellationRate: 0.08,
    repeatBookingRate: 0.2,
    availabilityScore: 0.9,
    portfolio: [],
  }),
];
