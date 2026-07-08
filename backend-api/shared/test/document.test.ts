import { describe, it, expect } from 'vitest';
import {
  createDocumentMetadata,
  touchDocumentMetadata,
  softDeleteDocumentMetadata,
  DocumentStatus,
} from '../src/domain/document.js';

const fixedNow = new Date('2026-07-05T10:00:00.000Z');
const laterNow = new Date('2026-07-06T10:00:00.000Z');

describe('createDocumentMetadata', () => {
  it('produces a version-1, non-deleted envelope with matching timestamps', () => {
    const meta = createDocumentMetadata({
      id: 'usr_1',
      actorId: 'usr_1',
      status: DocumentStatus.Active,
      now: fixedNow,
    });
    expect(meta).toMatchObject({
      id: 'usr_1',
      schemaVersion: 1,
      version: 1,
      status: 'active',
      deleted: false,
      createdBy: 'usr_1',
      updatedBy: 'usr_1',
      createdAt: '2026-07-05T10:00:00.000Z',
      updatedAt: '2026-07-05T10:00:00.000Z',
    });
    expect(meta.deletedAt).toBeUndefined();
  });
});

describe('touchDocumentMetadata', () => {
  it('bumps version and refreshes updatedAt/updatedBy but preserves created* fields', () => {
    const created = createDocumentMetadata({
      id: 'usr_1',
      actorId: 'usr_1',
      status: DocumentStatus.Active,
      now: fixedNow,
    });
    const updated = touchDocumentMetadata(created, 'admin_1', laterNow);
    expect(updated.version).toBe(2);
    expect(updated.updatedBy).toBe('admin_1');
    expect(updated.updatedAt).toBe('2026-07-06T10:00:00.000Z');
    expect(updated.createdBy).toBe('usr_1');
    expect(updated.createdAt).toBe('2026-07-05T10:00:00.000Z');
  });
});

describe('softDeleteDocumentMetadata', () => {
  it('sets the tombstone fields and bumps version', () => {
    const created = createDocumentMetadata({
      id: 'usr_1',
      actorId: 'usr_1',
      status: DocumentStatus.Active,
      now: fixedNow,
    });
    const deleted = softDeleteDocumentMetadata(created, 'admin_1', laterNow);
    expect(deleted.deleted).toBe(true);
    expect(deleted.deletedAt).toBe('2026-07-06T10:00:00.000Z');
    expect(deleted.deletedBy).toBe('admin_1');
    expect(deleted.version).toBe(2);
  });
});
