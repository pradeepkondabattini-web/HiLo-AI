import type { Auth } from 'firebase-admin/auth';
import { AppError } from '../errors/app-error.js';
import type { TokenVerifier, VerifiedIdentity } from './token-verifier.js';

/**
 * Verifies Firebase ID tokens via the Admin SDK (EOS-000 §64). A failed verification is
 * surfaced as a 401 without leaking internal detail. Shared by all HiLo services.
 */
export class FirebaseTokenVerifier implements TokenVerifier {
  constructor(private readonly auth: Auth) {}

  async verify(idToken: string): Promise<VerifiedIdentity> {
    try {
      const decoded = await this.auth.verifyIdToken(idToken, true);
      const roles = Array.isArray(decoded.roles)
        ? (decoded.roles as unknown[]).filter((r): r is string => typeof r === 'string')
        : undefined;
      return {
        uid: decoded.uid,
        email: decoded.email,
        emailVerified: decoded.email_verified ?? false,
        phoneNumber: decoded.phone_number,
        name: decoded.name,
        signInProvider: decoded.firebase?.sign_in_provider,
        roles,
      };
    } catch {
      throw AppError.unauthorized('Invalid or expired authentication token');
    }
  }
}
