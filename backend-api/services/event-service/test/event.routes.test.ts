import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { buildTestApp } from './support/harness.js';

const OWNER = 'owner1';
const bearer = (t: string) => ({ Authorization: `Bearer ${t}` });

let ctx: ReturnType<typeof buildTestApp>;
beforeEach(() => {
  ctx = buildTestApp();
  ctx.verifier.registerUser(OWNER);
  ctx.verifier.registerUser('guest1');
});

const validBody = {
  title: 'Birthday Party',
  category: 'birthday',
  eventDate: '2026-08-01',
  city: 'Hyderabad',
  guestCount: 40,
  totalBudget: 100_000,
};

async function createEvent(token = OWNER) {
  return request(ctx.app).post('/api/v1/events').set(bearer(token)).send(validBody);
}

describe('event API auth', () => {
  it('rejects unauthenticated requests (401)', async () => {
    const res = await request(ctx.app).get('/api/v1/events');
    expect(res.status).toBe(401);
  });
});

describe('POST /api/v1/events', () => {
  it('creates an event + default budget (201)', async () => {
    const res = await createEvent();
    expect(res.status).toBe(201);
    expect(res.body.event).toMatchObject({
      status: 'draft',
      ownerId: OWNER,
      title: 'Birthday Party',
    });
    expect(res.body.budget).toMatchObject({ totalAmount: 100_000, currency: 'INR' });
  });

  it('validates the body (422)', async () => {
    const res = await request(ctx.app)
      .post('/api/v1/events')
      .set(bearer(OWNER))
      .send({ ...validBody, guestCount: 0 });
    expect(res.status).toBe(422);
    expect(res.body.error.code).toBe('VALIDATION_FAILED');
  });
});

describe('event lifecycle + access', () => {
  it('reads own event, forbids strangers', async () => {
    const created = await createEvent();
    const id = created.body.event.id;

    const ok = await request(ctx.app).get(`/api/v1/events/${id}`).set(bearer(OWNER));
    expect(ok.status).toBe(200);

    ctx.verifier.registerUser('stranger');
    const forbidden = await request(ctx.app).get(`/api/v1/events/${id}`).set(bearer('stranger'));
    expect(forbidden.status).toBe(403);
  });

  it('transitions status through the state machine and rejects illegal jumps', async () => {
    const id = (await createEvent()).body.event.id;

    const planning = await request(ctx.app)
      .post(`/api/v1/events/${id}/status`)
      .set(bearer(OWNER))
      .send({ status: 'planning' });
    expect(planning.status).toBe(200);
    expect(planning.body.status).toBe('planning');

    const illegal = await request(ctx.app)
      .post(`/api/v1/events/${id}/status`)
      .set(bearer(OWNER))
      .send({ status: 'completed' });
    expect(illegal.status).toBe(400);
  });

  it('adds a member and lets them read the event', async () => {
    const id = (await createEvent()).body.event.id;
    const add = await request(ctx.app)
      .post(`/api/v1/events/${id}/members`)
      .set(bearer(OWNER))
      .send({ userId: 'guest1', role: 'guest' });
    expect(add.status).toBe(201);

    const read = await request(ctx.app).get(`/api/v1/events/${id}`).set(bearer('guest1'));
    expect(read.status).toBe(200);
  });

  it('updates the budget with recomputed allocations', async () => {
    const id = (await createEvent()).body.event.id;
    const res = await request(ctx.app)
      .put(`/api/v1/events/${id}/budget`)
      .set(bearer(OWNER))
      .send({ totalAmount: 200_000 });
    expect(res.status).toBe(200);
    expect(
      res.body.allocations.find((a: { category: string }) => a.category === 'venue'),
    ).toMatchObject({
      amount: 80_000,
    });
  });

  it('soft-deletes an event (204) after which it is not found', async () => {
    const id = (await createEvent()).body.event.id;
    const del = await request(ctx.app).delete(`/api/v1/events/${id}`).set(bearer(OWNER));
    expect(del.status).toBe(204);
    const read = await request(ctx.app).get(`/api/v1/events/${id}`).set(bearer(OWNER));
    expect(read.status).toBe(404);
  });

  it('lists events the caller belongs to', async () => {
    await createEvent();
    await createEvent();
    const res = await request(ctx.app).get('/api/v1/events?limit=10').set(bearer(OWNER));
    expect(res.status).toBe(200);
    expect(res.body.items).toHaveLength(2);
  });
});
