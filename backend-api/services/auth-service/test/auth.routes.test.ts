import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { buildTestHarness, type TestHarness } from './support/fakes.js';

const CONSUMER_TOKEN = 'tok-consumer';
const ADMIN_TOKEN = 'tok-admin';

function seedIdentities(h: TestHarness) {
  h.verifier.register(CONSUMER_TOKEN, {
    uid: 'u1',
    email: 'u1@example.com',
    emailVerified: true,
    signInProvider: 'password',
  });
  h.verifier.register(ADMIN_TOKEN, {
    uid: 'admin1',
    email: 'admin@example.com',
    emailVerified: true,
    signInProvider: 'password',
    roles: ['admin'],
  });
}

let h: TestHarness;
beforeEach(() => {
  h = buildTestHarness();
  seedIdentities(h);
});

const bearer = (t: string) => ({ Authorization: `Bearer ${t}` });

describe('authentication', () => {
  it('rejects requests with no Authorization header (401)', async () => {
    const res = await request(h.app).get('/api/v1/auth/me');
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });

  it('rejects an unknown/invalid token (401)', async () => {
    const res = await request(h.app).get('/api/v1/auth/me').set(bearer('garbage'));
    expect(res.status).toBe(401);
  });
});

describe('POST /bootstrap', () => {
  it('creates a new user with default role and mirrors claims on first login', async () => {
    const res = await request(h.app).post('/api/v1/auth/bootstrap').set(bearer(CONSUMER_TOKEN));
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      id: 'u1',
      email: 'u1@example.com',
      roles: ['consumer'],
      accountStatus: 'active',
      authProvider: 'email',
      emailVerified: true,
    });
    // Default roles were written to custom claims.
    expect(h.roleClaims.calls).toEqual([{ uid: 'u1', roles: ['consumer'] }]);
  });

  it('is idempotent — a second call does not duplicate or re-issue claims', async () => {
    await request(h.app).post('/api/v1/auth/bootstrap').set(bearer(CONSUMER_TOKEN));
    const res = await request(h.app).post('/api/v1/auth/bootstrap').set(bearer(CONSUMER_TOKEN));
    expect(res.status).toBe(200);
    expect(res.body.id).toBe('u1');
    expect(h.roleClaims.calls).toHaveLength(1); // not called again on return login
  });
});

describe('GET /me', () => {
  it('returns 404 before bootstrap', async () => {
    const res = await request(h.app).get('/api/v1/auth/me').set(bearer(CONSUMER_TOKEN));
    expect(res.status).toBe(404);
  });

  it('returns the profile after bootstrap', async () => {
    await request(h.app).post('/api/v1/auth/bootstrap').set(bearer(CONSUMER_TOKEN));
    const res = await request(h.app).get('/api/v1/auth/me').set(bearer(CONSUMER_TOKEN));
    expect(res.status).toBe(200);
    expect(res.body.id).toBe('u1');
  });
});

describe('PATCH /me', () => {
  beforeEach(async () => {
    await request(h.app).post('/api/v1/auth/bootstrap').set(bearer(CONSUMER_TOKEN));
  });

  it('updates whitelisted profile fields and bumps version', async () => {
    const res = await request(h.app)
      .patch('/api/v1/auth/me')
      .set(bearer(CONSUMER_TOKEN))
      .send({ displayName: 'Pradeep', city: 'Hyderabad', preferredLanguage: 'te' });
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      displayName: 'Pradeep',
      city: 'Hyderabad',
      preferredLanguage: 'te',
    });
    const stored = await h.users.findById('u1');
    expect(stored?.version).toBe(2);
  });

  it('ignores attempts to change roles via profile update (no self-escalation)', async () => {
    const res = await request(h.app)
      .patch('/api/v1/auth/me')
      .set(bearer(CONSUMER_TOKEN))
      .send({ displayName: 'X', roles: ['admin'] });
    expect(res.status).toBe(200);
    expect(res.body.roles).toEqual(['consumer']);
  });

  it('rejects an empty displayName (422)', async () => {
    const res = await request(h.app)
      .patch('/api/v1/auth/me')
      .set(bearer(CONSUMER_TOKEN))
      .send({ displayName: '   ' });
    expect(res.status).toBe(422);
    expect(res.body.error.code).toBe('VALIDATION_FAILED');
  });
});

describe('POST /users/:uid/roles (admin only)', () => {
  beforeEach(async () => {
    await request(h.app).post('/api/v1/auth/bootstrap').set(bearer(CONSUMER_TOKEN));
    await request(h.app).post('/api/v1/auth/bootstrap').set(bearer(ADMIN_TOKEN));
  });

  it('lets an admin assign roles and propagates claims', async () => {
    const res = await request(h.app)
      .post('/api/v1/auth/users/u1/roles')
      .set(bearer(ADMIN_TOKEN))
      .send({ roles: ['consumer', 'business'] });
    expect(res.status).toBe(200);
    expect(res.body.roles).toEqual(['consumer', 'business']);
    expect(h.roleClaims.calls).toContainEqual({ uid: 'u1', roles: ['consumer', 'business'] });
  });

  it('forbids a non-admin from assigning roles (403)', async () => {
    const res = await request(h.app)
      .post('/api/v1/auth/users/u1/roles')
      .set(bearer(CONSUMER_TOKEN))
      .send({ roles: ['admin'] });
    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe('FORBIDDEN');
  });

  it('drops unknown role names, keeping only approved roles', async () => {
    const res = await request(h.app)
      .post('/api/v1/auth/users/u1/roles')
      .set(bearer(ADMIN_TOKEN))
      .send({ roles: ['business', 'superuser'] });
    expect(res.status).toBe(200);
    expect(res.body.roles).toEqual(['business']);
  });

  it('rejects a malformed roles payload with a non-string entry (422)', async () => {
    const res = await request(h.app)
      .post('/api/v1/auth/users/u1/roles')
      .set(bearer(ADMIN_TOKEN))
      .send({ roles: ['business', 123] });
    expect(res.status).toBe(422);
    expect(res.body.error.code).toBe('VALIDATION_FAILED');
  });
});
