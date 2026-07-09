import { createLogger, startServer } from '@hilo/backend-shared';
import { loadVendorConfig } from './config.js';
import { buildVendorDeps } from './composition.js';
import { buildApp, SERVICE_NAME } from './server.js';

// Process bootstrap for the vendor-service Cloud Run container.
const config = loadVendorConfig();
const logger = createLogger({
  serviceName: config.serviceName,
  environment: config.env,
  level: config.logLevel,
});

const deps = buildVendorDeps({
  projectId: config.projectId,
  quoteValidityDays: config.quoteValidityDays,
});
const app = buildApp(logger, deps);

startServer({ app, port: config.port, logger, serviceName: SERVICE_NAME });
