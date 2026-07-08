# ADR-002: Firestore as the operational database

- **Status:** Accepted
- **Date:** 2026-07-05
- **Deciders:** Pradeep, AI Engineering (per EOS-000)
- **Related:** EOS-000 §31–60; EOS-004-P1..P6 (Data Architecture, Firestore, Security Rules)

## Context

HiLo needs a scalable, low-latency operational datastore that integrates natively with
Firebase Authentication and Cloud Run, supports real-time updates for collaborative event
workflows, and enforces security at the data layer.

## Decision

We will use **Cloud Firestore** as the sole operational database, with **BigQuery** for
analytics and **Cloud Storage** for binary assets. No other operational database may be
introduced without a superseding ADR.

Mandatory data conventions:
- Every document carries `id, createdAt, updatedAt, createdBy, updatedBy, status, version,
  deleted` (and `tenantId`, `metadata` reserved for the future).
- **Soft delete only** (`deleted=true`, `deletedAt`, `deletedBy`); no physical deletes
  outside approved retention workflows.
- Server-generated timestamps; optimistic versioning on business-critical documents.
- **Cursor-based pagination** only (`limit` + `startAfter` + `orderBy`); never unbounded reads.
- Every production query is backed by an index; access is always via the Repository pattern —
  the UI never reads Firestore directly.

## Consequences

- Strong Firebase/GCP integration and real-time capability out of the box.
- Query patterns must be designed before indexes; composite indexes are documented and reviewed.
- NoSQL modeling (references + justified denormalization) rather than relational joins.

## Alternatives considered

- **Cloud SQL / PostgreSQL** — rejected for MVP; weaker real-time and mobile-SDK integration.
- **MongoDB / other NoSQL** — rejected; Firestore is native to the chosen Firebase/GCP stack.

## References

- EOS-000 §31–60 (Data Architecture & Constitution).
- Engineering Bible EOS-004-P1..P6.
