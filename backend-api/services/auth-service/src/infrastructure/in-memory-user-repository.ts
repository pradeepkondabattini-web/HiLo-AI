import { AppError } from '@hilo/backend-shared';
import type { UserRepository } from '../domain/user-repository.js';
import type { User } from '../domain/user.js';

/**
 * In-memory {@link UserRepository} for unit tests and local development without a
 * Firestore emulator. Stored records are cloned on the way in and out so callers cannot
 * mutate internal state.
 */
export class InMemoryUserRepository implements UserRepository {
  private readonly store = new Map<string, User>();

  async findById(uid: string): Promise<User | null> {
    const found = this.store.get(uid);
    return found ? structuredClone(found) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    for (const user of this.store.values()) {
      if (user.email === email) return structuredClone(user);
    }
    return null;
  }

  async create(user: User): Promise<User> {
    if (this.store.has(user.id)) {
      throw AppError.conflict(`User already exists: ${user.id}`);
    }
    this.store.set(user.id, structuredClone(user));
    return structuredClone(user);
  }

  async update(user: User): Promise<User> {
    this.store.set(user.id, structuredClone(user));
    return structuredClone(user);
  }
}
