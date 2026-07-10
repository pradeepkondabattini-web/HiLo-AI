import type { Firestore } from 'firebase-admin/firestore';
import type { Prompt, PromptRepository } from '../domain/prompt.js';
import type {
  AiSession,
  AiSessionRepository,
  UsageRecord,
  UsageRecorder,
} from '../domain/session.js';
import { PROMPT_SEEDS } from './prompt-seeds.js';

const PROMPTS = 'prompts';
const SESSIONS = 'ai_sessions';
const USAGE = 'ai_usage';

/**
 * Firestore-backed Prompt Registry (EOS-005-P4 §18) with seed fallback: an approved
 * `prompts/{promptId}` document (status=production) overrides the seed, so prompts can be
 * governed in the console without a deploy.
 */
export class FirestorePromptRepository implements PromptRepository {
  constructor(private readonly db: Firestore) {}

  async findActive(promptId: string): Promise<Prompt | null> {
    const snap = await this.db.collection(PROMPTS).doc(promptId).get();
    if (snap.exists) {
      const prompt = snap.data() as Prompt;
      if (prompt.status === 'production') return prompt;
    }
    return PROMPT_SEEDS.find((p) => p.promptId === promptId) ?? null;
  }
}

export class FirestoreAiSessionRepository implements AiSessionRepository {
  constructor(private readonly db: Firestore) {}

  async find(sessionId: string): Promise<AiSession | null> {
    const snap = await this.db.collection(SESSIONS).doc(sessionId).get();
    return snap.exists ? (snap.data() as AiSession) : null;
  }

  async save(session: AiSession): Promise<AiSession> {
    await this.db.collection(SESSIONS).doc(session.id).set(session);
    return session;
  }
}

export class FirestoreUsageRecorder implements UsageRecorder {
  constructor(private readonly db: Firestore) {}

  async record(usage: UsageRecord): Promise<void> {
    await this.db.collection(USAGE).doc(usage.executionId).set(usage);
  }
}

// ─── In-memory fakes (tests / keyless local dev) ────────────────────────────

export class SeededPromptRepository implements PromptRepository {
  async findActive(promptId: string): Promise<Prompt | null> {
    return PROMPT_SEEDS.find((p) => p.promptId === promptId) ?? null;
  }
}

export class InMemoryAiSessionRepository implements AiSessionRepository {
  private readonly store = new Map<string, AiSession>();

  async find(sessionId: string): Promise<AiSession | null> {
    const found = this.store.get(sessionId);
    return found ? structuredClone(found) : null;
  }

  async save(session: AiSession): Promise<AiSession> {
    this.store.set(session.id, structuredClone(session));
    return structuredClone(session);
  }
}

export class InMemoryUsageRecorder implements UsageRecorder {
  readonly records: UsageRecord[] = [];
  async record(usage: UsageRecord): Promise<void> {
    this.records.push(usage);
  }
}
