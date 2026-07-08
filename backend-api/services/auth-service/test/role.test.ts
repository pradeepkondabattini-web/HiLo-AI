import { describe, it, expect } from 'vitest';
import { normalizeRoles, isRole, DEFAULT_ROLES, Role } from '../src/domain/role.js';

describe('normalizeRoles', () => {
  it('drops invalid roles and de-duplicates', () => {
    expect(normalizeRoles(['consumer', 'consumer', 'nope', 42])).toEqual(['consumer']);
  });

  it('falls back to the default role set when empty', () => {
    expect(normalizeRoles([])).toEqual([...DEFAULT_ROLES]);
    expect(normalizeRoles(undefined)).toEqual([...DEFAULT_ROLES]);
    expect(normalizeRoles(['unknown'])).toEqual([...DEFAULT_ROLES]);
  });

  it('preserves a valid multi-role set (ADR-008)', () => {
    expect(normalizeRoles(['business', 'consumer', 'admin'])).toEqual([
      'business',
      'consumer',
      'admin',
    ]);
  });
});

describe('isRole', () => {
  it('accepts approved roles only', () => {
    expect(isRole(Role.Admin)).toBe(true);
    expect(isRole('root')).toBe(false);
    expect(isRole(undefined)).toBe(false);
  });
});
