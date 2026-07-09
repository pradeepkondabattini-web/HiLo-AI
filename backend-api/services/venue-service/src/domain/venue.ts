/**
 * The Venue aggregate (EOS-002-P3-Part-05, EOS-004-P4 §7). Framework-free.
 *
 * Venues come from two sources merged behind the Location Service: HiLo's own catalogue
 * (Firestore) and Google Places (`source`). Google-derived fields (rating) are read-only;
 * `trustScore` and `reviewSentiment` are HiLo-internal.
 */
export type VenueSource = 'hilo' | 'google';

export interface Venue {
  id: string;
  source: VenueSource;
  googlePlaceId?: string;
  name: string;
  address: string;
  city?: string;
  category?: string;
  latitude: number;
  longitude: number;
  /** Maximum guests the venue can host. */
  capacity: number;
  /** Google rating, 0–5 (read-only — EOS-002-P3-Part-05 §23). */
  rating: number;
  reviewCount?: number;
  /** Google price level 1–4, when available. */
  priceLevel?: number;
  /** Indicative price per plate (INR), for HiLo catalogue venues. */
  pricePerPlate?: number;
  amenities: string[];
  photos: string[];
  verified: boolean;
  /** HiLo Trust Score, 0–1 (calculated internally). */
  trustScore?: number;
  /** Review sentiment, 0–1. */
  reviewSentiment?: number;
  indoor?: boolean;
}
