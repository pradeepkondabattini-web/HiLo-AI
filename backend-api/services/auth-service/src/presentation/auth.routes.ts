import { Router } from 'express';
import {
  AppError,
  asyncHandler,
  createAuthMiddleware,
  requireRoles,
  type TokenVerifier,
} from '@hilo/backend-shared';
import { Role } from '../domain/role.js';
import type { BootstrapUserUseCase } from '../application/bootstrap-user.use-case.js';
import type { GetMeUseCase } from '../application/get-me.use-case.js';
import type { UpdateProfileUseCase } from '../application/update-profile.use-case.js';
import type { AssignRolesUseCase } from '../application/assign-roles.use-case.js';
import { toUserDto } from './user.dto.js';
import { parseProfileInput, parseRolesInput } from './validation.js';

export interface AuthRouteDeps {
  verifier: TokenVerifier;
  bootstrapUser: BootstrapUserUseCase;
  getMe: GetMeUseCase;
  updateProfile: UpdateProfileUseCase;
  assignRoles: AssignRolesUseCase;
}

/**
 * Auth API routes (EOS-002-P3-Part-02). All routes require a verified Firebase ID token.
 *
 *   POST   /api/v1/auth/bootstrap        first-login upsert; returns the user
 *   GET    /api/v1/auth/me               the caller's own profile
 *   PATCH  /api/v1/auth/me               update own profile (onboarding)
 *   POST   /api/v1/auth/users/:uid/roles assign roles (admin only)
 */
export function createAuthRouter(deps: AuthRouteDeps): Router {
  const router = Router();
  const authenticate = createAuthMiddleware(deps.verifier);

  router.post(
    '/bootstrap',
    authenticate,
    asyncHandler(async (_req, res) => {
      const identity = res.locals.auth!.identity;
      const user = await deps.bootstrapUser.execute(identity);
      res.status(200).json(toUserDto(user));
    }),
  );

  router.get(
    '/me',
    authenticate,
    asyncHandler(async (_req, res) => {
      const user = await deps.getMe.execute(res.locals.auth!.identity.uid);
      res.status(200).json(toUserDto(user));
    }),
  );

  router.patch(
    '/me',
    authenticate,
    asyncHandler(async (req, res) => {
      const input = parseProfileInput(req.body);
      const user = await deps.updateProfile.execute(res.locals.auth!.identity.uid, input);
      res.status(200).json(toUserDto(user));
    }),
  );

  router.post(
    '/users/:uid/roles',
    authenticate,
    requireRoles(Role.Admin),
    asyncHandler(async (req, res) => {
      const targetUid = req.params.uid;
      if (!targetUid) throw AppError.badRequest('Missing target user id');
      const roles = parseRolesInput(req.body);
      const user = await deps.assignRoles.execute({
        targetUid,
        roles,
        actorUid: res.locals.auth!.identity.uid,
      });
      res.status(200).json(toUserDto(user));
    }),
  );

  return router;
}
