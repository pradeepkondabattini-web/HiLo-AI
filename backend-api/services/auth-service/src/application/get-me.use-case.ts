import { AppError } from '@hilo/backend-shared';
import type { UserRepository } from '../domain/user-repository.js';
import type { User } from '../domain/user.js';

/** Return the authenticated user's own record (EOS-002-P3-Part-02 §13). */
export class GetMeUseCase {
  constructor(private readonly users: UserRepository) {}

  async execute(uid: string): Promise<User> {
    const user = await this.users.findById(uid);
    if (!user || user.deleted) {
      throw AppError.notFound('User profile not found');
    }
    return user;
  }
}
