import type { Logger } from '../logging/logger.js';

/**
 * Per-request context attached to Express `res.locals` and available to handlers.
 * Correlation/request IDs support tracing (EOS-000 §23, §27).
 */
export interface RequestContext {
  correlationId: string;
  requestId: string;
  logger: Logger;
  /** Populated by auth middleware once Firebase ID tokens are verified (Sprint 1B). */
  userId?: string;
  startTimeMs: number;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Locals {
      ctx: RequestContext;
    }
  }
}
