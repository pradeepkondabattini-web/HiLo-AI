import type { RequestHandler } from 'express';

/**
 * Wraps an async route handler so rejected promises are forwarded to the error
 * middleware instead of crashing the process (Express 4 does not await handlers).
 */
export function asyncHandler(handler: RequestHandler): RequestHandler {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}
