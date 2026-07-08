import type { VerifiedIdentity } from './token-verifier.js';

/** Authenticated request context set by {@link createAuthMiddleware} on `res.locals.auth`. */
export interface AuthContext {
  identity: VerifiedIdentity;
  /** Effective roles from token custom claims (RBAC). Empty if none. */
  roles: string[];
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Locals {
      auth?: AuthContext;
    }
  }
}

export {};
