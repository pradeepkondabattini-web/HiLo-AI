import type { LogLevel } from '../logging/logger.js';

/**
 * Runtime environment. Kept small and explicit; configuration is externalized
 * (EOS-000 §25, EOS-001-P6 §13). Never hardcode secrets or environment-specific values.
 */
export type NodeEnv = 'development' | 'test' | 'production';

export interface AppConfig {
  /** Logical service name, e.g. "auth-service" (used in logs and telemetry). */
  readonly serviceName: string;
  readonly env: NodeEnv;
  /** Cloud Run injects PORT; default 8080. */
  readonly port: number;
  readonly logLevel: LogLevel;
}

export interface LoadConfigOptions {
  /** Required: the service's logical name. */
  serviceName: string;
  /** Optional overrides (mainly for tests). */
  env?: Partial<NodeJS.ProcessEnv>;
}

function parsePort(value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const port = Number.parseInt(value, 10);
  if (Number.isNaN(port) || port < 0 || port > 65535) {
    throw new Error(`Invalid PORT value: "${value}"`);
  }
  return port;
}

function parseEnv(value: string | undefined): NodeEnv {
  switch (value) {
    case 'production':
    case 'test':
    case 'development':
      return value;
    case undefined:
      return 'development';
    default:
      throw new Error(`Invalid NODE_ENV value: "${value}"`);
  }
}

function parseLogLevel(value: string | undefined, fallback: LogLevel): LogLevel {
  if (!value) return fallback;
  if (value === 'debug' || value === 'info' || value === 'warn' || value === 'error') {
    return value;
  }
  throw new Error(`Invalid LOG_LEVEL value: "${value}"`);
}

/**
 * Build immutable {@link AppConfig} from environment variables, validating as we go
 * (fail fast — EOS-001-P6 §3). No secrets are read here; those are resolved at point
 * of use from Secret Manager / injected env.
 */
export function loadConfig(options: LoadConfigOptions): AppConfig {
  const source = options.env ?? process.env;
  const env = parseEnv(source.NODE_ENV);
  return {
    serviceName: options.serviceName,
    env,
    port: parsePort(source.PORT, 8080),
    logLevel: parseLogLevel(source.LOG_LEVEL, env === 'production' ? 'info' : 'debug'),
  };
}
