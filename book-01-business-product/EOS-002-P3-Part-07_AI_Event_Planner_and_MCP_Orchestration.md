---
title: EOS-002-P3 Part 07 - AI Event Planner & MCP Orchestration
document_id: EOS-002-P3-P07
book: Book 01 – Business & Product
version: 1.0.0
status: Approved
classification: Functional Specification
project: EOS (Event Operating System)
product: HiLo
owner: AI Engineering
created: 2026-07-04
last_updated: 2026-07-04
---

# EOS-002-P3
# Part 07
# AI Event Planner & MCP Orchestration

> This document defines the AI architecture, OpenAI Responses API integration, MCP orchestration, intelligent decision engine, memory model, tool routing, and explainable recommendation framework for the HiLo platform.

---

# 1. Purpose

The AI Event Planner acts as the central intelligence layer of HiLo.

It understands user intent, orchestrates multiple MCP services, generates recommendations, automates repetitive tasks, and continuously improves planning outcomes.

---

# 2. Objectives

The AI shall:

- Understand natural language.
- Create complete event plans.
- Recommend venues.
- Recommend vendors.
- Optimize budgets.
- Generate timelines.
- Create Canva designs.
- Send WhatsApp invitations.
- Assist group collaboration.
- Order food through Swiggy APIs.
- Generate reminders.
- Produce post-event summaries.
- Explain every recommendation.

---

# 3. AI Principles

The AI must be:

- Explainable
- Transparent
- Non-deceptive
- Privacy-aware
- Human-supervised
- Deterministic where required
- Configurable
- Auditable

Users always retain final decision-making authority.

---

# 4. High-Level Architecture

```
                  User
                    │
                    ▼
             Flutter Application
                    │
                    ▼
         Cloud Run AI Gateway
                    │
                    ▼
         OpenAI Responses API
                    │
        MCP Orchestration Layer
                    │
 ┌────────┬────────┬────────┬────────┬────────┐
 │Google  │Canva  │Swiggy │WhatsApp│Payments│
 │Maps    │MCP    │ APIs  │Business│Gateway │
 └────────┴────────┴────────┴────────┴────────┘
                    │
                    ▼
              Firebase Backend
```

---

# 5. AI Responsibilities

The AI coordinates:

- Event planning
- Budget estimation
- Venue discovery
- Vendor ranking
- Theme generation
- Invitation creation
- Guest reminders
- Group collaboration
- Food ordering
- Timeline management
- Payment reminders
- Event summaries

---

# 6. Natural Language Planning

Example user requests:

> "Plan a birthday party for 60 people in Hyderabad with a budget of ₹2 lakh."

> "Find a rooftop venue near Gachibowli."

> "Generate a royal wedding invitation."

> "Order food for 150 guests."

The AI converts requests into structured workflows.

---

# 7. MCP Orchestration

The orchestration layer decides which MCP tools to invoke.

Supported tools:

| MCP | Responsibility |
|------|----------------|
| Google Maps | Venue & vendor discovery |
| Canva MCP | Invitations & themes |
| Swiggy APIs | Food & grocery ordering |
| WhatsApp Business | Invitations & reminders |
| Razorpay / Cashfree | Payments |
| Firebase | Data persistence |

---

# 8. Intent Classification

Primary intents:

- Create Event
- Edit Event
- Search Venue
- Search Vendor
- Generate Invitation
- Invite Guests
- Manage Budget
- Collect Payments
- Order Food
- Upload Photos
- Generate Summary

Multiple intents may be detected in one conversation.

---

# 9. Planning Workflow

```
User Request

↓

Intent Detection

↓

Context Retrieval

↓

MCP Selection

↓

Tool Execution

↓

Result Aggregation

↓

AI Reasoning

↓

Recommendation

↓

User Confirmation

↓

Execution
```

---

# 10. Context Awareness

The AI considers:

- Active event
- User preferences
- Budget
- Guest count
- Event type
- Event date
- Selected venue
- Vendor availability
- Previous conversations

---

# 11. Explainable AI

Every recommendation includes an explanation.

Example:

> "This venue is recommended because it is 4 km away, fits your ₹2 lakh budget, accommodates 80 guests, and has a Google rating of 4.8."

---

# 12. Memory Strategy

Short-term memory:

- Current conversation
- Current event
- Active selections

Long-term memory:

- User preferences
- Event history
- Favourite vendors
- Favourite venues
- Frequently used themes

Memory must never expose private information across users.

---

# 13. AI Planning Outputs

The AI may generate:

- Budget plan
- Timeline
- Checklist
- Vendor shortlist
- Venue shortlist
- Theme suggestions
- Invitation text
- Shopping list
- Catering estimate
- Reminder schedule

---

# 14. Canva MCP Workflow

```
Event Type

↓

Theme Selection

↓

Colour Palette

↓

Invitation Style

↓

Generate Canva Assets

↓

User Approval

↓

Save to Event Workspace
```

Generated assets include:

- Invitations
- Posters
- Welcome boards
- Social media posts
- Thank-you cards

---

# 15. Google Maps MCP Workflow

Inputs:

- Event location
- Budget
- Capacity
- Distance preference

Outputs:

- Venue recommendations
- Vendor recommendations
- Travel estimates
- Directions

---

# 16. Swiggy MCP Workflow

The AI may:

- Recommend catering
- Estimate food quantity
- Order groceries
- Suggest beverages
- Track deliveries

Execution requires user confirmation.

---

# 17. WhatsApp Workflow

The AI prepares:

- Invitations
- RSVP reminders
- Payment reminders
- Venue location sharing
- Event updates

Messages are previewed before sending.

---

# 18. Budget Intelligence

The AI shall:

- Allocate budgets
- Predict overruns
- Recommend savings
- Suggest alternative vendors
- Detect unnecessary expenses

---

# 19. AI Event Readiness Score

Score range:

0–100

Factors include:

- Venue confirmed
- Vendors booked
- Budget health
- RSVP completion
- Payment status
- Theme finalized
- Catering confirmed

Displayed on the dashboard.

---

# 20. AI Confidence

Internal confidence categories:

- High
- Medium
- Low

Low-confidence recommendations should request user clarification rather than making assumptions.

---

# 21. Firestore Collections

```
ai_sessions/

ai_memory/

ai_context/

ai_tasks/

ai_recommendations/

ai_explanations/

ai_feedback/

ai_usage/
```

---

# 22. Cloud Run Services

Dedicated services:

- AI Gateway
- MCP Orchestrator
- Prompt Service
- Recommendation Engine
- Memory Service
- Context Service
- Feedback Service

---

# 23. API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| /ai/chat | POST | Conversational planning |
| /ai/recommendations | POST | Generate recommendations |
| /ai/checklist | POST | Generate planning checklist |
| /ai/timeline | POST | Generate event timeline |
| /ai/theme | POST | Generate Canva design request |
| /ai/summary | GET | Post-event summary |

---

# 24. Business Rules

- AI recommendations are advisory only.
- User approval is mandatory before external actions.
- External MCP tools must be executed through the orchestration layer.
- AI shall explain recommendations.
- Sensitive actions require confirmation.

---

# 25. Error Handling

| Scenario | Behaviour |
|----------|-----------|
| Google Maps unavailable | Use cached venue data |
| Canva unavailable | Offer template fallback |
| Swiggy unavailable | Hide ordering options |
| OpenAI timeout | Retry with exponential backoff |
| MCP failure | Continue with available tools and notify user |

---

# 26. Acceptance Criteria

The AI module is complete when it can:

- Understand natural language.
- Plan complete events.
- Coordinate MCP tools.
- Generate explainable recommendations.
- Maintain conversational context.
- Produce event summaries.
- Respect privacy and security policies.

---

# 27. Dependencies

- OpenAI Responses API
- Firebase Authentication
- Cloud Firestore
- Cloud Run
- Google Maps Platform
- Canva MCP
- Swiggy Developer APIs
- WhatsApp Business Platform
- Razorpay / Cashfree

---

# 28. Related Documents

- EOS-001-P1 AI Governance & Engineering Philosophy
- EOS-001-P2 Master AI Governance System Prompt
- EOS-002-P3-Part-01 Platform Foundation & Core Architecture
- EOS-002-P3-Part-04 Event Management
- EOS-002-P3-Part-05 Venue Discovery & Google Maps Integration
- EOS-002-P3-Part-06 Vendor Marketplace & AI Recommendation Engine

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
| AI Architect | Pending |
| Engineering Lead | Pending |

---

> The AI Event Planner & MCP Orchestration module is the intelligence layer of HiLo. It coordinates OpenAI Responses API with Google Maps Platform, Canva MCP, Swiggy Developer APIs, WhatsApp Business Platform, Firebase, and payment gateways to deliver explainable, privacy-aware, and user-controlled event planning. Every recommendation is transparent, every external action requires user approval, and every completed event strengthens the platform's intelligence while preserving user trust.
