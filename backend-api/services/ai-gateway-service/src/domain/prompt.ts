/**
 * Prompt Registry entities (EOS-005-P4 §5, §7). Prompts are versioned, governed assets —
 * never hardcoded in business code (EOS-000 §98). The registry is Firestore-backed with
 * seeded defaults so the platform still boots before prompts are authored in the console.
 */
export interface Prompt {
  promptId: string;
  name: string;
  category: string;
  description: string;
  version: number;
  status: 'draft' | 'approved' | 'production' | 'deprecated';
  language: string;
  /** Template body. `{{variable}}` placeholders are filled by the context injector. */
  body: string;
}

export interface PromptRepository {
  /** Latest production version of a prompt, or null when not registered. */
  findActive(promptId: string): Promise<Prompt | null>;
}

/** Fill `{{variable}}` placeholders. Unknown variables render as empty strings. */
export function renderPrompt(prompt: Prompt, variables: Record<string, string>): string {
  return prompt.body.replace(/\{\{(\w+)\}\}/g, (_, key: string) => variables[key] ?? '');
}
