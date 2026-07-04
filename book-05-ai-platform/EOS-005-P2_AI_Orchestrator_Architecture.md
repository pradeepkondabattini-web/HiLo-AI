---
title: EOS-005 Part 02 - AI Orchestrator Architecture
document_id: EOS-005-P2
book: Book 05 – AI Platform Architecture
version: 1.0.0
status: Approved
classification: Enterprise AI Orchestration
project: EOS (Event Operating System)
product: HiLo
owner: AI Platform Team
created: 2026-07-04
last_updated: 2026-07-04
---

# EOS-005
# Part 02
# AI Orchestrator Architecture

> This document defines the Enterprise AI Orchestrator that coordinates all AI activities within the HiLo Event Operating System. The orchestrator manages intent understanding, planning, agent collaboration, MCP tool execution, memory, context, governance, and response synthesis.

---

# 1. Purpose

The AI Orchestrator is the central intelligence layer of HiLo.

It coordinates:

- AI Agents
- Skills
- MCP Servers
- Memory
- Knowledge Graph
- Vector Retrieval
- External APIs
- Human approvals

The orchestrator never contains business logic itself.

It coordinates specialized components.

---

# 2. Responsibilities

The AI Orchestrator shall:

- Receive AI requests
- Detect intent
- Assemble context
- Select agents
- Build execution plans
- Execute skills
- Invoke MCP tools
- Retrieve knowledge
- Validate outputs
- Update memory
- Produce explainable responses

---

# 3. Architectural Principles

The orchestrator shall be:

- Stateless
- Event-driven
- Modular
- Explainable
- Observable
- Vendor-neutral
- Resilient
- Policy-driven

---

# 4. High-Level Architecture

```
                    User
                      │
                      ▼
               AI Gateway
                      │
                      ▼
           Executive AI Orchestrator
                      │
     ┌────────────────┼────────────────┐
     ▼                ▼                ▼
Planning        Context Engine    Safety Engine
Supervisor
     │
     ▼
Agent Supervisor Layer
     │
 ┌───┼────┬──────┬───────┬────────┐
 ▼   ▼    ▼      ▼       ▼        ▼
Venue Budget Theme Vendor Guest Payment
Agent Agent Agent Agent Agent Agent
     │
     ▼
Skill Execution Engine
     │
     ▼
MCP Runtime
     │
 ┌───┬────┬─────┬────────┬────────┐
 ▼   ▼    ▼     ▼        ▼
Google Canva Swiggy WhatsApp Payment
Maps
```

---

# 5. Request Lifecycle

```
Request Received

↓

Authentication

↓

Policy Validation

↓

Intent Detection

↓

Context Assembly

↓

Planning

↓

Agent Selection

↓

Skill Selection

↓

Tool Execution

↓

Knowledge Retrieval

↓

Response Validation

↓

Memory Update

↓

Analytics

↓

Response Delivery
```

---

# 6. Intent Detection

Supported intents include:

- Plan Event
- Discover Venue
- Compare Vendors
- Create Theme
- Send Invitations
- Order Catering
- Manage Budget
- Track Payments
- Retrieve Event History

Intent classification combines structured rules and LLM reasoning.

---

# 7. Context Assembly

The Context Engine gathers:

- User profile
- Active event
- Budget
- Calendar
- Guest list
- Preferences
- Previous conversations
- AI memory
- Knowledge Graph
- Relevant documents
- MCP capabilities

Only required context is included.

---

# 8. Planning Engine

Complex goals are decomposed into executable tasks.

Example:

User:

"Plan my daughter's birthday."

Execution plan:

1. Create event
2. Estimate budget
3. Discover venues
4. Compare decorators
5. Generate invitations
6. Build guest list
7. Order food
8. Schedule reminders
9. Track expenses

Each task becomes a Skill invocation.

---

# 9. Agent Selection

The orchestrator selects one or more agents.

Examples:

- Event Planner Agent
- Venue Discovery Agent
- Vendor Advisor Agent
- Theme Designer Agent
- Food Planner Agent
- Budget Advisor Agent
- Guest Relationship Agent
- Payment Agent

Multiple agents may execute in parallel.

---

# 10. Skill Execution

Agents invoke reusable Skills.

Examples:

- Search Nearby Venues
- Estimate Budget
- Compare Quotes
- Create Canva Invitation
- Generate RSVP Link
- Calculate Catering

Skills are stateless and independently versioned.

---

# 11. MCP Runtime

Tool execution is delegated to MCP adapters.

Supported tools:

- Google Maps
- Canva
- Swiggy
- WhatsApp
- Razorpay/Cashfree

The orchestrator never communicates directly with provider APIs.

---

# 12. Memory Integration

Memory layers:

- Working Memory
- Short-Term Memory
- Long-Term Memory
- Episodic Memory
- Semantic Memory
- Knowledge Graph

The orchestrator retrieves only relevant memories.

---

# 13. Knowledge Retrieval

Retrieval-Augmented Generation (RAG) combines:

- Firestore
- Knowledge Graph
- Vector Search
- Platform documentation
- User history

Responses are grounded whenever possible.

---

# 14. Explainable AI

Every recommendation should include reasoning.

Example:

"This venue is recommended because:

- Fits ₹60,000 budget
- Capacity: 180 guests
- Outdoor seating available
- 4.8★ rating
- Previously preferred by you"

---

# 15. Human Approval Workflow

Certain actions require confirmation.

Examples:

- Confirm booking
- Send WhatsApp invitations
- Pay vendor
- Place food order
- Cancel event

The orchestrator pauses until approval is received.

---

# 16. Error Recovery

If a tool fails:

1. Retry eligible operations.
2. Use alternative providers where available.
3. Offer manual workflow.
4. Log failure.
5. Continue remaining tasks when safe.

---

# 17. Observability

Track:

- Execution traces
- Agent latency
- Skill execution time
- MCP latency
- Token consumption
- Cost per workflow
- Failure rate
- Approval wait time

Distributed tracing is mandatory.

---

# 18. Security

The orchestrator enforces:

- Firebase Authentication
- RBAC
- ABAC
- MCP permissions
- Prompt validation
- Data minimization
- Audit logging

No tool receives unnecessary user data.

---

# 19. Scalability

Supports:

- Horizontal scaling
- Parallel agent execution
- Asynchronous workflows
- Event-driven processing
- Multi-region deployment
- Future multi-model orchestration

---

# 20. Extensibility

New capabilities require only registration.

Supported extensions:

- AI Agent
- Skill
- MCP Server
- Payment Provider
- Vendor API
- LLM Provider

No orchestrator code changes should be required for standard extensions.

---

# 21. Technology Mapping

| Component | Technology |
|-----------|------------|
| AI Gateway | Cloud Run |
| AI Orchestrator | Cloud Run |
| Context Engine | Firestore + AI Memory |
| Planning Engine | Internal Service |
| Skill Registry | Firestore |
| MCP Runtime | OpenAI MCP |
| LLM | OpenAI Responses API |
| Memory | Firestore + Vector Store |
| Analytics | BigQuery + Firebase Analytics |
| Monitoring | Cloud Monitoring + Cloud Logging |

---

# 22. Acceptance Criteria

The AI Orchestrator architecture is complete when:

- Request lifecycle is defined.
- Context assembly is documented.
- Planning workflow is established.
- Agent coordination is specified.
- Skill execution is standardized.
- MCP runtime integration is documented.
- Human approval workflows are supported.
- Observability and governance are implemented.

---

# 23. Related Documents

- EOS-005-P1 AI Platform Architecture
- EOS-005-P3 Multi-Agent Framework
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
| Platform Engineering Lead | Pending |
| Product Owner | Pending |

---

> The AI Orchestrator Architecture defines the operational brain of the HiLo Event Operating System. By coordinating specialized AI agents, reusable skills, MCP-based tool integrations, contextual memory, and governed execution workflows, the orchestrator delivers scalable, explainable, secure, and extensible AI experiences while remaining independent of any single LLM or technology provider.
