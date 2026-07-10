import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { FirebaseTokenVerifier } from '@hilo/backend-shared';
import { ChatUseCase } from './application/chat.use-case.js';
import { Orchestrator } from './application/orchestrator.js';
import { systemClock } from './domain/session.js';
import { SkillRegistry } from './domain/skill.js';
import { getFirebaseApp } from './infrastructure/firebase.js';
import { createLlmProvider } from './infrastructure/providers.js';
import {
  FirestoreAiSessionRepository,
  FirestorePromptRepository,
  FirestoreUsageRecorder,
} from './infrastructure/repositories.js';
import {
  budgetAllocationSkill,
  generateChecklistSkill,
  listMyEventsSkill,
  readinessScoreSkill,
  searchVendorsSkill,
  searchVenuesSkill,
} from './skills/business-skills.js';
import { FetchServiceHttp } from './skills/http-client.js';
import type { AiRouteDeps } from './presentation/ai.routes.js';
import type { AiGatewayConfig } from './config.js';

/** Composition root (EOS-000 §24) — the only place infrastructure is constructed. */
export function buildAiDeps(config: AiGatewayConfig): AiRouteDeps {
  const app = getFirebaseApp(config.projectId);
  const auth = getAuth(app);
  const db = getFirestore(app);
  // Optional fields may be undefined — never persist them as Firestore errors.
  db.settings({ ignoreUndefinedProperties: true });

  const http = new FetchServiceHttp(config.servicesBaseUrl);
  const skills = new SkillRegistry()
    .register(searchVenuesSkill(http))
    .register(searchVendorsSkill(http))
    .register(listMyEventsSkill(http))
    .register(budgetAllocationSkill())
    .register(generateChecklistSkill())
    .register(readinessScoreSkill(http));

  const orchestrator = new Orchestrator(
    skills,
    new FirestorePromptRepository(db),
    createLlmProvider(process.env),
  );

  return {
    verifier: new FirebaseTokenVerifier(auth),
    chat: new ChatUseCase(
      new FirestoreAiSessionRepository(db),
      orchestrator,
      new FirestoreUsageRecorder(db),
      systemClock,
    ),
    skills,
  };
}
