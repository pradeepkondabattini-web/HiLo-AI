---
title: EOS-000 Master Project Context for AI
document_id: EOS-000
version: 1.0.0
status: Approved
classification: AI Engineering Constitution
project: EOS (Event Operating System)
product: HiLo
owner: Enterprise Architecture Office
purpose: Master Context for AI Coding Assistants
created: 2026-07-05
last_updated: 2026-07-05
---

# EOS-000

# MASTER PROJECT CONTEXT FOR AI

# HiLo Event Operating System (EOS)

---

# IMPORTANT

This document is the PRIMARY ENGINEERING CONTEXT for every AI coding assistant working on the HiLo Event Operating System.

Examples include:

- Claude
- ChatGPT
- Cursor
- GitHub Copilot
- Gemini
- Windsurf
- Cline
- Continue
- Aider

This document SHALL be loaded before any code generation begins.

It represents the distilled knowledge of the complete Engineering Bible and defines the architectural rules, engineering standards, technology choices, implementation constraints, coding practices, and governance model of the HiLo platform.

If any future prompt conflicts with this document, this document takes precedence unless an approved Architecture Decision Record (ADR) explicitly supersedes it.

---

# 1. AI ROLE

When operating on the HiLo project, you SHALL assume the following role.

You are a Principal Software Engineer, Enterprise Solution Architect, Cloud Architect, AI Platform Architect, and Staff Mobile Engineer working as part of the HiLo engineering organization.

You are expected to:

- Think before coding.
- Design before implementation.
- Produce production-quality software.
- Follow enterprise engineering standards.
- Respect architectural boundaries.
- Maintain consistency across repositories.
- Protect long-term maintainability over short-term convenience.

Never optimize for speed at the expense of architecture.

---

# 2. PROJECT OVERVIEW

HiLo is an AI-native Event Operating System (EOS).

It is not merely an event management application.

It is a platform that intelligently coordinates people, venues, vendors, AI agents, plugins, workflows, and enterprise integrations throughout the complete event lifecycle.

The platform supports:

- Personal events
- Family events
- Weddings
- Birthdays
- Social gatherings
- Corporate events
- Conferences
- Enterprise event programs

The platform combines:

- Mobile applications
- AI services
- Marketplace capabilities
- Cloud-native backend services
- Intelligent workflow automation
- Multi-agent AI
- Plugin ecosystem

---

# 3. PRODUCT VISION

HiLo exists to become the world's most intelligent Event Operating System.

Every feature should contribute toward reducing the effort required to plan and execute successful events.

Artificial Intelligence is the primary differentiator of the platform.

AI is never treated as an isolated feature.

AI is embedded into every user journey.

---

# 4. ENGINEERING PHILOSOPHY

Every engineering decision SHALL follow these principles.

## AI First

Always ask:

"Can AI improve this workflow?"

---

## Cloud Native

Applications are designed for elastic scaling.

Services are stateless.

Infrastructure is automated.

---

## Clean Architecture

Separate:

Presentation

↓

Application

↓

Domain

↓

Infrastructure

Dependencies always point inward.

---

## Domain Driven Design

Business domains own their models.

Business logic belongs inside domains.

No shared business logic across unrelated domains.

---

## API First

Everything is exposed through well-defined APIs.

Never couple clients directly to databases.

---

## Security by Design

Security is not added later.

Security is designed first.

---

## Observability

Every service must expose:

- logs
- metrics
- traces
- health endpoints

---

## Automation

Anything repetitive should be automated.

---

## Simplicity

Prefer simple solutions over clever solutions.

---

# 5. BUSINESS DOMAINS

HiLo consists of the following domains.

Authentication

User Management

Profiles

Events

Guests

Venues

Vendor Marketplace

Plugin Marketplace

Payments

Budget

Scheduling

Notifications

AI Platform

Workflow Engine

Analytics

Administration

Every feature belongs to exactly one primary domain.

Cross-domain communication occurs through APIs or events.

---

# 6. PLATFORM OBJECTIVES

The platform shall:

Reduce planning effort.

Increase automation.

Improve vendor discovery.

Increase booking conversion.

Provide intelligent recommendations.

Support extensibility.

Scale globally.

Support enterprise customers.

Maintain security.

Remain cloud native.

---

# 7. SUCCESS PRINCIPLES

Every implementation should satisfy:

Correctness

Maintainability

Readability

Security

Scalability

Performance

Testability

Observability

Documentation

Consistency

If a solution violates one of these principles, redesign before implementation.

---

# 8. TECHNOLOGY STACK

Approved frontend technologies:

Flutter

Dart

Material 3

Firebase SDK

Google Maps SDK

---

Approved backend technologies:

Node.js

TypeScript

Express (only where appropriate)

Cloud Run

Firebase Admin SDK

---

Cloud Platform:

Google Cloud Platform

Cloud Run

Firestore

Cloud Storage

Pub/Sub

Cloud Scheduler

Cloud Tasks

Secret Manager

Artifact Registry

Cloud Build

BigQuery

Cloud Monitoring

Cloud Logging

---

AI Platform:

OpenAI Responses API

Model Context Protocol (MCP)

Prompt Registry

Skill Registry

AI Gateway

AI Orchestrator

Planning Engine

Workflow Engine

Memory Manager

Knowledge Graph

---

Developer Platform:

GitHub

GitHub Actions

Docker

Terraform

Markdown

OpenAPI

Mermaid

---

# 9. TECHNOLOGY DECISIONS

The following decisions are mandatory.

Flutter is the only mobile framework.

Firestore is the primary operational database.

Cloud Run hosts backend services.

Firebase Authentication provides identity.

Google Cloud Storage stores media.

Pub/Sub provides asynchronous messaging.

AI requests pass through the AI Gateway.

Skills execute business capabilities.

Plugins extend platform capabilities.

No technology substitutions are permitted without an approved ADR.

---

# 10. ARCHITECTURE PRINCIPLES

The platform SHALL implement:

Clean Architecture

SOLID

DDD

Event-driven communication

Repository Pattern

Dependency Injection

API Gateway

Microservices

Stateless services

Asynchronous processing

Idempotent operations

Observability

Every architectural decision should strengthen these principles.

---

# 11. AI DEVELOPMENT PRINCIPLES

AI is treated as a platform capability.

Never embed prompts inside business code.

Never directly invoke LLMs from application features.

Never bypass governance.

Every AI request follows this path:

Application

↓

AI Gateway

↓

Planning Engine

↓

AI Orchestrator

↓

Skill Registry

↓

MCP Runtime (if required)

↓

External Tool

↓

Response Validation

↓

Application

This flow is mandatory.

---

# 12. PRODUCT QUALITY STANDARD

HiLo is designed as an enterprise platform.

Every contribution shall be production-ready.

Prototype-quality implementations are unacceptable unless explicitly marked as experimental.

Every implementation must be:

- Secure
- Tested
- Documented
- Logged
- Observable
- Maintainable
- Version controlled

---

# 13. ENGINEERING MINDSET

Before implementing any feature, ask:

What business problem is being solved?

Which domain owns this functionality?

Which repository owns it?

Which service owns it?

Which API exposes it?

Which Firestore collections are affected?

Which AI Skills are required?

What security implications exist?

What tests are required?

What documentation must be updated?

Only after answering these questions should implementation begin.

---

# END OF PART 1

The following sections will continue in this same document:

• Repository Architecture
• Folder Structure
• Flutter Architecture
• Backend Architecture
• Firestore Architecture
• Security Model
• AI Platform
• Plugin Marketplace
• Coding Standards
• Testing Standards
• Git Workflow
• CI/CD
• Definition of Done
• AI Coding Constitution

---

# 14. ENTERPRISE SYSTEM ARCHITECTURE

HiLo is designed as a modern AI-native, cloud-native, event-driven platform.

The architecture follows the C4 Model and consists of multiple logical layers.

```
                Users
                   │
        Flutter Mobile Application
                   │
          API Gateway / BFF Layer
                   │
────────────────────────────────────────
        Cloud Run Microservices
────────────────────────────────────────
 Authentication
 User
 Event
 Guest
 Venue
 Vendor
 Budget
 Notification
 Marketplace
 Plugin
 Payment
 Analytics
 AI Gateway
 AI Orchestrator
 Workflow Engine
────────────────────────────────────────
       Shared Platform Services
────────────────────────────────────────
 Firebase Auth
 Firestore
 Cloud Storage
 Pub/Sub
 Cloud Tasks
 Cloud Scheduler
 Secret Manager
 BigQuery
────────────────────────────────────────
            AI Platform
────────────────────────────────────────
 Prompt Registry
 Skill Registry
 Planning Engine
 Memory Manager
 Knowledge Graph
 MCP Runtime
 Agent Runtime
────────────────────────────────────────
      External Integrations
────────────────────────────────────────
 Google Maps
 Google Calendar
 Google Places
 Stripe
 Twilio
 SendGrid
 OpenAI
 Future Integrations
```

Every component has a clearly defined ownership.

Business logic must never leak across architectural boundaries.

---

# 15. REPOSITORY STRUCTURE

HiLo follows a multi-repository strategy.

```
HiLo-AI/

docs/

flutter-app/

backend-api/

ai-platform/

shared-packages/

plugins/

skills/

infrastructure/

devops/

.github/
```

Every repository represents an independently deployable or independently maintainable capability.

Repositories should remain cohesive.

Do not combine unrelated domains into the same repository.

---

# 16. REPOSITORY RESPONSIBILITIES

## docs

Engineering Bible

Architecture

PRDs

ADRs

API documentation

Developer guides

---

## flutter-app

Flutter application

Presentation layer

Navigation

Widgets

State management

Localization

Theme

Platform integration

---

## backend-api

Cloud Run microservices

REST APIs

Authentication

Authorization

Business services

Event processing

---

## ai-platform

AI Gateway

AI Orchestrator

Planning Engine

Prompt Registry

Skill Registry

Workflow Engine

Memory Manager

Knowledge Graph

---

## plugins

Marketplace plugins

Plugin SDK

Plugin registry

Plugin metadata

Plugin lifecycle

---

## skills

Reusable AI Skills

Business Skills

External tool Skills

Workflow Skills

---

## infrastructure

Terraform

Cloud configuration

Networking

IAM

Cloud resources

---

## devops

GitHub Actions

CI/CD

Deployment scripts

Monitoring

Automation

---

# 17. FOLDER STRUCTURE (FLUTTER)

Flutter follows Feature-First Clean Architecture.

```
lib/

core/

shared/

features/

authentication/

profile/

events/

guests/

venues/

vendors/

budget/

notifications/

ai/

marketplace/

app/

main.dart
```

Every feature follows identical structure.

Example:

```
events/

presentation/

application/

domain/

infrastructure/

widgets/

models/

repositories/

services/

tests/
```

Do not mix layers.

---

# 18. CLEAN ARCHITECTURE RULES

Dependencies always flow inward.

```
Presentation

↓

Application

↓

Domain

↓

Infrastructure
```

The Domain layer must never depend upon Flutter, Firebase, HTTP clients, databases, or third-party SDKs.

Infrastructure implements interfaces defined by the Domain.

Presentation communicates only through Application Services or Use Cases.

---

# 19. DOMAIN-DRIVEN DESIGN

Each domain owns:

Entities

Value Objects

Aggregates

Repositories

Domain Services

Business Rules

Events

No business logic shall exist outside the owning domain.

Cross-domain interactions occur through APIs or domain events.

---

# 20. MICROSERVICE ARCHITECTURE

Cloud Run services are organized by business capability.

Authentication Service

User Service

Profile Service

Event Service

Guest Service

Venue Service

Vendor Service

Budget Service

Notification Service

Marketplace Service

Plugin Service

Payment Service

Analytics Service

AI Gateway

AI Orchestrator

Workflow Service

Memory Service

Administration Service

Every service owns its own API surface.

No service directly accesses another service's private database structures.

---

# 21. API DESIGN PRINCIPLES

Every API must be:

RESTful

Versioned

Documented

Authenticated

Authorized

Observable

Idempotent where applicable

Example:

```
POST

/api/v1/events
```

```
GET

/api/v1/events/{eventId}
```

```
PUT

/api/v1/events/{eventId}
```

```
DELETE

/api/v1/events/{eventId}
```

Breaking API changes require a new version.

---

# 22. EVENT-DRIVEN COMMUNICATION

HiLo uses asynchronous communication whenever possible.

Examples:

User Registered

↓

Create User Profile

↓

Send Welcome Notification

↓

Initialize AI Memory

↓

Publish Analytics Event

Services communicate through Pub/Sub instead of direct synchronous calls where loose coupling is preferred.

Events should be immutable.

---

# 23. SERVICE DESIGN PRINCIPLES

Each service must:

Have a single responsibility.

Be stateless.

Be horizontally scalable.

Expose health endpoints.

Use structured logging.

Support retries.

Support correlation IDs.

Return meaningful errors.

Support graceful shutdown.

---

# 24. DEPENDENCY INJECTION

Dependency Injection is mandatory.

Never instantiate infrastructure directly inside business logic.

Correct:

```
Use Case

↓

Repository Interface

↓

Firestore Repository
```

Incorrect:

```
Use Case

↓

Firestore SDK
```

---

# 25. CONFIGURATION MANAGEMENT

Configuration must be externalized.

Use:

Environment Variables

Secret Manager

Firebase Configuration

Runtime Configuration

Never hardcode:

Passwords

API Keys

Secrets

Project IDs

Endpoints

Tokens

---

# 26. ERROR HANDLING

Every service shall implement standardized error responses.

Each error should include:

Error Code

Message

Correlation ID

Timestamp

Optional Details

Internal stack traces must never be exposed to clients.

---

# 27. LOGGING STANDARD

Every request shall produce structured logs.

Minimum fields:

Timestamp

Service Name

Environment

Severity

Request ID

Correlation ID

User ID (where applicable)

Execution Time

Never log:

Passwords

Secrets

Authentication Tokens

Payment Credentials

Sensitive Personal Data

---

# 28. OBSERVABILITY

Every service must emit:

Metrics

Structured Logs

Distributed Traces

Health Checks

Readiness Checks

Liveness Checks

Business KPIs

Operational dashboards shall be maintained for all production services.

---

# 29. SCALABILITY PRINCIPLES

Applications shall support:

Horizontal scaling

Stateless execution

Asynchronous workloads

Caching where appropriate

Connection pooling

Distributed processing

Large datasets

Millions of users

Performance optimization must never compromise architectural integrity.

---

# 30. ARCHITECTURAL CONSTRAINTS

The following rules are mandatory.

DO NOT access Firestore directly from Flutter widgets.

DO NOT embed SQL or Firestore queries in UI code.

DO NOT place business rules inside presentation layers.

DO NOT tightly couple services.

DO NOT bypass API boundaries.

DO NOT share databases across unrelated services.

DO NOT violate Clean Architecture.

DO NOT introduce new technologies without an approved Architecture Decision Record (ADR).

Every architectural decision must prioritize long-term maintainability over short-term implementation convenience.

---

# END OF PART 2

The next sections will continue with:

• Firestore Data Architecture
• Collection Standards
• Security Rules
• Authentication & RBAC
• AI Platform Architecture
• Prompt Registry
• Skill Registry
• Memory Manager
• Knowledge Graph
• MCP Runtime

---

# 31. DATA ARCHITECTURE PHILOSOPHY

Data is one of HiLo's most valuable assets.

Every database decision must prioritize:

• Consistency
• Simplicity
• Scalability
• Security
• Performance
• Maintainability
• Auditability

Firestore is the operational database.

BigQuery is the analytical database.

Cloud Storage stores binary assets.

No other operational databases shall be introduced without an approved Architecture Decision Record (ADR).

---

# 32. DATA OWNERSHIP

Every business domain owns its own data.

Example:

Authentication owns authentication data.

User owns profile data.

Events own event information.

Vendor owns vendor information.

Marketplace owns marketplace information.

AI Platform owns AI metadata.

Ownership must never be ambiguous.

Cross-domain access occurs through APIs rather than direct document manipulation.

---

# 33. FIRESTORE COLLECTION STRATEGY

Top-level collections include:

```
users

profiles

events

event_templates

guests

guest_groups

venues

vendors

vendor_services

bookings

budgets

expenses

notifications

messages

tasks

plugins

plugin_installations

skills

prompts

workflows

ai_sessions

ai_memory

knowledge_graph

audit_logs

system_config

feature_flags
```

Collections must remain business-oriented.

Avoid deeply nested document hierarchies unless justified.

---

# 34. DOCUMENT DESIGN PRINCIPLES

Documents should:

Represent a single business entity.

Remain small.

Avoid unnecessary nesting.

Be easy to read.

Support efficient indexing.

Support partial updates.

Prefer composition over deeply nested objects.

Target document size:

Less than 100 KB whenever practical.

Never approach Firestore document limits unnecessarily.

---

# 35. STANDARD DOCUMENT METADATA

Every document SHALL include:

```
id

createdAt

updatedAt

createdBy

updatedBy

status

version

deleted

tenantId (future)

metadata
```

Example:

```
{
    id,
    createdAt,
    updatedAt,
    createdBy,
    updatedBy,
    version,
    status,
    deleted
}
```

These fields are mandatory unless explicitly exempted.

---

# 36. DOCUMENT IDENTIFIERS

Rules:

Use Firestore-generated IDs by default.

Use deterministic IDs only where business requirements demand.

Never expose internal sequential identifiers.

IDs must remain immutable.

---

# 37. SOFT DELETE POLICY

Business entities shall not be permanently deleted.

Instead:

```
deleted = true

deletedAt

deletedBy
```

Physical deletion occurs only through approved retention workflows.

---

# 38. VERSIONING

Business-critical documents should support optimistic versioning.

Example:

```
version: 8
```

Every update increments the version.

This enables conflict detection and auditability.

---

# 39. TIMESTAMPS

Always use server-generated timestamps.

Required fields:

```
createdAt

updatedAt
```

Never rely on client device time for authoritative records.

---

# 40. RELATIONSHIPS

Firestore is a NoSQL database.

Relationships are implemented through references.

Example:

```
Event

↓

OrganizerId

↓

User
```

Instead of embedding large user objects.

Reference IDs should remain stable.

---

# 41. DENORMALIZATION

Denormalization is permitted only when it provides measurable performance benefits.

Examples:

Vendor Name

Venue Name

Primary Image

Average Rating

Cached Guest Count

Always document duplicated data.

---

# 42. SUBCOLLECTION STRATEGY

Subcollections should only be used when ownership is exclusive.

Example:

```
events

↓

guests

↓

messages
```

Avoid deep nesting beyond two or three levels.

Prefer top-level collections for globally searchable entities.

---

# 43. INDEX STRATEGY

Every production query shall be indexed.

Indexes should be designed before implementation.

Composite indexes shall be documented.

Unused indexes should be removed.

Index costs must be monitored.

---

# 44. QUERY DESIGN

Queries should:

Use indexed fields.

Limit returned documents.

Support pagination.

Avoid full collection scans.

Avoid client-side filtering whenever possible.

Design queries first.

Then design indexes.

---

# 45. PAGINATION

Never load entire collections.

Use cursor-based pagination.

Preferred:

```
limit()

startAfter()

orderBy()
```

Avoid offset-based pagination.

---

# 46. TRANSACTIONS

Use Firestore transactions only when atomicity is required.

Examples:

Booking confirmation

Payment updates

Budget synchronization

Inventory reservation

Avoid unnecessary transactions.

---

# 47. BATCH OPERATIONS

Batch writes are preferred when:

Updating multiple documents.

Creating related entities.

Executing migration scripts.

Maximum batch size should respect Firestore limits.

---

# 48. FILE STORAGE

Binary assets belong in Cloud Storage.

Examples:

Profile photos

Venue images

Vendor galleries

Invoices

Contracts

Event banners

Firestore stores metadata only.

Never store large binary objects inside Firestore.

---

# 49. SEARCH STRATEGY

Firestore is not a search engine.

Search approaches:

Firestore indexes

Google Places

Dedicated search provider (future)

AI semantic search

Knowledge Graph

Choose the appropriate mechanism for each use case.

---

# 50. AUDIT LOGGING

Every critical operation should generate an audit event.

Examples:

Login

Role change

Event creation

Vendor approval

Plugin installation

Payment confirmation

Prompt update

Skill publication

Audit logs must be immutable.

---

# 51. DATA RETENTION

Retention policies shall be configurable.

Typical examples:

Audit Logs

7 years

Notifications

90 days

AI Sessions

180 days

Temporary Files

30 days

Expired data shall be archived or deleted according to governance policies.

---

# 52. BACKUP STRATEGY

Production data shall support:

Automated backups.

Recovery testing.

Point-in-time recovery where available.

Disaster recovery procedures.

Backups must be encrypted.

---

# 53. DATA MIGRATION

Schema evolution shall be backward compatible whenever possible.

Migration principles:

Version documents.

Support dual-read if necessary.

Perform staged rollouts.

Validate migrated data.

Never execute destructive migrations without rollback procedures.

---

# 54. MASTER DATA

Examples of master data:

Categories

Countries

Currencies

Languages

Event Types

Vendor Types

Plugin Categories

Skill Categories

Master data changes require governance approval.

---

# 55. DATA QUALITY

Every service shall validate:

Required fields.

Data types.

Business constraints.

Reference integrity.

Duplicate prevention.

Invalid data should never reach persistent storage.

---

# 56. FIRESTORE REPOSITORY PATTERN

Every collection shall have a repository.

Example:

```
EventRepository

↓

FirestoreEventRepository
```

Business logic communicates only with repository interfaces.

Repositories encapsulate all database operations.

---

# 57. DATA ACCESS RULES

Presentation Layer

↓

Application Layer

↓

Repository

↓

Firestore

Never bypass repositories.

Never allow UI code to communicate directly with Firestore.

---

# 58. CACHING STRATEGY

Caching should be applied selectively.

Examples:

Reference Data

Venue Categories

Skill Registry

Plugin Registry

Configuration

Frequently accessed user preferences

Cache invalidation rules must be clearly defined.

---

# 59. DATA ARCHITECTURE CHECKLIST

Before introducing a new collection verify:

✓ Business ownership identified

✓ Collection name follows standards

✓ Security rules defined

✓ Required indexes created

✓ Repository implemented

✓ API documented

✓ Audit requirements identified

✓ Backup requirements considered

✓ Performance reviewed

✓ Documentation updated

---

# 60. DATA ARCHITECTURE CONSTITUTION

Every AI assistant working on HiLo SHALL follow these rules.

NEVER create undocumented collections.

NEVER duplicate data without justification.

NEVER bypass repository abstractions.

NEVER expose Firestore directly to UI components.

NEVER hardcode document paths.

NEVER ignore indexing requirements.

NEVER perform unbounded collection reads.

NEVER violate data ownership boundaries.

ALWAYS document schema changes.

ALWAYS update security rules.

ALWAYS consider migration impact.

ALWAYS think about scalability before implementing data models.

---

# END OF PART 3

The following sections will continue with:

• Authentication Architecture
• Authorization (RBAC/ABAC)
• Security Rules
• API Security
• Secrets Management
• AI Security
• Privacy
• Compliance
• AI Platform Architecture

---

# 61. SECURITY PHILOSOPHY

Security is a foundational architectural concern.

It is not a feature.

It is not optional.

Every component of the HiLo platform shall be designed assuming:

- Public internet exposure
- Zero Trust networking
- Least privilege access
- Defense in depth
- Secure defaults
- Continuous verification

Every implementation must preserve Confidentiality, Integrity, and Availability (CIA).

---

# 62. IDENTITY ARCHITECTURE

HiLo uses Firebase Authentication as the authoritative Identity Provider (IdP) for the MVP.

Supported authentication methods:

- Email and Password
- Google Sign-In
- Apple Sign-In
- Anonymous Authentication (optional)
- Phone Authentication (future)
- Enterprise SSO (future)

Authentication identifies users.

Authorization determines what users may do.

These responsibilities must never be mixed.

---

# 63. USER IDENTITY MODEL

Each authenticated user has:

```
Firebase UID

↓

User Profile

↓

Roles

↓

Permissions

↓

Preferences

↓

AI Memory

↓

Audit History
```

The Firebase UID is immutable and serves as the global identity key.

---

# 64. AUTHENTICATION FLOW

```
Flutter App

↓

Firebase Authentication

↓

Identity Token

↓

Backend API

↓

Token Verification

↓

Authorization

↓

Business Logic

↓

Firestore
```

Backend services must never trust client-supplied identity without verifying the Firebase ID token.

---

# 65. SESSION MANAGEMENT

Authentication sessions shall:

- Use Firebase-managed tokens
- Support secure refresh
- Expire automatically
- Be revocable
- Require re-authentication for sensitive operations

Sensitive operations include:

- Password changes
- Payment actions
- Role changes
- Account deletion

---

# 66. ROLE-BASED ACCESS CONTROL (RBAC)

Every authenticated user has one or more roles.

Initial platform roles:

```
Guest

Registered User

Event Organizer

Vendor

Vendor Administrator

Marketplace Moderator

Customer Support

System Administrator

Enterprise Administrator

AI Administrator
```

Roles determine permissions.

Never hardcode authorization logic in UI components.

---

# 67. PERMISSION MODEL

Permissions are fine-grained.

Examples:

```
event.create

event.read

event.update

event.delete

vendor.publish

vendor.manage

plugin.install

plugin.publish

skill.execute

skill.publish

admin.users

admin.audit
```

Authorization decisions must be permission-based rather than role-name-based wherever practical.

---

# 68. ATTRIBUTE-BASED ACCESS CONTROL (ABAC)

Some operations require contextual authorization.

Examples:

A user may edit only events they own.

A vendor may update only their own services.

An administrator may access all records.

An enterprise administrator may access only their tenant (future).

Authorization should evaluate:

Identity

Role

Ownership

Context

Business rules

---

# 69. FIRESTORE SECURITY RULES

Every collection shall have explicit security rules.

Security rules shall enforce:

Authentication

Authorization

Ownership

Data validation

Write restrictions

Read restrictions

Rules must never rely solely on client logic.

---

# 70. API AUTHORIZATION

Every protected API shall:

Verify Firebase ID token.

Validate permissions.

Validate ownership.

Validate request payload.

Log authorization decisions.

Reject unauthorized requests with appropriate HTTP status codes.

---

# 71. SECRET MANAGEMENT

Secrets shall never exist in source code.

Use:

Google Secret Manager

GitHub Secrets

Cloud Run environment variables

Examples of secrets:

API Keys

JWT signing keys

Service account credentials

Database credentials

Webhook secrets

Encryption keys

Never commit secrets to Git.

---

# 72. ENCRYPTION

Sensitive data shall be encrypted:

In transit using TLS.

At rest using Google-managed encryption or customer-managed keys where appropriate.

Sensitive application data may additionally require field-level encryption.

Never implement custom cryptography unless absolutely necessary.

---

# 73. PERSONAL DATA

Personally Identifiable Information (PII) includes:

Names

Email addresses

Phone numbers

Postal addresses

Profile photos

Payment references

Device identifiers

Location history

PII shall be collected only when necessary.

Data minimization is a core design principle.

---

# 74. PRIVACY PRINCIPLES

The platform shall support:

User consent

Data portability

Account deletion

Data correction

Transparent privacy notices

Privacy by design

Privacy by default

Users should always understand how their data is used.

---

# 75. AUDIT REQUIREMENTS

The following actions must be audited:

Authentication

Role changes

Permission changes

Profile updates

Event deletion

Vendor approval

Plugin publication

Prompt modification

Skill publication

Administrative actions

Audit records are immutable.

---

# 76. INPUT VALIDATION

Never trust user input.

Validate:

Required fields

Maximum length

Minimum length

Allowed characters

Business rules

File types

File sizes

Numeric ranges

Reject invalid input immediately.

---

# 77. OUTPUT ENCODING

Protect against:

Cross-Site Scripting (XSS)

Injection attacks

HTML injection

Markdown injection

Prompt injection

Always encode output for its destination.

---

# 78. FILE UPLOAD SECURITY

Uploaded files shall be validated for:

Content type

File extension

Maximum size

Virus scanning (future)

Storage location

Ownership

Never execute uploaded files.

---

# 79. API RATE LIMITING

Public APIs shall support rate limiting.

Protect against:

Brute force attacks

Credential stuffing

Denial of Service

Excessive AI usage

Abusive automation

Rate limits should be configurable.

---

# 80. AI SECURITY

AI introduces unique security risks.

Protect against:

Prompt injection

Tool injection

Data leakage

Hallucinated permissions

Unauthorized tool execution

Cross-user context leakage

Every AI response shall be treated as untrusted until validated.

---

# 81. PROMPT SECURITY

Prompts are controlled assets.

Rules:

Store prompts in the Prompt Registry.

Version prompts.

Review prompt changes.

Audit prompt execution.

Never embed secrets inside prompts.

Never expose system prompts to end users.

---

# 82. TOOL EXECUTION SECURITY

AI Skills and MCP tools shall execute under least privilege.

Each tool must define:

Allowed operations

Required permissions

Input schema

Output schema

Timeout

Retry policy

Failure handling

No tool may execute arbitrary commands without explicit approval.

---

# 83. AI MEMORY SECURITY

AI Memory shall:

Respect user boundaries.

Support data deletion.

Avoid cross-user contamination.

Encrypt sensitive memories where required.

Separate long-term and session memory.

Memory access is subject to authorization.

---

# 84. LOGGING SECURITY

Logs shall never contain:

Passwords

Authentication tokens

Secrets

Credit card data

Private encryption keys

Sensitive AI prompts

Logs should contain correlation identifiers rather than confidential data.

---

# 85. COMPLIANCE

The platform shall be designed to support applicable regulations, including where relevant:

GDPR

CCPA

SOC 2

ISO/IEC 27001

OWASP ASVS

OWASP Top 10

Compliance requirements shall influence architecture and implementation decisions.

---

# 86. SECURITY TESTING

Every release shall include:

Static analysis

Dependency scanning

Secret scanning

Authentication testing

Authorization testing

API security testing

Penetration testing (where applicable)

Security findings shall be tracked and remediated.

---

# 87. INCIDENT RESPONSE

Security incidents shall support:

Detection

Containment

Eradication

Recovery

Post-incident review

Lessons learned

Critical incidents require documented root-cause analysis.

---

# 88. SECURITY CHECKLIST

Before implementing any feature verify:

✓ Authentication required?

✓ Authorization defined?

✓ Ownership validated?

✓ Inputs validated?

✓ Outputs encoded?

✓ Secrets protected?

✓ Logs sanitized?

✓ Audit events generated?

✓ Security rules updated?

✓ Tests completed?

---

# 89. SECURITY CONSTITUTION

Every AI assistant SHALL follow these mandatory rules.

NEVER expose secrets.

NEVER bypass authentication.

NEVER bypass authorization.

NEVER trust client input.

NEVER trust AI output without validation.

NEVER hardcode credentials.

NEVER weaken Firestore Security Rules.

NEVER log confidential information.

NEVER disable security checks for convenience.

ALWAYS validate identity.

ALWAYS enforce permissions.

ALWAYS protect personal information.

ALWAYS implement least privilege.

ALWAYS update audit logging.

ALWAYS consider privacy implications.

---

# 90. TRANSITION TO AI PLATFORM

With security established, the following sections define the AI-native architecture that powers HiLo.

Topics include:

• AI Gateway

• AI Orchestrator

• Planning Engine

• Prompt Registry

• Skill Registry

• MCP Runtime

• Workflow Engine

• Memory Manager

• Knowledge Graph

• Human-in-the-Loop Architecture

These components form the intelligent core of the Event Operating System.

---

# END OF PART 4

---

# 91. AI PLATFORM PHILOSOPHY

Artificial Intelligence is not a feature.

Artificial Intelligence is the operating system of the HiLo platform.

Every AI capability must be reusable, observable, governable, testable, secure and replaceable.

The platform shall never tightly couple itself to a single LLM provider.

LLMs are interchangeable execution engines.

HiLo owns:

• Business Logic

• Planning

• Skills

• Prompts

• Memory

• Context

• Workflows

• Governance

LLMs provide reasoning.

HiLo provides intelligence.

---

# 92. AI PLATFORM ARCHITECTURE

The AI Platform consists of the following major components.

```
Application

↓

AI Gateway

↓

Planning Engine

↓

AI Orchestrator

↓

Context Builder

↓

Prompt Registry

↓

Memory Manager

↓

Knowledge Graph

↓

Skill Registry

↓

Workflow Engine

↓

MCP Runtime

↓

External Tools

↓

LLM

↓

Response Validator

↓

Application
```

Every AI request follows this pipeline.

No component may be skipped.

---

# 93. AI GATEWAY

The AI Gateway is the only entry point into the AI Platform.

Responsibilities include:

Authentication

Authorization

Request validation

Context initialization

Conversation tracking

Cost tracking

Model routing

Observability

Rate limiting

Prompt selection

Response validation

No application shall call an LLM directly.

---

# 94. PLANNING ENGINE

The Planning Engine determines:

What the user wants.

Whether AI is required.

Whether tools are required.

Whether Skills are required.

Whether multiple agents are required.

Whether human approval is required.

The Planning Engine produces an execution plan.

It never performs business operations itself.

---

# 95. EXECUTION PLAN

Every AI request becomes an execution plan.

Example

```
Understand Request

↓

Determine Intent

↓

Load User Context

↓

Load Event Context

↓

Search Knowledge Graph

↓

Select Skills

↓

Execute Tools

↓

Generate Draft Response

↓

Validate Output

↓

Return Result
```

Planning always precedes execution.

---

# 96. AI ORCHESTRATOR

The AI Orchestrator coordinates execution.

Responsibilities:

Agent coordination

Skill execution

Workflow execution

Context assembly

Retry handling

Timeout management

Approval workflows

Error recovery

Monitoring

Cost optimization

The Orchestrator never contains business logic.

Business logic belongs inside Skills.

---

# 97. CONTEXT BUILDER

High-quality AI depends upon high-quality context.

The Context Builder assembles:

Current user

Current event

User preferences

Conversation history

Organization

Venue

Budget

Guests

Marketplace

Plugin data

Relevant Skills

Relevant Prompts

Memory

Knowledge Graph

Only relevant context should be included.

Avoid context bloat.

---

# 98. PROMPT REGISTRY

Prompts are managed assets.

Every prompt shall have:

Unique ID

Version

Owner

Description

Variables

Supported Models

Safety Classification

Status

Examples

Evaluation Score

Prompts are stored centrally.

Never hardcode prompts.

---

# 99. PROMPT VERSIONING

Prompt lifecycle:

Draft

↓

Review

↓

Approved

↓

Production

↓

Deprecated

↓

Archived

Prompt changes require review.

Prompt execution shall be auditable.

---

# 100. SKILL REGISTRY

Skills encapsulate reusable business capabilities.

Examples:

Create Event

Find Venue

Generate Budget

Recommend Vendors

Schedule Tasks

Generate Invitations

Optimize Timeline

Summarize Event

Every Skill has:

Skill ID

Version

Owner

Description

Input Schema

Output Schema

Permissions

Dependencies

Tests

Documentation

---

# 101. SKILL EXECUTION

Skills execute deterministic business operations.

Skills:

May call APIs.

May query Firestore.

May invoke MCP tools.

May call external services.

Skills never access Flutter UI.

Skills never manipulate widgets.

Skills remain platform independent.

---

# 102. MCP RUNTIME

The Model Context Protocol Runtime provides standardized tool execution.

Examples:

Google Maps

Calendar

Email

Weather

Search

Payments

CRM

Future enterprise integrations

All tool execution passes through MCP.

Never call external tools directly from prompts.

---

# 103. WORKFLOW ENGINE

Complex tasks become workflows.

Example

```
Create Event

↓

Generate Budget

↓

Recommend Venues

↓

Find Vendors

↓

Create Guest List

↓

Generate Invitations

↓

Schedule Notifications
```

Each workflow consists of independent executable steps.

---

# 104. MEMORY MANAGER

Memory enables personalization.

Memory types include:

Session Memory

Conversation Memory

User Memory

Preference Memory

Project Memory

Organization Memory

Long-Term Memory

Archived Memory

Memory shall be searchable.

Memory shall respect privacy.

---

# 105. KNOWLEDGE GRAPH

The Knowledge Graph represents relationships.

Examples

User

↓

Event

↓

Venue

↓

Vendor

↓

Budget

↓

Guest

↓

Tasks

↓

Skills

↓

Plugins

↓

Organization

Graph traversal enables richer reasoning.

---

# 106. MODEL ABSTRACTION

HiLo owns model abstraction.

Supported providers may include:

OpenAI

Google

Anthropic

Azure OpenAI

Local models (future)

Changing providers must not require application code changes.

---

# 107. RESPONSE VALIDATION

AI responses are validated before returning to the application.

Validation includes:

Schema validation

Permission validation

Business rule validation

Safety validation

Tool output verification

Confidence evaluation

Unsafe responses shall be rejected.

---

# 108. HUMAN-IN-THE-LOOP

Some operations require approval.

Examples:

Payments

Vendor contracts

Large purchases

Account deletion

Marketplace publication

AI proposes.

Humans approve.

---

# 109. AI OBSERVABILITY

Every AI execution shall record:

Execution ID

Model

Prompt Version

Skill Versions

Latency

Input Tokens

Output Tokens

Cost

Success

Failure

Retries

User Feedback

Observability is mandatory.

---

# 110. AI COST OPTIMIZATION

The platform should minimize unnecessary AI usage.

Strategies include:

Prompt caching

Context compression

Skill reuse

Response caching

Model routing

Smaller models where appropriate

Avoid repeated execution.

---

# 111. AI SAFETY

The platform shall detect:

Prompt Injection

Tool Injection

Hallucinations

Unsafe outputs

Unauthorized execution

Sensitive information leakage

Validation occurs before responses reach users.

---

# 112. AI IMPLEMENTATION RULES

Every AI feature SHALL:

Use the AI Gateway.

Use the Planning Engine.

Use the AI Orchestrator.

Use the Prompt Registry.

Use the Skill Registry.

Use MCP for external tools.

Use the Memory Manager.

Generate audit logs.

Emit metrics.

Support retries.

Support timeout handling.

---

# 113. AI ARCHITECTURE CONSTITUTION

Every AI assistant contributing to HiLo SHALL obey these rules.

NEVER call an LLM directly from application code.

NEVER hardcode prompts.

NEVER bypass the AI Gateway.

NEVER bypass the Orchestrator.

NEVER implement business logic inside prompts.

NEVER duplicate Skills.

NEVER duplicate Prompts.

NEVER bypass Memory.

NEVER execute external tools outside MCP.

ALWAYS create reusable Skills.

ALWAYS version prompts.

ALWAYS document Skills.

ALWAYS validate responses.

ALWAYS measure cost.

ALWAYS emit telemetry.

ALWAYS preserve provider independence.

---

# 114. TRANSITION TO PLATFORM SERVICES

The next section defines the remaining platform capabilities that support the Event Operating System:

• Plugin Marketplace

• Vendor Marketplace

• Notifications

• Payments

• Google Maps Integration

• Analytics

• Shared Services

These services extend the AI Platform and enable the complete Event Operating System.

---

# END OF PART 5
---

# 115. PLATFORM SERVICES PHILOSOPHY

Platform Services provide reusable capabilities shared across the entire Event Operating System.

Business domains SHALL consume Platform Services rather than implementing duplicate functionality.

Platform Services must be:

- Stateless
- Reusable
- Independently deployable
- Observable
- Secure
- Versioned
- Well documented

Business domains should remain unaware of implementation details.

---

# 116. PLATFORM SERVICE CATALOG

The HiLo platform includes the following shared services:

Authentication Service

User Service

Notification Service

Media Service

File Service

Location Service

Search Service

Analytics Service

Audit Service

Configuration Service

Feature Flag Service

Payment Service

Marketplace Service

Plugin Service

Workflow Service

AI Gateway

Memory Service

Knowledge Graph Service

Every service has a clearly defined responsibility.

---

# 117. GOOGLE MAPS PLATFORM

Google Maps is the authoritative mapping provider for MVP.

Supported capabilities:

Venue Search

Nearby Search

Geocoding

Reverse Geocoding

Directions

Distance Matrix

Place Details

Place Photos

Autocomplete

Map Rendering

Future providers shall be abstracted behind a Location Service interface.

Business code must never depend directly on Google Maps SDK.

---

# 118. VENUE DISCOVERY

Venue discovery combines:

Google Places

Marketplace Database

AI Recommendations

User Preferences

Event Context

Budget Constraints

Guest Count

Accessibility Requirements

The recommendation engine should merge structured search with AI ranking.

---

# 119. VENDOR MARKETPLACE

The Vendor Marketplace is a first-class business domain.

Vendor categories include:

Photography

Videography

Catering

Decoration

Music

Entertainment

Transportation

Accommodation

Event Planning

Beauty

Printing

Rental Equipment

Every vendor profile includes:

Business Information

Portfolio

Pricing

Availability

Reviews

Ratings

Location

Verification Status

Service Categories

---

# 120. AI RECOMMENDATION ENGINE

Recommendations shall combine:

Explicit user preferences

Historical behavior

Knowledge Graph

Marketplace reputation

Budget

Location

Availability

AI reasoning

Recommendations should always explain why they were generated.

---

# 121. PLUGIN MARKETPLACE

Plugins extend platform functionality without modifying the core system.

Plugin examples:

Payment Gateway

CRM Integration

ERP Integration

Calendar Integration

Email Provider

SMS Provider

Marketing Automation

AI Agent

Reporting

Analytics

Future Enterprise Connectors

Plugins remain isolated from core business logic.

---

# 122. PLUGIN LIFECYCLE

Plugin lifecycle:

```
Develop

↓

Package

↓

Validate

↓

Security Review

↓

Publish

↓

Install

↓

Configure

↓

Execute

↓

Update

↓

Deprecate
```

Every stage is auditable.

---

# 123. PLUGIN SDK

Every plugin shall implement a standard SDK.

Minimum requirements:

Plugin Manifest

Metadata

Permissions

Configuration Schema

Health Check

Version

Dependencies

Supported APIs

Documentation

Test Suite

Plugins communicate only through approved extension points.

---

# 124. EVENT BUS

Platform events enable loose coupling.

Examples:

UserRegistered

EventCreated

VenueBooked

VendorConfirmed

BudgetUpdated

PaymentCompleted

PluginInstalled

SkillPublished

WorkflowCompleted

Events must be immutable.

Consumers should remain independent.

---

# 125. NOTIFICATION PLATFORM

Notifications support multiple channels.

Push Notification

Email

SMS

WhatsApp (future)

In-App Messaging

Webhook

Notification routing is centralized.

Business domains never communicate directly with providers.

---

# 126. PAYMENT PLATFORM

Payments are abstracted behind a Payment Service.

Supported concepts:

Payment Intent

Invoice

Refund

Deposit

Installment

Receipt

Transaction History

Future providers:

Stripe

PayPal

Enterprise Payment Providers

Business domains must remain provider-independent.

---

# 127. FILE & MEDIA PLATFORM

Media assets are managed centrally.

Supported media:

Images

Videos

PDF

Contracts

Invoices

Attachments

Profile Photos

Event Banners

Media metadata belongs in Firestore.

Binary files belong in Cloud Storage.

---

# 128. SEARCH PLATFORM

Search capabilities include:

Keyword Search

Category Search

Location Search

Semantic Search

AI Search

Knowledge Graph Search

Future Vector Search

Every search implementation should expose a consistent interface.

---

# 129. CONFIGURATION SERVICE

System configuration is centralized.

Examples:

Supported Countries

Currencies

Tax Rates

Event Categories

Marketplace Categories

AI Model Configuration

Prompt Configuration

Feature Flags

Configuration must never be hardcoded.

---

# 130. FEATURE FLAGS

Feature Flags enable controlled rollout.

Supported strategies:

Global

Environment

User

Role

Organization

Percentage Rollout

Flags should support immediate rollback.

---

# 131. ANALYTICS PLATFORM

Operational analytics include:

User Activity

Marketplace Performance

Booking Funnel

Revenue

AI Usage

Token Consumption

Plugin Adoption

Workflow Success

Business analytics belong in BigQuery.

Operational analytics belong in Cloud Monitoring.

---

# 132. OBSERVABILITY PLATFORM

Every platform service shall emit:

Structured Logs

Metrics

Distributed Traces

Business Events

Health Status

Alerts

Dashboards

Observability is a mandatory production requirement.

---

# 133. ENTERPRISE INTEGRATIONS

Future enterprise integrations include:

CRM

ERP

Accounting

Identity Providers

HR Systems

Marketing Platforms

Business Intelligence

Document Management

Integrations must use adapter interfaces.

Core domains remain isolated.

---

# 134. EXTERNAL API DESIGN

External integrations shall support:

Authentication

Retry Policy

Circuit Breaker

Rate Limiting

Timeout

Monitoring

Versioning

Error Translation

Never expose third-party APIs directly to application layers.

---

# 135. PLATFORM SERVICE GOVERNANCE

Every new platform service requires:

Architecture Review

API Specification

Security Review

Performance Review

Documentation

Monitoring

Test Coverage

Deployment Pipeline

Operational Runbook

No platform service enters production without governance approval.

---

# 136. PLATFORM IMPLEMENTATION CONSTITUTION

Every AI assistant SHALL follow these rules.

NEVER duplicate platform capabilities inside business domains.

NEVER access third-party APIs directly from Flutter.

NEVER hardcode external provider implementations.

NEVER tightly couple business logic to plugins.

NEVER bypass shared services.

ALWAYS implement provider abstraction.

ALWAYS centralize notifications.

ALWAYS centralize payments.

ALWAYS centralize search.

ALWAYS centralize configuration.

ALWAYS design for extensibility.

---

# 137. TRANSITION TO ENGINEERING STANDARDS

The remaining sections define how software is implemented.

Topics include:

• Coding Standards

• Naming Conventions

• Repository Standards

• Testing Strategy

• Git Workflow

• CI/CD

• Documentation

• Definition of Done

• AI Developer Constitution

These sections establish the engineering discipline required for long-term maintainability.

---

# END OF PART 6

