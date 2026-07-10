import { createLogger, startServer } from '@hilo/backend-shared';
import { loadAiConfig } from './config.js';
import { buildAiDeps } from './composition.js';
import { buildApp, SERVICE_NAME } from './server.js';

// Process bootstrap for the ai-gateway-service Cloud Run container.
const config = loadAiConfig();
const logger = createLogger({
  serviceName: config.serviceName,
  environment: config.env,
  level: config.logLevel,
});

const deps = buildAiDeps(config);
const app = buildApp(logger, deps);

startServer({ app, port: config.port, logger, serviceName: SERVICE_NAME });
