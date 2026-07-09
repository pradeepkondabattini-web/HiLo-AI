import type { RankedVendor } from '../application/search-vendors.use-case.js';
import type { Quote } from '../domain/quote.js';
import type { Vendor } from '../domain/vendor.js';

function round(value: number, dp: number): number {
  const f = 10 ** dp;
  return Math.round(value * f) / f;
}

export function toVendorDto(vendor: Vendor) {
  return {
    id: vendor.id,
    businessName: vendor.businessName,
    category: vendor.category,
    description: vendor.description,
    city: vendor.city,
    address: vendor.address,
    latitude: vendor.latitude,
    longitude: vendor.longitude,
    serviceRadiusKm: vendor.serviceRadiusKm,
    yearsOfExperience: vendor.yearsOfExperience,
    teamSize: vendor.teamSize,
    startingPrice: vendor.startingPrice,
    rating: vendor.rating,
    reviewCount: vendor.reviewCount,
    verificationLevel: vendor.verificationLevel,
    trustScore: vendor.trustScore,
    responseTimeHours: vendor.responseTimeHours,
    portfolio: vendor.portfolio,
    workingDays: vendor.workingDays,
  };
}

export function toRankedVendorDto(ranked: RankedVendor) {
  return {
    vendor: toVendorDto(ranked.vendor),
    distanceKm: round(ranked.distanceKm, 2),
    score: round(ranked.score, 3),
    breakdown: ranked.breakdown,
  };
}

export function toQuoteDto(quote: Quote) {
  return {
    id: quote.id,
    vendorId: quote.vendorId,
    requesterUid: quote.requesterUid,
    vendorOwnerUid: quote.vendorOwnerUid,
    eventId: quote.eventId,
    message: quote.message,
    proposedAmount: quote.proposedAmount,
    status: quote.status,
    expiresAt: quote.expiresAt,
    createdAt: quote.createdAt,
    updatedAt: quote.updatedAt,
  };
}
