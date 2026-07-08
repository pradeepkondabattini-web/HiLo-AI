import { createApp, type Logger } from '@hilo/backend-shared';
import { createAuthRouter, type AuthRouteDeps } from './presentation/auth.routes.js';

export const SERVICE_NAME = 'auth-service';
export const SERVICE_VERSION = '0.1.0';

/**
 * Builds the auth-service Express app (EOS-002-P3-Part-02). Dependencies are injected so
 * the app can be exercised in tests with in-memory fakes (no Firebase required).
 * Mounts the shared health endpoints plus the versioned auth API.
 */
export function buildApp(logger: Logger, deps: AuthRouteDeps) {
  return createApp({
    serviceName: SERVICE_NAME,
    version: SERVICE_VERSION,
    logger,
    routers: [{ path: '/api/v1/auth', router: createAuthRouter(deps) }],
  });
}
