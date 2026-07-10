# ADR-012: Deterministic Planning Engine + consolidated ai-gateway-service for MVP

- **Status:** Accepted
- **Date:** 2026-07-10
- **Deciders:** Pradeep, AI Engineering
- **Related:** EOS-002-P3-Part-07; EOS-005-P1/P2/P5/P8; EOS-000 §92–101; ADR-011

## Context

Book 5 prescribes the AI platform as separate components — AI Gateway, Planning Engine,
Orchestrator, Skill Registry, Prompt Registry, MCP Runtime — and an LLM-assisted intent
classifier. At MVP scale the same arguments as ADR-011 apply: separate deployables
multiply operational surface without an isolation benefit, and an LLM classifier adds
cost, latency, and non-determinism to every request before any value is produced.

## Decision

1. **One `ai-gateway-service`** hosts the gateway, planning engine, orchestrator, and the
   in-process Skill Registry. Internal seams follow the Book 5 component boundaries
   (separate domain modules with ports), so extraction into dedicated services later is a
   packaging change, not a rewrite. The MCP Runtime is deferred until an external-tool
   integration (WhatsApp, Canva, Maps) needs it.
2. **Intent classification is deterministic** (keyword rules) for MVP: auditable, free,
   instant, and unit-testable. It hides behind `classifyIntent()`; an LLM-assisted
   classifier can replace it behind the same signature. Low-confidence classifications
   ask a clarifying question instead of guessing (Part-07 §20).
3. **Skills before reasoning:** every plan runs deterministic business skills first
   (venue/vendor search, budget split, checklist, readiness), then one LLM step that
   narrates the skill data using a registry prompt. The LLM never fabricates business
   data; every response carries the explanation envelope (intent, skills used, data
   sources, model — EOS-000 §101).
4. **Sensitive actions stay with the user:** the AI never creates/mutates events, venues,
   or vendors. `create_event` intent produces guidance that points to the wizard
   (Part-07 §24 — AI proposes, the user acts).

## Consequences

- Recall is bounded by the keyword rules; unusual phrasings fall to `general_help`.
  Mitigated by clarification prompts and telemetry (`ai_usage` records intents).
- Single service means shared failure domain for all AI capabilities at MVP — accepted,
  same trade-off as ADR-011.
- The Firestore `prompts/` collection overrides seeded prompts at runtime, so prompt
  governance works without redeploys from day one.
