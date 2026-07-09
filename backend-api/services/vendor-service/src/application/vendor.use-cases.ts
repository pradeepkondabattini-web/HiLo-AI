import {
  AppError,
  createDocumentMetadata,
  DocumentStatus,
  touchDocumentMetadata,
} from '@hilo/backend-shared';
import type { Clock, VendorRepository } from '../domain/repositories.js';
import { calculateTrustScore } from '../domain/trust-score.js';
import {
  VENDOR_CATEGORIES,
  VerificationLevel,
  type Vendor,
  type VendorOnboardingInput,
} from '../domain/vendor.js';

const MAX_COMPARE = 4;

/** Fetch one vendor (excluding soft-deleted). */
export class GetVendorUseCase {
  constructor(private readonly vendors: VendorRepository) {}

  async execute(id: string): Promise<Vendor> {
    const vendor = await this.vendors.findById(id);
    if (!vendor || vendor.deleted) throw AppError.notFound('Vendor not found');
    return vendor;
  }
}

/** Compare up to four vendors (EOS-002-P3-Part-06 §11). */
export class CompareVendorsUseCase {
  constructor(private readonly getVendor: GetVendorUseCase) {}

  async execute(ids: readonly string[]): Promise<Vendor[]> {
    if (ids.length === 0) throw AppError.badRequest('Provide at least one vendor id');
    if (ids.length > MAX_COMPARE) {
      throw AppError.badRequest(`You can compare at most ${MAX_COMPARE} vendors at once`);
    }
    return Promise.all(ids.map((id) => this.getVendor.execute(id)));
  }
}

/**
 * Vendor onboarding (EOS-002-P3-Part-06 §5). One listing per business account for MVP.
 * New vendors start at verification level 0 — levels are granted by backend/admin flows
 * (§6, §24: verification before the badge). The caller must hold the `business` role
 * (enforced at the route).
 */
export class OnboardVendorUseCase {
  constructor(
    private readonly vendors: VendorRepository,
    private readonly clock: Clock,
  ) {}

  async execute(ownerUid: string, input: VendorOnboardingInput): Promise<Vendor> {
    const existing = await this.vendors.findByOwner(ownerUid);
    if (existing && !existing.deleted) {
      throw AppError.conflict('This account already has a vendor listing');
    }
    if (!(VENDOR_CATEGORIES as readonly string[]).includes(input.category)) {
      throw AppError.validation(`category must be one of: ${VENDOR_CATEGORIES.join(', ')}`);
    }

    const metadata = createDocumentMetadata({
      id: `vnd_${ownerUid}`,
      actorId: ownerUid,
      status: DocumentStatus.Active,
      now: this.clock.now(),
    });

    const vendor: Vendor = {
      ...metadata,
      ownerUid,
      businessName: input.businessName,
      category: input.category,
      description: input.description,
      contactPerson: input.contactPerson,
      city: input.city,
      address: input.address,
      latitude: input.latitude,
      longitude: input.longitude,
      serviceRadiusKm: input.serviceRadiusKm ?? 10,
      yearsOfExperience: input.yearsOfExperience,
      teamSize: input.teamSize,
      startingPrice: input.startingPrice,
      rating: 0,
      verificationLevel: VerificationLevel.None,
      portfolio: [],
      workingDays: input.workingDays,
    };
    return this.vendors.create(vendor);
  }
}

/**
 * Scheduled Trust Score recalculation (EOS-002-P3-Part-06 §18, §24). Invoked by Cloud
 * Scheduler (or an admin) — walks the catalogue and refreshes each vendor's trustScore.
 * Booking/complaint signals are wired in as those domains land; until then the calculator
 * uses the vendor's own behavioural fields.
 */
export class RecalculateTrustScoresUseCase {
  constructor(
    private readonly vendors: VendorRepository,
    private readonly clock: Clock,
  ) {}

  async execute(actorUid: string): Promise<{ updated: number }> {
    const all = await this.vendors.list({});
    let updated = 0;
    for (const vendor of all) {
      if (vendor.deleted) continue;
      const trustScore = calculateTrustScore(vendor);
      if (vendor.trustScore !== trustScore) {
        await this.vendors.update(
          touchDocumentMetadata({ ...vendor, trustScore }, actorUid, this.clock.now()),
        );
        updated++;
      }
    }
    return { updated };
  }
}
