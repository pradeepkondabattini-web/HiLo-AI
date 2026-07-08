import { createApp, type Logger } from '@hilo/backend-shared';
import { createEventRouter, type EventRouteDeps } from './presentation/event.routes.js';

export const SERVICE_NAME = 'event-service';
export const SERVICE_VERSION = '0.1.0';

/**
 * Builds the event-service Express app (EOS-002-P3-Part-04). Dependencies are injected so
 * the app can be exercised in tests with in-memory fakes (no Firebase required). Mounts
 * the shared health endpoints plus the versioned events API.
 */
export function buildApp(logger: Logger, deps: EventRouteDeps) {
  return createApp({
    serviceName: SERVICE_NAME,
    version: SERVICE_VERSION,
    logger,
    routers: [{ path: '/api/v1/events', router: createEventRouter(deps) }],
  });
}
