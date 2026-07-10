import type { LlmProvider } from '../domain/llm-provider.js';
import type { ExecutionPlan } from '../domain/planning-engine.js';
import { renderPrompt, type PromptRepository } from '../domain/prompt.js';
import type { AiSession, Explanation } from '../domain/session.js';
import type { SkillContext, SkillRegistry, SkillResult } from '../domain/skill.js';

export interface OrchestrationResult {
  reply: string;
  explanation: Explanation;
  /** Structured skill outputs the client may render natively (cards, scores). */
  data: Record<string, unknown>;
  inputTokens: number;
  outputTokens: number;
  model: string;
}

/**
 * AI Orchestrator (EOS-005-P2, EOS-000 §96): executes the Planning Engine's plan —
 * skills first (deterministic business data), then LLM reasoning over their results
 * using a registry prompt. Contains no business logic itself; that lives in skills.
 * Every response carries the explainability envelope (EOS-000 §101).
 */
export class Orchestrator {
  constructor(
    private readonly skills: SkillRegistry,
    private readonly prompts: PromptRepository,
    private readonly llm: LlmProvider,
  ) {}

  async execute(
    plan: ExecutionPlan,
    message: string,
    session: AiSession,
    context: SkillContext,
  ): Promise<OrchestrationResult> {
    const skillResults: Record<string, SkillResult> = {};
    const skillsUsed: string[] = [];
    const dataSources: string[] = [];
    let reply = '';
    let promptId: string | undefined;
    let inputTokens = 0;
    let outputTokens = 0;
    let model = 'none';

    for (const step of plan.steps) {
      if (step.kind === 'skill') {
        const skill = this.skills.get(step.ref);
        if (!skill) continue;
        const result = await skill.execute(step.input ?? {}, context);
        skillResults[step.ref] = result;
        skillsUsed.push(step.ref);
        dataSources.push(result.source);
        continue;
      }

      // LLM reasoning step — prompt comes from the registry, never hardcoded.
      promptId = step.ref;
      const prompt = await this.prompts.findActive(step.ref);
      if (!prompt) {
        // Governance guard: without an approved prompt the platform degrades to the
        // deterministic skill data rather than improvising (EOS-000 §98).
        reply = summarizeWithoutLlm(skillResults);
        continue;
      }

      const history = session.messages
        .slice(-6)
        .map((m) => `${m.role}: ${m.content}`)
        .join('\n');
      const rendered = renderPrompt(prompt, {
        message,
        data: JSON.stringify(skillResults, null, 2).slice(0, 6000),
        history,
      });
      const result = await this.llm.complete([
        { role: 'system', content: rendered },
        { role: 'user', content: message },
      ]);
      reply = result.text;
      inputTokens += result.inputTokens;
      outputTokens += result.outputTokens;
      model = result.model;
    }

    return {
      reply: reply || summarizeWithoutLlm(skillResults),
      explanation: {
        intent: plan.intent,
        confidence: plan.confidence,
        skillsUsed,
        dataSources,
        promptId,
        model,
      },
      data: Object.fromEntries(Object.entries(skillResults).map(([id, r]) => [id, r.data])),
      inputTokens,
      outputTokens,
      model,
    };
  }
}

/** Deterministic fallback reply when no LLM/prompt is available. */
function summarizeWithoutLlm(results: Record<string, SkillResult>): string {
  const ids = Object.keys(results);
  if (ids.length === 0) {
    return 'I can help you plan events, find venues and vendors, split budgets, and build checklists. What are you working on?';
  }
  return `Here's what I found from ${ids
    .map((id) => id.replace('skill.', '').replace(/_/g, ' '))
    .join(', ')} — see the details below.`;
}
