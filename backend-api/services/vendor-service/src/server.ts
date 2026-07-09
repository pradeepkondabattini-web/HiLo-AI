import { createApp, type Logger } from '@hilo/backend-shared';
import { createVendorRouter, type VendorRouteDeps } from './presentation/vendor.routes.js';

export const SERVICE_NAME = 'vendor-service';
export const SERVICE_VERSION = '0.1.0';

/**
 * Builds the vendor-service Express app (EOS-002-P3-Part-06). Dependencies are injected so
 * the app can be exercised in tests with in-memory fakes (no Firebase required).
 */
export function buildApp(logger: Logger, deps: VendorRouteDeps) {
  return createApp({
    serviceName: SERVICE_NAME,
    version: SERVICE_VERSION,
    logger,
    routers: [{ path: '/api/v1/vendors', router: createVendorRouter(deps) }],
  });
}
