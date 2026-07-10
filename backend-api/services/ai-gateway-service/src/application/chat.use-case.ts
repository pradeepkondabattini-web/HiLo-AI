import { AppError } from '@hilo/backend-shared';
import { buildPlan } from '../domain/planning-engine.js';
import type {
  AiSession,
  AiSessionRepository,
  Clock,
  Explanation,
  UsageRecorder,
} from '../domain/session.js';
import type { SkillContext } from '../domain/skill.js';
import type { Orchestrator } from './orchestrator.js';

export interface ChatRequest {
  uid: string;
  bearerToken: string;
  message: string;
  sessionId?: string;
  eventId?: string;
}

export interface ChatResponse {
  sessionId: string;
  reply: string;
  explanation: Explanation;
  data: Record<string, unknown>;
}

/**
 * The AI request lifecycle (EOS-005-P1 §6): session → plan → orchestrate → validate →
 * persist → usage record. The gateway route stays thin; this use case is the pipeline.
 */
export class ChatUseCase {
  constructor(
    private readonly sessions: AiSessionRepository,
    private readonly orchestrator: Orchestrator,
    private readonly usage: UsageRecorder,
    private readonly clock: Clock,
  ) {}

  async execute(request: ChatRequest): Promise<ChatResponse> {
    const message = request.message.trim();
    if (!message) throw AppError.validation('message must not be empty');
    if (message.length > 2000) throw AppError.validation('message exceeds 2000 characters');

    const startedAt = this.clock.now();
    const session = await this.loadOrCreateSession(request);
    const plan = buildPlan(message, request.eventId ?? session.eventId);

    // Low confidence → ask, don't guess (Part-07 §20).
    if (plan.clarification && plan.steps.length === 0) {
      const response: ChatResponse = {
        sessionId: session.id,
        reply: plan.clarification,
        explanation: {
          intent: plan.intent,
          confidence: plan.confidence,
          skillsUsed: [],
          dataSources: [],
        },
        data: {},
      };
      await this.persistTurn(session, message, response.reply);
      return response;
    }

    const context: SkillContext = {
      uid: request.uid,
      bearerToken: request.bearerToken,
      eventId: request.eventId ?? session.eventId,
    };

    const result = await this.orchestrator.execute(plan, message, session, context);
    await this.persistTurn(session, message, result.reply);

    const finishedAt = this.clock.now();
    await this.usage.record({
      executionId: `exe_${session.id}_${finishedAt.getTime()}`,
      userId: request.uid,
      sessionId: session.id,
      intent: plan.intent,
      provider: result.model === 'none' ? 'none' : result.model,
      model: result.model,
      inputTokens: result.inputTokens,
      outputTokens: result.outputTokens,
      latencyMs: finishedAt.getTime() - startedAt.getTime(),
      success: true,
      at: finishedAt.toISOString(),
    });

    return {
      sessionId: session.id,
      reply: result.reply,
      explanation: result.explanation,
      data: result.data,
    };
  }

  private async loadOrCreateSession(request: ChatRequest): Promise<AiSession> {
    if (request.sessionId) {
      const existing = await this.sessions.find(request.sessionId);
      if (existing) {
        if (existing.userId !== request.uid) {
          // Cross-user context leakage guard (EOS-000 §80).
          throw AppError.forbidden('This conversation belongs to another account');
        }
        return existing;
      }
    }
    const now = this.clock.now().toISOString();
    return {
      id: `ses_${request.uid}_${this.clock.now().getTime()}`,
      userId: request.uid,
      eventId: request.eventId,
      messages: [],
      createdAt: now,
      updatedAt: now,
    };
  }

  private async persistTurn(session: AiSession, userMessage: string, reply: string): Promise<void> {
    const at = this.clock.now().toISOString();
    session.messages.push({ role: 'user', content: userMessage, at });
    session.messages.push({ role: 'assistant', content: reply, at });
    // Bound session size (EOS-000 §97 — avoid context bloat).
    session.messages = session.messages.slice(-30);
    session.updatedAt = at;
    await this.sessions.save(session);
  }
}
