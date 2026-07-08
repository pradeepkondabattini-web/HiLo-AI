import express, { type Express, type Router } from 'express';
import type { Logger } from '../logging/logger.js';
import { correlationIdMiddleware } from '../http/correlation-id.middleware.js';
import { requestLoggerMiddleware } from '../http/request-logger.middleware.js';
import { errorHandlerMiddleware, notFoundMiddleware } from '../http/error-handler.middleware.js';
import { createHealthRouter, type ReadinessCheck } from '../http/health.router.js';

export interface CreateAppOptions {
  serviceName: string;
  version: string;
  logger: Logger;
  /** Service routers mounted after the shared middleware, before 404/error handlers. */
  routers?: Array<{ path: string; router: Router }>;
  readinessChecks?: ReadinessCheck[];
  /** JSON body size limit. Default 1mb. */
  jsonLimit?: string;
}

/**
 * Express application factory that wires the standard middleware stack in the correct
 * order (EOS-000 §23–28): correlation IDs → request logging → body parsing → health →
 * service routes → 404 → central error handler.
 *
 * The returned app is not bound to a port — {@link startServer} handles the lifecycle,
 * which keeps the app trivially testable with supertest.
 */
export function createApp(options: CreateAppOptions): Express {
  const {
    serviceName,
    version,
    logger,
    routers = [],
    readinessChecks = [],
    jsonLimit = '1mb',
  } = options;

  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', true);

  // Order matters: context first so every downstream layer has the request logger.
  app.use(correlationIdMiddleware(logger));
  app.use(requestLoggerMiddleware());
  app.use(express.json({ limit: jsonLimit }));

  app.use(createHealthRouter({ serviceName, version, readinessChecks }));

  for (const { path, router } of routers) {
    app.use(path, router);
  }

  // Terminal handlers — must be last.
  app.use(notFoundMiddleware());
  app.use(errorHandlerMiddleware());

  return app;
}
