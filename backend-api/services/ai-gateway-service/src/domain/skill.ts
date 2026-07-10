/**
 * Skill Registry (EOS-005-P5 §7, §10–11). Skills are the only way the AI platform
 * performs business operations (EOS-000 §100–101): deterministic, permissioned, and
 * observable. Sprint 4 skills are in-process; MCP-hosted skills arrive with external
 * integrations (Sprint 6).
 */
export interface SkillDefinition {
  skillId: string;
  name: string;
  category: 'business' | 'external' | 'workflow';
  description: string;
  version: number;
  status: 'active' | 'deprecated';
  /** Human-readable input contract (JSON-schema-lite for MVP). */
  inputSchema: Record<string, string>;
  outputSchema: Record<string, string>;
  permissions: string[];
}

/** Execution context handed to every skill invocation. */
export interface SkillContext {
  /** Verified caller uid — skills act on behalf of the user. */
  uid: string;
  /** Caller's bearer token for delegated service-to-service calls. */
  bearerToken: string;
  eventId?: string;
}

export interface SkillResult {
  ok: boolean;
  /** Compact JSON-safe payload fed into LLM context and/or returned to the client. */
  data: unknown;
  /** One-line data-source note for the explainability envelope. */
  source: string;
}

export interface Skill {
  definition: SkillDefinition;
  execute(input: Record<string, unknown>, context: SkillContext): Promise<SkillResult>;
}

/** In-memory registry of the skills this deployment exposes. */
export class SkillRegistry {
  private readonly skills = new Map<string, Skill>();

  register(skill: Skill): this {
    this.skills.set(skill.definition.skillId, skill);
    return this;
  }

  get(skillId: string): Skill | undefined {
    return this.skills.get(skillId);
  }

  list(): SkillDefinition[] {
    return [...this.skills.values()].map((s) => s.definition);
  }
}
