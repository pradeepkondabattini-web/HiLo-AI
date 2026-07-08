# ADR-005: AI Gateway pipeline + LLM provider abstraction

- **Status:** Accepted
- **Date:** 2026-07-05
- **Deciders:** Pradeep, AI Engineering (per EOS-000)
- **Related:** EOS-000 §11, §91–113, §106; Book 05 (AI Platform)

## Context

AI is the operating system of HiLo, not a feature. The platform must remain governable,
observable, testable, and independent of any single LLM vendor, while preventing ad-hoc LLM
calls scattered through application code.

## Decision

Every AI request flows through the mandatory pipeline, with no component skipped:

```
Application → AI Gateway → Planning Engine → AI Orchestrator → Skill Registry
           → MCP Runtime (if tools) → LLM → Response Validator → Application
```

- The **AI Gateway is the sole entry point** to the AI platform. Application/feature code
  never calls an LLM directly.
- **Prompts are managed assets** in the Prompt Registry and versioned; prompts are never
  hardcoded and never embed secrets.
- Business capability lives in **Skills** (Skill Registry), not in prompts or the orchestrator.
- External tools execute only through the **MCP Runtime** under least privilege.
- **Provider abstraction:** the LLM is an interchangeable execution engine. Swapping providers
  must not require application code changes. Every AI response is validated before use.

## Consequences

- Uniform observability (tokens, cost, latency, prompt/skill versions) and safety validation.
- Higher upfront platform investment (Gateway, registries, orchestrator) — delivered from Sprint 4.
- HiLo owns business logic, planning, prompts, memory, and governance; vendors provide reasoning only.

## Open point — concrete provider selection

EOS-000 §8 names the *OpenAI Responses API*, while §106 mandates provider independence
including OpenAI, Google, and Anthropic. The **default provider and model** are deferred to a
follow-up ADR at Sprint 4, decided behind this abstraction. This ADR fixes the *architecture*
(gateway + provider abstraction), not the vendor.

## Alternatives considered

- **Direct SDK calls from features** — rejected; violates governance, observability, and
  provider independence (EOS-000 §113).

## References

- EOS-000 §11, §91–113 (AI Platform), §106 (Model Abstraction).
- Engineering Bible Book 05 (EOS-005-P1..P12).
