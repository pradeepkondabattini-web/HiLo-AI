import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { buildTestApp } from './support/harness.js';
import { SERVICE_NAME, SERVICE_VERSION } from '../src/server.js';

describe('event-service health', () => {
  it('GET /health returns 200 with service metadata', async () => {
    const { app } = buildTestApp();
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      status: 'ok',
      service: SERVICE_NAME,
      version: SERVICE_VERSION,
    });
  });

  it('GET /ready returns 200 when no checks are registered', async () => {
    const { app } = buildTestApp();
    const res = await request(app).get('/ready');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ready');
  });

  it('unknown route returns the standard 404 error envelope', async () => {
    const { app } = buildTestApp();
    const res = await request(app).get('/nope');
    expect(res.status).toBe(404);
    expect(res.body.error).toMatchObject({ code: 'NOT_FOUND' });
  });
});
