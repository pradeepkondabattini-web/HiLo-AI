import { describe, it, expect, beforeEach } from 'vitest';
import { buildHarness, validCreateInput } from './support/harness.js';
import { EventStatus } from '../src/domain/event-status.js';
import { EventMemberRole } from '../src/domain/event-member.js';

const OWNER = 'owner1';
const STRANGER = 'stranger1';

let h: ReturnType<typeof buildHarness>;
beforeEach(() => {
  h = buildHarness();
});

describe('CreateEvent', () => {
  it('creates a draft event, owner membership, and a default budget', async () => {
    const { event, budget } = await h.createEvent.execute(OWNER, validCreateInput);
    expect(event).toMatchObject({
      id: 'id-1',
      status: EventStatus.Draft,
      ownerId: OWNER,
      coHostIds: [],
      memberIds: [OWNER],
      version: 1,
      deleted: false,
      budgetId: 'id-2',
    });
    expect(budget).toMatchObject({
      id: 'id-2',
      eventId: 'id-1',
      currency: 'INR',
      totalAmount: 100_000,
    });
    expect(budget.allocations.find((a) => a.category === 'venue')).toMatchObject({
      amount: 40_000,
    });

    const ownerMember = await h.members.findByEventAndUser('id-1', OWNER);
    expect(ownerMember).toMatchObject({ userId: OWNER, role: EventMemberRole.Owner });
  });

  it('rejects a non-positive guest count', async () => {
    await expect(
      h.createEvent.execute(OWNER, { ...validCreateInput, guestCount: 0 }),
    ).rejects.toMatchObject({ statusCode: 422 });
  });

  it('rejects an empty title', async () => {
    await expect(
      h.createEvent.execute(OWNER, { ...validCreateInput, title: '  ' }),
    ).rejects.toMatchObject({ statusCode: 422 });
  });
});

describe('GetEvent (ABAC)', () => {
  it('lets a member read but forbids a stranger and 404s missing', async () => {
    const { event } = await h.createEvent.execute(OWNER, validCreateInput);
    await expect(h.getEvent.execute(OWNER, event.id)).resolves.toMatchObject({ id: event.id });
    await expect(h.getEvent.execute(STRANGER, event.id)).rejects.toMatchObject({ statusCode: 403 });
    await expect(h.getEvent.execute(OWNER, 'missing')).rejects.toMatchObject({ statusCode: 404 });
  });
});

describe('AddMember', () => {
  it('owner adds a guest and the event membership is updated', async () => {
    const { event } = await h.createEvent.execute(OWNER, validCreateInput);
    const member = await h.addMember.execute({
      actorUid: OWNER,
      eventId: event.id,
      userId: 'guest1',
      role: EventMemberRole.Guest,
    });
    expect(member).toMatchObject({ userId: 'guest1', role: EventMemberRole.Guest });
    const updated = await h.getEvent.execute(OWNER, event.id);
    expect(updated.memberIds).toContain('guest1');
    // The guest can now read the event.
    await expect(h.getEvent.execute('guest1', event.id)).resolves.toMatchObject({ id: event.id });
  });

  it('only the owner can add co-hosts', async () => {
    const { event } = await h.createEvent.execute(OWNER, validCreateInput);
    await h.addMember.execute({
      actorUid: OWNER,
      eventId: event.id,
      userId: 'co1',
      role: EventMemberRole.CoHost,
    });
    // co1 is a co-host; co-hosts can add guests but not other co-hosts.
    await h.addMember.execute({
      actorUid: 'co1',
      eventId: event.id,
      userId: 'g1',
      role: EventMemberRole.Guest,
    });
    await expect(
      h.addMember.execute({
        actorUid: 'co1',
        eventId: event.id,
        userId: 'co2',
        role: EventMemberRole.CoHost,
      }),
    ).rejects.toMatchObject({ statusCode: 403 });
  });

  it('rejects assigning owner and duplicate members', async () => {
    const { event } = await h.createEvent.execute(OWNER, validCreateInput);
    await expect(
      h.addMember.execute({
        actorUid: OWNER,
        eventId: event.id,
        userId: 'x',
        role: EventMemberRole.Owner,
      }),
    ).rejects.toMatchObject({ statusCode: 400 });
    await h.addMember.execute({
      actorUid: OWNER,
      eventId: event.id,
      userId: 'g1',
      role: EventMemberRole.Guest,
    });
    await expect(
      h.addMember.execute({
        actorUid: OWNER,
        eventId: event.id,
        userId: 'g1',
        role: EventMemberRole.Guest,
      }),
    ).rejects.toMatchObject({ statusCode: 409 });
  });
});

describe('UpdateEvent', () => {
  it('owner updates fields and version is bumped', async () => {
    const { event } = await h.createEvent.execute(OWNER, validCreateInput);
    const updated = await h.updateEvent.execute(OWNER, event.id, {
      title: 'New Title',
      guestCount: 60,
    });
    expect(updated).toMatchObject({
      title: 'New Title',
      guestCount: 60,
      version: 2,
      updatedBy: OWNER,
    });
  });

  it('forbids a non-manager', async () => {
    const { event } = await h.createEvent.execute(OWNER, validCreateInput);
    await expect(h.updateEvent.execute(STRANGER, event.id, { title: 'X' })).rejects.toMatchObject({
      statusCode: 403,
    });
  });

  it('blocks the title change once completed but allows other edits', async () => {
    const { event } = await h.createEvent.execute(OWNER, validCreateInput);
    const stored = (await h.events.findById(event.id))!;
    await h.events.update({ ...stored, status: EventStatus.Completed });
    await expect(h.updateEvent.execute(OWNER, event.id, { title: 'Nope' })).rejects.toMatchObject({
      statusCode: 409,
    });
    await expect(h.updateEvent.execute(OWNER, event.id, { notes: 'ok' })).resolves.toMatchObject({
      notes: 'ok',
    });
  });

  it('rejects any write to an archived event', async () => {
    const { event } = await h.createEvent.execute(OWNER, validCreateInput);
    const stored = (await h.events.findById(event.id))!;
    await h.events.update({ ...stored, status: EventStatus.Archived });
    await expect(h.updateEvent.execute(OWNER, event.id, { notes: 'x' })).rejects.toMatchObject({
      statusCode: 409,
    });
  });
});

describe('TransitionStatus', () => {
  it('advances along the pipeline and can cancel', async () => {
    const { event } = await h.createEvent.execute(OWNER, validCreateInput);
    const planning = await h.transition.execute(OWNER, event.id, EventStatus.Planning);
    expect(planning.status).toBe(EventStatus.Planning);
    const cancelled = await h.transition.execute(OWNER, event.id, EventStatus.Cancelled);
    expect(cancelled.status).toBe(EventStatus.Cancelled);
  });

  it('rejects an illegal transition', async () => {
    const { event } = await h.createEvent.execute(OWNER, validCreateInput);
    await expect(h.transition.execute(OWNER, event.id, EventStatus.Ready)).rejects.toMatchObject({
      statusCode: 400,
    });
  });

  it('forbids a non-manager', async () => {
    const { event } = await h.createEvent.execute(OWNER, validCreateInput);
    await expect(
      h.transition.execute(STRANGER, event.id, EventStatus.Planning),
    ).rejects.toMatchObject({ statusCode: 403 });
  });
});

describe('UpdateBudget', () => {
  it('recomputes allocation amounts from a new total', async () => {
    const { event } = await h.createEvent.execute(OWNER, validCreateInput);
    const budget = await h.updateBudget.execute(OWNER, event.id, { totalAmount: 200_000 });
    expect(budget.totalAmount).toBe(200_000);
    expect(budget.allocations.find((a) => a.category === 'venue')).toMatchObject({
      amount: 80_000,
    });
  });

  it('forbids a non-manager', async () => {
    const { event } = await h.createEvent.execute(OWNER, validCreateInput);
    await expect(
      h.updateBudget.execute(STRANGER, event.id, { totalAmount: 1 }),
    ).rejects.toMatchObject({ statusCode: 403 });
  });
});

describe('DeleteEvent (soft)', () => {
  it('owner soft-deletes and the event becomes unreadable', async () => {
    const { event } = await h.createEvent.execute(OWNER, validCreateInput);
    await h.deleteEvent.execute(OWNER, event.id);
    await expect(h.getEvent.execute(OWNER, event.id)).rejects.toMatchObject({ statusCode: 404 });
    const stored = await h.events.findById(event.id);
    expect(stored?.deleted).toBe(true);
  });

  it('forbids a non-owner (co-host cannot delete)', async () => {
    const { event } = await h.createEvent.execute(OWNER, validCreateInput);
    await h.addMember.execute({
      actorUid: OWNER,
      eventId: event.id,
      userId: 'co1',
      role: EventMemberRole.CoHost,
    });
    await expect(h.deleteEvent.execute('co1', event.id)).rejects.toMatchObject({ statusCode: 403 });
  });
});

describe('ListEvents (cursor pagination)', () => {
  it('returns the member events newest-first and paginates', async () => {
    for (let i = 0; i < 3; i++) {
      await h.createEvent.execute(OWNER, { ...validCreateInput, title: `E${i}` });
      h.clock.advance(1000);
    }
    const page1 = await h.listEvents.execute(OWNER, { limit: 2 });
    expect(page1.items).toHaveLength(2);
    expect(page1.nextCursor).toBeTruthy();

    const page2 = await h.listEvents.execute(OWNER, { limit: 2, cursor: page1.nextCursor });
    expect(page2.items).toHaveLength(1);
    expect(page2.nextCursor).toBeNull();

    // A stranger sees nothing.
    const none = await h.listEvents.execute(STRANGER, { limit: 10 });
    expect(none.items).toHaveLength(0);
  });
});
