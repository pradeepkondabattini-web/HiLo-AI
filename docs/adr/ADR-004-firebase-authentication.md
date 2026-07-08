# ADR-004: Firebase Authentication as the identity provider

- **Status:** Accepted
- **Date:** 2026-07-05
- **Deciders:** Pradeep, AI Engineering (per EOS-000)
- **Related:** EOS-000 §62–70; EOS-002-P3-Part-02 (Authentication & Identity)

## Context

HiLo needs a managed identity provider that supports multiple sign-in methods for the
Hyderabad launch market (Google, Phone/OTP, Email), issues verifiable tokens for backend
authorization, and integrates natively with Firestore security rules and the Flutter SDK.

## Decision

We will use **Firebase Authentication** as the authoritative identity provider for the MVP.
The Firebase UID is the immutable global identity key. Supported methods at launch: Email/
Password, Google Sign-In, and Phone (OTP); Apple Sign-In and Enterprise SSO are future.

Authorization is separate from authentication:
- Backend services **verify the Firebase ID token on every protected API** — client-supplied
  identity is never trusted unverified.
- **RBAC** via role claims plus **ABAC** ownership checks (e.g. a user edits only events they own).
- Sensitive operations (password/role change, payments, account deletion) require re-authentication.

## Consequences

- Managed, secure token lifecycle (refresh, expiry, revocation) with minimal custom crypto.
- Firestore security rules can enforce authentication/ownership at the data layer.
- Role claims must be provisioned during user bootstrap (auth-service, Sprint 1B).

## Alternatives considered

- **Auth0 / Cognito / custom JWT** — rejected for MVP; weaker native Firebase/Firestore
  integration and more operational overhead.

## References

- EOS-000 §62–70 (Identity, Authentication Flow, RBAC, ABAC, API Authorization).
- Engineering Bible EOS-002-P3-Part-02.
