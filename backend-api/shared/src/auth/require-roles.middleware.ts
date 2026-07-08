import type { RequestHandler } from 'express';
import { AppError } from '../errors/app-error.js';
import './auth-context.js';

/**
 * RBAC guard (EOS-000 §66–67). Allows the request only if the caller holds at least one
 * of the required roles. Must run after {@link createAuthMiddleware}.
 */
export function requireRoles(...allowed: string[]): RequestHandler {
  return (_req, res, next) => {
    const roles = res.locals.auth?.roles ?? [];
    if (roles.some((role) => allowed.includes(role))) {
      next();
      return;
    }
    next(AppError.forbidden('Insufficient permissions for this operation'));
  };
}
