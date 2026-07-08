import { Router } from 'express';

/**
 * A readiness check: returns true when the dependency is ready to serve traffic.
 * Services register checks (Firestore reachable, migrations applied, ...).
 */
export interface ReadinessCheck {
  name: string;
  check: () => Promise<boolean> | boolean;
}

export interface HealthRouterOptions {
  serviceName: string;
  version: string;
  readinessChecks?: ReadinessCheck[];
}

/**
 * Liveness and readiness endpoints (EOS-000 §23, §28).
 *
 * - `GET /health`  — liveness: the process is up. Always 200 unless the process is dead.
 * - `GET /ready`   — readiness: all registered dependency checks pass, else 503.
 */
export function createHealthRouter(options: HealthRouterOptions): Router {
  const router = Router();
  const { serviceName, version, readinessChecks = [] } = options;

  router.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok', service: serviceName, version });
  });

  router.get('/ready', async (_req, res) => {
    const results = await Promise.all(
      readinessChecks.map(async (c) => {
        try {
          return { name: c.name, ready: await c.check() };
        } catch {
          return { name: c.name, ready: false };
        }
      }),
    );
    const ready = results.every((r) => r.ready);
    res.status(ready ? 200 : 503).json({
      status: ready ? 'ready' : 'not_ready',
      service: serviceName,
      version,
      checks: results,
    });
  });

  return router;
}
