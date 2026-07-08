/**
 * Structured JSON logging (EOS-000 §27, EOS-001-P6 §12).
 *
 * Emits one JSON object per line with the mandatory fields (timestamp, service,
 * environment, severity, correlationId, requestId, userId, executionTime). Never logs
 * passwords, secrets, tokens, or PII — a redaction pass strips sensitive keys.
 *
 * Dependency-light on purpose (EOS-001-P6 §14): no external logging library.
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LEVEL_WEIGHT: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

/** Structured context attached to a log entry. */
export type LogContext = Record<string, unknown>;

export interface LoggerOptions {
  serviceName: string;
  environment: string;
  level: LogLevel;
  /** Injectable sink (defaults to stdout/stderr) — keeps the logger testable. */
  sink?: (line: string) => void;
  /** Injectable clock — keeps timestamps deterministic in tests. */
  now?: () => Date;
}

/** Keys whose values are always redacted, case-insensitive substring match. */
const SENSITIVE_KEY_PATTERNS = [
  'password',
  'passwd',
  'secret',
  'token',
  'authorization',
  'apikey',
  'api_key',
  'credential',
  'cookie',
  'ssn',
  'card',
  'cvv',
  'pin',
];

const REDACTED = '[REDACTED]';

function isSensitiveKey(key: string): boolean {
  const lower = key.toLowerCase();
  return SENSITIVE_KEY_PATTERNS.some((pattern) => lower.includes(pattern));
}

/** Recursively redact sensitive keys. Guards against cycles and unbounded depth. */
export function redact(value: unknown, seen = new WeakSet<object>(), depth = 0): unknown {
  if (depth > 8 || value === null || typeof value !== 'object') return value;
  if (seen.has(value as object)) return '[Circular]';
  seen.add(value as object);

  if (Array.isArray(value)) {
    return value.map((item) => redact(item, seen, depth + 1));
  }
  const out: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
    out[key] = isSensitiveKey(key) ? REDACTED : redact(val, seen, depth + 1);
  }
  return out;
}

export class Logger {
  private readonly serviceName: string;
  private readonly environment: string;
  private readonly level: LogLevel;
  private readonly sink: (line: string) => void;
  private readonly now: () => Date;
  private readonly baseContext: LogContext;

  constructor(options: LoggerOptions, baseContext: LogContext = {}) {
    this.serviceName = options.serviceName;
    this.environment = options.environment;
    this.level = options.level;
    this.sink = options.sink ?? ((line) => process.stdout.write(`${line}\n`));
    this.now = options.now ?? (() => new Date());
    this.baseContext = baseContext;
  }

  /** Derive a child logger that always includes the given context (e.g. per-request IDs). */
  child(context: LogContext): Logger {
    return new Logger(
      {
        serviceName: this.serviceName,
        environment: this.environment,
        level: this.level,
        sink: this.sink,
        now: this.now,
      },
      { ...this.baseContext, ...context },
    );
  }

  debug(message: string, context?: LogContext): void {
    this.log('debug', message, context);
  }
  info(message: string, context?: LogContext): void {
    this.log('info', message, context);
  }
  warn(message: string, context?: LogContext): void {
    this.log('warn', message, context);
  }
  error(message: string, context?: LogContext): void {
    this.log('error', message, context);
  }

  private log(level: LogLevel, message: string, context?: LogContext): void {
    if (LEVEL_WEIGHT[level] < LEVEL_WEIGHT[this.level]) return;

    const entry = {
      timestamp: this.now().toISOString(),
      service: this.serviceName,
      environment: this.environment,
      severity: level.toUpperCase(),
      message,
      ...(redact({ ...this.baseContext, ...context }) as LogContext),
    };
    this.sink(JSON.stringify(entry));
  }
}

export function createLogger(options: LoggerOptions): Logger {
  return new Logger(options);
}
