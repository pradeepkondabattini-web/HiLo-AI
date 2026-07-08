import { AppError, touchDocumentMetadata } from '@hilo/backend-shared';
import type { UserRepository } from '../domain/user-repository.js';
import type { Clock } from '../domain/ports.js';
import type { User, UserProfileInput } from '../domain/user.js';

/**
 * Update the caller's own profile during/after onboarding (EOS-002-P3-Part-02 §7).
 *
 * Only whitelisted profile fields are writable here — never `roles`, `accountStatus`, or
 * verification flags (those are controlled by the backend/admin). Bumps the version and
 * `updatedAt`/`updatedBy` via the metadata envelope.
 */
export class UpdateProfileUseCase {
  constructor(
    private readonly users: UserRepository,
    private readonly clock: Clock,
  ) {}

  async execute(uid: string, input: UserProfileInput): Promise<User> {
    const user = await this.users.findById(uid);
    if (!user || user.deleted) {
      throw AppError.notFound('User profile not found');
    }

    const displayName = input.displayName?.trim();
    if (displayName !== undefined && displayName.length === 0) {
      throw AppError.validation('displayName cannot be empty');
    }

    const patched: User = {
      ...user,
      ...(displayName !== undefined ? { displayName } : {}),
      ...(input.city !== undefined ? { city: input.city } : {}),
      ...(input.preferredLanguage !== undefined
        ? { preferredLanguage: input.preferredLanguage }
        : {}),
      ...(input.profilePhoto !== undefined ? { profilePhoto: input.profilePhoto } : {}),
    };

    return this.users.update(touchDocumentMetadata(patched, uid, this.clock.now()));
  }
}
