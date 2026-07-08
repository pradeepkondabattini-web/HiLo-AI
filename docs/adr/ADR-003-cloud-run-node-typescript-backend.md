# ADR-003: Cloud Run + Node.js/TypeScript for backend services

- **Status:** Accepted
- **Date:** 2026-07-05
- **Deciders:** Pradeep, AI Engineering (per EOS-000)
- **Related:** EOS-000 §8, §20–28; EOS-003-P4 (Cloud Run Microservices Architecture)

## Context

HiLo's backend must scale elastically to zero, deploy as independent microservices per
business capability, and integrate with the Firebase Admin SDK and GCP services while
remaining stateless and observable.

## Decision

We will implement backend microservices in **Node.js + TypeScript**, using **Express**
where an HTTP framework is appropriate, deployed as containers on **Cloud Run**. Services
are organized by business capability (`auth-service`, `event-service`, ...); each owns its
own API surface and never accesses another service's private data.

Every service must:
- be stateless and horizontally scalable;
- expose `/health` (liveness) and `/ready` (readiness) endpoints;
- use Dependency Injection (no direct instantiation of infrastructure in business logic);
- emit structured logs with correlation IDs (never logging PII/tokens/secrets);
- return the standard error envelope (code, message, correlationId, timestamp, optional details);
- verify Firebase ID tokens on every protected route.

## Consequences

- Consistent language/tooling across services (TypeScript, ESLint, Prettier) enforced in CI.
- Scale-to-zero economics; container images published to Artifact Registry.
- Shared cross-cutting concerns live in `backend-api/shared/`.

## Alternatives considered

- **Firebase Cloud Functions only** — rejected as the primary compute; less control over
  scaling, cold starts, and service boundaries for larger services (may still be used for
  event-driven glue).
- **Go / Java services** — rejected for MVP; TypeScript chosen in EOS-000 for velocity and
  shared models with the wider stack.

## References

- EOS-000 §8 (Stack), §20–28 (Microservices, API, Service Design, Observability).
- Engineering Bible EOS-003-P4.
