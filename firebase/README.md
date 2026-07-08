# firebase/

Firestore/Storage security rules and index sources for HiLo (EOS).

| File | Purpose |
|------|---------|
| `firestore.rules` | **Deny-by-default** security rules + reusable helper library (EOS-004-P6) |
| `firestore.indexes.json` | Composite index definitions (empty baseline) |
| `storage.rules` | **Deny-by-default** Cloud Storage rules |

> The Firebase CLI/MCP entry points (`firebase.json`, `.firebaserc`) live at the **repo
> root** — the Firebase tooling expects them there — and reference the rule files in this
> folder. Default project: **`hilo-23078`**.

## Local development (no paid keys required)

```bash
# from repo root
firebase emulators:start
```

Emulator ports: Auth `9099`, Firestore `8080`, Storage `9199`, Emulator UI `4000`.

## Security posture

Both rule sets start from **deny-all**; access is granted explicitly per collection/path
as each domain slice lands (users/roles/sessions in Sprint 1B, events in Sprint 1C).
Rules must never be weakened for convenience (EOS-000 §89). Every document is expected to
carry the mandatory metadata fields (`id, createdAt, updatedAt, createdBy, updatedBy,
status, version, deleted`) and use soft delete only.

### Auth domain rules (Sprint 1B — EOS-002-P3-Part-02, EOS-004-P6 §8)

| Collection | Read | Write |
|------------|------|-------|
| `users/{uid}` | self only | self create/update of **profile fields only**; `roles`, `accountStatus`, and verification flags are locked (managed by auth-service via the Admin SDK, which bypasses rules). No client delete. |
| `roles/{id}` | any signed-in user (master data) | backend/admin only |
| `sessions/{id}` | own sessions | backend-managed |

This blocks privilege **self-escalation**: a client cannot grant itself roles by writing
its own user document. Schemas: [`docs/database/auth-collections.md`](../docs/database/auth-collections.md).

> **Verification pending:** these rules are structurally validated (helpers resolve,
> braces balance) but not yet exercised — emulator-based rules tests
> (`@firebase/rules-unit-testing`) are added once the Firebase CLI is available locally.
> Verify with `firebase emulators:exec` before deploying.

> Replace the `.firebaserc` project id and provide real `google-services.json` /
> Firebase config via environment/Secret Manager — never commit them (see `.gitignore`).
