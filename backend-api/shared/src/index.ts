/**
 * @hilo/backend-shared — public API.
 * Shared middleware, logging, errors, config, DI, and the Express app factory for
 * HiLo Cloud Run services. Import from the package root only.
 */

// Config
export { loadConfig } from './config/env.js';
export type { AppConfig, NodeEnv, LoadConfigOptions } from './config/env.js';

// Domain — document metadata envelope (EOS-000 §35)
export {
  DocumentStatus,
  createDocumentMetadata,
  touchDocumentMetadata,
  softDeleteDocumentMetadata,
} from './domain/document.js';
export type { DocumentMetadata, IsoTimestamp } from './domain/document.js';

// Logging
export { Logger, createLogger, redact } from './logging/logger.js';
export type { LogLevel, LogContext, LoggerOptions } from './logging/logger.js';

// Errors
export { AppError, ErrorCode } from './errors/app-error.js';
export type { ErrorEnvelope } from './errors/app-error.js';

// Dependency Injection
export { Container, Token, createToken } from './container/container.js';

// HTTP
export type { RequestContext } from './http/context.js';
export { asyncHandler } from './http/async-handler.js';
export { correlationIdMiddleware } from './http/correlation-id.middleware.js';
export { requestLoggerMiddleware } from './http/request-logger.middleware.js';
export { errorHandlerMiddleware, notFoundMiddleware } from './http/error-handler.middleware.js';
export { createHealthRouter } from './http/health.router.js';
export type { ReadinessCheck, HealthRouterOptions } from './http/health.router.js';

// Auth — provider-agnostic token verification + RBAC (EOS-000 §64, §66)
export type { TokenVerifier, VerifiedIdentity } from './auth/token-verifier.js';
export type { AuthContext } from './auth/auth-context.js';
export { createAuthMiddleware } from './auth/auth.middleware.js';
export { requireRoles } from './auth/require-roles.middleware.js';
export { FirebaseTokenVerifier } from './auth/firebase-token-verifier.js';

// Firebase Admin app bootstrap
export { getFirebaseApp } from './firebase/app.js';

// App lifecycle
export { createApp } from './app/create-app.js';
export type { CreateAppOptions } from './app/create-app.js';
export { startServer } from './app/start-server.js';
export type { StartServerOptions } from './app/start-server.js';
