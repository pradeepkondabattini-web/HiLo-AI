import { createApp, type Logger } from '@hilo/backend-shared';
import { createVenueRouter, type VenueRouteDeps } from './presentation/venue.routes.js';

export const SERVICE_NAME = 'venue-service';
export const SERVICE_VERSION = '0.1.0';

/**
 * Builds the venue-service Express app (EOS-002-P3-Part-05). Dependencies are injected so
 * the app can be exercised in tests with in-memory fakes (no Firebase/Google required).
 */
export function buildApp(logger: Logger, deps: VenueRouteDeps) {
  return createApp({
    serviceName: SERVICE_NAME,
    version: SERVICE_VERSION,
    logger,
    routers: [{ path: '/api/v1/venues', router: createVenueRouter(deps) }],
  });
}
