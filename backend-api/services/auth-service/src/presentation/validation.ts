import { AppError } from '@hilo/backend-shared';
import type { UserProfileInput } from '../domain/user.js';

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function optionalString(value: unknown, field: string, maxLen = 200): string | undefined {
  if (value === undefined) return undefined;
  if (typeof value !== 'string') {
    throw AppError.validation(`${field} must be a string`);
  }
  if (value.length > maxLen) {
    throw AppError.validation(`${field} exceeds ${maxLen} characters`);
  }
  return value;
}

/** Parse and validate a profile-update body (EOS-000 §76 — never trust input). */
export function parseProfileInput(body: unknown): UserProfileInput {
  if (!isPlainObject(body)) {
    throw AppError.validation('Request body must be a JSON object');
  }
  return {
    displayName: optionalString(body.displayName, 'displayName', 120),
    city: optionalString(body.city, 'city', 120),
    preferredLanguage: optionalString(body.preferredLanguage, 'preferredLanguage', 10),
    profilePhoto: optionalString(body.profilePhoto, 'profilePhoto', 2048),
  };
}

/** Parse and validate a role-assignment body: `{ "roles": string[] }`. */
export function parseRolesInput(body: unknown): string[] {
  if (!isPlainObject(body) || !Array.isArray(body.roles)) {
    throw AppError.validation('Body must be an object with a "roles" array');
  }
  return body.roles.map((r) => {
    if (typeof r !== 'string') throw AppError.validation('Each role must be a string');
    return r;
  });
}
