import type { DocumentMetadata } from '@hilo/backend-shared';
import type { Role } from './role.js';

/** Authentication provider used at sign-in (EOS-002-P3-Part-02 §3). */
export type AuthProvider = 'google' | 'phone' | 'email';

export type AccountStatus = 'active' | 'suspended';

/**
 * The User aggregate root (owner: auth-service). Combines the mandatory metadata
 * envelope (EOS-000 §35) with the identity/profile fields from EOS-002-P3-Part-02 §13
 * and EOS-004-P4 §4. `roles` is an array per ADR-008.
 */
export interface User extends DocumentMetadata {
  email: string;
  phone?: string;
  displayName: string;
  authProvider: AuthProvider;
  roles: Role[];
  accountStatus: AccountStatus;
  emailVerified: boolean;
  phoneVerified: boolean;
  city?: string;
  preferredLanguage?: string;
  profilePhoto?: string;
  lastLoginAt?: string;
}

/** Fields a user may set on themselves during onboarding (never `roles`/`accountStatus`). */
export interface UserProfileInput {
  displayName?: string;
  city?: string;
  preferredLanguage?: string;
  profilePhoto?: string;
}

export function hasRole(user: Pick<User, 'roles'>, role: Role): boolean {
  return user.roles.includes(role);
}

export function hasAnyRole(user: Pick<User, 'roles'>, roles: readonly Role[]): boolean {
  return user.roles.some((r) => roles.includes(r));
}
