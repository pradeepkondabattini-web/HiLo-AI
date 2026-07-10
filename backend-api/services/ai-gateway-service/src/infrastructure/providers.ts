import Anthropic from '@anthropic-ai/sdk';
import type { LlmMessage, LlmProvider, LlmResult } from '../domain/llm-provider.js';

/**
 * LLM provider adapters (ADR-013). The platform is provider-agnostic: the adapter is
 * selected by configuration, and swapping providers requires no application changes
 * (EOS-000 §106). Keys come from the environment only — never from source (EOS-000 §71).
 */

/** Deterministic provider for tests and keyless local/dev deployments. */
export class FakeLlmProvider implements LlmProvider {
  readonly id = 'fake';

  async complete(messages: LlmMessage[]): Promise<LlmResult> {
    const user = messages.filter((m) => m.role === 'user').at(-1)?.content ?? '';
    return {
      text: `((fake-llm)) You said: "${user.slice(0, 120)}". The deterministic skill data below has the details.`,
      inputTokens: 0,
      outputTokens: 0,
      model: 'fake',
    };
  }
}

/** Anthropic Claude via the official SDK. Default model: claude-opus-4-8. */
export class AnthropicLlmProvider implements LlmProvider {
  readonly id = 'anthropic';
  private readonly client: Anthropic;

  constructor(
    apiKey: string,
    private readonly model: string = 'claude-opus-4-8',
  ) {
    this.client = new Anthropic({ apiKey });
  }

  async complete(messages: LlmMessage[], options?: { maxTokens?: number }): Promise<LlmResult> {
    const system = messages
      .filter((m) => m.role === 'system')
      .map((m) => m.content)
      .join('\n\n');
    const turns = messages
      .filter((m): m is LlmMessage & { role: 'user' | 'assistant' } => m.role !== 'system')
      .map((m) => ({ role: m.role, content: m.content }));

    const response = await this.client.messages.create({
      model: this.model,
      // Chat replies are deliberately short; cap well below the streaming threshold.
      max_tokens: options?.maxTokens ?? 2048,
      thinking: { type: 'adaptive' },
      ...(system ? { system } : {}),
      messages: turns,
    });

    const text = response.content
      .filter((block): block is Anthropic.TextBlock => block.type === 'text')
      .map((block) => block.text)
      .join('');
    return {
      text,
      inputTokens: response.usage.input_tokens,
      outputTokens: response.usage.output_tokens,
      model: response.model,
    };
  }
}

/** OpenAI chat-completions via REST (no SDK dependency for the secondary adapter). */
export class OpenAiLlmProvider implements LlmProvider {
  readonly id = 'openai';

  constructor(
    private readonly apiKey: string,
    private readonly model: string = 'gpt-4o',
  ) {}

  async complete(messages: LlmMessage[], options?: { maxTokens?: number }): Promise<LlmResult> {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${this.apiKey}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: this.model,
        max_tokens: options?.maxTokens ?? 2048,
        messages,
      }),
    });
    if (!res.ok) {
      throw new Error(`OpenAI request failed: HTTP ${res.status}`);
    }
    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
      usage?: { prompt_tokens?: number; completion_tokens?: number };
      model?: string;
    };
    return {
      text: data.choices?.[0]?.message?.content ?? '',
      inputTokens: data.usage?.prompt_tokens ?? 0,
      outputTokens: data.usage?.completion_tokens ?? 0,
      model: data.model ?? this.model,
    };
  }
}

/** Select the provider from configuration (ADR-013: the env ratifies the default). */
export function createLlmProvider(env: NodeJS.ProcessEnv): LlmProvider {
  const explicit = env.LLM_PROVIDER;
  if (explicit === 'anthropic' || (!explicit && env.ANTHROPIC_API_KEY)) {
    if (!env.ANTHROPIC_API_KEY)
      throw new Error('LLM_PROVIDER=anthropic requires ANTHROPIC_API_KEY');
    return new AnthropicLlmProvider(env.ANTHROPIC_API_KEY, env.LLM_MODEL || undefined);
  }
  if (explicit === 'openai' || (!explicit && env.OPENAI_API_KEY)) {
    if (!env.OPENAI_API_KEY) throw new Error('LLM_PROVIDER=openai requires OPENAI_API_KEY');
    return new OpenAiLlmProvider(env.OPENAI_API_KEY, env.LLM_MODEL || undefined);
  }
  // No key provisioned → deterministic degraded mode (skills still work end-to-end).
  return new FakeLlmProvider();
}
