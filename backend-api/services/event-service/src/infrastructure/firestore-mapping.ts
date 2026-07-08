import { FieldValue, type DocumentData } from 'firebase-admin/firestore';
import type { DocumentMetadata } from '@hilo/backend-shared';

/**
 * Serialize a domain document for Firestore, applying server timestamps to
 * `createdAt`/`updatedAt` (EOS-000 §39). Authoritative records never trust client clocks.
 */
export function toFirestore<T extends DocumentMetadata>(
  doc: T,
  opts: { create: boolean },
): DocumentData {
  const { createdAt: _createdAt, updatedAt: _updatedAt, ...rest } = doc;
  return {
    ...rest,
    updatedAt: FieldValue.serverTimestamp(),
    ...(opts.create ? { createdAt: FieldValue.serverTimestamp() } : {}),
  };
}

function toIso(value: unknown): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (typeof (value as { toDate?: () => Date }).toDate === 'function') {
    return (value as { toDate: () => Date }).toDate().toISOString();
  }
  return '';
}

/** Convert a Firestore document (Timestamps) back into a domain document (ISO strings). */
export function fromFirestore<T extends DocumentMetadata>(data: DocumentData): T {
  return {
    ...data,
    createdAt: toIso(data.createdAt),
    updatedAt: toIso(data.updatedAt),
    ...(data.deletedAt ? { deletedAt: toIso(data.deletedAt) } : {}),
  } as T;
}
