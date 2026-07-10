import { createLogger, type TokenVerifier, type VerifiedIdentity } from '@hilo/backend-shared';
import { ChatUseCase } from '../../src/application/chat.use-case.js';
import { Orchestrator } from '../../src/application/orchestrator.js';
import { SkillRegistry } from '../../src/domain/skill.js';
import type { Clock } from '../../src/domain/session.js';
import { FakeLlmProvider } from '../../src/infrastructure/providers.js';
import {
  InMemoryAiSessionRepository,
  InMemoryUsageRecorder,
  SeededPromptRepository,
} from '../../src/infrastructure/repositories.js';
import {
  budgetAllocationSkill,
  generateChecklistSkill,
  listMyEventsSkill,
  readinessScoreSkill,
  searchVendorsSkill,
  searchVenuesSkill,
} from '../../src/skills/business-skills.js';
import type { ServiceHttp } from '../../src/skills/http-client.js';
import { buildApp } from '../../src/server.js';
import type { AiRouteDeps } from '../../src/presentation/ai.routes.js';

export class FakeTokenVerifier implements TokenVerifier {
  async verify(token: string): Promise<VerifiedIdentity> {
    if (token === 'user') return { uid: 'u1', emailVerified: true, roles: ['consumer'] };
    const { AppError } = await import('@hilo/backend-shared');
    throw AppError.unauthorized('Invalid token');
  }
}

/** Canned upstream responses keyed by path prefix; records calls for assertions. */
export class FakeServiceHttp implements ServiceHttp {
  readonly calls: { method: string; path: string; token: string }[] = [];

  async get(path: string, token: string): Promise<unknown> {
    this.calls.push({ method: 'GET', path, token });
    if (path.startsWith('/api/v1/events/evt1')) {
      return {
        id: 'evt1',
        title: 'Birthday Bash',
        status: 'planning',
        guestCount: 40,
        budgetId: 'bud1',
        eventDate: new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString(),
      };
    }
    if (path.startsWith('/api/v1/events')) {
      return { items: [{ id: 'evt1', title: 'Birthday Bash', status: 'planning' }] };
    }
    throw new Error(`Unexpected GET ${path}`);
  }

  async post(path: string, token: string): Promise<unknown> {
    this.calls.push({ method: 'POST', path, token });
    if (path.startsWith('/api/v1/venues/search')) {
      return { items: [{ venue: { name: 'Grand Palace' }, score: 0.9 }] };
    }
    if (path.startsWith('/api/v1/vendors/search')) {
      return { items: [{ vendor: { businessName: 'Paradise Caterers' }, score: 0.88 }] };
    }
    throw new Error(`Unexpected POST ${path}`);
  }
}

export const fixedClock: Clock = { now: () => new Date('2026-07-10T10:00:00.000Z') };

export function buildTestApp() {
  const http = new FakeServiceHttp();
  const skills = new SkillRegistry()
    .register(searchVenuesSkill(http))
    .register(searchVendorsSkill(http))
    .register(listMyEventsSkill(http))
    .register(budgetAllocationSkill())
    .register(generateChecklistSkill())
    .register(readinessScoreSkill(http));

  const sessions = new InMemoryAiSessionRepository();
  const usage = new InMemoryUsageRecorder();
  const deps: AiRouteDeps = {
    verifier: new FakeTokenVerifier(),
    chat: new ChatUseCase(
      sessions,
      new Orchestrator(skills, new SeededPromptRepository(), new FakeLlmProvider()),
      usage,
      fixedClock,
    ),
    skills,
  };

  const logger = createLogger({
    serviceName: 'ai-gateway-service',
    environment: 'test',
    level: 'error',
    sink: () => {},
  });
  return { app: buildApp(logger, deps), http, usage, sessions };
}
