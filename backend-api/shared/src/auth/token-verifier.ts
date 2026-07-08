/**
 * Provider-agnostic identity verification (EOS-000 §64). Backends must never trust
 * client-supplied identity without verifying the token.
 */

/** The verified identity extracted from an ID token. */
export interface VerifiedIdentity {
  uid: string;
  email?: string;
  emailVerified: boolean;
  phoneNumber?: string;
  name?: string;
  /** Sign-in provider id from the token (e.g. "google.com", "phone", "password"). */
  signInProvider?: string;
  /** Roles previously written to custom claims, if any. */
  roles?: string[];
}

/** Verifies an ID token and returns the caller's {@link VerifiedIdentity}. */
export interface TokenVerifier {
  verify(idToken: string): Promise<VerifiedIdentity>;
}
