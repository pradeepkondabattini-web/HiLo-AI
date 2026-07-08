import { randomUUID } from 'node:crypto';
import type { IdGenerator } from '../domain/ports.js';

/** Default {@link IdGenerator} backed by crypto.randomUUID. */
export class UuidIdGenerator implements IdGenerator {
  newId(): string {
    return randomUUID();
  }
}
