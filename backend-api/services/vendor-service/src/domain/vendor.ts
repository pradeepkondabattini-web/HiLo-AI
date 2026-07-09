import type { DocumentMetadata } from '@hilo/backend-shared';

/**
 * Vendor verification levels (EOS-002-P3-Part-06 §6). Level 4 = HiLo Verified Partner.
 * Levels are granted by the backend/admin only — never self-assigned.
 */
export const VerificationLevel = {
  None: 0,
  EmailVerified: 1,
  MobileVerified: 2,
  DocumentsVerified: 3,
  HiLoVerifiedPartner: 4,
} as const;

export type VerificationLevel = (typeof VerificationLevel)[keyof typeof VerificationLevel];

export function isVerificationLevel(value: unknown): value is VerificationLevel {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0 && value <= 4;
}

/** Curated launch categories (EOS-002-P3-Part-06 §3). */
export const VENDOR_CATEGORIES = [
  'Catering',
  'Decoration',
  'Photography',
  'Videography',
  'Entertainment',
  'Music',
  'Beauty',
  'Event Services',
  'Transportation',
  'Gifts',
] as const;

/**
 * The Vendor aggregate root (owner: vendor-service). Carries the mandatory metadata
 * envelope (EOS-000 §35). `ownerUid` is the business account that manages this listing.
 */
export interface Vendor extends DocumentMetadata {
  ownerUid: string;
  businessName: string;
  category: string;
  description?: string;
  contactPerson?: string;
  city: string;
  address?: string;
  latitude: number;
  longitude: number;
  /** How far the vendor travels to serve, km (§5 Location). */
  serviceRadiusKm: number;
  yearsOfExperience?: number;
  teamSize?: number;
  /** Indicative starting price, INR. */
  startingPrice?: number;
  /** Google rating 0–5 (read-only). */
  rating: number;
  reviewCount?: number;
  verificationLevel: VerificationLevel;
  /** HiLo Trust Score 0–1 (calculated internally — see trust-score.ts). */
  trustScore?: number;
  reviewSentiment?: number;
  /** Average first-response time in hours (drives scoring). */
  responseTimeHours?: number;
  /** 0–1 fraction of confirmed bookings later cancelled by the vendor. */
  cancellationRate?: number;
  /** 0–1 fraction of customers who book again. */
  repeatBookingRate?: number;
  /** 0–1 — how ready the vendor is for new work right now. */
  availabilityScore?: number;
  portfolio: string[];
  workingDays?: string[];
}

/** Input a business user provides at onboarding (EOS-002-P3-Part-06 §5). */
export interface VendorOnboardingInput {
  businessName: string;
  category: string;
  description?: string;
  contactPerson?: string;
  city: string;
  address?: string;
  latitude: number;
  longitude: number;
  serviceRadiusKm?: number;
  yearsOfExperience?: number;
  teamSize?: number;
  startingPrice?: number;
  workingDays?: string[];
}
