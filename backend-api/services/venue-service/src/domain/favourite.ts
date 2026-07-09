import type { DocumentMetadata } from '@hilo/backend-shared';

/**
 * A user's saved (favourite) venue (EOS-002-P3-Part-05 §16). Optionally linked to an
 * event workspace. Deterministic id `fav_{userId}_{venueId}` enforces one per user+venue.
 */
export interface VenueFavourite extends DocumentMetadata {
  userId: string;
  venueId: string;
  eventId?: string;
  note?: string;
}

export function favouriteId(userId: string, venueId: string): string {
  return `fav_${userId}_${venueId}`;
}

export interface FavouriteRepository {
  add(favourite: VenueFavourite): Promise<VenueFavourite>;
  find(userId: string, venueId: string): Promise<VenueFavourite | null>;
  listByUser(userId: string): Promise<VenueFavourite[]>;
  remove(userId: string, venueId: string): Promise<void>;
}
