import type { RequestHandler } from 'express';
import { AppError } from '../errors/app-error.js';
import type { TokenVerifier } from './token-verifier.js';
import './auth-context.js';

/**
 * Authentication middleware (EOS-000 §64, §70). Requires a `Bearer <ID token>` header,
 * verifies it, and populates `res.locals.auth` with the identity and effective roles,
 * plus the caller's uid on the shared request context. Rejects with 401 when the token is
 * missing or invalid. Reusable by every Cloud Run service.
 */
export function createAuthMiddleware(verifier: TokenVerifier): RequestHandler {
  return (req, res, next) => {
    void (async () => {
      try {
        const header = req.headers.authorization;
        if (typeof header !== 'string' || !header.startsWith('Bearer ')) {
          throw AppError.unauthorized('Missing or malformed Authorization header');
        }
        const token = header.slice('Bearer '.length).trim();
        if (!token) {
          throw AppError.unauthorized('Missing bearer token');
        }

        const identity = await verifier.verify(token);
        const roles = Array.isArray(identity.roles)
          ? identity.roles.filter((r): r is string => typeof r === 'string')
          : [];

        res.locals.auth = { identity, roles };
        if (res.locals.ctx) {
          res.locals.ctx.userId = identity.uid;
        }
        next();
      } catch (err) {
        next(err);
      }
    })();
  };
}
