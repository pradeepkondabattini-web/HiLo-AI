import type { ErrorRequestHandler, RequestHandler } from 'express';
import { AppError, ErrorCode } from '../errors/app-error.js';

/** Terminal 404 handler for unmatched routes. Mount after all routes. */
export function notFoundMiddleware(): RequestHandler {
  return (req, _res, next) => {
    next(AppError.notFound(`Route not found: ${req.method} ${req.path}`));
  };
}

/**
 * Central error handler producing the standard client envelope (EOS-000 §26).
 *
 * - {@link AppError} → its status/code/message (+ sanitized details).
 * - Anything else → generic 500; the real error is logged server-side only, never
 *   leaked to the client (no stack traces to clients — EOS-001-P6 §11).
 *
 * Must be registered LAST, after routes and the not-found handler.
 */
export function errorHandlerMiddleware(): ErrorRequestHandler {
  // Express identifies error handlers by their 4-arg signature; _next is required.
  return (err, _req, res, _next) => {
    const ctx = res.locals.ctx;
    const correlationId = ctx?.correlationId;
    const logger = ctx?.logger;

    if (err instanceof AppError) {
      if (!err.isOperational) {
        logger?.error('request.error', { code: err.code, message: err.message, stack: err.stack });
      } else {
        logger?.warn('request.rejected', { code: err.code, message: err.message });
      }
      res.status(err.statusCode).json(err.toEnvelope(correlationId));
      return;
    }

    // Unknown/unexpected error — log full detail internally, return a generic envelope.
    const message = err instanceof Error ? err.message : String(err);
    const stack = err instanceof Error ? err.stack : undefined;
    logger?.error('request.unhandled', { message, stack });

    const generic = new AppError(ErrorCode.Internal, 500, 'Internal server error', {
      isOperational: false,
    });
    res.status(500).json(generic.toEnvelope(correlationId));
  };
}
