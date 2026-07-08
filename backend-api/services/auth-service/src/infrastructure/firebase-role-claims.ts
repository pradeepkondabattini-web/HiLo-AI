import type { Auth } from 'firebase-admin/auth';
import type { RoleClaimsManager } from '../domain/ports.js';
import type { Role } from '../domain/role.js';

/**
 * Writes RBAC roles into Firebase custom claims (EOS-000 §66). Claims are picked up on
 * the client's next ID-token refresh and are readable by Firestore security rules.
 */
export class FirebaseRoleClaimsManager implements RoleClaimsManager {
  constructor(private readonly auth: Auth) {}

  async setRoles(uid: string, roles: Role[]): Promise<void> {
    await this.auth.setCustomUserClaims(uid, { roles });
  }
}
