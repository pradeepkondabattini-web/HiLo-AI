---
title: EOS-003 Part 03 - Firebase Backend Architecture
document_id: EOS-003-P3
book: Book 02 – Technical Architecture
version: 1.0.0
status: Approved
classification: Technical Architecture
project: EOS (Event Operating System)
product: HiLo
owner: Backend Engineering
created: 2026-07-04
last_updated: 2026-07-04
---

# EOS-003
# Part 03
# Firebase Backend Architecture

> This document defines the Firebase architecture for the HiLo platform, including project organization, authentication, Firestore, Storage, Cloud Messaging, App Check, Analytics, Remote Config, Security Rules, backup strategy, and integration with Cloud Run microservices.

---

# 1. Purpose

Firebase provides the managed backend services required for authentication, real-time collaboration, storage, analytics, messaging, and client synchronization.

Business logic, AI orchestration, and third-party integrations remain within Cloud Run microservices.

---

# 2. Architectural Principles

The Firebase implementation shall:

- Use managed services where appropriate.
- Keep business logic outside client applications.
- Separate data ownership by domain.
- Support offline-first synchronization.
- Enforce least-privilege access.
- Scale automatically.
- Integrate seamlessly with Cloud Run.

---

# 3. Firebase Responsibilities

Firebase is responsible for:

- User Authentication
- Firestore Database
- File Storage
- Push Notifications
- Remote Config
- Analytics
- Crash Reporting
- App Check
- Hosting (Web)
- Client synchronization

Cloud Run is responsible for:

- AI Orchestrator
- MCP integrations
- Payments
- Vendor APIs
- Swiggy APIs
- Google Maps orchestration
- WhatsApp Business integration
- Plugin execution

---

# 4. Firebase Project Strategy

Separate projects for each environment:

| Environment | Purpose |
|-------------|---------|
| hilo-dev | Developer environment |
| hilo-qa | QA & automation |
| hilo-staging | Pre-production |
| hilo-prod | Production |

Each project has isolated:

- Firestore
- Storage
- Authentication
- Analytics
- Messaging
- Remote Config

---

# 5. Firebase Services

Enabled services:

- Firebase Authentication
- Cloud Firestore
- Firebase Storage
- Cloud Messaging
- Analytics
- Crashlytics
- Remote Config
- App Check
- Performance Monitoring
- Hosting (Web)

---

# 6. Authentication

Supported providers:

- Google
- Apple
- Email & Password
- Phone (OTP)

Future:

- Microsoft
- Enterprise SSO
- Passkeys

Authentication flow:

```
User
  ↓
Flutter App
  ↓
Firebase Auth
  ↓
ID Token
  ↓
API Gateway
  ↓
Cloud Run Services
```

---

# 7. Authorization

Authorization is enforced in Cloud Run using:

- Firebase ID Tokens
- Custom Claims
- Role-Based Access Control (RBAC)

Example roles:

- Consumer
- Business
- Vendor
- Admin
- Support

---

# 8. Firestore Architecture

Primary collections:

```
users/
profiles/
events/
venues/
vendors/
groups/
messages/
tasks/
polls/
payments/
media/
notifications/
skills/
ai_sessions/
plugin_registry/
audit_logs/
```

Detailed schemas are defined in Book 03 – Data Architecture.

---

# 9. Firestore Design Rules

- One bounded context owns each collection.
- Avoid deeply nested collections unless required.
- Denormalize for read performance where appropriate.
- Use server timestamps.
- Prefer document references over duplication when practical.

---

# 10. Firestore Indexing

Composite indexes shall be created for:

- Event search
- Venue filtering
- Vendor filtering
- User events
- Payments
- Notifications

Index definitions are stored in source control.

---

# 11. Firebase Storage

Bucket structure:

```
/users/{userId}/profile/

/events/{eventId}/photos/

/events/{eventId}/videos/

/events/{eventId}/documents/

/themes/

/generated-assets/

/vendor-assets/
```

Storage Rules enforce ownership and role-based access.

---

# 12. Cloud Messaging

Firebase Cloud Messaging is used for:

- Event reminders
- RSVP updates
- Payment reminders
- Chat notifications
- AI recommendations
- Vendor confirmations
- Delivery updates

Topics:

- event-{eventId}
- user-{userId}
- vendor-{vendorId}

---

# 13. Remote Config

Feature flags include:

- AI Beta Features
- Marketplace Features
- Plugin SDK
- New Design Themes
- Promotional Campaigns

Remote Config enables staged rollouts.

---

# 14. Firebase Analytics

Track:

- Sign-ups
- Event creation
- Venue searches
- Vendor bookings
- AI interactions
- Payments
- Photo uploads
- Session duration

PII must never be logged.

---

# 15. Crashlytics

Capture:

- Flutter exceptions
- Native crashes
- Network failures
- AI service errors (client-side)
- Performance issues

Crash reports include app version and environment.

---

# 16. App Check

Enable App Check using:

- Play Integrity API (Android)
- App Attest / DeviceCheck (iOS)
- reCAPTCHA Enterprise (Web)

All Firebase services require valid App Check tokens.

---

# 17. Offline Synchronization

Firestore offline persistence is enabled.

Rules:

- Queue writes locally.
- Resolve conflicts using server timestamps.
- Notify users of sync failures.
- Retry automatically.

---

# 18. Security Rules

Principles:

- Deny by default.
- Grant least privilege.
- Validate ownership.
- Validate roles.
- Prevent unauthorized writes.
- Enforce document-level access.

Security Rules are version-controlled.

---

# 19. Cloud Run Integration

Firebase clients never call third-party APIs directly.

Flow:

```
Flutter App
   ↓
Firebase Auth
   ↓
API Gateway
   ↓
Cloud Run
   ↓
External APIs
```

---

# 20. Backup & Disaster Recovery

Firestore:

- Daily exports
- Point-in-time recovery (where available)

Storage:

- Lifecycle policies
- Multi-region backups for production assets

Configuration:

- Exported via Infrastructure as Code

---

# 21. Cost Optimization

Strategies:

- Efficient document design
- Minimize reads
- Batch writes
- Cache frequently accessed data
- Archive inactive events
- Use Cloud Run for compute-intensive tasks
- Monitor usage with Firebase and Google Cloud billing dashboards

---

# 22. Multi-Tenant Considerations

Support:

- Consumers
- Businesses
- Vendors

Future enterprise deployments may introduce tenant isolation using dedicated Firebase projects or logical partitioning with tenant identifiers.

---

# 23. Monitoring

Monitor:

- Firestore reads/writes
- Storage usage
- Authentication success/failure
- Messaging delivery
- Crash-free sessions
- Performance metrics

Use:

- Firebase Console
- Cloud Monitoring
- Cloud Logging

---

# 24. CI/CD Integration

GitHub Actions shall:

- Validate Firestore Rules
- Deploy Firestore Indexes
- Deploy Storage Rules
- Deploy Hosting (Web)
- Promote configurations across environments

---

# 25. Acceptance Criteria

The Firebase backend is accepted when:

- Authentication works across all supported providers.
- Firestore enforces security rules.
- Offline synchronization is reliable.
- Storage is secured by role.
- Push notifications are operational.
- Remote Config supports staged rollouts.
- Analytics and Crashlytics are active.
- Cloud Run integrates securely using Firebase ID Tokens.

---

# 26. Related Documents

- EOS-003-P1 System Architecture & C4 Model
- EOS-003-P2 Flutter Application Architecture
- EOS-004 Book 03 – Data Architecture
- EOS-005 Book 04 – AI Platform Architecture

---

# Revision History

| Version | Date | Description |
|----------|------|-------------|
| 1.0.0 | 2026-07-04 | Initial release |

---

# Approval

| Role | Status |
|------|--------|
| Backend Architect | Pending |
| Firebase Lead | Pending |
| Engineering Lead | Pending |
| Product Owner | Pending |

---

> The Firebase Backend Architecture defines the managed backend foundation for HiLo. Firebase provides secure, scalable services for authentication, data synchronization, storage, messaging, analytics, and client connectivity, while Cloud Run microservices handle business logic, AI orchestration, MCP integrations, and external system interactions. This separation ensures a secure, scalable, and maintainable architecture suitable for enterprise-grade deployments.
