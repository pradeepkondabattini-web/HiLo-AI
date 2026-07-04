---
title: EOS-002-P3 Part 02 - Authentication & Identity
document_id: EOS-002-P3-P02
book: Book 01 – Business & Product
version: 1.0.0
status: Approved
classification: Functional Specification
project: EOS (Event Operating System)
product: HiLo
owner: Product Engineering
created: 2026-07-04
last_updated: 2026-07-04
---

# EOS-002-P3
# Part 02
# Authentication & Identity

> This document defines the authentication, authorization, onboarding, identity management, and account lifecycle for the HiLo platform.

---

# 1. Purpose

This module provides:

- Secure authentication
- Identity management
- User onboarding
- Account lifecycle
- Session management
- Role assignment
- Authorization rules

---

# 2. Objectives

The Authentication module shall:

- Support frictionless sign-in
- Protect user accounts
- Support multiple login providers
- Minimize onboarding time
- Integrate with Firebase Authentication
- Provide secure access to all platform services

---

# 3. Supported Authentication Providers

| Provider | Phase | Status |
|-----------|-------|--------|
| Google | Phase 1 | Required |
| Phone (OTP) | Phase 1 | Required |
| Email & Password | Phase 1 | Required |
| Apple Sign-In | Phase 2 | Planned |
| Enterprise SSO | Future | Backlog |

---

# 4. User Roles

The system supports the following roles:

| Role | Description |
|------|-------------|
| Consumer | Creates and manages events |
| Guest | Participates in invited events |
| Business | Manages venues or vendor services |
| Administrator | Manages platform operations |

A user may possess multiple roles.

Example:

```
Pradeep

Consumer ✓

Business Owner ✓

Guest ✓
```

---

# 5. Registration Flow

```
Launch App

↓

Welcome Screen

↓

Choose Login Method

↓

Authenticate

↓

Verify Identity

↓

Accept Terms & Privacy Policy

↓

Create User Profile

↓

Select Role(s)

↓

Complete Onboarding

↓

Dashboard
```

---

# 6. Login Methods

## Google Sign-In

Requirements:

- OAuth via Firebase Auth
- Retrieve verified email
- Retrieve display name
- Retrieve profile image
- Create user if first login

---

## Phone Login

Requirements:

- OTP verification
- Country code support
- Retry limits
- Automatic SMS retrieval where supported

---

## Email Login

Requirements:

- Email verification
- Password reset
- Password strength validation

---

# 7. First-Time User Onboarding

Collect:

- Full Name
- Mobile Number
- Email
- City
- Preferred Language
- Profile Photo (Optional)

Preferences:

- Event interests
- Budget range
- Preferred event types

---

# 8. Business Registration

Additional Information:

- Business Name
- GST (Optional)
- Business Category
- Address
- Google Maps Location
- Contact Person
- Business Logo
- Operating Hours

Verification:

- Mobile Verification
- Email Verification
- Admin Approval (for verified badge)

---

# 9. Identity Verification

Verification Levels:

| Level | Description |
|---------|-------------|
| Level 1 | Email Verified |
| Level 2 | Phone Verified |
| Level 3 | Government ID Verified (Future) |
| Level 4 | Verified Business |

Verification status shall be displayed on the profile.

---

# 10. Session Management

Requirements:

- Persistent login
- Secure token refresh
- Automatic session recovery
- Logout from all devices
- Session timeout for inactive admin accounts

---

# 11. Authorization Model

Authorization shall use Role-Based Access Control (RBAC).

Example permissions:

| Permission | Consumer | Business | Admin |
|------------|----------|----------|-------|
| Create Event | ✓ | ✓ | ✓ |
| Book Venue | ✓ | ✓ | ✓ |
| Manage Own Listings | ✗ | ✓ | ✓ |
| Verify Vendors | ✗ | ✗ | ✓ |
| View Platform Analytics | ✗ | Limited | ✓ |

---

# 12. Firestore Collections

```
users/

roles/

permissions/

sessions/

business_profiles/

verification_requests/
```

---

# 13. User Profile Schema

```json
{
  "uid": "firebase_uid",
  "displayName": "Pradeep",
  "email": "user@example.com",
  "phone": "+91XXXXXXXXXX",
  "roles": [
    "consumer"
  ],
  "city": "Hyderabad",
  "profilePhoto": "",
  "createdAt": "timestamp",
  "lastLogin": "timestamp",
  "status": "active"
}
```

---

# 14. Security Requirements

- Firebase Authentication
- HTTPS only
- Email verification
- OTP verification
- JWT validation for Cloud Run services
- Firestore Security Rules
- Rate limiting for login attempts
- Secure password storage (handled by Firebase)

---

# 15. Error Handling

Common scenarios:

| Scenario | User Message |
|----------|--------------|
| Invalid OTP | "The verification code is incorrect." |
| Expired OTP | "The verification code has expired." |
| Email already exists | "An account already exists with this email." |
| Network failure | "Please check your internet connection and try again." |
| Account disabled | "Your account has been temporarily disabled. Contact support." |

---

# 16. Acceptance Criteria

Authentication is complete when:

- User can register using supported providers.
- Identity is verified.
- Profile is created.
- Appropriate role is assigned.
- User reaches the dashboard.
- Sessions persist securely.
- Logout functions correctly.

---

# 17. Dependencies

- Firebase Authentication
- Cloud Firestore
- Firebase Cloud Messaging
- Cloud Run
- Firebase Storage (profile photos)

---

# 18. Related Documents

- EOS-000 Project Charter
- EOS-001-P1 AI Governance
- EOS-001-P2 Master AI Governance System Prompt
- EOS-002-P1 Living Product Requirements Document
- EOS-002-P2 User Personas & User Journeys
- EOS-002-P3-Part-01 Platform Foundation & Core Architecture

---

# Revision History

| Version | Date | Description |
|----------|------|-------------|
| 1.0.0 | 2026-07-04 | Initial release |

---

# Approval

| Role | Status |
|------|--------|
| Product Owner | Pending |
| Solution Architect | Pending |
| Engineering Lead | Pending |

---

> Authentication is the trust foundation of the HiLo platform. Every user interaction, event, booking, payment, and collaboration begins with a secure and verifiable identity.
