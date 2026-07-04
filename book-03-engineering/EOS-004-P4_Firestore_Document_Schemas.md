---
title: EOS-004 Part 04 - Firestore Document Schemas
document_id: EOS-004-P4
book: Book 03 – Data Architecture
version: 1.0.0
status: Approved
classification: Technical Architecture
project: EOS (Event Operating System)
product: HiLo
owner: Data Architecture Team
created: 2026-07-04
last_updated: 2026-07-04
---

# EOS-004
# Part 04
# Firestore Document Schemas

> This document defines the canonical Firestore document schemas for HiLo. Each schema specifies fields, data types, validation rules, ownership, indexing considerations, lifecycle, AI metadata, and offline synchronization requirements.

---

# 1. Purpose

This document is the single source of truth for all Firestore document structures.

Objectives:

- Standardize data contracts.
- Support Flutter and backend development.
- Enable AI reasoning.
- Optimize Firestore performance.
- Simplify schema evolution.

---

# 2. Schema Standards

Every schema shall define:

- Collection Name
- Aggregate Root
- Owner Service
- Version
- Required Fields
- Optional Fields
- Validation Rules
- Security Considerations
- Index Recommendations
- Lifecycle
- Example JSON

---

# 3. Common Metadata

Every document includes:

| Field | Type | Required |
|--------|------|----------|
| id | string | Yes |
| schemaVersion | integer | Yes |
| createdAt | timestamp | Yes |
| updatedAt | timestamp | Yes |
| createdBy | string | Yes |
| updatedBy | string | Yes |
| status | string | Yes |

---

# 4. Collection: users

Aggregate Root: User

Owner: Identity Service

## Fields

| Field | Type | Required | Notes |
|--------|------|----------|------|
| id | string | Yes | Firestore ID |
| email | string | Yes | Unique |
| phone | string | No | E.164 |
| authProvider | string | Yes | Google, Apple, Email, Phone |
| role | string | Yes | Consumer, Vendor, Admin |
| accountStatus | string | Yes | Active, Suspended |
| createdAt | timestamp | Yes | Server timestamp |
| updatedAt | timestamp | Yes | Server timestamp |

Validation:

- Email unique
- Role from approved list
- Status from approved list

---

Example

```json
{
  "id":"usr_1001",
  "email":"john@example.com",
  "role":"consumer",
  "accountStatus":"active",
  "schemaVersion":1
}
```

---

# 5. Collection: profiles

Owner: Identity Service

Fields

| Field | Type |
|--------|------|
| userId | string |
| fullName | string |
| profilePhoto | string |
| city | string |
| state | string |
| country | string |
| preferredLanguage | string |
| favoriteEventTypes | array |
| notificationPreferences | map |

---

# 6. Collection: events

Aggregate Root: Event

Owner: Event Service

## Required Fields

| Field | Type |
|--------|------|
| eventId | string |
| ownerId | string |
| title | string |
| category | string |
| eventDate | timestamp |
| budgetId | string |
| venueId | string |
| guestCount | integer |
| status | string |

## Optional Fields

- description
- themeId
- coverImage
- tags
- notes

Validation

- Guest count > 0
- Budget exists
- Venue exists
- Owner exists

Example

```json
{
  "eventId":"EVT10001",
  "title":"Birthday Party",
  "category":"Birthday",
  "guestCount":40,
  "venueId":"VEN101",
  "budgetId":"BUD1001",
  "status":"Planning"
}
```

---

# 7. Collection: venues

Owner: Venue Service

Fields

| Field | Type |
|--------|------|
| venueId | string |
| googlePlaceId | string |
| name | string |
| address | string |
| latitude | double |
| longitude | double |
| capacity | integer |
| rating | double |
| priceRange | string |
| amenities | array |
| photos | array |
| verified | boolean |

Validation

- Capacity >= 1
- Rating between 0 and 5

---

# 8. Collection: vendors

Owner: Vendor Service

Fields

| Field | Type |
|--------|------|
| vendorId | string |
| businessName | string |
| category | string |
| city | string |
| rating | double |
| verified | boolean |
| pricingModel | string |
| contactNumber | string |
| availability | map |

---

# 9. Collection: groups

Owner: Collaboration Service

Fields

| Field | Type |
|--------|------|
| groupId | string |
| eventId | string |
| ownerId | string |
| title | string |
| whatsappGroupLink | string |
| memberCount | integer |

---

# 10. Collection: group_messages

Fields

| Field | Type |
|--------|------|
| messageId | string |
| groupId | string |
| senderId | string |
| messageType | string |
| message | string |
| attachmentUrl | string |
| createdAt | timestamp |

Supported message types:

- text
- image
- video
- document
- ai-summary

---

# 11. Collection: budgets

Owner: Budget Service

Fields

| Field | Type |
|--------|------|
| budgetId | string |
| eventId | string |
| totalBudget | number |
| allocatedBudget | number |
| spentBudget | number |
| remainingBudget | number |
| currency | string |

Validation

Remaining Budget = Total - Spent

---

# 12. Collection: expenses

Fields

| Field | Type |
|--------|------|
| expenseId | string |
| budgetId | string |
| category | string |
| amount | number |
| vendorId | string |
| paymentStatus | string |

---

# 13. Collection: payments

Owner: Payment Service

Fields

| Field | Type |
|--------|------|
| paymentId | string |
| eventId | string |
| payerId | string |
| amount | number |
| currency | string |
| gateway | string |
| transactionId | string |
| paymentStatus | string |

Supported gateways

- Razorpay
- Cashfree

---

# 14. Collection: food_orders

Owner: Commerce Service

Fields

| Field | Type |
|--------|------|
| orderId | string |
| eventId | string |
| provider | string |
| orderStatus | string |
| deliveryETA | timestamp |
| totalAmount | number |

Provider

- Swiggy

Future

- Zomato

---

# 15. Collection: media

Owner: Media Service

Fields

| Field | Type |
|--------|------|
| mediaId | string |
| ownerId | string |
| eventId | string |
| mediaType | string |
| storagePath | string |
| thumbnailPath | string |
| uploadedAt | timestamp |

Supported

- image
- video
- audio
- pdf

---

# 16. Collection: themes

Owner: Design Service

Fields

| Field | Type |
|--------|------|
| themeId | string |
| title | string |
| category | string |
| canvaTemplateId | string |
| previewImage | string |
| premium | boolean |

---

# 17. Collection: ai_sessions

Owner: AI Orchestrator

Fields

| Field | Type |
|--------|------|
| sessionId | string |
| eventId | string |
| userId | string |
| activeAgent | string |
| skillsExecuted | array |
| contextSummary | string |
| createdAt | timestamp |

---

# 18. Collection: ai_memory

Owner: AI Platform

Fields

| Field | Type |
|--------|------|
| memoryId | string |
| userId | string |
| preferenceType | string |
| embeddingId | string |
| summary | string |
| confidenceScore | number |

Future support:

- Vector Search
- RAG
- Long-term memory

---

# 19. Collection: plugins

Owner: Plugin Platform

Fields

| Field | Type |
|--------|------|
| pluginId | string |
| name | string |
| version | string |
| publisher | string |
| permissions | array |
| certificationLevel | string |

---

# 20. Collection: audit_logs

Owner: Platform

Fields

| Field | Type |
|--------|------|
| logId | string |
| actorId | string |
| action | string |
| resource | string |
| correlationId | string |
| timestamp | timestamp |

Audit records are immutable.

---

# 21. Schema Versioning

Rules:

- Increment schemaVersion for breaking changes.
- Backward compatibility preferred.
- Migrations documented in EOS-004-P10.

---

# 22. Validation Standards

Validation occurs at:

- Flutter form level
- Cloud Run service level
- Firestore Security Rules
- AI input validation

---

# 23. Offline Synchronization

Documents shall:

- Support local caching.
- Resolve conflicts using server timestamps.
- Retry failed writes.
- Preserve user intent.

---

# 24. Acceptance Criteria

The Firestore Document Schemas are accepted when:

- Every collection has a documented schema.
- Validation rules are defined.
- Ownership is established.
- Security considerations are documented.
- Schema versioning is supported.
- AI metadata supports future personalization.

---

# 25. Related Documents

- EOS-004-P1 Data Architecture Principles
- EOS-004-P2 Firestore Collection Model
- EOS-004-P3 Entity Relationship Model
- EOS-004-P5 Indexes, Partitioning and Query Optimization

---

# Revision History

| Version | Date | Description |
|----------|------|-------------|
| 1.0.0 | 2026-07-04 | Initial release |

---

# Approval

| Role | Status |
|------|--------|
| Chief Data Architect | Pending |
| Backend Lead | Pending |
| Mobile Lead | Pending |
| Product Owner | Pending |

---

> The Firestore Document Schemas define the canonical data contracts for HiLo. They ensure consistent implementation across Flutter clients, Cloud Run microservices, AI agents, and platform integrations while providing a scalable, secure, and AI-ready foundation for future evolution.
