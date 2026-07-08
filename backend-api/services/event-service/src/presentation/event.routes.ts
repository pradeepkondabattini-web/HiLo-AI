import { Router, type Request } from 'express';
import {
  AppError,
  asyncHandler,
  createAuthMiddleware,
  type TokenVerifier,
} from '@hilo/backend-shared';
import type { CreateEventUseCase } from '../application/create-event.use-case.js';
import type { GetEventUseCase } from '../application/get-event.use-case.js';
import type { ListEventsUseCase } from '../application/list-events.use-case.js';
import type { UpdateEventUseCase } from '../application/update-event.use-case.js';
import type { TransitionStatusUseCase } from '../application/transition-status.use-case.js';
import type { AddMemberUseCase } from '../application/add-member.use-case.js';
import type { UpdateBudgetUseCase } from '../application/update-budget.use-case.js';
import type { DeleteEventUseCase } from '../application/delete-event.use-case.js';
import { toBudgetDto, toEventDto, toMemberDto } from './dto.js';
import {
  parseAddMember,
  parseCreateEvent,
  parseListQuery,
  parseStatus,
  parseUpdateBudget,
  parseUpdateEvent,
} from './validation.js';

export interface EventRouteDeps {
  verifier: TokenVerifier;
  createEvent: CreateEventUseCase;
  getEvent: GetEventUseCase;
  listEvents: ListEventsUseCase;
  updateEvent: UpdateEventUseCase;
  transition: TransitionStatusUseCase;
  addMember: AddMemberUseCase;
  updateBudget: UpdateBudgetUseCase;
  deleteEvent: DeleteEventUseCase;
}

function eventIdParam(req: Request): string {
  const id = req.params.id;
  if (!id) throw AppError.badRequest('Missing event id');
  return id;
}

/**
 * Event API routes (EOS-002-P3-Part-04 §23). All routes require a verified Firebase ID
 * token; per-event access (ABAC) is enforced inside the use cases from the caller's uid.
 *
 *   POST   /api/v1/events              create (owner = caller)
 *   GET    /api/v1/events              list events the caller belongs to (cursor)
 *   GET    /api/v1/events/:id          read one (members only)
 *   PATCH  /api/v1/events/:id          update fields (owner/co-host)
 *   POST   /api/v1/events/:id/status   lifecycle transition (owner/co-host)
 *   POST   /api/v1/events/:id/members  add a participant (owner/co-host)
 *   PUT    /api/v1/events/:id/budget   update budget (owner/co-host)
 *   DELETE /api/v1/events/:id          soft delete (owner)
 */
export function createEventRouter(deps: EventRouteDeps): Router {
  const router = Router();
  const authenticate = createAuthMiddleware(deps.verifier);

  router.post(
    '/',
    authenticate,
    asyncHandler(async (req, res) => {
      const input = parseCreateEvent(req.body);
      const { event, budget } = await deps.createEvent.execute(
        res.locals.auth!.identity.uid,
        input,
      );
      res.status(201).json({ event: toEventDto(event), budget: toBudgetDto(budget) });
    }),
  );

  router.get(
    '/',
    authenticate,
    asyncHandler(async (req, res) => {
      const { limit, cursor } = parseListQuery(req.query as Record<string, unknown>);
      const page = await deps.listEvents.execute(res.locals.auth!.identity.uid, { limit, cursor });
      res.status(200).json({ items: page.items.map(toEventDto), nextCursor: page.nextCursor });
    }),
  );

  router.get(
    '/:id',
    authenticate,
    asyncHandler(async (req, res) => {
      const event = await deps.getEvent.execute(res.locals.auth!.identity.uid, eventIdParam(req));
      res.status(200).json(toEventDto(event));
    }),
  );

  router.patch(
    '/:id',
    authenticate,
    asyncHandler(async (req, res) => {
      const input = parseUpdateEvent(req.body);
      const event = await deps.updateEvent.execute(
        res.locals.auth!.identity.uid,
        eventIdParam(req),
        input,
      );
      res.status(200).json(toEventDto(event));
    }),
  );

  router.post(
    '/:id/status',
    authenticate,
    asyncHandler(async (req, res) => {
      const target = parseStatus(req.body);
      const event = await deps.transition.execute(
        res.locals.auth!.identity.uid,
        eventIdParam(req),
        target,
      );
      res.status(200).json(toEventDto(event));
    }),
  );

  router.post(
    '/:id/members',
    authenticate,
    asyncHandler(async (req, res) => {
      const { userId, role } = parseAddMember(req.body);
      const member = await deps.addMember.execute({
        actorUid: res.locals.auth!.identity.uid,
        eventId: eventIdParam(req),
        userId,
        role,
      });
      res.status(201).json(toMemberDto(member));
    }),
  );

  router.put(
    '/:id/budget',
    authenticate,
    asyncHandler(async (req, res) => {
      const input = parseUpdateBudget(req.body);
      const budget = await deps.updateBudget.execute(
        res.locals.auth!.identity.uid,
        eventIdParam(req),
        input,
      );
      res.status(200).json(toBudgetDto(budget));
    }),
  );

  router.delete(
    '/:id',
    authenticate,
    asyncHandler(async (req, res) => {
      await deps.deleteEvent.execute(res.locals.auth!.identity.uid, eventIdParam(req));
      res.status(204).send();
    }),
  );

  return router;
}
