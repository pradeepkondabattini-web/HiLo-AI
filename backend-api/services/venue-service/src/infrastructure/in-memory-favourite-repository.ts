import { favouriteId, type FavouriteRepository, type VenueFavourite } from '../domain/favourite.js';

/** In-memory {@link FavouriteRepository} for tests and local dev. */
export class InMemoryFavouriteRepository implements FavouriteRepository {
  private readonly store = new Map<string, VenueFavourite>();

  async add(favourite: VenueFavourite): Promise<VenueFavourite> {
    this.store.set(favourite.id, structuredClone(favourite));
    return structuredClone(favourite);
  }

  async find(userId: string, venueId: string): Promise<VenueFavourite | null> {
    const found = this.store.get(favouriteId(userId, venueId));
    return found && !found.deleted ? structuredClone(found) : null;
  }

  async listByUser(userId: string): Promise<VenueFavourite[]> {
    return [...this.store.values()]
      .filter((f) => f.userId === userId && !f.deleted)
      .map((f) => structuredClone(f));
  }

  async remove(userId: string, venueId: string): Promise<void> {
    this.store.delete(favouriteId(userId, venueId));
  }
}
