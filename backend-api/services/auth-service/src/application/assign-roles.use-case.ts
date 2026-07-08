import { AppError, touchDocumentMetadata } from '@hilo/backend-shared';
import type { UserRepository } from '../domain/user-repository.js';
import type { Clock, RoleClaimsManager } from '../domain/ports.js';
import { normalizeRoles, type Role } from '../domain/role.js';
import type { User } from '../domain/user.js';

/**
 * Assign roles to a user (admin-only — enforced at the route via RBAC guard).
 *
 * Roles are normalized to the approved set and mirrored into custom claims so RBAC takes
 * effect on the next token refresh (EOS-000 §66). This is the *only* sanctioned path for
 * changing roles; clients can never self-escalate (security rules + this guard).
 */
export class AssignRolesUseCase {
  constructor(
    private readonly users: UserRepository,
    private readonly roleClaims: RoleClaimsManager,
    private readonly clock: Clock,
  ) {}

  async execute(params: {
    targetUid: string;
    roles: readonly unknown[];
    actorUid: string;
  }): Promise<User> {
    const user = await this.users.findById(params.targetUid);
    if (!user || user.deleted) {
      throw AppError.notFound('User not found');
    }

    const roles: Role[] = normalizeRoles(params.roles);
    const updated = await this.users.update(
      touchDocumentMetadata({ ...user, roles }, params.actorUid, this.clock.now()),
    );
    await this.roleClaims.setRoles(updated.id, roles);
    return updated;
  }
}
