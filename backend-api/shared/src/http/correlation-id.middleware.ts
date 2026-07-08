import { randomUUID } from 'node:crypto';
import type { RequestHandler } from 'express';
import type { Logger } from '../logging/logger.js';
import type { RequestContext } from './context.js';

const CORRELATION_HEADER = 'x-correlation-id';
const REQUEST_ID_HEADER = 'x-request-id';

/** Accept only well-formed inbound IDs; otherwise generate our own (avoid header injection). */
function sanitizeId(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  return /^[A-Za-z0-9._-]{1,128}$/.test(value) ? value : undefined;
}

/**
 * Establishes per-request {@link RequestContext}: a correlation ID (propagated across
 * services) and a per-request ID, plus a request-scoped child logger. Echoes both IDs
 * back on the response so clients and downstreams can trace (EOS-000 §23, §27).
 */
export function correlationIdMiddleware(baseLogger: Logger): RequestHandler {
  return (req, res, next) => {
    const correlationId = sanitizeId(req.headers[CORRELATION_HEADER]) ?? randomUUID();
    const requestId = sanitizeId(req.headers[REQUEST_ID_HEADER]) ?? randomUUID();

    const ctx: RequestContext = {
      correlationId,
      requestId,
      startTimeMs: Date.now(),
      logger: baseLogger.child({ correlationId, requestId }),
    };
    res.locals.ctx = ctx;

    res.setHeader(CORRELATION_HEADER, correlationId);
    res.setHeader(REQUEST_ID_HEADER, requestId);
    next();
  };
}
