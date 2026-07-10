import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { buildTestApp } from './support/harness.js';

const auth = { Authorization: 'Bearer user' };

describe('AI gateway auth', () => {
  it('rejects unauthenticated chat (401)', async () => {
    const { app } = buildTestApp();
    const res = await request(app).post('/api/v1/ai/chat').send({ message: 'hi' });
    expect(res.status).toBe(401);
  });
});

describe('POST /api/v1/ai/chat', () => {
  it('venue intent: runs the venue skill and returns reply + explanation envelope', async () => {
    const { app, http } = buildTestApp();
    const res = await request(app)
      .post('/api/v1/ai/chat')
      .set(auth)
      .send({ message: 'find me a wedding venue' });

    expect(res.status).toBe(200);
    expect(res.body.reply).toBeTruthy();
    expect(res.body.sessionId).toBeTruthy();
    expect(res.body.explanation).toMatchObject({
      intent: 'search_venue',
      skillsUsed: ['skill.search_venues'],
    });
    expect(res.body.data['skill.search_venues'].items[0].venue.name).toBe('Grand Palace');
    // Delegated auth: the skill called venue-service with the caller's own token.
    expect(http.calls[0]).toMatchObject({
      method: 'POST',
      path: '/api/v1/venues/search',
      token: 'user',
    });
  });

  it('budget intent with an amount returns rupee allocations (Part-04 §10 defaults)', async () => {
    const { app } = buildTestApp();
    const res = await request(app)
      .post('/api/v1/ai/chat')
      .set(auth)
      .send({ message: 'split my budget of 200000 for the wedding' });
    expect(res.status).toBe(200);
    const allocation = res.body.data['skill.budget_allocation'];
    expect(allocation.total).toBe(200000);
    expect(allocation.allocations[0]).toMatchObject({
      category: 'Venue',
      percentage: 40,
      amount: 80000,
    });
  });

  it('maintains the session across turns', async () => {
    const { app } = buildTestApp();
    const first = await request(app)
      .post('/api/v1/ai/chat')
      .set(auth)
      .send({ message: 'show my events' });
    const second = await request(app)
      .post('/api/v1/ai/chat')
      .set(auth)
      .send({ message: 'give me a checklist', sessionId: first.body.sessionId });
    expect(second.status).toBe(200);
    expect(second.body.sessionId).toBe(first.body.sessionId);
  });

  it('records usage per execution (EOS-000 §109)', async () => {
    const { app, usage } = buildTestApp();
    await request(app).post('/api/v1/ai/chat').set(auth).send({ message: 'find a caterer' });
    expect(usage.records).toHaveLength(1);
    expect(usage.records[0]).toMatchObject({
      userId: 'u1',
      intent: 'search_vendor',
      success: true,
    });
  });

  it('low-confidence readiness without event asks for clarification (§20)', async () => {
    const { app, http } = buildTestApp();
    const res = await request(app)
      .post('/api/v1/ai/chat')
      .set(auth)
      .send({ message: 'am I on track?' });
    expect(res.status).toBe(200);
    expect(res.body.explanation.confidence).toBe('low');
    expect(http.calls).toHaveLength(0); // no skill executed
  });

  it('rejects an empty message (422)', async () => {
    const { app } = buildTestApp();
    const res = await request(app).post('/api/v1/ai/chat').set(auth).send({ message: '   ' });
    expect(res.status).toBe(422);
  });
});

describe('GET /api/v1/ai/readiness/:eventId', () => {
  it('returns the score with factor breakdown', async () => {
    const { app } = buildTestApp();
    const res = await request(app).get('/api/v1/ai/readiness/evt1').set(auth);
    expect(res.status).toBe(200);
    expect(res.body.score).toBeGreaterThan(30);
    expect(res.body.factors.length).toBe(5);
    expect(res.body.title).toBe('Birthday Bash');
  });
});

describe('GET /api/v1/ai/skills', () => {
  it('lists registered skill definitions with contracts', async () => {
    const { app } = buildTestApp();
    const res = await request(app).get('/api/v1/ai/skills').set(auth);
    expect(res.status).toBe(200);
    expect(res.body.items.length).toBe(6);
    expect(res.body.items[0]).toHaveProperty('inputSchema');
  });
});
