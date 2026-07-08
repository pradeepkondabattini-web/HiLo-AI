import type { Server } from 'node:http';
import type { Express } from 'express';
import type { Logger } from '../logging/logger.js';

export interface StartServerOptions {
  app: Express;
  port: number;
  logger: Logger;
  serviceName: string;
  /** Optional async cleanup (close DB clients, flush, ...) run during shutdown. */
  onShutdown?: () => Promise<void> | void;
  /** Max time to wait for graceful shutdown before forcing exit. Default 10s. */
  shutdownTimeoutMs?: number;
}

/**
 * Boots the HTTP server and wires graceful shutdown (EOS-000 §23). Cloud Run sends
 * SIGTERM before reclaiming an instance; we stop accepting connections, drain, run
 * cleanup, then exit. Returns the {@link Server} so tests/callers can close it.
 */
export function startServer(options: StartServerOptions): Server {
  const { app, port, logger, serviceName, onShutdown, shutdownTimeoutMs = 10_000 } = options;

  const server = app.listen(port, () => {
    logger.info('server.started', { service: serviceName, port });
  });

  let shuttingDown = false;
  const shutdown = (signal: string): void => {
    if (shuttingDown) return;
    shuttingDown = true;
    logger.info('server.shutdown.begin', { signal });

    const forceTimer = setTimeout(() => {
      logger.error('server.shutdown.forced', { timeoutMs: shutdownTimeoutMs });
      process.exit(1);
    }, shutdownTimeoutMs);
    forceTimer.unref();

    server.close((err) => {
      void (async () => {
        try {
          if (err) throw err;
          await onShutdown?.();
          logger.info('server.shutdown.complete');
          clearTimeout(forceTimer);
          process.exit(0);
        } catch (shutdownErr) {
          logger.error('server.shutdown.error', {
            message: shutdownErr instanceof Error ? shutdownErr.message : String(shutdownErr),
          });
          clearTimeout(forceTimer);
          process.exit(1);
        }
      })();
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  return server;
}
