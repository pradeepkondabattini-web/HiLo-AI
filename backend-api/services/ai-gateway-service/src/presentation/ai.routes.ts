import { Router } from 'express';
import {
  AppError,
  asyncHandler,
  createAuthMiddleware,
  type TokenVerifier,
} from '@hilo/backend-shared';
import type { ChatUseCase } from '../application/chat.use-case.js';
import type { SkillRegistry } from '../domain/skill.js';

export interface AiRouteDeps {
  verifier: TokenVerifier;
  chat: ChatUseCase;
  skills: SkillRegistry;
}

/** Extract the raw bearer token for delegated skill calls (already verified by authenticate). */
function bearerToken(header: string | undefined): string {
  return (header ?? '').slice('Bearer '.length).trim();
}

/**
 * AI Gateway API (EOS-002-P3-Part-07 §23). The gateway authenticates, validates, and
 * delegates — it performs no reasoning itself (EOS-005-P1 §7).
 *
 *   POST /api/v1/ai/chat                   conversational planning
 *   GET  /api/v1/ai/readiness/:eventId     AI Event Readiness Score
 *   GET  /api/v1/ai/skills                 registered skill definitions (transparency)
 */
export function createAiRouter(deps: AiRouteDeps): Router {
  const router = Router();
  const authenticate = createAuthMiddleware(deps.verifier);

  router.post(
    '/chat',
    authenticate,
    asyncHandler(async (req, res) => {
      const body = (req.body ?? {}) as Record<string, unknown>;
      if (typeof body.message !== 'string') {
        throw AppError.validation('message is required and must be a string');
      }
      const response = await deps.chat.execute({
        uid: res.locals.auth!.identity.uid,
        bearerToken: bearerToken(req.headers.authorization),
        message: body.message,
        sessionId: typeof body.sessionId === 'string' ? body.sessionId : undefined,
        eventId: typeof body.eventId === 'string' ? body.eventId : undefined,
      });
      res.status(200).json(response);
    }),
  );

  router.get(
    '/readiness/:eventId',
    authenticate,
    asyncHandler(async (req, res) => {
      const eventId = req.params.eventId;
      if (!eventId) throw AppError.badRequest('Missing event id');
      const skill = deps.skills.get('skill.readiness_score');
      if (!skill) throw AppError.internal('readiness skill not registered');
      const result = await skill.execute(
        { eventId },
        {
          uid: res.locals.auth!.identity.uid,
          bearerToken: bearerToken(req.headers.authorization),
          eventId,
        },
      );
      res.status(200).json(result.data);
    }),
  );

  router.get(
    '/skills',
    authenticate,
    asyncHandler(async (_req, res) => {
      res.status(200).json({ items: deps.skills.list() });
    }),
  );

  return router;
}
