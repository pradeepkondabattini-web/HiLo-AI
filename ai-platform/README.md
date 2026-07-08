# ai-platform/

The AI-native core of HiLo. Every AI request follows the mandatory pipeline
(EOS-000 §11, §92):

```
Application → AI Gateway → Planning Engine → AI Orchestrator → Skill Registry
           → MCP Runtime (if tools) → LLM → Response Validator → Application
```

Houses the AI Gateway (sole LLM entry point), Planning Engine, Orchestrator, Prompt
Registry, Skill Registry, Memory Manager, Knowledge Graph, and MCP Runtime.

**Non-negotiables:** never call an LLM from application code; never hardcode prompts;
provider-abstracted (LLMs are interchangeable); every AI response validated before use.

Populated from **Sprint 4** onward (Book 05). See [ADR-005](../docs/adr/ADR-005-ai-gateway-provider-abstraction.md).
