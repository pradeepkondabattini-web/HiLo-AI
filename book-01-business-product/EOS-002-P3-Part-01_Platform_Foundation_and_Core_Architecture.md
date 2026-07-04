---
title: EOS-002-P3 Part 01 - Platform Foundation & Core Architecture
document_id: EOS-002-P3-P01
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
# Part 01
# Platform Foundation & Core Architecture

> This document defines the foundational functional architecture for the HiLo platform. Every module within the platform inherits the standards, workflows, and engineering principles described here.

---

# 1. Purpose

This document establishes:

- Platform architecture
- Core modules
- Navigation
- Permissions
- AI architecture
- MCP architecture
- Backend services
- Firestore collections
- User roles
- Business rules
- Cross-module interactions

---

# 2. Platform Overview

HiLo is an AI-first Hyperlocal Event Operating System.

The platform consists of three applications sharing one backend.

```
                    HiLo Platform

            ┌────────────────────┐
            │ Firebase Backend   │
            └─────────┬──────────┘
                      │
     ┌────────────────┼────────────────┐
     │                │                │
┌────────────┐  ┌────────────┐  ┌────────────┐
│ Consumer   │  │ Business   │  │ Admin      │
│ Flutter App│  │ Portal      │  │ Portal     │
└────────────┘  └────────────┘  └────────────┘
                      │
          Cloud Run Microservices
                      │
          OpenAI Responses API
                      │
               MCP Orchestrator
```

---

# 3. Applications

## Consumer App

Primary users:

- Event hosts
- Family members
- Friends
- Guests

Functions:

- Plan events
- Invite guests
- Discover venues
- Book vendors
- Manage budgets
- Upload photos
- Collaborate

---

## Business Portal

Primary users:

- Venue owners
- Caterers
- Decorators
- Photographers
- DJs
- Event planners

Functions:

- Manage listings
- Manage bookings
- View analytics
- Update pricing
- Manage availability

---

## Admin Portal

Primary users:

- HiLo Operations

Functions:

- User Management
- Vendor Verification
- AI Monitoring
- Payments
- Marketplace Health
- Reports

---

# 4. Core Platform Modules

| Module | Phase |
|----------|--------|
| Authentication | Phase 1 |
| User Profile | Phase 1 |
| Event Management | Phase 1 |
| Venue Discovery | Phase 1 |
| Vendor Marketplace | Phase 1 |
| AI Planner | Phase 1 |
| Canva Themes | Phase 1 |
| WhatsApp Integration | Phase 1 |
| UPI Payments | Phase 1 |
| Swiggy Commerce | Phase 1 |
| Media Gallery | Phase 1 |
| Notifications | Phase 1 |
| Business Portal | Phase 2 |
| Admin Portal | Phase 2 |
| Analytics | Phase 2 |

---

# 5. User Roles

## Consumer

Permissions:

✓ Create events

✓ Edit own events

✓ Invite guests

✓ Upload photos

✓ Make payments

✓ Chat

✓ Vote

---

## Guest

Permissions:

✓ View invitations

✓ RSVP

✓ Upload photos

✓ Participate in chat

✓ Vote

---

## Vendor

Permissions:

✓ Manage listings

✓ Accept bookings

✓ Update availability

✓ View analytics

---

## Admin

Permissions:

✓ Manage users

✓ Verify businesses

✓ Remove inappropriate content

✓ Configure platform

---

# 6. Navigation Architecture

Consumer App

```
Splash

↓

Authentication

↓

Onboarding

↓

Dashboard

↓

Create Event

↓

Event Workspace

↓

Venue Discovery

↓

Vendor Discovery

↓

Payments

↓

Media Gallery

↓

Profile

↓

Settings
```

---

Business Portal

```
Login

↓

Dashboard

↓

Bookings

↓

Listings

↓

Analytics

↓

Profile

↓

Settings
```

---

Admin Portal

```
Login

↓

Overview

↓

Users

↓

Businesses

↓

Payments

↓

Reports

↓

AI Monitoring

↓

Settings
```

---

# 7. AI Architecture

AI Responsibilities

- Event Planning
- Budget Estimation
- Venue Ranking
- Vendor Ranking
- Timeline Creation
- Theme Suggestions
- Guest Reminders
- Event Summary
- Cost Optimization

All AI responses must include:

- Confidence level (internal)
- Data sources (where applicable)
- Explanation for recommendations

---

# 8. MCP Architecture

Approved MCP Integrations

| MCP | Purpose |
|------|----------|
| Google Maps | Venue Discovery |
| Canva | Invitations & Themes |
| Swiggy | Food & Grocery Ordering |
| WhatsApp | Invitations & Messaging |
| Razorpay/Cashfree | UPI Payments |

Each MCP integration shall use:

- Adapter Pattern
- Retry Policy
- Timeout Handling
- Structured Logging
- Error Recovery

---

# 9. Backend Services

Cloud Run Services

- Authentication Service
- Event Service
- Venue Service
- Vendor Service
- AI Gateway
- Payment Service
- Messaging Service
- Notification Service
- Analytics Service

Each service:

- Stateless
- Independently deployable
- REST API
- Health endpoint
- Metrics endpoint

---

# 10. Firestore Collections

```
users

events

venues

vendors

groups

messages

photos

payments

themes

notifications

analytics

audit_logs

ai_sessions

bookings

reviews
```

Each collection will be specified in dedicated database documentation.

---

# 11. Security Model

Authentication

Firebase Authentication

Authorization

Firestore Rules

Cloud Run JWT Validation

Admin RBAC

Security Requirements

- HTTPS only
- Least privilege
- Audit logging
- Input validation
- Rate limiting
- Secret Manager integration

---

# 12. Event Lifecycle

```
Draft

↓

Planning

↓

Invitations Sent

↓

Venue Confirmed

↓

Vendor Confirmed

↓

Payments Ongoing

↓

Ready

↓

Live Event

↓

Completed

↓

Archived
```

Every event transitions through these states.

---

# 13. Group Collaboration

Every event automatically creates:

- Workspace
- Chat Room
- Shared Gallery
- Budget Tracker
- RSVP Dashboard
- Voting Module
- Timeline

---

# 14. AI Event Readiness Score

Score Range

0–100

Factors

- Venue booked
- Vendors confirmed
- RSVP completion
- Budget completion
- Payments received
- Food finalized
- Theme completed

Displayed on Dashboard.

---

# 15. Marketplace Trust Score

Calculated using:

- Google Ratings
- Verified Bookings
- Repeat Customers
- Cancellation Rate
- Review Quality
- Response Time
- Verification Status

Used in recommendation ranking.

---

# 16. Performance Targets

| Metric | Target |
|----------|--------|
| App Startup | <3 seconds |
| Venue Search | <2 seconds |
| AI Response | <5 seconds |
| Crash Free Sessions | >95% |
| Availability | 99.5% |

---

# 17. Acceptance Criteria

The platform foundation is complete when:

- User roles implemented.
- Navigation established.
- Backend services defined.
- AI architecture approved.
- MCP integrations identified.
- Firestore collections documented.
- Event lifecycle standardized.

---

# Related Documents

- EOS-000 Project Charter
- EOS-001-P1 AI Governance
- EOS-001-P2 Master AI Governance
- EOS-002-P1 Living Product Requirements
- EOS-002-P2 User Personas

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

> This document establishes the foundational architecture for the HiLo platform. All functional modules, APIs, Firestore schemas, Flutter features, Cloud Run services, and AI workflows shall conform to the architecture and principles defined herein.
