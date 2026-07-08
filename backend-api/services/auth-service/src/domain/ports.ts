import type { Role } from './role.js';

/**
 * Auth-service-specific ports (EOS-000 §24). Token verification is provided by
 * `@hilo/backend-shared` ({@link TokenVerifier}); these are the ports unique to identity
 * management.
 */

/** Manages RBAC custom claims on the identity provider (EOS-000 §66). */
export interface RoleClaimsManager {
  setRoles(uid: string, roles: Role[]): Promise<void>;
}

/** Injected clock — keeps time deterministic in tests. */
export interface Clock {
  now(): Date;
}

export const systemClock: Clock = { now: () => new Date() };
