# AI Platform Collections (Sprint 4 — EOS-002-P3-Part-07, Book 5)

Collections owned by `ai-gateway-service`. All writes go through the service (Admin
SDK); client access is defined in `firebase/firestore.rules`.

## `prompts/` — Prompt Registry (EOS-005-P4)

Governed prompt documents; a `status: "production"` document overrides the in-code seed
for the same `promptId`, so prompts are managed without redeploys.

| Field | Type | Notes |
|---|---|---|
| `promptId` | string | e.g. `prompt.venue_recommendation` (doc id) |
| `name`, `description`, `category` | string | governance metadata |
| `version` | number | increments per approved revision |
| `status` | string | `draft` \| `production` \| `retired` — only `production` is served |
| `language` | string | `en` (hi/te variants planned) |
| `body` | string | template with `{{message}}`, `{{data}}`, `{{history}}` placeholders |

Client access: **none** (read and write denied).

## `ai_sessions/` — conversation state

| Field | Type | Notes |
|---|---|---|
| `id` | string | `ses_<uid>_<ms>` (doc id) |
| `userId` | string | owner |
| `eventId` | string? | set when the chat is grounded in an event |
| `messages` | array | `{role, content, at}` — capped at the last 30 turns |
| `createdAt`, `updatedAt` | string | ISO 8601 |

Client access: owner may **read** their own sessions; writes denied.

## `ai_usage/` — cost & telemetry (EOS-000 §109)

One record per orchestrated execution: `executionId` (doc id), `userId`, `sessionId`,
`intent`, `provider`, `model`, `inputTokens`, `outputTokens`, `latencyMs`, `success`,
`at`. Feeds the BigQuery cost pipeline later.

Client access: **none**.

## Indexes

All reads are by document id — no composite indexes required yet. Add
`ai_usage(userId, at desc)` when the usage dashboard lands.
