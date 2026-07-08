# Security Policy

Security is a foundational architectural concern for HiLo, not an afterthought
(see [`EOS-000`](EOS-000_MASTER_PROJECT_CONTEXT_FOR_AI.md) §61–89). This document
describes how to report vulnerabilities and the baseline security expectations for
all contributions.

## Reporting a vulnerability

**Do not open a public issue for security vulnerabilities.**

Report privately to the Enterprise Architecture Office / security contact for the
HiLo organization. Include:

- a description of the vulnerability and its impact,
- steps to reproduce (proof of concept where possible),
- affected component(s) and version/commit,
- any suggested remediation.

You will receive an acknowledgement, and we will work with you on triage,
remediation, and coordinated disclosure. Please allow reasonable time to remediate
before any public disclosure.

## Supported branches

Security fixes target `main` (via `hotfix/*`) and are back-merged to `develop`.

## Secrets — never commit them

Repositories must never contain API keys, passwords, tokens, certificates, service
account keys, or private credentials. Use **Google Secret Manager**, **GitHub Secrets**,
or Cloud Run environment variables. Secret scanning is enforced in CI. If a secret is
ever committed, treat it as compromised: rotate it immediately and purge it from history.

## Baseline expectations for every change (EOS-000 §88 checklist)

- Authentication required where applicable; Firebase ID tokens verified on every protected API.
- Authorization defined (RBAC) and ownership validated (ABAC).
- All inputs validated; outputs encoded for their destination.
- Secrets protected; logs sanitized (no PII, tokens, secrets, or payment credentials).
- Audit events generated for critical operations.
- Firestore security rules updated and reviewed (deny-by-default).
- Tests completed, including authn/authz paths.

## AI-specific security

Every AI response is treated as untrusted until validated. Protect against prompt
injection, tool injection, data leakage, and unauthorized tool execution. External
tools execute only through the MCP Runtime under least privilege (EOS-000 §80–83).

## Standards we design toward

GDPR, CCPA, SOC 2, ISO/IEC 27001, OWASP ASVS, and the OWASP Top 10 (EOS-000 §85).
