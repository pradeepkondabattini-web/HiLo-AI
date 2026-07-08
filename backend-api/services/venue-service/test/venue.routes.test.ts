import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { buildTestApp, HYDERABAD } from './support/harness.js';

const bearer = { Authorization: 'Bearer good' };

describe('venue-service routes', () => {
  it('GET /health returns 200', async () => {
    const { app } = buildTestApp();
    expect((await request(app).get('/health')).status).toBe(200);
  });

  it('rejects search without a token (401)', async () => {
    const { app } = buildTestApp();
    const res = await request(app)
      .post('/api/v1/venues/search')
      .send({ ...HYDERABAD, guestCount: 100 });
    expect(res.status).toBe(401);
  });

  it('POST /search returns ranked items with a score breakdown', async () => {
    const { app } = buildTestApp();
    const res = await request(app)
      .post('/api/v1/venues/search')
      .set(bearer)
      .send({ ...HYDERABAD, radiusKm: 50, guestCount: 200, budgetPerPlate: 1500 });
    expect(res.status).toBe(200);
    expect(res.body.items).toHaveLength(5);
    expect(res.body.items[0].score).toBeGreaterThanOrEqual(res.body.items[1].score);
    expect(res.body.items[0]).toHaveProperty('breakdown');
    expect(res.body.items[0]).toHaveProperty('distanceKm');
  });

  it('search validation: missing latitude → 422', async () => {
    const { app } = buildTestApp();
    const res = await request(app)
      .post('/api/v1/venues/search')
      .set(bearer)
      .send({ longitude: 78.4, guestCount: 100 });
    expect(res.status).toBe(422);
  });

  it('GET /:id returns a venue; unknown → 404', async () => {
    const { app } = buildTestApp();
    const ok = await request(app).get('/api/v1/venues/ven_hilo_taj').set(bearer);
    expect(ok.status).toBe(200);
    expect(ok.body.name).toContain('Taj');
    const missing = await request(app).get('/api/v1/venues/nope').set(bearer);
    expect(missing.status).toBe(404);
  });

  it('POST /compare returns venues; more than 4 → 422', async () => {
    const { app } = buildTestApp();
    const ok = await request(app)
      .post('/api/v1/venues/compare')
      .set(bearer)
      .send({ venueIds: ['ven_hilo_taj', 'ven_g_novotel'] });
    expect(ok.status).toBe(200);
    expect(ok.body.items).toHaveLength(2);

    const tooMany = await request(app)
      .post('/api/v1/venues/compare')
      .set(bearer)
      .send({ venueIds: ['a', 'b', 'c', 'd', 'e'] });
    expect(tooMany.status).toBe(422);
  });

  it('favourites: add → list → remove', async () => {
    const { app } = buildTestApp();
    const add = await request(app)
      .post('/api/v1/venues/favourites')
      .set(bearer)
      .send({ venueId: 'ven_hilo_taj', note: 'love it' });
    expect(add.status).toBe(201);
    expect(add.body.venueId).toBe('ven_hilo_taj');

    const list = await request(app).get('/api/v1/venues/favourites').set(bearer);
    expect(list.status).toBe(200);
    expect(list.body.items).toHaveLength(1);

    const del = await request(app).delete('/api/v1/venues/favourites/ven_hilo_taj').set(bearer);
    expect(del.status).toBe(204);

    const after = await request(app).get('/api/v1/venues/favourites').set(bearer);
    expect(after.body.items).toHaveLength(0);
  });
});
