import { createLogger, startServer } from '@hilo/backend-shared';
import { loadEventConfig } from './config.js';
import { buildEventDeps } from './composition.js';
import { buildApp, SERVICE_NAME } from './server.js';

// Process bootstrap for the event-service Cloud Run container.
const config = loadEventConfig();
const logger = createLogger({
  serviceName: config.serviceName,
  environment: config.env,
  level: config.logLevel,
});

const deps = buildEventDeps(config.projectId);
const app = buildApp(logger, deps);

startServer({
  app,
  port: config.port,
  logger,
  serviceName: SERVICE_NAME,
});
