import { describe, it, expect } from 'vitest';
import { Logger, redact } from '../src/logging/logger.js';

describe('redact', () => {
  it('redacts sensitive keys at any depth', () => {
    const input = {
      email: 'a@b.com',
      password: 'hunter2',
      nested: { authToken: 'abc', accessToken: 'xyz', keep: 1 },
      list: [{ apiKey: 'k' }],
    };
    const out = redact(input) as Record<string, unknown>;
    expect(out.email).toBe('a@b.com');
    expect(out.password).toBe('[REDACTED]');
    const nested = out.nested as Record<string, unknown>;
    expect(nested.authToken).toBe('[REDACTED]');
    expect(nested.accessToken).toBe('[REDACTED]');
    expect(nested.keep).toBe(1);
    expect((out.list as Array<Record<string, unknown>>)[0].apiKey).toBe('[REDACTED]');
  });

  it('handles circular references without throwing', () => {
    const a: Record<string, unknown> = { name: 'x' };
    a.self = a;
    expect(() => redact(a)).not.toThrow();
  });
});

describe('Logger', () => {
  function capturingLogger(level: 'debug' | 'info' | 'warn' | 'error' = 'debug') {
    const lines: string[] = [];
    const logger = new Logger({
      serviceName: 'test-service',
      environment: 'test',
      level,
      sink: (line) => lines.push(line),
      now: () => new Date('2026-07-05T00:00:00.000Z'),
    });
    return { logger, lines };
  }

  it('emits structured JSON with the mandatory fields', () => {
    const { logger, lines } = capturingLogger();
    logger.info('hello', { correlationId: 'cid-1' });
    expect(lines).toHaveLength(1);
    const entry = JSON.parse(lines[0]!);
    expect(entry).toMatchObject({
      timestamp: '2026-07-05T00:00:00.000Z',
      service: 'test-service',
      environment: 'test',
      severity: 'INFO',
      message: 'hello',
      correlationId: 'cid-1',
    });
  });

  it('respects the configured level', () => {
    const { logger, lines } = capturingLogger('warn');
    logger.debug('debug');
    logger.info('info');
    logger.warn('warn');
    expect(lines).toHaveLength(1);
    expect(JSON.parse(lines[0]!).severity).toBe('WARN');
  });

  it('redacts sensitive context before writing', () => {
    const { logger, lines } = capturingLogger();
    logger.info('login', { password: 'secret', userId: 'u1' });
    const entry = JSON.parse(lines[0]!);
    expect(entry.password).toBe('[REDACTED]');
    expect(entry.userId).toBe('u1');
  });

  it('child loggers inherit base context', () => {
    const { logger, lines } = capturingLogger();
    logger.child({ correlationId: 'cid-child' }).info('x');
    expect(JSON.parse(lines[0]!).correlationId).toBe('cid-child');
  });
});
