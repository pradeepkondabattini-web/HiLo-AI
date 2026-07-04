---
title: EOS-003 Part 01 - System Architecture & C4 Model
document_id: EOS-003-P1
book: Book 02 – Technical Architecture
version: 1.0.0
status: Approved
classification: Technical Architecture
project: EOS (Event Operating System)
product: HiLo
owner: Chief Architect
created: 2026-07-04
last_updated: 2026-07-04
---

# EOS-003
# Part 01
# System Architecture & C4 Model

> This document defines the enterprise system architecture for HiLo, including the C4 model, logical architecture, physical deployment, domain boundaries, service topology, AI Orchestrator, MCP integrations, security zones, scalability strategy, and deployment model.

---

# 1. Purpose

This document serves as the authoritative architecture reference for the HiLo platform.

It defines how every subsystem interacts and provides the foundation for implementation, testing, deployment, scaling, and future extensibility.

---

# 2. Architectural Principles

The platform shall follow:

- Clean Architecture
- Domain Driven Design (DDD)
- Event Driven Architecture (EDA)
- Microservices
- AI-First Design
- API First
- Cloud Native
- Mobile First
- Offline First
- Security by Design
- Privacy by Design
- Infrastructure as Code
- Twelve-Factor App methodology

---

# 3. Technology Stack

| Layer | Technology |
|---------|------------|
| Mobile & Web | Flutter |
| Backend | Firebase + Cloud Run |
| Authentication | Firebase Auth |
| Database | Cloud Firestore |
| Storage | Firebase Storage |
| AI | OpenAI Responses API |
| AI Skills | Skill Registry |
| AI Agents | AI Agent Platform |
| Maps | Google Maps Platform |
| Design | Canva MCP |
| Commerce | Swiggy APIs |
| Messaging | WhatsApp Business |
| Payments | Razorpay / Cashfree |
| Notifications | Firebase Cloud Messaging |
| Analytics | Firebase Analytics |
| CI/CD | GitHub Actions |
| Hosting | Firebase Hosting |
| Infrastructure | Google Cloud |

---

# 4. Context Diagram (C4 Level 1)

```
                        USER

                          │

                  Flutter Application

                          │

────────────────────────────────────────────

              HiLo Platform (EOS)

────────────────────────────────────────────

Authentication

Event Management

Venue Discovery

Vendor Marketplace

AI Platform

Commerce

Media

Analytics

────────────────────────────────────────────

          External Platforms

Google Maps

OpenAI

Canva

Swiggy

WhatsApp

Payment Gateway

Firebase
```

---

# 5. Container Diagram (C4 Level 2)

```
Flutter App

↓

Firebase Authentication

↓

API Gateway

↓

Cloud Run

↓

AI Gateway

↓

AI Orchestrator

↓

Agent Platform

↓

Skill Registry

↓

MCP Layer

↓

Google Maps

Canva

Swiggy

WhatsApp

Payments

↓

Firestore

↓

Storage
```

---

# 6. Component Diagram (C4 Level 3)

## Flutter

Presentation Layer

↓

Application Layer

↓

Domain Layer

↓

Infrastructure Layer

↓

Repositories

↓

API Gateway

---

## Backend

API Gateway

↓

Authentication Middleware

↓

Domain Services

↓

Event Bus

↓

Firestore

↓

Cloud Storage

---

## AI Platform

AI Gateway

↓

Intent Detection

↓

AI Orchestrator

↓

Agent Router

↓

Skill Registry

↓

MCP Execution Layer

↓

Response Generator

---

# 7. Domain-Driven Design (DDD)

Bounded Contexts

- Identity
- User Profile
- Event Management
- Venue Discovery
- Vendor Marketplace
- Budget
- Commerce
- Payments
- Collaboration
- Media
- AI Platform
- Marketplace
- Analytics
- Notifications

Each bounded context owns its data and APIs.

---

# 8. Microservice Topology

Cloud Run Services:

- api-gateway
- auth-service
- event-service
- venue-service
- vendor-service
- ai-orchestrator
- planner-agent
- venue-agent
- vendor-agent
- budget-agent
- design-agent
- commerce-agent
- collaboration-agent
- media-agent
- analytics-service
- notification-service
- payment-service
- plugin-service

All services are independently deployable.

---

# 9. AI Platform Architecture

```
User

↓

OpenAI Responses API

↓

AI Gateway

↓

AI Orchestrator

↓

AI Agent Platform

↓

Skill Registry

↓

MCP Layer

↓

External Systems
```

---

# 10. Event-Driven Architecture

Events include:

- EventCreated
- VenueSelected
- VendorBooked
- PaymentCompleted
- GuestInvited
- RSVPUpdated
- FoodOrdered
- MediaUploaded
- PluginInstalled
- SkillExecuted

Cloud Run services communicate asynchronously using Pub/Sub where appropriate.

---

# 11. API Gateway

Responsibilities:

- Authentication
- Authorization
- Rate limiting
- Request validation
- API versioning
- Routing
- Logging
- Observability

---

# 12. Security Zones

Zone 1 – Client

Flutter Applications

Zone 2 – Edge

Firebase Hosting

API Gateway

Zone 3 – Application

Cloud Run

AI Platform

Firestore

Zone 4 – External

Google Maps

Swiggy

Canva

WhatsApp

Payment Providers

---

# 13. Deployment Architecture

Google Cloud Regions

↓

Firebase

↓

Cloud Run

↓

Firestore

↓

Cloud Storage

↓

Cloud Logging

↓

Cloud Monitoring

↓

Cloud Trace

↓

Cloud Armor

↓

Secret Manager

---

# 14. Scalability

The architecture supports:

- Horizontal scaling
- Stateless services
- Serverless deployment
- Multi-region readiness
- Independent scaling of AI Agents
- Elastic Cloud Run instances

---

# 15. Availability

Target SLA:

99.9%

Strategies:

- Auto Scaling
- Health Checks
- Retry Policies
- Circuit Breakers
- Graceful Degradation

---

# 16. Observability

Metrics:

- Request latency
- AI execution time
- MCP execution time
- Error rate
- User sessions
- Event creation rate
- Booking success rate

Tools:

- Cloud Logging
- Cloud Monitoring
- Error Reporting
- Firebase Analytics

---

# 17. Repository Architecture

```
HiLo-AI/

docs/

flutter-app/

backend-services/

ai-orchestrator/

plugin-sdk/

firebase/

mcp-adapters/

infrastructure/

terraform/

testing/

examples/
```

---

# 18. C4 Level 4 (Code Organization)

Flutter follows Feature-First Clean Architecture:

```
features/

authentication/

events/

venues/

vendors/

payments/

chat/

media/

ai/

shared/
```

Cloud Run services follow:

```
cmd/

internal/

api/

domain/

application/

infrastructure/

tests/
```

---

# 19. Architecture Decision Records (ADR)

Every significant decision shall be documented as an ADR.

Examples:

- ADR-001 Flutter
- ADR-002 Firebase
- ADR-003 Cloud Run
- ADR-004 OpenAI Responses API
- ADR-005 MCP Framework
- ADR-006 Google Maps Platform

---

# 20. Quality Attributes

The architecture optimizes for:

- Scalability
- Reliability
- Security
- Maintainability
- Testability
- Explainability
- Extensibility
- Performance
- Cost Efficiency

---

# 21. Acceptance Criteria

The architecture is accepted when:

- Every subsystem has defined ownership.
- All integrations pass through approved interfaces.
- AI orchestration is centralized.
- Services are independently deployable.
- Security boundaries are documented.
- The platform supports horizontal scaling.
- New AI Agents and Plugins can be added without modifying existing services.

---

# 22. Dependencies

- Flutter
- Firebase
- Cloud Run
- Firestore
- Google Maps Platform
- OpenAI Responses API
- Canva MCP
- Swiggy Developer APIs
- WhatsApp Business Platform
- Razorpay / Cashfree
- GitHub Actions
- Docker

---

# 23. Related Documents

- EOS-001-P1 AI Governance & Engineering Philosophy
- EOS-001-P2 Master AI Governance System Prompt
- EOS-002-P3 Parts 01–10
- Future Book 03 – Data Architecture
- Future Book 04 – AI Platform Architecture

---

# Revision History

| Version | Date | Description |
|----------|------|-------------|
| 1.0.0 | 2026-07-04 | Initial release |

---

# Approval

| Role | Status |
|------|--------|
| Chief Architect | Pending |
| Product Owner | Pending |
| Engineering Lead | Pending |
| AI Architect | Pending |

---

> This document is the master technical blueprint for HiLo. All repositories, services, APIs, AI agents, MCP adapters, plugins, and deployment pipelines must conform to the architecture and principles defined herein.
