import type { User } from './user.js';

/**
 * Repository port for the User aggregate (EOS-000 §24, §56). The domain depends on this
 * interface; infrastructure provides the Firestore (or in-memory) implementation.
 */
export interface UserRepository {
  findById(uid: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  /** Create a new user document. Rejects if one already exists for the uid. */
  create(user: User): Promise<User>;
  /** Persist a full updated user document. */
  update(user: User): Promise<User>;
}
