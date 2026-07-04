---
title: EOS-004 Part 06 - Data Security Rules and RBAC
document_id: EOS-004-P6
book: Book 03 – Data Architecture
version: 1.0.0
status: Approved
classification: Security Architecture
project: EOS (Event Operating System)
product: HiLo
owner: Security Architecture Team
created: 2026-07-04
last_updated: 2026-07-04
---

# EOS-004
# Part 06
# Data Security Rules and RBAC

> This document defines the security architecture, Firestore Security Rules, Role-Based Access Control (RBAC), Attribute-Based Access Control (ABAC), service authorization, AI agent permissions, plugin permissions, audit requirements, and compliance standards for the HiLo platform.

---

# 1. Purpose

The HiLo platform shall implement a Zero Trust security model where every request is authenticated, authorized, logged, and validated.

Objectives:

- Protect user data.
- Prevent unauthorized access.
- Secure AI workflows.
- Enable safe plugin execution.
- Meet regulatory requirements.
- Provide auditable security controls.

---

# 2. Security Principles

The platform shall follow:

- Zero Trust Architecture
- Least Privilege Access
- Defense in Depth
- Secure by Default
- Privacy by Design
- Encryption Everywhere
- Immutable Audit Trails
- Principle of Explicit Authorization

---

# 3. Authentication

Authentication is provided by:

- Firebase Authentication

Supported providers:

- Google
- Apple
- Email/Password
- Phone OTP

Future:

- Enterprise SSO (OIDC/SAML)

Unauthenticated users may only access public resources explicitly designated as public.

---

# 4. Authorization Model

HiLo combines:

- Role-Based Access Control (RBAC)
- Attribute-Based Access Control (ABAC)

RBAC determines **who** can perform an action.

ABAC evaluates **context**, such as:

- Resource ownership
- Event membership
- Vendor verification
- Subscription tier
- Plugin permissions

---

# 5. User Roles

## Consumer

Permissions:

- Create events
- Join groups
- Upload media
- Make payments
- Chat
- Vote
- Invite participants

Cannot:

- Modify platform settings
- Access other users' data
- Install system plugins

---

## Business

Permissions:

- Manage business profile
- Publish venues
- Publish services
- Respond to quotations
- View business analytics

---

## Vendor

Permissions:

- Manage vendor profile
- Submit quotations
- Accept bookings
- Update availability

Cannot access consumer private data.

---

## Moderator

Permissions:

- Review reported content
- Moderate media
- Suspend abusive users
- Resolve disputes

---

## Administrator

Permissions:

- Platform configuration
- Feature flags
- User management
- Plugin approvals
- AI configuration
- Security monitoring

---

## AI Service Account

Used exclusively by Cloud Run AI services.

Cannot authenticate as a human user.

Access is limited to AI-specific collections.

---

## System Service Account

Used by backend services.

Access limited by IAM.

Never exposed to client applications.

---

# 6. Resource Ownership

Each document has an owner.

Examples:

Event

Owner → User

Vendor

Owner → Business

Budget

Owner → Event

Media

Owner → Event

Payments

Owner → Contributor

---

# 7. Firestore Security Rules

Default policy:

```
deny all;
```

Access is explicitly granted.

Example:

```
match /events/{eventId} {

allow read:

if request.auth != null

&& resource.data.memberIds.hasAny([request.auth.uid]);

allow write:

if request.auth.uid == resource.data.ownerId;

}
```

---

# 8. Collection-Level Security

| Collection | Read | Write |
|------------|------|-------|
| users | Self | Self |
| profiles | Self | Self |
| events | Members | Owner |
| venues | Public | Business/Admin |
| vendors | Public | Vendor/Admin |
| budgets | Event Members | Owner |
| groups | Members | Owner |
| group_messages | Members | Members |
| media | Event Members | Event Members |
| payments | Contributor | Payment Service |
| ai_sessions | Owner | AI Service |
| plugins | Public | Admin |

---

# 9. Role Matrix

| Action | Consumer | Business | Vendor | Admin |
|----------|----------|----------|---------|--------|
| Create Event | ✓ | ✓ | ✗ | ✓ |
| Edit Event | Owner | Owner | ✗ | ✓ |
| Upload Media | ✓ | ✓ | ✓ | ✓ |
| Approve Plugin | ✗ | ✗ | ✗ | ✓ |
| Manage AI Skills | ✗ | ✗ | ✗ | ✓ |
| Configure Platform | ✗ | ✗ | ✗ | ✓ |

---

# 10. Attribute-Based Rules

Examples:

Only group members may:

- Read messages
- Upload photos
- Vote
- View shared budgets

Only verified vendors may:

- Submit quotations
- Receive bookings

Only paid subscribers may:

- Access premium AI features
- Use premium Canva templates
- Install premium plugins

---

# 11. AI Authorization

AI Agents operate through:

AI Gateway

↓

AI Orchestrator

↓

Skill Registry

↓

MCP Adapter

AI Agents never bypass Firestore Security Rules.

All AI actions execute under scoped service accounts.

---

# 12. Plugin Permissions

Plugins declare required permissions.

Example:

```
{
"permissions":[
"events.read",
"vendors.search",
"media.upload"
]
}
```

Users approve permissions before installation.

---

# 13. Service-to-Service Authorization

Cloud Run services authenticate using:

- Google IAM
- Identity Tokens
- Service Accounts

Mutual trust exists only between authorized services.

---

# 14. API Security

Every API request includes:

- Firebase ID Token
- Correlation ID
- Request ID
- Device Metadata

All APIs validate:

- Authentication
- Authorization
- Input
- Rate limits

---

# 15. Media Security

Uploaded media:

- Stored in Firebase Storage
- Access controlled by Storage Rules
- Virus scanning (future enhancement)
- Metadata validation
- Signed URLs for downloads

---

# 16. Payment Security

Payments handled through:

- Razorpay
- Cashfree

Rules:

- No card data stored.
- UPI tokens never stored.
- Webhooks verified.
- Transaction logs immutable.

PCI DSS scope minimized by using hosted payment pages.

---

# 17. WhatsApp Security

Integration uses:

- WhatsApp Business Platform

Rules:

- Explicit user consent required.
- Phone numbers encrypted.
- Invitation links expire.
- No unsolicited messaging.

---

# 18. Google Maps & Canva Security

API Keys:

- Stored in Secret Manager.
- Restricted by IP and application.
- Never embedded in source code.

OAuth tokens:

- Short-lived
- Rotated automatically

---

# 19. Swiggy API Security

Requests:

- Signed
- Authenticated
- Logged

No payment credentials stored.

---

# 20. Audit Logging

Every privileged action records:

- Actor
- Timestamp
- IP Address
- Device
- Resource
- Action
- Result
- Correlation ID

Audit logs are immutable.

Retention:

7 years

---

# 21. Encryption

Data in Transit

TLS 1.3

Data at Rest

Google-managed encryption

Secrets

Google Secret Manager

Future:

Customer-managed encryption keys (CMEK)

---

# 22. Compliance

Platform designed for:

- India Digital Personal Data Protection Act (DPDP)
- GDPR readiness
- PCI DSS (payments)
- Google Play Data Safety
- Apple App Privacy

---

# 23. Threat Protection

Mitigations include:

- Rate limiting
- API throttling
- Brute-force protection
- Bot detection
- Replay attack prevention
- Input validation
- Output encoding
- CSP headers (Web)

---

# 24. Incident Response

Security events trigger:

- Cloud Logging
- Error Reporting
- Alerting
- Incident ticket
- Audit review

Critical incidents require post-incident review.

---

# 25. Acceptance Criteria

This security architecture is accepted when:

- All access is authenticated.
- Firestore Security Rules deny by default.
- RBAC and ABAC are enforced.
- AI agents use scoped permissions.
- Plugins require explicit user consent.
- Audit logging is immutable.
- Payment data is never stored.
- Compliance requirements are documented.

---

# 26. Related Documents

- EOS-003-P3 Firebase Backend Architecture
- EOS-003-P4 Cloud Run Microservices Architecture
- EOS-004-P4 Firestore Document Schemas
- EOS-005 AI Platform Architecture
- EOS-006 Security & Compliance

---

# Revision History

| Version | Date | Description |
|----------|------|-------------|
| 1.0.0 | 2026-07-04 | Initial release |

---

# Approval

| Role | Status |
|------|--------|
| Chief Information Security Officer | Pending |
| Cloud Security Architect | Pending |
| Backend Lead | Pending |
| Product Owner | Pending |

---

> The Data Security Rules and RBAC architecture establish a Zero Trust security model for HiLo. By combining Firebase Authentication, Firestore Security Rules, IAM-based service authentication, RBAC, ABAC, immutable auditing, and secure integrations with AI agents and external platforms, the system protects user privacy while enabling scalable collaboration, commerce, and AI-powered event management.
