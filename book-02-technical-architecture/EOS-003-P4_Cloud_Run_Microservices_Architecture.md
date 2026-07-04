---
title: EOS-003 Part 04 - Cloud Run Microservices Architecture
document_id: EOS-003-P4
book: Book 02 – Technical Architecture
version: 1.0.0
status: Approved
classification: Technical Architecture
project: EOS (Event Operating System)
product: HiLo
owner: Backend Engineering
created: 2026-07-04
last_updated: 2026-07-04
---

# EOS-003
# Part 04
# Cloud Run Microservices Architecture

> This document defines the Cloud Run microservices architecture for HiLo, including service boundaries, deployment standards, inter-service communication, API Gateway, asynchronous processing, security, observability, and operational best practices.

---

# 1. Purpose

Cloud Run is the execution platform for all backend business logic.

Cloud Run services are responsible for:

- AI orchestration
- Business workflows
- MCP integrations
- Payments
- Vendor APIs
- Event processing
- Notifications
- External API communication
- Plugin execution

Firebase remains responsible for managed backend capabilities such as Authentication, Firestore, Storage, Messaging, Analytics, and Remote Config.

---

# 2. Architectural Principles

All services shall be:

- Stateless
- Independently deployable
- Horizontally scalable
- Event-driven
- API-first
- Observable
- Secure by default
- Idempotent where applicable

---

# 3. Service Topology

```
Flutter Application
        │
        ▼
 Firebase Authentication
        │
        ▼
     API Gateway
        │
        ▼
─────────────────────────────────────
 Cloud Run Services
─────────────────────────────────────
 Event Service
 Venue Service
 Vendor Service
 Budget Service
 AI Gateway
 AI Orchestrator
 Planner Agent
 Venue Agent
 Vendor Agent
 Budget Agent
 Design Agent
 Commerce Agent
 Collaboration Agent
 Media Agent
 Notification Service
 Payment Service
 Plugin Service
 Analytics Service
─────────────────────────────────────
        │
        ▼
 Pub/Sub │ Cloud Tasks │ Firestore
        │
        ▼
External MCP Integrations
```

---

# 4. Service Responsibilities

## API Gateway

Responsibilities:

- Authentication
- Authorization
- Request validation
- Rate limiting
- Routing
- API versioning
- Correlation IDs
- Audit logging

---

## Event Service

Responsibilities:

- Event CRUD
- Timeline management
- RSVP updates
- Event lifecycle

---

## Venue Service

Responsibilities:

- Venue search
- Availability
- Distance calculation
- Venue caching

---

## Vendor Service

Responsibilities:

- Vendor discovery
- Quotation management
- Vendor ratings
- Marketplace synchronization

---

## Budget Service

Responsibilities:

- Budget allocation
- Expense tracking
- Forecasting
- Discount calculations

---

## AI Gateway

Responsibilities:

- Receive AI requests
- Authenticate requests
- Stream responses
- Invoke AI Orchestrator

---

## AI Orchestrator

Responsibilities:

- Intent detection
- Task decomposition
- Agent selection
- Skill execution
- MCP routing
- Response aggregation

---

## Notification Service

Responsibilities:

- Push notifications
- Email (future)
- SMS (future)
- In-app notifications

---

## Payment Service

Responsibilities:

- UPI payment initiation
- Payment verification
- Contribution tracking
- Refund workflows

---

## Plugin Service

Responsibilities:

- Plugin registry
- Plugin validation
- Plugin lifecycle
- Plugin execution

---

# 5. Service Communication

### Synchronous

REST APIs

Used for:

- User requests
- CRUD operations
- Authentication
- Payments

---

### Asynchronous

Google Cloud Pub/Sub

Used for:

- Event notifications
- AI processing
- Analytics
- Background jobs
- Plugin events

---

### Deferred Processing

Google Cloud Tasks

Used for:

- Retry operations
- Scheduled reminders
- Long-running workflows
- AI retries

---

# 6. API Gateway Design

```
Client
  │
  ▼
API Gateway
  │
  ├── Authentication
  ├── Authorization
  ├── Validation
  ├── Logging
  ├── Routing
  └── Rate Limiting
        │
        ▼
Cloud Run Services
```

---

# 7. Service-to-Service Authentication

Authentication uses:

- Google IAM
- Service Accounts
- Identity Tokens
- Mutual trust within Google Cloud

No anonymous service communication is permitted.

---

# 8. Event-Driven Communication

Key domain events:

- EventCreated
- EventUpdated
- VenueSelected
- VendorBooked
- BudgetExceeded
- PaymentCompleted
- InvitationSent
- RSVPReceived
- MediaUploaded
- SkillExecuted
- PluginInstalled

All events include:

- Event ID
- Correlation ID
- Timestamp
- Source Service
- Payload Version

---

# 9. Cloud Run Deployment Standards

Each service shall define:

- Dockerfile
- Health endpoint
- Readiness endpoint
- Environment variables
- Secret references
- Resource limits

---

# 10. Scaling Policies

Default configuration:

- Minimum instances: 0 (Dev), 1 (Prod critical services)
- Maximum instances: configurable per service
- Concurrency: tuned per workload
- CPU allocation: request-based

Critical services may use minimum instances to reduce cold starts.

---

# 11. Configuration Management

Configuration sources:

- Environment variables
- Secret Manager
- Firebase Remote Config (client features)
- Infrastructure as Code

No secrets are committed to source control.

---

# 12. Secret Management

Secrets stored in:

Google Secret Manager

Examples:

- OpenAI API credentials
- Google Maps credentials
- Canva credentials
- Swiggy credentials
- WhatsApp credentials
- Payment gateway credentials

---

# 13. Logging Standards

Every request logs:

- Correlation ID
- User ID (if authenticated)
- Service name
- Endpoint
- Latency
- Status code
- Error details (sanitized)

Logs are centralized in Cloud Logging.

---

# 14. Observability

Metrics:

- Request latency
- Error rate
- Throughput
- AI execution time
- MCP latency
- Queue depth
- Task retries

Tools:

- Cloud Monitoring
- Cloud Logging
- Cloud Trace
- Error Reporting

---

# 15. Resilience Patterns

Supported patterns:

- Retry with exponential backoff
- Circuit breaker
- Timeout policies
- Bulkhead isolation
- Graceful degradation
- Idempotent operations

---

# 16. Docker Standards

Each service includes:

- Multi-stage build
- Minimal base image
- Non-root user
- Health checks
- Version labels

Images are stored in Artifact Registry.

---

# 17. API Versioning

Pattern:

```
/api/v1/events
/api/v1/venues
/api/v1/vendors
/api/v1/ai
```

Breaking changes require a new API version.

---

# 18. CI/CD

GitHub Actions pipeline:

- Static analysis
- Unit tests
- Build container
- Security scan
- Push to Artifact Registry
- Deploy to Cloud Run
- Smoke tests

---

# 19. Disaster Recovery

Strategies:

- Multi-region container images
- Infrastructure as Code
- Automated redeployment
- Firestore backups
- Secret replication
- Pub/Sub message durability

---

# 20. Acceptance Criteria

The Cloud Run architecture is accepted when:

- Services are independently deployable.
- API Gateway routes all external requests.
- Service authentication uses IAM.
- Pub/Sub enables asynchronous workflows.
- Cloud Tasks handle deferred execution.
- Observability is fully configured.
- Scaling policies meet performance targets.
- Secrets are managed securely.

---

# 21. Related Documents

- EOS-003-P1 System Architecture & C4 Model
- EOS-003-P2 Flutter Application Architecture
- EOS-003-P3 Firebase Backend Architecture
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
| Cloud Architect | Pending |
| Backend Lead | Pending |
| DevOps Lead | Pending |
| Product Owner | Pending |

---

> The Cloud Run Microservices Architecture provides the execution backbone for HiLo. By separating business logic into independently deployable, event-driven services and integrating securely with Firebase and external MCP providers, the platform achieves scalability, resilience, operational visibility, and long-term extensibility while supporting AI-native workflows.
