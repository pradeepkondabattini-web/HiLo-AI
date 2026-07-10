import { createApp, type Logger } from '@hilo/backend-shared';
import { createAiRouter, type AiRouteDeps } from './presentation/ai.routes.js';

export const SERVICE_NAME = 'ai-gateway-service';
export const SERVICE_VERSION = '0.1.0';

/**
 * Builds the AI Gateway Express app (Book 5, EOS-002-P3-Part-07). Dependencies are
 * injected so tests run with in-memory registries and the fake LLM provider.
 */
export function buildApp(logger: Logger, deps: AiRouteDeps) {
  return createApp({
    serviceName: SERVICE_NAME,
    version: SERVICE_VERSION,
    logger,
    routers: [{ path: '/api/v1/ai', router: createAiRouter(deps) }],
  });
}
