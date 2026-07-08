# ADR-009: Event writes are API-mediated (client Firestore writes denied)

- **Status:** Accepted
- **Date:** 2026-07-05
- **Deciders:** Pradeep, AI Engineering
- **Related:** EOS-000 §30, §57; EOS-004-P6 §8; EOS-002-P3-Part-04 §7, §24

## Context

Two rules interact for the `events` domain:

- **EOS-004-P6 §8** lists `events` write access as **Owner**, suggesting clients write their
  own event documents directly in Firestore.
- **EOS-000 §30 & §57** are emphatic that **the UI never touches Firestore directly** —
  all access flows Presentation → Application → Repository → API.

Events also carry a **lifecycle state machine** (Draft → … → Archived) and invariants
(one owner, archived read-only, name-editable-until-completion, budget consistency) that
must be enforced server-side. Direct client writes could bypass the state machine.

## Decision

All event-domain writes (`events/`, `event_members/`, `event_budgets/`) are performed
**only by event-service via the Firebase Admin SDK**, which bypasses security rules.
Firestore security rules therefore **deny all client writes** to these collections and
allow only **member reads** of `events/` (and self-reads of `event_members/`). This
supersedes the literal "write = Owner" reading of EOS-004-P6 §8 for the events domain,
resolving it in favor of EOS-000 §30/§57.

Ownership/authorization (owner vs co-host vs guest) is enforced in the service as ABAC
checks (see `event-service`), not via client-side Firestore writes.

## Consequences

- The lifecycle state machine and all invariants are enforced in exactly one place.
- Clients read events directly (real-time capable) but mutate only through the API.
- Offline-first write queues (future) will sync through event-service, not direct writes.
- `event_budgets` are read via the API (rules deny direct client reads) to avoid a
  per-read event-membership lookup in rules; revisit if direct real-time budget reads are
  needed.

## Alternatives considered

- **Owner/co-host client writes with rule-enforced invariants** — rejected; Firestore
  rules cannot express the full lifecycle state machine, so integrity would be at risk and
  logic duplicated between rules and service.

## References

- EOS-000 §30 (Architectural Constraints), §57 (Data Access Rules).
- EOS-004-P6 §8; EOS-002-P3-Part-04 §7, §24.
