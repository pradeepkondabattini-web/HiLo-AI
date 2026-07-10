# ADR-013: LLM provider abstraction — Anthropic default, configuration-selected

- **Status:** Accepted
- **Date:** 2026-07-10
- **Deciders:** Pradeep, AI Engineering
- **Related:** EOS-000 §106 (interchangeable AI providers); EOS-000 §71 (secrets); ADR-012

## Context

EOS-000 §106 requires LLM providers to be interchangeable behind a port so no application
code depends on a specific vendor. The platform needs a concrete default for production
plus a deterministic mode for tests and keyless environments.

## Decision

- The domain port is `LlmProvider` (`complete(messages) → {text, tokens, model}`); all
  reasoning goes through it. Application code never imports a vendor SDK.
- **Three adapters** ship in Sprint 4:
  - `AnthropicLlmProvider` — the production default, via the official `@anthropic-ai/sdk`
    with model `claude-opus-4-8` and adaptive thinking.
  - `OpenAiLlmProvider` — secondary adapter over the REST API (no extra SDK dependency).
  - `FakeLlmProvider` — deterministic; used by tests and any deployment without a key.
- **Selection is configuration:** `LLM_PROVIDER` (or key presence) chooses the adapter;
  `LLM_MODEL` overrides the model. API keys live only in the environment/Secret Manager —
  never in source or logs. With no key configured, the platform degrades gracefully: the
  skills still run and the reply falls back to a deterministic summary.
- Every execution writes an `ai_usage` record (provider, model, tokens, latency) so
  provider cost/quality can be compared before switching (EOS-000 §109).

## Consequences

- Swapping providers is an env change + redeploy; adding one is a single adapter file.
- The Anthropic key must be provisioned via Cloud Run `--set-secrets` (Secret Manager)
  before production replies use a real model; until then responses are marked
  `model: "fake"` in the explanation envelope, which is honest and visible.
