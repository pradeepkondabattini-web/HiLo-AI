---
title: EOS-004 Part 03 - Entity Relationship Model
document_id: EOS-004-P3
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
# Part 03
# Entity Relationship Model

> This document defines the logical Entity Relationship Model (ERM) for HiLo using Domain-Driven Design (DDD). It specifies aggregate roots, bounded contexts, entity relationships, ownership rules, reference strategies, and consistency boundaries while remaining optimized for Cloud Firestore.

---

# 1. Purpose

The Entity Relationship Model provides the canonical definition of how business entities relate to one another.

Objectives:

- Define logical relationships.
- Establish aggregate roots.
- Prevent ownership ambiguity.
- Optimize Firestore design.
- Enable AI reasoning.
- Support future analytics and reporting.

---

# 2. Modeling Principles

HiLo follows:

- Domain Driven Design
- Aggregate Root Pattern
- Reference over Join
- Eventual Consistency
- API-first ownership
- Offline-first synchronization
- AI-ready relationships

---

# 3. Bounded Contexts

| Context | Aggregate Root |
|----------|----------------|
| Identity | User |
| Profile | Profile |
| Event Management | Event |
| Venue Discovery | Venue |
| Vendor Marketplace | Vendor |
| Budget | Budget |
| Commerce | Order |
| Payments | Payment |
| Collaboration | Group |
| Media | Album |
| AI Platform | AI Session |
| Plugin Platform | Plugin |
| Analytics | Analytics Snapshot |

Each bounded context owns its own lifecycle and APIs.

---

# 4. High-Level Relationship Model

```
                         User
                          │
        ┌─────────────────┼──────────────────┐
        │                 │                  │
        ▼                 ▼                  ▼
     Profile           Events             AI Session
                          │
        ┌─────────────────┼──────────────────────┐
        ▼                 ▼                      ▼
     Venue            Budget                 Group
        │                 │                      │
        ▼                 ▼                      ▼
     Vendors          Payments             Messages
        │                 │                      │
        ▼                 ▼                      ▼
   Food Orders      Transactions           Polls
        │
        ▼
     Media
        │
        ▼
    Analytics
```

---

# 5. Identity Relationships

## Aggregate Root

User

Relationships:

```
User

↓

Profile (1:1)

↓

Events (1:N)

↓

Groups (1:N)

↓

Payments (1:N)

↓

Media (1:N)

↓

AI Sessions (1:N)
```

Rules:

- A user owns one profile.
- A user may create many events.
- A user may belong to many groups.
- Users never directly own venues or vendors.

---

# 6. Event Aggregate

Aggregate Root:

Event

Relationships:

```
Event

↓

Venue (1:1)

↓

Budget (1:1)

↓

Groups (1:N)

↓

Payments (1:N)

↓

Media (1:N)

↓

Timeline (1:N)

↓

Food Orders (1:N)

↓

Vendor Quotes (1:N)
```

Rules:

- Every event belongs to one owner.
- Every event has one selected venue.
- Multiple vendors may participate.
- AI recommendations are associated through AI Sessions.

---

# 7. Venue Relationships

Venue

Relationships:

```
Venue

↓

Events (1:N)

↓

Venue Category (N:1)

↓

Vendor Recommendations (1:N)
```

Venue data is cached from Google Maps Platform and partner integrations.

---

# 8. Vendor Relationships

Vendor

Relationships:

```
Vendor

↓

Quotes (1:N)

↓

Bookings (1:N)

↓

Reviews (1:N)

↓

Food Orders (1:N)

↓

Categories (N:1)
```

A vendor can participate in multiple events.

---

# 9. Budget Relationships

Budget

Relationships:

```
Budget

↓

Expenses (1:N)

↓

Payments (1:N)

↓

Discount Rules (1:N)
```

Budget belongs exclusively to a single event.

---

# 10. Collaboration Relationships

Group

Relationships:

```
Group

↓

Members (1:N)

↓

Messages (1:N)

↓

Polls (1:N)

↓

Tasks (1:N)

↓

Media (1:N)
```

A group is always associated with exactly one event.

---

# 11. Payment Relationships

Payment

Relationships:

```
Payment

↓

Transaction (1:N)

↓

Refund (0:N)

↓

Contributor (1:1)
```

Payments are immutable after settlement.

---

# 12. Media Relationships

Album

Relationships:

```
Album

↓

Media (1:N)

↓

Highlights (1:N)
```

Media belongs to an event and optionally to an album.

---

# 13. AI Platform Relationships

AI Session

Relationships:

```
AI Session

↓

AI Memory

↓

Skill Executions

↓

MCP Invocations

↓

Feedback
```

The AI Session acts as the aggregate root for conversational context.

---

# 14. Skill Relationships

Skill

Relationships:

```
Skill

↓

Agent

↓

Plugin

↓

MCP Adapter
```

A Skill may invoke one or more MCP adapters through the AI Orchestrator.

---

# 15. Plugin Relationships

Plugin

Relationships:

```
Plugin

↓

Skills

↓

AI Agents

↓

MCP Adapters

↓

Version History
```

Plugins are versioned and independently deployable.

---

# 16. Analytics Relationships

Analytics Snapshot

Relationships:

```
Analytics

↓

Events

↓

Users

↓

Payments

↓

Vendors

↓

AI Usage
```

Analytics data is read-only and derived from operational data.

---

# 17. Reference Strategy

Reference documents using IDs rather than embedding large objects.

Example:

```
eventId

venueId

vendorId

budgetId

groupId

paymentId
```

Embed only immutable or frequently accessed metadata when beneficial for performance.

---

# 18. Denormalization Guidelines

Allowed:

- Venue name in Event
- Vendor display name in Quote
- User display name in Message

Avoid duplicating mutable business data.

---

# 19. Transaction Boundaries

Cloud Firestore transactions are used only when:

- Updating related documents atomically.
- Maintaining counters.
- Processing payments.
- Finalizing bookings.

Long-running workflows use event-driven orchestration rather than distributed transactions.

---

# 20. AI Context Graph

Logical AI relationships:

```
User
  │
  ▼
Preferences
  │
  ▼
Past Events
  │
  ▼
Preferred Venues
  │
  ▼
Preferred Vendors
  │
  ▼
Themes
  │
  ▼
Skills
  │
  ▼
Recommendations
```

This logical graph supports future semantic search and Retrieval-Augmented Generation (RAG).

---

# 21. Data Consistency Rules

- Aggregate roots own state transitions.
- Cross-domain updates occur via APIs or events.
- No service directly writes another service's aggregate.
- Eventual consistency is acceptable across bounded contexts.

---

# 22. Ownership Matrix

| Aggregate Root | Owning Service |
|----------------|----------------|
| User | Identity Service |
| Event | Event Service |
| Venue | Venue Service |
| Vendor | Vendor Service |
| Budget | Budget Service |
| Payment | Payment Service |
| Group | Collaboration Service |
| Album | Media Service |
| AI Session | AI Orchestrator |
| Plugin | Plugin Service |

---

# 23. Acceptance Criteria

The Entity Relationship Model is complete when:

- Aggregate roots are defined.
- Relationships are documented.
- Ownership boundaries are clear.
- Firestore reference strategies are established.
- AI context relationships support future personalization.
- Cross-service interactions follow DDD principles.

---

# 24. Related Documents

- EOS-004-P1 Data Architecture Principles
- EOS-004-P2 Firestore Collection Model
- EOS-004-P4 Firestore Document Schemas
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
| Chief Data Architect | Pending |
| Backend Lead | Pending |
| AI Architect | Pending |
| Product Owner | Pending |

---

> The Entity Relationship Model establishes the logical structure of the HiLo platform. By combining Domain-Driven Design with Firestore-optimized reference strategies, it provides a scalable, AI-ready foundation for event management, collaboration, commerce, analytics, and future platform evolution while maintaining clear ownership and consistency boundaries.
