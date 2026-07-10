/**
 * LLM provider abstraction (EOS-000 §106, ADR-013). LLMs are interchangeable execution
 * engines — HiLo owns prompts, planning, and governance; providers supply reasoning.
 * Swapping providers must never require application code changes.
 */
export interface LlmMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LlmResult {
  text: string;
  inputTokens: number;
  outputTokens: number;
  model: string;
}

export interface LlmProvider {
  /** Provider id for observability (e.g. "anthropic", "openai", "fake"). */
  readonly id: string;
  complete(messages: LlmMessage[], options?: { maxTokens?: number }): Promise<LlmResult>;
}
