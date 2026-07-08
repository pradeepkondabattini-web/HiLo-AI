/**
 * Platform roles (EOS-002-P3-Part-02 §4, EOS-000 §66). A user may hold many roles
 * (multi-role — see ADR-008). The domain layer is framework-free.
 */
export const Role = {
  Consumer: 'consumer',
  Guest: 'guest',
  Business: 'business',
  Admin: 'admin',
} as const;

export type Role = (typeof Role)[keyof typeof Role];

const ALL_ROLES: readonly Role[] = Object.values(Role);

export function isRole(value: unknown): value is Role {
  return typeof value === 'string' && (ALL_ROLES as readonly string[]).includes(value);
}

/** Default role assigned to a newly bootstrapped account. */
export const DEFAULT_ROLES: readonly Role[] = [Role.Consumer];

/**
 * Normalize an arbitrary roles input into a valid, de-duplicated, non-empty role set.
 * Invalid entries are dropped; an empty result falls back to {@link DEFAULT_ROLES}.
 */
export function normalizeRoles(input: readonly unknown[] | undefined): Role[] {
  const valid = (input ?? []).filter(isRole);
  const unique = Array.from(new Set(valid));
  return unique.length > 0 ? unique : [...DEFAULT_ROLES];
}
