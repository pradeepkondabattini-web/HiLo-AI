---
title: EOS-004 Part 07 - AI Memory, Context, Vector and Knowledge Graph
document_id: EOS-004-P7
book: Book 03 – Data Architecture
version: 1.0.0
status: Approved
classification: AI Data Architecture
project: EOS (Event Operating System)
product: HiLo
owner: AI Platform Team
created: 2026-07-04
last_updated: 2026-07-04
---

# EOS-004
# Part 07
# AI Memory, Context, Vector and Knowledge Graph

> This document defines the memory architecture for HiLo's AI Platform, including working memory, short-term memory, long-term memory, vector embeddings, Retrieval-Augmented Generation (RAG), knowledge graph relationships, MCP context propagation, and personalization strategies.

---

# 1. Purpose

HiLo AI shall remember relevant user context across sessions while respecting privacy, user consent, and security boundaries.

Objectives:

- Deliver personalized event planning.
- Reduce repetitive user input.
- Improve recommendations.
- Enable multi-agent collaboration.
- Support Retrieval-Augmented Generation (RAG).
- Build an enterprise knowledge graph.

---

# 2. AI Memory Philosophy

The AI must:

- Remember useful information.
- Forget temporary information when appropriate.
- Never retain sensitive information without consent.
- Be transparent about remembered preferences.
- Allow users to inspect and delete memory.

Memory exists to improve user experience, not to collect unnecessary personal data.

---

# 3. Memory Layers

```
User

↓

Working Memory

↓

Short-Term Memory

↓

Long-Term Memory

↓

Knowledge Graph

↓

Vector Index

↓

AI Skills

↓

MCP Integrations
```

---

# 4. Working Memory

Purpose:

Maintain context for the active conversation.

Retention:

Current session only.

Examples:

- Selected event
- Current venue search
- Budget under discussion
- Vendor shortlist
- Active attendees
- Current AI task

Storage:

In-memory (Cloud Run).

Never persisted beyond the session unless promoted.

---

# 5. Short-Term Memory

Purpose:

Store recent planning context.

Retention:

30–90 days (configurable).

Examples:

- Recent conversations
- Pending RSVPs
- Budget revisions
- Vendor comparisons
- Theme discussions
- Group decisions

Storage:

Firestore (`ai_sessions` collection).

---

# 6. Long-Term Memory

Purpose:

Capture stable user preferences and behavioral patterns.

Examples:

- Preferred event types
- Budget ranges
- Favorite venues
- Cuisine preferences
- Preferred decorators
- Frequently invited contacts
- Language preference
- Accessibility requirements

Storage:

Firestore (`ai_memory` collection).

Users can edit or delete entries.

---

# 7. Episodic Memory

Stores completed experiences.

Examples:

- Birthday 2025
- Wedding Anniversary
- Office Team Lunch
- Housewarming

Each episode contains:

- Event summary
- Budget
- Venue
- Vendors
- Guest satisfaction
- Photos
- AI-generated highlights

This enables future recommendations based on past events.

---

# 8. Semantic Memory

Stores general platform knowledge.

Examples:

- Venue categories
- Vendor taxonomy
- Event checklists
- Cultural traditions
- Festival templates

Shared across all users.

Managed by the AI Platform Team.

---

# 9. Procedural Memory

Defines repeatable workflows.

Examples:

- Plan a birthday party
- Book a banquet hall
- Order catering
- Send WhatsApp invitations
- Generate Canva invitation
- Split payments

Procedural memory is implemented as AI Skills.

---

# 10. Vector Memory

Purpose:

Support semantic retrieval beyond keyword matching.

Vector sources include:

- Event descriptions
- Vendor profiles
- Venue summaries
- AI conversations
- User preferences
- Theme descriptions

Embedding model:

OpenAI Embeddings API (or future equivalent).

Future vector store options:

- Vertex AI Vector Search
- Pinecone
- Weaviate
- pgvector
- Firestore-compatible vector storage (when appropriate)

---

# 11. Retrieval-Augmented Generation (RAG)

Flow:

```
User Query

↓

AI Orchestrator

↓

Context Retrieval

↓

Vector Search

↓

Knowledge Graph

↓

Relevant Documents

↓

OpenAI Responses API

↓

Grounded Response
```

The AI must ground responses in retrieved context whenever possible.

---

# 12. Knowledge Graph

Purpose:

Represent relationships across the platform.

Core entities:

- User
- Event
- Venue
- Vendor
- Budget
- Theme
- Group
- Payment
- Media
- Skill
- Plugin
- MCP Adapter

Example:

```
User

ATTENDED

↓

Event

HOSTED_AT

↓

Venue

BOOKED

↓

Vendor
```

---

# 13. User Preference Graph

Tracks relationships such as:

- Likes
- Frequently books
- Frequently invites
- Frequently orders
- Frequently visits

Used to personalize recommendations.

---

# 14. Vendor Knowledge Graph

Relationships include:

- Vendor → Category
- Vendor → City
- Vendor → Ratings
- Vendor → Events Served
- Vendor → Preferred Themes

---

# 15. Venue Knowledge Graph

Relationships include:

- Venue → Location
- Venue → Capacity
- Venue → Amenities
- Venue → Event Types
- Venue → Nearby Vendors

---

# 16. AI Context Assembly

Before every AI response, the orchestrator assembles:

1. User profile.
2. Active event.
3. Group context.
4. Budget.
5. Venue.
6. Vendor shortlist.
7. Previous decisions.
8. Relevant memories.
9. Retrieved knowledge.
10. MCP capabilities.

Only the minimum required context is sent to the LLM.

---

# 17. MCP Context Propagation

Each MCP request receives scoped context.

Examples:

### Google Maps MCP

- City
- Event type
- Budget
- Guest count

### Canva MCP

- Theme
- Colors
- Occasion
- Branding

### Swiggy MCP

- Delivery location
- Guest count
- Cuisine
- Budget

### WhatsApp MCP

- Group ID
- Invite list
- Event summary

No MCP receives unrelated personal information.

---

# 18. Memory Promotion Rules

Information is promoted from Working Memory to Long-Term Memory only when:

- User explicitly saves it.
- Preference is repeatedly observed.
- AI confidence exceeds defined threshold.
- User consent exists.

---

# 19. Forgetting Strategy

The AI shall forget:

- Temporary planning notes after completion.
- Expired invitations.
- Completed workflows not marked for retention.

Users may request:

- Delete one memory.
- Delete event memory.
- Delete all AI memory.

Deletion propagates across all memory layers where applicable.

---

# 20. Privacy Controls

Users can:

- View stored memories.
- Export memories.
- Correct memories.
- Delete memories.
- Disable personalization.

Memory collection requires informed consent where applicable.

---

# 21. Security

Memory inherits platform security:

- Firebase Authentication
- Firestore Security Rules
- RBAC
- ABAC
- IAM for service accounts

AI memory is encrypted at rest and in transit.

---

# 22. Performance Targets

| Operation | Target |
|-----------|--------|
| Working Memory Lookup | <20 ms |
| Firestore Memory Lookup | <100 ms |
| Vector Retrieval | <300 ms |
| Knowledge Graph Expansion | <300 ms |
| Context Assembly | <500 ms |

---

# 23. Future Enhancements

- Multi-agent shared memory
- Federated memory across devices
- Knowledge graph reasoning
- Semantic event clustering
- AI-generated life timeline
- Personalized planning playbooks
- Memory confidence scoring
- Context compression

---

# 24. Acceptance Criteria

The AI Memory architecture is complete when:

- Working, short-term, and long-term memory are defined.
- Memory promotion rules are documented.
- Knowledge graph entities and relationships are established.
- Vector retrieval strategy is defined.
- MCP context propagation is documented.
- Privacy controls are implemented.
- Memory lifecycle is documented.

---

# 25. Related Documents

- EOS-003-P4 Cloud Run Microservices Architecture
- EOS-004-P2 Firestore Collection Model
- EOS-004-P4 Firestore Document Schemas
- EOS-005 AI Platform Architecture
- EOS-005-P2 AI Orchestrator Architecture

---

# Revision History

| Version | Date | Description |
|----------|------|-------------|
| 1.0.0 | 2026-07-04 | Initial release |

---

# Approval

| Role | Status |
|------|--------|
| Chief AI Architect | Pending |
| Chief Data Architect | Pending |
| Security Architect | Pending |
| Product Owner | Pending |

---

> The AI Memory, Context, Vector and Knowledge Graph architecture provides the cognitive foundation for HiLo. By combining layered memory, semantic retrieval, knowledge graphs, and controlled MCP context propagation, the platform delivers personalized, explainable, and privacy-aware AI assistance that continuously improves over time while remaining secure and scalable.
