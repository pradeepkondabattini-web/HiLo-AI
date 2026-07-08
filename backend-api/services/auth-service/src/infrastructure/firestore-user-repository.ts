import {
  FieldValue,
  type DocumentData,
  type Firestore,
  type Timestamp,
} from 'firebase-admin/firestore';
import { AppError } from '@hilo/backend-shared';
import type { UserRepository } from '../domain/user-repository.js';
import type { User } from '../domain/user.js';

const COLLECTION = 'users';

/**
 * Firestore-backed {@link UserRepository}. Uses server timestamps for `createdAt` /
 * `updatedAt` on write (EOS-000 §39) and maps Firestore `Timestamp`s back to ISO strings
 * on read. Document id is the Firebase uid.
 */
export class FirestoreUserRepository implements UserRepository {
  constructor(private readonly db: Firestore) {}

  private collection() {
    return this.db.collection(COLLECTION);
  }

  async findById(uid: string): Promise<User | null> {
    const snap = await this.collection().doc(uid).get();
    return snap.exists ? fromFirestore(snap.data()!) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const query = await this.collection().where('email', '==', email).limit(1).get();
    const doc = query.docs[0];
    return doc ? fromFirestore(doc.data()) : null;
  }

  async create(user: User): Promise<User> {
    const ref = this.collection().doc(user.id);
    await this.db.runTransaction(async (tx) => {
      const existing = await tx.get(ref);
      if (existing.exists) {
        throw AppError.conflict(`User already exists: ${user.id}`);
      }
      tx.set(ref, toFirestore(user, { create: true }));
    });
    const created = await ref.get();
    return fromFirestore(created.data()!);
  }

  async update(user: User): Promise<User> {
    const ref = this.collection().doc(user.id);
    await ref.set(toFirestore(user, { create: false }), { merge: true });
    const updated = await ref.get();
    return fromFirestore(updated.data()!);
  }
}

/** Serialize a domain User for Firestore, applying server timestamps. */
function toFirestore(user: User, opts: { create: boolean }): Record<string, unknown> {
  const { createdAt: _createdAt, updatedAt: _updatedAt, ...rest } = user;
  return {
    ...rest,
    updatedAt: FieldValue.serverTimestamp(),
    ...(opts.create ? { createdAt: FieldValue.serverTimestamp() } : {}),
  };
}

/** Convert a Firestore document (with Timestamps) back into a domain User. */
function fromFirestore(data: DocumentData): User {
  return {
    ...data,
    createdAt: toIso(data.createdAt),
    updatedAt: toIso(data.updatedAt),
    ...(data.deletedAt ? { deletedAt: toIso(data.deletedAt) } : {}),
  } as User;
}

function toIso(value: Timestamp | string | undefined): string {
  if (!value) return '';
  return typeof value === 'string' ? value : value.toDate().toISOString();
}
