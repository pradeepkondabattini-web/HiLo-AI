# ADR-008: Multi-role `users` schema (`roles[]`)

- **Status:** Accepted
- **Date:** 2026-07-05
- **Deciders:** Pradeep, AI Engineering
- **Related:** EOS-002-P3-Part-02 §4, §13; EOS-004-P4 §4; EOS-000 §35, §66

## Context

Two Engineering Bible documents describe the `users` record differently:

- **EOS-002-P3-Part-02** (Authentication & Identity) §4 states *"A user may possess
  multiple roles"* and its §13 example shows `"roles": ["consumer"]` — an **array**.
- **EOS-004-P4** (Firestore Document Schemas) §4 lists a singular `role: string`
  (`Consumer, Vendor, Admin`).

These conflict. Multi-role is a stated **functional requirement** (one account acting as
Consumer, Business, and Guest — Part-02 §4), so the singular field cannot express it.

## Decision

The `users` document stores **`roles: string[]`** (a non-empty array from the approved
role set: `consumer`, `guest`, `business`, `admin`). New accounts default to
`['consumer']`. This follows the functional owner (Part-02) and supersedes the singular
`role` field in EOS-004-P4 §4 for this collection.

Roles are also mirrored into Firebase Auth **custom claims** for RBAC at the API and in
Firestore rules (EOS-000 §66). Role changes are performed only by the backend
(auth-service via the Admin SDK); clients cannot self-escalate (enforced in security
rules — see Sprint 1B rules).

The document also carries the mandatory metadata envelope (EOS-000 §35): `id, createdAt,
updatedAt, createdBy, updatedBy, status, version, deleted` plus `schemaVersion`
(EOS-004-P4 §3).

## Consequences

- Supports one-account-many-roles without a migration later.
- Authorization checks are permission/role-set based, not single-role based.
- EOS-004-P4 §4 should be updated to `roles[]` when the bible is next revised; this ADR
  is the interim source of truth for the `users` schema.

## Alternatives considered

- **Singular `role` (as in EOS-004-P4)** — rejected; cannot represent the required
  multi-role accounts and would force a breaking migration.
- **Separate `user_roles` join collection** — rejected for MVP; unnecessary complexity
  for a small, bounded role set that fits in the user document and custom claims.

## References

- EOS-002-P3-Part-02 §4, §13; EOS-004-P4 §3–4; EOS-000 §35, §66.
