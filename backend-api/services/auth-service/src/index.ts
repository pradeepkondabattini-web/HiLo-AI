import { createLogger, startServer } from '@hilo/backend-shared';
import { loadAuthConfig } from './config.js';
import { buildAuthDeps } from './composition.js';
import { buildApp, SERVICE_NAME } from './server.js';

// Process bootstrap for the auth-service Cloud Run container.
const config = loadAuthConfig();
const logger = createLogger({
  serviceName: config.serviceName,
  environment: config.env,
  level: config.logLevel,
});

const deps = buildAuthDeps(config.projectId);
const app = buildApp(logger, deps);

startServer({
  app,
  port: config.port,
  logger,
  serviceName: SERVICE_NAME,
});
