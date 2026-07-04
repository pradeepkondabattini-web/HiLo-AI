---
title: EOS-002-P3 Part 09 - AI Agent Platform & AI Orchestrator
document_id: EOS-002-P3-P09
book: Book 01 – Business & Product
version: 1.0.0
status: Approved
classification: Functional Specification
project: EOS (Event Operating System)
product: HiLo
owner: AI Platform Engineering
created: 2026-07-04
last_updated: 2026-07-04
---

# EOS-002-P3
# Part 09
# AI Agent Platform & AI Orchestrator

> This document defines the AI-native architecture of HiLo. It introduces the AI Orchestrator, specialized AI Agents, Skill Registry, MCP execution model, shared memory, governance, and inter-agent collaboration.

---

# 1. Purpose

HiLo shall function as an AI-native Event Operating System (EOS), where intelligent work is performed by specialized AI Agents coordinated through a central AI Orchestrator.

The Orchestrator manages task decomposition, agent selection, MCP execution, context sharing, memory, governance, auditing, and user approvals.

---

# 2. Objectives

The platform shall:

- Decompose complex requests into executable tasks.
- Route tasks to the appropriate AI Agent.
- Execute reusable Skills.
- Invoke MCP services securely.
- Maintain shared context and memory.
- Coordinate multiple agents in parallel.
- Explain recommendations.
- Ensure governance and auditability.

---

# 3. High-Level Architecture

```
                    User
                      │
                      ▼
               Flutter Application
                      │
                      ▼
             AI Gateway (Cloud Run)
                      │
                      ▼
                AI ORCHESTRATOR
                      │
 ┌────────────┬────────────┬────────────┬────────────┐
 │            │            │            │            │
 ▼            ▼            ▼            ▼            ▼
Planner    Venue AI    Vendor AI   Budget AI   Design AI

 ▼            ▼            ▼            ▼            ▼

Commerce   Media AI   Analytics   Messaging   Marketplace
   AI          AI          AI          AI           AI

                      │
                      ▼
               Skill Registry
                      │
                      ▼
              MCP Execution Layer
                      │
──────────────────────────────────────────
Google Maps
Canva
Swiggy
WhatsApp
Payments
Firebase
Future MCPs
──────────────────────────────────────────
```

---

# 4. AI Orchestrator Responsibilities

The Orchestrator is responsible for:

- Intent understanding
- Task decomposition
- Agent selection
- Skill selection
- Context management
- Memory retrieval
- MCP routing
- User approval workflows
- Result aggregation
- Error recovery
- Audit logging

The Orchestrator does **not** execute business logic directly.

---

# 5. AI Agent Principles

Every AI Agent must be:

- Domain-specific
- Stateless between requests (except managed memory)
- Independently deployable
- Observable
- Explainable
- Permission-aware
- Replaceable
- Versioned

---

# 6. Core AI Agents

## Event Planner Agent

Responsibilities:

- Event creation
- Planning checklist
- Timeline generation
- Risk detection
- Event readiness scoring

Skills:

- Create Event
- Generate Checklist
- Generate Timeline
- Generate Summary

---

## Venue Discovery Agent

Responsibilities:

- Google Maps search
- Hyperlocal discovery
- Venue ranking
- Venue comparison
- Travel estimation

Skills:

- Search Venues
- Compare Venues
- Estimate Travel Time
- Recommend Alternatives

---

## Vendor Intelligence Agent

Responsibilities:

- Vendor discovery
- Vendor ranking
- Quotation comparison
- Vendor Trust Score
- Bundle recommendations

Skills:

- Search Vendors
- Compare Quotes
- Book Vendor
- Analyze Reviews

---

## Budget Optimization Agent

Responsibilities:

- Budget planning
- Expense forecasting
- Cost optimization
- Payment tracking
- Contribution analysis

Skills:

- Allocate Budget
- Predict Overruns
- Suggest Savings
- Generate Payment Links

---

## Design Agent

Responsibilities:

- Canva integration
- Branding
- Theme generation
- Invitations
- Social assets

Skills:

- Generate Invitation
- Generate Poster
- Generate Welcome Board
- Generate Thank-you Card

---

## Commerce Agent

Responsibilities:

- Swiggy integration
- Food estimation
- Grocery ordering
- Supply management

Skills:

- Estimate Catering
- Order Food
- Order Supplies
- Track Deliveries

---

## Collaboration Agent

Responsibilities:

- Group management
- WhatsApp messaging
- Polls
- Task assignment
- AI summaries

Skills:

- Create Group
- Invite Members
- Generate Poll
- Summarize Discussion

---

## Media Intelligence Agent

Responsibilities:

- Photo organization
- Album creation
- Highlight generation
- Memory timeline
- AI captions

Skills:

- Organize Gallery
- Generate Highlights
- Detect Duplicates
- Create Album

---

## Marketplace Intelligence Agent

Responsibilities:

- Marketplace analytics
- Promotions
- Vendor intelligence
- Dynamic pricing
- Recommendation learning

Skills:

- Rank Promotions
- Analyze Demand
- Bundle Services
- Forecast Trends

---

## Analytics Agent

Responsibilities:

- Business dashboards
- Operational insights
- AI metrics
- Marketplace KPIs

Skills:

- Generate Dashboard
- Export Reports
- Forecast Revenue
- Analyze Usage

---

# 7. Agent Communication Model

Agents never call one another directly.

All communication flows through the AI Orchestrator.

```
Planner Agent

↓

AI Orchestrator

↓

Venue Agent

↓

AI Orchestrator

↓

Budget Agent

↓

AI Orchestrator

↓

User
```

---

# 8. Skill Registry

Every capability is registered as a Skill.

Each Skill contains:

- Skill ID
- Version
- Agent Owner
- MCP Dependencies
- Required Permissions
- Retry Policy
- Timeout
- Input Schema
- Output Schema
- Audit Policy

---

# 9. MCP Execution Layer

Supported MCPs:

| MCP | Primary Responsibility |
|------|------------------------|
| Google Maps Platform | Places, Maps, Routes |
| Canva MCP | Creative assets |
| Swiggy Developer APIs | Food & grocery |
| WhatsApp Business Platform | Messaging |
| Razorpay / Cashfree | UPI payments |
| Firebase | Persistence |
| OpenAI Responses API | Reasoning |

Future integrations require only a new MCP adapter and Skill registration.

---

# 10. Shared Memory

The platform maintains:

## Session Memory

- Active conversation
- Current event
- Temporary selections

## User Memory

- Preferences
- Favorite venues
- Favorite vendors
- Budget habits

## Organizational Memory

- Marketplace intelligence
- Vendor performance
- Venue success patterns

Memory is partitioned by tenant and user to preserve privacy.

---

# 11. Approval Framework

The following actions require explicit user approval:

- Payments
- WhatsApp broadcasts
- Food orders
- Vendor bookings
- Venue bookings
- Calendar updates
- External API actions with financial impact

---

# 12. Explainability Framework

Every recommendation must include:

- Why it was selected
- Data sources consulted
- Confidence level
- Alternative options
- User-adjustable factors

---

# 13. AI Governance

Every Agent shall:

- Log reasoning metadata
- Log Skill execution
- Record MCP calls
- Record execution time
- Record approval events
- Support audit trails

---

# 14. Firestore Collections

```
ai_agents/

agent_registry/

skill_registry/

skill_versions/

agent_sessions/

agent_memory/

orchestrator_logs/

mcp_execution_logs/

approval_requests/

ai_explanations/
```

---

# 15. Cloud Run Services

Each Agent is independently deployable:

- orchestrator-service
- planner-agent
- venue-agent
- vendor-agent
- budget-agent
- design-agent
- commerce-agent
- collaboration-agent
- media-agent
- analytics-agent
- marketplace-agent

---

# 16. API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| /orchestrator/execute | POST | Execute a multi-agent workflow |
| /agents | GET | List registered agents |
| /agents/{id} | GET | Retrieve agent metadata |
| /skills | GET | List registered skills |
| /skills/{id}/execute | POST | Execute a skill |
| /approvals | GET | Pending approvals |
| /memory/context | GET | Retrieve active context |

---

# 17. Business Rules

- Agents communicate only through the Orchestrator.
- Every Skill is versioned.
- External MCPs must be invoked through approved adapters.
- Financial actions require approval.
- AI recommendations are advisory and explainable.
- All executions are auditable.

---

# 18. Acceptance Criteria

The AI Agent Platform is complete when:

- Requests are decomposed into tasks.
- Appropriate Agents are selected.
- Skills execute successfully.
- MCPs are invoked securely.
- Shared context is maintained.
- User approvals are enforced.
- Execution logs are available.
- Recommendations are explainable.

---

# 19. Dependencies

- Flutter
- Firebase Auth
- Cloud Firestore
- Cloud Run
- OpenAI Responses API
- Google Maps Platform
- Canva MCP
- Swiggy Developer APIs
- WhatsApp Business Platform
- Razorpay / Cashfree
- Firebase Cloud Messaging

---

# 20. Related Documents

- EOS-001-P1 AI Governance & Engineering Philosophy
- EOS-001-P2 Master AI Governance System Prompt
- EOS-002-P3-Part-07 AI Event Planner & MCP Orchestration
- EOS-002-P3-Part-08 Group Collaboration, AI Skill Registry & WhatsApp Integration

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
| Chief AI Architect | Pending |
| Engineering Lead | Pending |

---

> The AI Agent Platform & AI Orchestrator establishes HiLo as an AI-native Event Operating System. By separating orchestration, agents, skills, and MCP integrations, the platform becomes modular, explainable, extensible, and enterprise-ready while supporting continuous innovation without disrupting existing capabilities.
