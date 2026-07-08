import { createDocumentMetadata, DocumentStatus } from '@hilo/backend-shared';
import { favouriteId, type FavouriteRepository, type VenueFavourite } from '../domain/favourite.js';
import type { Clock } from '../domain/ports.js';

/** Save a venue as a favourite (EOS-002-P3-Part-05 §16). Idempotent per user+venue. */
export class AddFavouriteUseCase {
  constructor(
    private readonly favourites: FavouriteRepository,
    private readonly clock: Clock,
  ) {}

  async execute(params: {
    userId: string;
    venueId: string;
    eventId?: string;
    note?: string;
  }): Promise<VenueFavourite> {
    const existing = await this.favourites.find(params.userId, params.venueId);
    if (existing) return existing;

    const metadata = createDocumentMetadata({
      id: favouriteId(params.userId, params.venueId),
      actorId: params.userId,
      status: DocumentStatus.Active,
      now: this.clock.now(),
    });
    const favourite: VenueFavourite = {
      ...metadata,
      userId: params.userId,
      venueId: params.venueId,
      eventId: params.eventId,
      note: params.note,
    };
    return this.favourites.add(favourite);
  }
}

export class ListFavouritesUseCase {
  constructor(private readonly favourites: FavouriteRepository) {}
  execute(userId: string): Promise<VenueFavourite[]> {
    return this.favourites.listByUser(userId);
  }
}

export class RemoveFavouriteUseCase {
  constructor(private readonly favourites: FavouriteRepository) {}
  execute(userId: string, venueId: string): Promise<void> {
    return this.favourites.remove(userId, venueId);
  }
}
