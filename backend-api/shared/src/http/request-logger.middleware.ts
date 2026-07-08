import type { RequestHandler } from 'express';

/**
 * Logs one structured entry per completed request with method, path, status, and
 * execution time (EOS-000 §27). Relies on the request-scoped logger set by
 * {@link correlationIdMiddleware}.
 */
export function requestLoggerMiddleware(): RequestHandler {
  return (req, res, next) => {
    res.on('finish', () => {
      const ctx = res.locals.ctx;
      if (!ctx) return;
      const executionTimeMs = Date.now() - ctx.startTimeMs;
      ctx.logger.info('request.completed', {
        method: req.method,
        path: req.originalUrl,
        statusCode: res.statusCode,
        executionTimeMs,
        ...(ctx.userId ? { userId: ctx.userId } : {}),
      });
    });
    next();
  };
}
