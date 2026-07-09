import { AppError } from '@hilo/backend-shared';
import { MAX_COMPARE } from '../domain/search.js';
import type { Venue } from '../domain/venue.js';
import type { GetVenueUseCase } from './get-venue.use-case.js';

/** Compare up to four venues side by side (EOS-002-P3-Part-05 §15). */
export class CompareVenuesUseCase {
  constructor(private readonly getVenue: GetVenueUseCase) {}

  async execute(ids: readonly string[]): Promise<Venue[]> {
    if (ids.length === 0) {
      throw AppError.badRequest('Provide at least one venue id to compare');
    }
    if (ids.length > MAX_COMPARE) {
      throw AppError.badRequest(`You can compare at most ${MAX_COMPARE} venues at once`);
    }
    return Promise.all(ids.map((id) => this.getVenue.execute(id)));
  }
}
