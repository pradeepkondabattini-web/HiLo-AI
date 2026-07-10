import type { Confidence, Intent } from './planning-engine.js';

/**
 * Conversation + observability entities (EOS-002-P3-Part-07 §21, EOS-000 §109).
 * Sessions live in `ai_sessions/`; every execution records usage into `ai_usage/`.
 */
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  at: string;
}

export interface AiSession {
  id: string;
  userId: string;
  eventId?: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface AiSessionRepository {
  find(sessionId: string): Promise<AiSession | null>;
  save(session: AiSession): Promise<AiSession>;
}

/** Explainability envelope shipped with every AI response (EOS-000 §101, Part-07 §11). */
export interface Explanation {
  intent: Intent;
  confidence: Confidence;
  skillsUsed: string[];
  dataSources: string[];
  promptId?: string;
  model?: string;
}

/** One usage record per execution (EOS-000 §109 — observability is mandatory). */
export interface UsageRecord {
  executionId: string;
  userId: string;
  sessionId: string;
  intent: Intent;
  provider: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  latencyMs: number;
  success: boolean;
  at: string;
}

export interface UsageRecorder {
  record(usage: UsageRecord): Promise<void>;
}

export interface Clock {
  now(): Date;
}

export const systemClock: Clock = { now: () => new Date() };
