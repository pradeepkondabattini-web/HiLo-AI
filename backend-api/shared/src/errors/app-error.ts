/**
 * Standardized application errors and the client error envelope (EOS-000 §26, EOS-001-P6 §11).
 *
 * Internal stack traces are never exposed to clients. Each error carries a stable machine
 * code, an HTTP status, and optional non-sensitive details.
 */

/** Stable, machine-readable error codes. Extend per domain as needed. */
export enum ErrorCode {
  BadRequest = 'BAD_REQUEST',
  ValidationFailed = 'VALIDATION_FAILED',
  Unauthorized = 'UNAUTHORIZED',
  Forbidden = 'FORBIDDEN',
  NotFound = 'NOT_FOUND',
  Conflict = 'CONFLICT',
  RateLimited = 'RATE_LIMITED',
  Internal = 'INTERNAL_ERROR',
  Unavailable = 'SERVICE_UNAVAILABLE',
}

/** Shape returned to clients. Never includes stack traces or internal details. */
export interface ErrorEnvelope {
  error: {
    code: string;
    message: string;
    correlationId?: string;
    timestamp: string;
    details?: unknown;
  };
}

export class AppError extends Error {
  readonly code: ErrorCode;
  readonly statusCode: number;
  readonly details?: unknown;
  /** Operational errors are expected (validation, auth); non-operational are bugs. */
  readonly isOperational: boolean;

  constructor(
    code: ErrorCode,
    statusCode: number,
    message: string,
    options: { details?: unknown; cause?: unknown; isOperational?: boolean } = {},
  ) {
    super(message, options.cause !== undefined ? { cause: options.cause } : undefined);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = options.details;
    this.isOperational = options.isOperational ?? true;
    Error.captureStackTrace?.(this, AppError);
  }

  /** Serialize to the client envelope. Details are assumed pre-sanitized by the caller. */
  toEnvelope(correlationId?: string, now: Date = new Date()): ErrorEnvelope {
    return {
      error: {
        code: this.code,
        message: this.message,
        correlationId,
        timestamp: now.toISOString(),
        ...(this.details !== undefined ? { details: this.details } : {}),
      },
    };
  }

  // ─── Factory helpers for common cases ───────────────────────────────────────
  static badRequest(message = 'Bad request', details?: unknown): AppError {
    return new AppError(ErrorCode.BadRequest, 400, message, { details });
  }
  static validation(message = 'Validation failed', details?: unknown): AppError {
    return new AppError(ErrorCode.ValidationFailed, 422, message, { details });
  }
  static unauthorized(message = 'Unauthorized'): AppError {
    return new AppError(ErrorCode.Unauthorized, 401, message);
  }
  static forbidden(message = 'Forbidden'): AppError {
    return new AppError(ErrorCode.Forbidden, 403, message);
  }
  static notFound(message = 'Resource not found'): AppError {
    return new AppError(ErrorCode.NotFound, 404, message);
  }
  static conflict(message = 'Conflict', details?: unknown): AppError {
    return new AppError(ErrorCode.Conflict, 409, message, { details });
  }
  static internal(message = 'Internal server error', cause?: unknown): AppError {
    return new AppError(ErrorCode.Internal, 500, message, { cause, isOperational: false });
  }
}
