import { describe, it, expect } from 'vitest';
import { SearchVenuesUseCase } from '../src/application/search-venues.use-case.js';
import { FakeLocationService } from '../src/infrastructure/fake-location-service.js';
import { InMemoryVenueRepository } from '../src/infrastructure/in-memory-venue-repository.js';
import { HYDERABAD } from './support/harness.js';

function useCase() {
  return new SearchVenuesUseCase(new InMemoryVenueRepository(), new FakeLocationService());
}

describe('SearchVenuesUseCase', () => {
  it('returns all seeded venues within a wide radius, ranked by score descending', async () => {
    const results = await useCase().execute({ ...HYDERABAD, radiusKm: 50, guestCount: 200 });
    expect(results).toHaveLength(5); // 3 HiLo catalogue + 2 Google
    for (let i = 1; i < results.length; i++) {
      expect(results[i - 1]!.score).toBeGreaterThanOrEqual(results[i]!.score);
    }
    expect(results[0]).toHaveProperty('breakdown');
  });

  it('excludes venues beyond the radius', async () => {
    const near = await useCase().execute({ ...HYDERABAD, radiusKm: 8, guestCount: 200 });
    const wide = await useCase().execute({ ...HYDERABAD, radiusKm: 50, guestCount: 200 });
    expect(near.length).toBeLessThan(wide.length);
    expect(near.every((r) => r.distanceKm <= 8)).toBe(true);
  });

  it('applies the verifiedOnly filter (HiLo catalogue only)', async () => {
    const results = await useCase().execute({
      ...HYDERABAD,
      radiusKm: 50,
      guestCount: 200,
      filters: { verifiedOnly: true },
    });
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((r) => r.venue.verified)).toBe(true);
  });

  it('applies the minCapacity filter', async () => {
    const results = await useCase().execute({
      ...HYDERABAD,
      radiusKm: 50,
      guestCount: 200,
      filters: { minCapacity: 400 },
    });
    expect(results.every((r) => r.venue.capacity >= 400)).toBe(true);
  });

  it('respects the result limit', async () => {
    const results = await useCase().execute({
      ...HYDERABAD,
      radiusKm: 50,
      guestCount: 200,
      limit: 2,
    });
    expect(results).toHaveLength(2);
  });
});
