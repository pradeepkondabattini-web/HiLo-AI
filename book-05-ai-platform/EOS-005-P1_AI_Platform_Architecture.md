---
title: EOS-005 Part 01 - AI Platform Architecture
document_id: EOS-005-P1
book: Book 05 – AI Platform Architecture
version: 1.0.0
status: Approved
classification: Enterprise AI Architecture
project: EOS (Event Operating System)
product: HiLo
owner: AI Platform Team
created: 2026-07-04
last_updated: 2026-07-04
---

# EOS-005
# Part 01
# AI Platform Architecture

> This document defines the enterprise AI architecture for the HiLo Event Operating System (EOS). It establishes the architectural principles, platform components, AI execution model, orchestration framework, memory architecture, tool integration strategy, governance, and extensibility model for all AI-powered capabilities.

---

# 1. Purpose

The AI Platform is the intelligence layer of HiLo.

Its responsibilities include:

- Understanding user intent
- Planning complex tasks
- Coordinating AI agents
- Invoking MCP tools
- Managing conversational context
- Maintaining user memory
- Generating recommendations
- Explaining decisions
- Learning user preferences
- Supporting future autonomous workflows

The AI Platform is designed as a reusable enterprise capability rather than a collection of isolated AI features.

---

# 2. Vision

HiLo shall evolve into an AI-native Event Operating System where specialized AI agents collaborate with users and external services to plan, coordinate, and manage events from initial idea through completion.

The platform must support:

- Consumer experiences
- Business workflows
- Marketplace interactions
- Enterprise integrations
- Future autonomous planning

---

# 3. Architectural Principles

The AI Platform shall be:

- AI-first
- Human-centered
- Explainable
- Context-aware
- Memory-driven
- Privacy-aware
- Vendor-agnostic
- Extensible
- Observable
- Secure by design

---

# 4. High-Level Architecture

```
                    User
                      │
                      ▼
         Flutter Mobile / Flutter Web
                      │
                      ▼
            Firebase Authentication
                      │
                      ▼
            AI Gateway (Cloud Run)
                      │
                      ▼
             AI Orchestrator (EOS)
                      │
 ┌─────────────┬──────────────┬──────────────┐
 ▼             ▼              ▼
Context      Planning       Memory
Engine       Engine         Manager
 └─────────────┬──────────────┘
               ▼
         Skill Registry
               │
               ▼
          MCP Runtime
               │
 ┌──────┬────────┬─────────┬──────────┬──────────┐
 ▼      ▼        ▼         ▼          ▼
Google Canva   Swiggy  WhatsApp  Payment
Maps    MCP      MCP       MCP       MCP
               │
               ▼
      OpenAI Responses API
               │
               ▼
      AI Generated Response
```

---

# 5. AI Platform Components

The platform consists of the following core services:

- AI Gateway
- AI Orchestrator
- Context Engine
- Planning Engine
- Memory Manager
- Prompt Registry
- Skill Registry
- MCP Runtime
- Knowledge Graph
- Vector Retrieval
- Safety Engine
- Observability Platform

Each component is independently deployable.

---

# 6. AI Request Lifecycle

```
User Request

↓

Authentication

↓

Context Assembly

↓

Intent Detection

↓

Task Planning

↓

Skill Selection

↓

MCP Tool Invocation

↓

Knowledge Retrieval

↓

LLM Reasoning

↓

Response Validation

↓

Memory Update

↓

User Response
```

---

# 7. AI Gateway

Responsibilities:

- Authenticate requests
- Rate limiting
- Request validation
- Session management
- Trace creation
- API version routing
- Cost attribution

The AI Gateway does not perform reasoning.

---

# 8. AI Orchestrator

The AI Orchestrator coordinates all AI execution.

Responsibilities:

- Interpret user intent
- Select AI agents
- Invoke skills
- Coordinate MCP servers
- Manage execution flow
- Handle failures
- Aggregate responses

The orchestrator is the central intelligence layer of the platform.

---

# 9. Context Engine

The Context Engine assembles the minimum required information for each request.

Context sources include:

- User profile
- Active event
- Budget
- Preferences
- Calendar
- Group members
- Previous conversations
- Knowledge Graph
- Vector retrieval
- MCP capabilities

Only relevant context is supplied to the LLM.

---

# 10. Planning Engine

The Planning Engine decomposes complex goals into executable tasks.

Example:

"Plan a birthday party"

↓

- Determine guest count
- Estimate budget
- Search venues
- Compare vendors
- Generate invitation
- Order food
- Schedule reminders
- Track payments

---

# 11. Memory Manager

Memory layers:

- Working Memory
- Short-Term Memory
- Long-Term Memory
- Episodic Memory
- Semantic Memory
- Knowledge Graph

Memory updates follow user consent and governance policies.

---

# 12. Skill Registry

Every AI capability is implemented as a reusable Skill.

Examples:

- Venue Search
- Budget Optimizer
- Vendor Comparison
- Theme Generation
- RSVP Management
- Payment Tracking
- Catering Planner

Skills are discoverable and version-controlled.

---

# 13. MCP Runtime

The MCP Runtime provides standardized access to external capabilities.

Supported integrations:

- Google Maps
- Canva
- Swiggy
- WhatsApp
- UPI Payment Gateway

Future integrations are onboarded through the same runtime.

---

# 14. Knowledge Graph

The Knowledge Graph models relationships among:

- Users
- Events
- Venues
- Vendors
- Budgets
- Themes
- AI Skills
- Plugins
- MCP Servers

The graph supports contextual reasoning and recommendations.

---

# 15. Vector Retrieval

The AI Platform performs semantic retrieval over:

- Event history
- User preferences
- Vendor profiles
- Venue descriptions
- Themes
- Documentation
- AI memory

Retrieval-Augmented Generation (RAG) grounds responses in relevant knowledge.

---

# 16. AI Agent Model

The platform initially supports specialized agents, including:

- Event Planner Agent
- Venue Discovery Agent
- Budget Advisor Agent
- Vendor Advisor Agent
- Theme Designer Agent
- Food Planner Agent
- Guest Relationship Agent
- Payment Agent
- Memory Agent
- Marketplace Agent

Agents collaborate through the AI Orchestrator.

---

# 17. Explainable AI

Every recommendation should provide an explanation when appropriate.

Example:

"This venue is recommended because it fits your ₹75,000 budget, accommodates 150 guests, is within 5 km, and matches your previous preference for outdoor venues."

Users should understand why recommendations are made.

---

# 18. Human-in-the-Loop

The AI never performs irreversible business actions without approval.

Approval examples:

- Confirm venue booking
- Submit vendor payment
- Place Swiggy order
- Send invitations
- Execute refunds

Users remain in control of critical decisions.

---

# 19. Safety & Governance

The platform enforces:

- Prompt validation
- Content moderation
- RBAC
- MCP permission checks
- Audit logging
- AI policy enforcement
- Sensitive data protection

Safety policies are centralized.

---

# 20. Observability

Monitor:

- Request volume
- Response latency
- Token usage
- MCP usage
- Skill execution
- AI costs
- Memory retrievals
- Error rates
- User satisfaction

All AI operations generate distributed traces.

---

# 21. Scalability

The platform supports:

- Stateless Cloud Run services
- Horizontal auto-scaling
- Multi-agent execution
- Asynchronous workflows
- Event-driven processing
- Future multi-region deployment

---

# 22. Extensibility

New capabilities are added without changing the core platform.

Examples:

- New AI Agent
- New Skill
- New MCP Server
- New Payment Provider
- New Marketplace Plugin
- New LLM Provider

All extensions integrate through standardized interfaces.

---

# 23. Technology Stack

| Layer | Technology |
|--------|------------|
| Client | Flutter |
| Authentication | Firebase Auth |
| Backend | Cloud Run |
| Database | Cloud Firestore |
| Storage | Firebase Storage |
| AI | OpenAI Responses API |
| Tool Runtime | MCP |
| Maps | Google Maps Platform |
| Design | Canva MCP |
| Commerce | Swiggy Developer APIs |
| Messaging | WhatsApp Business Platform |
| Payments | Razorpay / Cashfree |
| Notifications | Firebase Cloud Messaging |
| Analytics | Firebase Analytics + BigQuery |
| CI/CD | GitHub Actions |

---

# 24. Acceptance Criteria

The AI Platform architecture is complete when:

- AI platform principles are documented.
- Core platform components are defined.
- AI request lifecycle is established.
- Agent architecture is documented.
- MCP runtime is standardized.
- Memory and context management are defined.
- Governance and safety controls are established.
- Scalability and extensibility requirements are documented.

---

# 25. Related Documents

- EOS-003-P5 Enterprise Integration Architecture
- EOS-004-P7 AI Memory, Context, Vector and Knowledge Graph
- EOS-004-P9 Analytics, BigQuery and Business Intelligence
- EOS-004-P11 Search, Indexing and Semantic Retrieval
- EOS-005-P2 AI Orchestrator Architecture
- EOS-005-P3 Multi-Agent Framework

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
| Enterprise Architect | Pending |
| Platform Engineering Lead | Pending |
| Product Owner | Pending |

---

> The AI Platform Architecture establishes the foundational intelligence layer for the HiLo Event Operating System. By combining an AI Orchestrator, modular agents, memory management, MCP-based tool integration, semantic retrieval, and enterprise governance, the platform delivers explainable, scalable, and secure AI experiences while remaining adaptable to future models, integrations, and autonomous capabilities.
