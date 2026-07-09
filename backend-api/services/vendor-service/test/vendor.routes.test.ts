import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { buildTestApp, HYDERABAD } from './support/harness.js';

const as = (token: string) => ({ Authorization: `Bearer ${token}` });

describe('vendor search & details', () => {
  it('POST /search returns ranked vendors with breakdowns', async () => {
    const { app } = buildTestApp();
    const res = await request(app)
      .post('/api/v1/vendors/search')
      .set(as('consumer'))
      .send({ ...HYDERABAD, radiusKm: 20, budget: 600, category: 'Catering' });
    expect(res.status).toBe(200);
    expect(res.body.items).toHaveLength(1);
    expect(res.body.items[0].vendor.businessName).toBe('Paradise Caterers');
    expect(res.body.items[0]).toHaveProperty('breakdown');
  });

  it('search without category returns all in radius, ranked', async () => {
    const { app } = buildTestApp();
    const res = await request(app)
      .post('/api/v1/vendors/search')
      .set(as('consumer'))
      .send({ ...HYDERABAD, radiusKm: 20 });
    expect(res.status).toBe(200);
    expect(res.body.items.length).toBeGreaterThanOrEqual(3);
    const scores = res.body.items.map((i: { score: number }) => i.score);
    expect([...scores].sort((a, b) => b - a)).toEqual(scores);
  });

  it('minVerificationLevel filters unverified vendors', async () => {
    const { app } = buildTestApp();
    const res = await request(app)
      .post('/api/v1/vendors/search')
      .set(as('consumer'))
      .send({ ...HYDERABAD, radiusKm: 50, minVerificationLevel: 4 });
    expect(res.body.items).toHaveLength(1);
    expect(res.body.items[0].vendor.verificationLevel).toBe(4);
  });

  it('GET /:id returns details; unknown → 404', async () => {
    const { app } = buildTestApp();
    expect(
      (await request(app).get('/api/v1/vendors/vnd_seed_photo').set(as('consumer'))).status,
    ).toBe(200);
    expect((await request(app).get('/api/v1/vendors/nope').set(as('consumer'))).status).toBe(404);
  });
});

describe('onboarding (RBAC)', () => {
  const body = {
    businessName: 'New Biz',
    category: 'Decoration',
    city: 'Hyderabad',
    latitude: 17.4,
    longitude: 78.4,
  };

  it('consumer role is forbidden (403)', async () => {
    const { app } = buildTestApp();
    const res = await request(app).post('/api/v1/vendors/onboard').set(as('consumer')).send(body);
    expect(res.status).toBe(403);
  });

  it('business role can onboard once; second attempt conflicts (409)', async () => {
    const { app } = buildTestApp();
    const first = await request(app).post('/api/v1/vendors/onboard').set(as('business')).send(body);
    expect(first.status).toBe(201);
    expect(first.body.verificationLevel).toBe(0); // never self-verified
    const second = await request(app)
      .post('/api/v1/vendors/onboard')
      .set(as('business'))
      .send(body);
    expect(second.status).toBe(409);
  });

  it('rejects an unknown category (422)', async () => {
    const { app } = buildTestApp();
    const res = await request(app)
      .post('/api/v1/vendors/onboard')
      .set(as('business'))
      .send({ ...body, category: 'Rocketry' });
    expect(res.status).toBe(422);
  });
});

describe('quotes', () => {
  it('full happy path: request → submit → accept', async () => {
    const { app } = buildTestApp();
    const created = await request(app)
      .post('/api/v1/vendors/vnd_seed_caterer/quote')
      .set(as('consumer'))
      .send({ message: 'Wedding for 300, 12 Dec' });
    expect(created.status).toBe(201);
    expect(created.body.status).toBe('requested');
    const quoteId = created.body.id;

    // Vendor owner submits a proposal.
    const submitted = await request(app)
      .post(`/api/v1/vendors/quotes/${quoteId}/status`)
      .set(as('caterer'))
      .send({ status: 'submitted', proposedAmount: 135000 });
    expect(submitted.status).toBe(200);
    expect(submitted.body.proposedAmount).toBe(135000);

    // Requester accepts.
    const accepted = await request(app)
      .post(`/api/v1/vendors/quotes/${quoteId}/status`)
      .set(as('consumer'))
      .send({ status: 'accepted' });
    expect(accepted.status).toBe(200);
    expect(accepted.body.status).toBe('accepted');
  });

  it('requester cannot submit; vendor cannot accept; strangers are 403', async () => {
    const { app } = buildTestApp();
    const created = await request(app)
      .post('/api/v1/vendors/vnd_seed_caterer/quote')
      .set(as('consumer'))
      .send({});
    const quoteId = created.body.id;

    const requesterSubmit = await request(app)
      .post(`/api/v1/vendors/quotes/${quoteId}/status`)
      .set(as('consumer'))
      .send({ status: 'submitted' });
    expect(requesterSubmit.status).toBe(409);

    await request(app)
      .post(`/api/v1/vendors/quotes/${quoteId}/status`)
      .set(as('caterer'))
      .send({ status: 'submitted', proposedAmount: 1000 });
    const vendorAccept = await request(app)
      .post(`/api/v1/vendors/quotes/${quoteId}/status`)
      .set(as('caterer'))
      .send({ status: 'accepted' });
    expect(vendorAccept.status).toBe(409);

    const stranger = await request(app)
      .post(`/api/v1/vendors/quotes/${quoteId}/status`)
      .set(as('consumer2'))
      .send({ status: 'accepted' });
    expect(stranger.status).toBe(403);
  });

  it('quotes expire lazily after validity (7 days)', async () => {
    const { app, clock } = buildTestApp();
    const created = await request(app)
      .post('/api/v1/vendors/vnd_seed_caterer/quote')
      .set(as('consumer'))
      .send({});
    const quoteId = created.body.id;

    clock.advanceDays(8);

    const attempt = await request(app)
      .post(`/api/v1/vendors/quotes/${quoteId}/status`)
      .set(as('caterer'))
      .send({ status: 'submitted', proposedAmount: 1000 });
    expect(attempt.status).toBe(409); // expired → no further transitions

    const mine = await request(app).get('/api/v1/vendors/quotes').set(as('consumer'));
    expect(mine.body.requested[0].status).toBe('expired');
  });

  it('vendor owner cannot quote their own listing (400)', async () => {
    const { app } = buildTestApp();
    const res = await request(app)
      .post('/api/v1/vendors/vnd_seed_caterer/quote')
      .set(as('caterer'))
      .send({});
    expect(res.status).toBe(400);
  });
});

describe('trust recalculation (admin)', () => {
  it('admin can trigger; consumer is forbidden', async () => {
    const { app } = buildTestApp();
    const admin = await request(app).post('/api/v1/vendors/trust/recalculate').set(as('admin'));
    expect(admin.status).toBe(200);
    expect(admin.body.updated).toBeGreaterThan(0);

    const consumer = await request(app)
      .post('/api/v1/vendors/trust/recalculate')
      .set(as('consumer'));
    expect(consumer.status).toBe(403);
  });
});
