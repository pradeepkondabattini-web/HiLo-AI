import { createLogger, startServer } from '@hilo/backend-shared';
import { loadVenueConfig } from './config.js';
import { buildVenueDeps } from './composition.js';
import { buildApp, SERVICE_NAME } from './server.js';

// Process bootstrap for the venue-service Cloud Run container.
const config = loadVenueConfig();
const logger = createLogger({
  serviceName: config.serviceName,
  environment: config.env,
  level: config.logLevel,
});

const deps = buildVenueDeps({
  projectId: config.projectId,
  googleMapsApiKey: config.googleMapsApiKey,
});
const app = buildApp(logger, deps);

startServer({ app, port: config.port, logger, serviceName: SERVICE_NAME });
