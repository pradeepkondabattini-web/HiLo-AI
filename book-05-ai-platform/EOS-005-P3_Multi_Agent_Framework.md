---
title: EOS-005 Part 03 - Multi-Agent Framework
document_id: EOS-005-P3
book: Book 05 – AI Platform Architecture
version: 1.0.0
status: Approved
classification: Enterprise AI Multi-Agent Architecture
project: EOS (Event Operating System)
product: HiLo
owner: AI Platform Team
created: 2026-07-04
last_updated: 2026-07-04
---

# EOS-005
# Part 03
# Multi-Agent Framework

> This document defines the Multi-Agent Framework for the HiLo Event Operating System (EOS). It establishes the architecture, lifecycle, collaboration model, communication protocols, governance, and execution patterns for specialized AI agents working together to accomplish complex event-planning tasks.

---

# 1. Purpose

The Multi-Agent Framework enables HiLo to decompose complex user goals into coordinated tasks executed by specialized AI agents.

Objectives:

- Domain specialization
- Parallel execution
- Reusable capabilities
- Explainable decisions
- Scalable architecture
- Fault isolation
- Extensible ecosystem

---

# 2. Design Principles

The framework shall be:

- Modular
- Stateless
- Event-driven
- Explainable
- Observable
- Policy-controlled
- Vendor-neutral
- Human-supervised

---

# 3. Agent Hierarchy

```
User
 │
 ▼
Executive AI Orchestrator
 │
 ├─────────────────────────────────────┐
 ▼                                     ▼
Planning Supervisor             Marketplace Supervisor
 │                                     │
 ├──────────────┐                      ├───────────────┐
 ▼              ▼                      ▼               ▼
Venue Agent   Budget Agent      Vendor Agent    Commerce Agent

                 ▼
Communication Supervisor
 │
 ├──────────────┐
 ▼              ▼
Guest Agent   Notification Agent

                 ▼
Memory Supervisor
 │
 ├──────────────┐
 ▼              ▼
Memory Agent  Knowledge Agent
```

Supervisor agents coordinate worker agents within a domain.

---

# 4. Agent Categories

## Executive Agent

Responsibilities:

- Receive orchestrator requests
- Delegate work
- Monitor execution
- Aggregate responses

---

## Planning Agents

Examples:

- Event Planner
- Timeline Planner
- Budget Planner

---

## Discovery Agents

Examples:

- Venue Discovery
- Vendor Discovery
- Theme Discovery

---

## Commerce Agents

Examples:

- Catering
- Grocery
- Payment
- Ticketing (future)

---

## Communication Agents

Examples:

- Invitation Manager
- RSVP Manager
- WhatsApp Coordinator
- Reminder Manager

---

## Design Agents

Examples:

- Canva Designer
- Branding Advisor
- Theme Generator

---

## Memory Agents

Examples:

- Context Manager
- Preference Manager
- Knowledge Graph Manager

---

## Marketplace Agents

Examples:

- Plugin Discovery
- Skill Discovery
- Marketplace Recommendations

---

# 5. Agent Lifecycle

```
Register

↓

Idle

↓

Assigned

↓

Planning

↓

Executing

↓

Waiting (optional)

↓

Completed

↓

Memory Update

↓

Idle
```

Agents remain stateless between executions.

---

# 6. Agent Responsibilities

Every agent shall:

- Accept structured input
- Validate permissions
- Request context
- Execute assigned task
- Return structured output
- Emit telemetry
- Avoid side effects outside assigned scope

---

# 7. Agent Communication

Agents communicate only through:

- AI Orchestrator
- Event Bus
- Shared Context
- Skill Execution Engine

Direct agent-to-agent calls are prohibited.

---

# 8. Event Bus

The framework uses asynchronous events.

Examples:

```
EventPlanningRequested

VenueSearchCompleted

VendorQuotesReceived

InvitationGenerated

PaymentCompleted

FoodOrderAccepted

ReminderScheduled
```

Google Cloud Pub/Sub is the preferred implementation.

---

# 9. Shared Context

Agents access a shared execution context containing:

- User profile
- Active event
- Budget
- Preferences
- Guest list
- Calendar
- Memory references
- AI policies

Context is immutable during a single execution unless explicitly updated by the orchestrator.

---

# 10. Memory Access

Agents access memory through the Memory Manager.

Supported layers:

- Working Memory
- Short-Term Memory
- Long-Term Memory
- Episodic Memory
- Semantic Memory
- Knowledge Graph

Agents never write directly to storage.

---

# 11. Skill Invocation

Agents execute reusable Skills rather than embedding business logic.

Example:

Venue Agent

↓

SearchNearbyVenues Skill

↓

Google Maps MCP

↓

Results

This separation promotes reuse and consistency.

---

# 12. MCP Tool Usage

Agents interact with external services only through the MCP Runtime.

Supported tools:

- Google Maps
- Canva
- Swiggy
- WhatsApp
- Payments

No agent may call provider SDKs directly.

---

# 13. Human Collaboration

Agents pause for approval when required.

Approval scenarios:

- Venue booking
- Vendor selection
- Payment confirmation
- Food order placement
- Invitation dispatch

The framework supports resuming workflows after approval.

---

# 14. Error Handling

If an agent fails:

1. Retry transient errors.
2. Escalate to supervisor.
3. Attempt alternative skill or provider.
4. Continue unaffected tasks.
5. Record failure in audit logs.

---

# 15. Explainability

Each agent shall provide:

- Decision summary
- Inputs considered
- Confidence score
- Recommended next action

Users should understand how conclusions were reached.

---

# 16. Security

Every agent enforces:

- Firebase Authentication
- RBAC
- ABAC
- MCP permissions
- Data minimization
- Prompt validation

Agents receive only the minimum data necessary.

---

# 17. Observability

Metrics:

- Agent latency
- Success rate
- Failure rate
- Retry count
- Token usage
- Cost
- MCP invocations
- Memory retrievals
- User approvals

Distributed traces correlate multi-agent workflows.

---

# 18. Scalability

The framework supports:

- Horizontal scaling
- Parallel agent execution
- Long-running workflows
- Event-driven processing
- Future multi-region deployment

---

# 19. Agent Registry

Each registered agent includes:

- Agent ID
- Name
- Domain
- Version
- Description
- Owner
- Supported Skills
- MCP Dependencies
- Required Permissions
- Status

The Agent Registry is the authoritative catalog of AI agents.

---

# 20. Governance

New agents require:

- Architecture review
- Security review
- Prompt review
- Skill registration
- MCP permission approval
- Observability configuration

All agents follow semantic versioning.

---

# 21. Future Expansion

Planned agents include:

- Travel Planner
- Accommodation Planner
- Entertainment Coordinator
- Weather Advisor
- Sustainability Advisor
- Accessibility Advisor
- Corporate Compliance Agent
- Sponsor Manager
- Marketing Campaign Agent
- AI Concierge

The framework supports incremental onboarding without modifying existing agents.

---

# 22. Technology Mapping

| Component | Technology |
|-----------|------------|
| Agent Runtime | Cloud Run |
| Event Bus | Google Cloud Pub/Sub |
| Agent Registry | Firestore |
| Context Store | Firestore |
| Memory Store | Firestore + Vector Store |
| MCP Runtime | OpenAI MCP |
| AI Model | OpenAI Responses API |
| Monitoring | Cloud Monitoring |
| Analytics | BigQuery |

---

# 23. Acceptance Criteria

The Multi-Agent Framework is complete when:

- Agent hierarchy is defined.
- Lifecycle is documented.
- Communication model is standardized.
- Event Bus architecture is established.
- Shared context management is specified.
- Memory integration is documented.
- Security and governance are enforced.
- Agent Registry is operational.

---

# 24. Related Documents

- EOS-005-P1 AI Platform Architecture
- EOS-005-P2 AI Orchestrator Architecture
- EOS-005-P4 Prompt Registry and Prompt Engineering
- EOS-005-P5 Skill Registry and Skill Execution Engine
- EOS-005-P6 MCP Runtime and Tool Orchestration
- EOS-004-P7 AI Memory, Context, Vector and Knowledge Graph
- EOS-003-P5 Enterprise Integration Architecture

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
| AI Platform Lead | Pending |
| Product Owner | Pending |

---

> The Multi-Agent Framework provides the collaborative intelligence layer of the HiLo Event Operating System. By organizing AI capabilities into supervised, domain-specific agents coordinated through an event-driven architecture, HiLo achieves scalable, explainable, resilient, and extensible AI workflows while maintaining strong governance, security, and operational observability.
