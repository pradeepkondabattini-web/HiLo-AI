import {
  AppError,
  createDocumentMetadata,
  DocumentStatus,
  type VerifiedIdentity,
} from '@hilo/backend-shared';
import type { UserRepository } from '../domain/user-repository.js';
import type { Clock, RoleClaimsManager } from '../domain/ports.js';
import { DEFAULT_ROLES } from '../domain/role.js';
import type { User } from '../domain/user.js';
import { mapSignInProvider } from './map-provider.js';

/**
 * Bootstraps the platform user for a verified identity (EOS-002-P3-Part-02 §5).
 *
 * - First login → create the `users/` document with the mandatory metadata envelope,
 *   assign the default role(s), and mirror them into custom claims (RBAC).
 * - Returning user → refresh `lastLoginAt`.
 *
 * Idempotent: safe to call on every authenticated session start.
 */
export class BootstrapUserUseCase {
  constructor(
    private readonly users: UserRepository,
    private readonly roleClaims: RoleClaimsManager,
    private readonly clock: Clock,
  ) {}

  async execute(identity: VerifiedIdentity): Promise<User> {
    const existing = await this.users.findById(identity.uid);
    const now = this.clock.now();

    if (existing) {
      return this.users.update({ ...existing, lastLoginAt: now.toISOString() });
    }

    if (!identity.email && !identity.phoneNumber) {
      throw AppError.badRequest('Identity must include an email or phone number');
    }

    const metadata = createDocumentMetadata({
      id: identity.uid,
      actorId: identity.uid,
      status: DocumentStatus.Active,
      now,
    });

    const user: User = {
      ...metadata,
      email: identity.email ?? '',
      phone: identity.phoneNumber,
      displayName: identity.name ?? deriveDisplayName(identity),
      authProvider: mapSignInProvider(identity.signInProvider),
      roles: [...DEFAULT_ROLES],
      accountStatus: 'active',
      emailVerified: identity.emailVerified,
      phoneVerified: Boolean(identity.phoneNumber),
      lastLoginAt: now.toISOString(),
    };

    const created = await this.users.create(user);
    // Mirror default roles into custom claims so RBAC works on the next token refresh.
    await this.roleClaims.setRoles(created.id, created.roles);
    return created;
  }
}

function deriveDisplayName(identity: VerifiedIdentity): string {
  if (identity.email) return identity.email.split('@')[0] ?? 'HiLo user';
  return 'HiLo user';
}
