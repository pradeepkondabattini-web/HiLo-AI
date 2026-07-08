import type { User } from '../domain/user.js';

/** Public representation of a user returned by the API (no internal-only fields). */
export interface UserDto {
  id: string;
  email: string;
  phone?: string;
  displayName: string;
  authProvider: string;
  roles: string[];
  accountStatus: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  city?: string;
  preferredLanguage?: string;
  profilePhoto?: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export function toUserDto(user: User): UserDto {
  return {
    id: user.id,
    email: user.email,
    phone: user.phone,
    displayName: user.displayName,
    authProvider: user.authProvider,
    roles: user.roles,
    accountStatus: user.accountStatus,
    emailVerified: user.emailVerified,
    phoneVerified: user.phoneVerified,
    city: user.city,
    preferredLanguage: user.preferredLanguage,
    profilePhoto: user.profilePhoto,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    lastLoginAt: user.lastLoginAt,
  };
}
