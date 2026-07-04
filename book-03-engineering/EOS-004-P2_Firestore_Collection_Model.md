---
title: EOS-004 Part 02 - Firestore Collection Model
document_id: EOS-004-P2
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
# Part 02
# Firestore Collection Model

> This document defines the logical and physical organization of all Cloud Firestore collections used by HiLo. It establishes ownership, relationships, access policies, indexing strategy, lifecycle, scalability expectations, and AI-readiness for every major domain.

---

# 1. Purpose

The Firestore Collection Model provides the canonical definition of all persistent collections within the HiLo platform.

Objectives:

- Define collection ownership.
- Standardize document organization.
- Enable secure access control.
- Optimize read/write performance.
- Support offline synchronization.
- Prepare data for AI agents and analytics.

---

# 2. Collection Design Principles

Every collection shall:

- Belong to exactly one bounded context.
- Have a documented owner.
- Define lifecycle states.
- Use server timestamps.
- Support offline-first synchronization.
- Avoid deeply nested structures unless justified.
- Be versioned where schema evolution is expected.

---

# 3. Firestore Collection Hierarchy

```
users/
profiles/

events/
event_timelines/
event_templates/

venues/
venue_categories/

vendors/
vendor_categories/
vendor_quotes/

groups/
group_members/
group_messages/
group_polls/
group_tasks/

budgets/
expenses/

food_orders/
grocery_orders/

payments/
payment_transactions/

media/
albums/
highlights/

notifications/

themes/
design_assets/

skills/
skill_registry/

ai_sessions/
ai_memory/
ai_feedback/

plugins/
plugin_registry/

audit_logs/

analytics/

system_configs/
```

---

# 4. Identity Domain

## Collection: users

### Purpose

Stores authentication-independent user records.

### Owner

Identity Service

### Key Fields

- userId
- authProvider
- status
- role
- createdAt
- updatedAt

### Security

User can read own record.

Admins have elevated access.

---

## Collection: profiles

### Purpose

Stores personal preferences and profile metadata.

### Example Fields

- fullName
- profilePhoto
- preferredLanguage
- city
- state
- country
- notificationPreferences
- favoriteEventTypes

---

# 5. Event Domain

## Collection: events

Purpose:

Primary aggregate root for all event management.

Key Fields

- eventId
- ownerId
- title
- description
- category
- themeId
- budgetId
- venueId
- status
- guestCount
- eventDate
- createdAt
- updatedAt

Relationships

- Users
- Venue
- Vendors
- Budget
- Payments
- Media
- Chat
- AI Sessions

Retention

7 years after completion unless deleted by user.

---

## Collection: event_timelines

Purpose

Stores event milestones and schedules.

Example

- timelineId
- eventId
- title
- startTime
- endTime
- owner
- status

---

## Collection: event_templates

Stores reusable event blueprints.

Examples

- Birthday
- Wedding
- Corporate
- Housewarming
- Baby Shower
- Festival

---

# 6. Venue Domain

## Collection: venues

Owner

Venue Service

Purpose

Caches approved venue information retrieved from Google Maps Platform and partner integrations.

Key Fields

- venueId
- googlePlaceId
- name
- address
- latitude
- longitude
- capacity
- rating
- priceRange
- amenities
- photos
- verified

---

## Collection: venue_categories

Examples

- Banquet Hall
- Hotel
- Restaurant
- Convention Center
- Farm House
- Rooftop
- Community Hall

---

# 7. Vendor Domain

## Collection: vendors

Purpose

Marketplace of service providers.

Categories include:

- Catering
- Decoration
- Photography
- Videography
- DJ
- Music
- Makeup
- Transportation
- Event Management
- Entertainment

Key Fields

- vendorId
- businessName
- category
- city
- rating
- verified
- pricingModel
- availability

---

## Collection: vendor_quotes

Stores quotations submitted by vendors.

Fields

- quoteId
- vendorId
- eventId
- amount
- notes
- validityDate

---

# 8. Group Collaboration

## Collection: groups

Represents event collaboration groups.

Fields

- groupId
- eventId
- ownerId
- title
- whatsappGroupLink
- createdAt

---

## Collection: group_members

Tracks membership.

Fields

- memberId
- groupId
- role
- joinedAt

---

## Collection: group_messages

Stores in-app conversations.

Fields

- messageId
- groupId
- senderId
- messageType
- attachmentUrl
- createdAt

---

## Collection: group_polls

Supports collaborative decision-making.

Examples

- Venue Voting
- Food Voting
- Theme Voting

---

## Collection: group_tasks

Tracks assigned action items.

---

# 9. Budget Domain

## Collection: budgets

Tracks event budgets.

Fields

- budgetId
- eventId
- totalBudget
- allocatedBudget
- spentBudget
- remainingBudget

---

## Collection: expenses

Stores expense line items.

Categories

- Venue
- Food
- Decoration
- Gifts
- Entertainment
- Transport

---

# 10. Commerce Domain

## Collection: food_orders

Stores Swiggy-powered food orders.

Fields

- orderId
- eventId
- vendor
- orderStatus
- deliveryTime
- totalAmount

---

## Collection: grocery_orders

Stores grocery purchases.

---

# 11. Payments Domain

## Collection: payments

Tracks group contributions.

Fields

- paymentId
- eventId
- payerId
- amount
- paymentStatus
- gateway
- transactionId

---

## Collection: payment_transactions

Immutable payment history.

---

# 12. Media Domain

## Collection: media

Stores uploaded assets.

Fields

- mediaId
- ownerId
- eventId
- storagePath
- mediaType
- uploadedAt

---

## Collection: albums

Logical grouping of event media.

---

## Collection: highlights

AI-generated highlight reels and summaries.

---

# 13. Notification Domain

## Collection: notifications

Stores in-app notification history.

Types

- Reminder
- RSVP
- Payment
- Chat
- AI Suggestion
- Vendor Update

---

# 14. Design Domain

## Collection: themes

Stores Canva-based event themes.

Examples

- Royal Wedding
- Corporate Modern
- Kids Party
- Traditional
- Festival

---

## Collection: design_assets

Stores generated invitations, banners, posters, and social media creatives.

---

# 15. AI Domain

## Collection: skills

Registered AI Skills.

---

## Collection: skill_registry

Metadata for all available skills.

---

## Collection: ai_sessions

Conversation history and orchestration metadata.

---

## Collection: ai_memory

Persistent user preferences, planning context, and recommendation history.

---

## Collection: ai_feedback

Stores user ratings and feedback on AI responses.

---

# 16. Plugin Domain

## Collection: plugins

Installed plugins.

---

## Collection: plugin_registry

Certified plugins available through the marketplace.

---

# 17. Audit Domain

## Collection: audit_logs

Immutable platform audit trail.

Fields

- logId
- actorId
- action
- resource
- timestamp
- correlationId

Retention: 7 years (configurable).

---

# 18. Analytics Domain

## Collection: analytics

Aggregated operational metrics.

Examples

- Active Users
- Events Created
- Venue Searches
- Vendor Bookings
- AI Requests
- Payment Volume

---

# 19. Platform Configuration

## Collection: system_configs

Stores feature flags and platform configuration.

Examples

- Discount Rules
- Event Categories
- Supported Cities
- AI Feature Toggles
- Plugin Policies

---

# 20. Naming Standards

Rules:

- Collection names use plural nouns.
- Document IDs use UUID or Firestore auto IDs.
- Field names use camelCase.
- Timestamp fields use UTC.

---

# 21. Ownership Matrix

| Collection | Owner Service |
|------------|---------------|
| users | Identity Service |
| profiles | Identity Service |
| events | Event Service |
| venues | Venue Service |
| vendors | Vendor Service |
| budgets | Budget Service |
| payments | Payment Service |
| media | Media Service |
| groups | Collaboration Service |
| ai_sessions | AI Orchestrator |
| skills | Skill Registry |
| plugins | Plugin Service |
| analytics | Analytics Service |

---

# 22. Acceptance Criteria

The Firestore Collection Model is complete when:

- Every bounded context owns its collections.
- Security ownership is documented.
- Lifecycle policies are defined.
- AI-related collections support future memory and personalization.
- Collections are optimized for Firestore performance and offline synchronization.

---

# 23. Related Documents

- EOS-004-P1 Data Architecture Principles
- EOS-004-P3 Entity Relationship Model
- EOS-004-P4 Firestore Document Schemas
- EOS-003-P3 Firebase Backend Architecture

---

# Revision History

| Version | Date | Description |
|----------|------|-------------|
| 1.0.0 | 2026-07-04 | Initial release |

---

# Approval

| Role | Status |
|------|--------|
| Data Architect | Pending |
| Backend Lead | Pending |
| Product Owner | Pending |

---

> The Firestore Collection Model defines the canonical data organization for HiLo. It ensures that every domain—from event planning and collaboration to AI memory, commerce, and analytics—has a clearly owned, scalable, secure, and AI-ready data structure. This model serves as the foundation for all application features, microservices, and future platform extensions.
