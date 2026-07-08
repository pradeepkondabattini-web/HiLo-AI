/**
 * Standard Firestore document metadata envelope (EOS-000 §35, EOS-004-P4 §3).
 *
 * Every persisted business document carries these fields. This module is framework
 * agnostic: timestamps are ISO-8601 strings at the domain boundary, and the Firestore
 * repository substitutes server timestamps on write (EOS-000 §39) so authoritative
 * records never depend on client/device clocks.
 */
export type IsoTimestamp = string;

/** Common lifecycle statuses. Domains may use their own additional values. */
export const DocumentStatus = {
  Active: 'active',
  Inactive: 'inactive',
  Suspended: 'suspended',
  Archived: 'archived',
} as const;

export interface DocumentMetadata {
  /** Document identifier (mirrors the Firestore document id). */
  id: string;
  /** Schema contract version — bumped on breaking schema changes (EOS-004-P4 §21). */
  schemaVersion: number;
  /** Optimistic-concurrency version — incremented on every update (EOS-000 §38). */
  version: number;
  status: string;
  /** Soft-delete flag — business docs are never hard-deleted (EOS-000 §37). */
  deleted: boolean;
  createdAt: IsoTimestamp;
  updatedAt: IsoTimestamp;
  /** Actor (uid or service id) that created the document. */
  createdBy: string;
  updatedBy: string;
  deletedAt?: IsoTimestamp;
  deletedBy?: string;
}

function iso(now: Date | undefined): IsoTimestamp {
  return (now ?? new Date()).toISOString();
}

/** Build the metadata envelope for a brand-new document (version 1, not deleted). */
export function createDocumentMetadata(params: {
  id: string;
  actorId: string;
  status: string;
  now?: Date;
  schemaVersion?: number;
}): DocumentMetadata {
  const timestamp = iso(params.now);
  return {
    id: params.id,
    schemaVersion: params.schemaVersion ?? 1,
    version: 1,
    status: params.status,
    deleted: false,
    createdAt: timestamp,
    updatedAt: timestamp,
    createdBy: params.actorId,
    updatedBy: params.actorId,
  };
}

/** Advance metadata for an update: bump version, refresh updatedAt/updatedBy. */
export function touchDocumentMetadata<T extends DocumentMetadata>(
  doc: T,
  actorId: string,
  now?: Date,
): T {
  return {
    ...doc,
    version: doc.version + 1,
    updatedAt: iso(now),
    updatedBy: actorId,
  };
}

/** Apply a soft delete (EOS-000 §37): set the tombstone fields and bump version. */
export function softDeleteDocumentMetadata<T extends DocumentMetadata>(
  doc: T,
  actorId: string,
  now?: Date,
): T {
  const timestamp = iso(now);
  return {
    ...doc,
    deleted: true,
    deletedAt: timestamp,
    deletedBy: actorId,
    version: doc.version + 1,
    updatedAt: timestamp,
    updatedBy: actorId,
  };
}
