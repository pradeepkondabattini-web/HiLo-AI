---
title: EOS-001 Part 06 - Coding Standards and Best Practices
document_id: EOS-001-P6
book: Book 01 – AI Governance & Engineering Philosophy
version: 1.0.0
status: Approved
classification: Enterprise Coding Standard
project: EOS (Event Operating System)
product: HiLo
owner: Engineering Excellence Team
created: 2026-07-04
last_updated: 2026-07-04
---

# EOS-001
# Part 06
# Coding Standards and Best Practices

> This document defines the coding standards, development conventions, software craftsmanship principles, and best practices for the HiLo Event Operating System (EOS). These standards apply to all frontend applications, backend services, AI components, shared libraries, infrastructure code, and automation scripts.

---

# 1. Purpose

The purpose of this document is to establish a consistent engineering approach that produces software which is:

- Readable
- Maintainable
- Testable
- Secure
- Scalable
- Performant
- Observable
- AI-assisted
- Enterprise-ready

These standards reduce technical debt while improving long-term maintainability and developer productivity.

---

# 2. Guiding Principles

Every engineer shall strive to write software that is:

- Simple
- Correct
- Consistent
- Reusable
- Modular
- Self-documenting
- Secure by default
- Easy to test
- Easy to extend
- Easy to review

Code is written for humans first and computers second.

---

# 3. Clean Code Principles

Developers shall:

- Prefer readability over cleverness.
- Keep functions short and focused.
- Use meaningful names.
- Eliminate duplication.
- Minimize side effects.
- Fail fast when errors occur.
- Avoid premature optimization.

Every function should have a single responsibility.

---

# 4. Project Structure

Projects shall follow a feature-first organization.

Example:

```
lib/
├── core/
├── shared/
├── features/
│   ├── authentication/
│   ├── events/
│   ├── venues/
│   ├── vendors/
│   └── ai/
└── app/
```

Backend services should use a similar domain-oriented structure.

---

# 5. Clean Architecture

Every application shall implement the following layers:

```
Presentation

↓

Application

↓

Domain

↓

Infrastructure
```

Rules:

- Domain has no framework dependencies.
- Infrastructure depends on Domain.
- Presentation depends on Application.
- Dependency flow is inward only.

---

# 6. SOLID Principles

Software shall comply with:

- Single Responsibility Principle
- Open/Closed Principle
- Liskov Substitution Principle
- Interface Segregation Principle
- Dependency Inversion Principle

These principles improve extensibility and maintainability.

---

# 7. Naming Conventions

## Classes

```
UserProfile
EventPlanner
VenueRepository
BudgetCalculator
```

---

## Interfaces

```
IRepository
IAIProvider
INotificationService
```

---

## Methods

```
createEvent()

searchVenues()

calculateBudget()

sendInvitation()
```

---

## Variables

```
eventId

vendorRating

guestCount

totalBudget
```

Names must clearly express intent.

---

# 8. File Naming

Use lowercase with underscores or platform conventions.

Examples:

```
event_repository.dart

venue_service.ts

budget_calculator.dart
```

Avoid abbreviations unless universally understood.

---

# 9. Function Design

Functions should:

- Perform one task.
- Be small.
- Have descriptive names.
- Avoid hidden side effects.
- Return predictable results.

Target:

- Prefer fewer than 30 lines where practical.
- Limit parameters to five or fewer.
- Extract complex logic into helper methods or domain services.

---

# 10. Class Design

Classes should:

- Have a single responsibility.
- Expose minimal public APIs.
- Hide implementation details.
- Favor composition over inheritance.
- Be cohesive.

Avoid "God Objects" that manage unrelated concerns.

---

# 11. Error Handling

Use structured exceptions.

Errors shall:

- Include meaningful messages.
- Preserve stack traces.
- Include correlation IDs.
- Avoid exposing sensitive implementation details.

Never silently ignore exceptions.

---

# 12. Logging

Use structured logging.

Each log entry should contain:

- Timestamp
- Service name
- Correlation ID
- Severity
- Request ID
- User ID (when applicable)

Never log:

- Passwords
- API keys
- Access tokens
- Personally identifiable information (PII)
- Secrets

---

# 13. Configuration Management

Configuration shall be externalized.

Use:

- Environment variables
- Secret Manager
- Configuration files

Never hardcode:

- Secrets
- API keys
- Credentials
- URLs that vary by environment

---

# 14. Dependency Management

Dependencies shall be:

- Minimal
- Actively maintained
- License compliant
- Security reviewed

Unused dependencies must be removed promptly.

---

# 15. Code Formatting

Formatting shall be automated.

Use:

- Dart formatter
- ESLint
- Prettier
- TypeScript formatter

Formatting rules shall be enforced in CI.

---

# 16. Documentation

Public APIs shall include documentation.

Complex algorithms require explanatory comments.

Comments should explain:

- Why
- Business intent
- Architectural rationale

Avoid comments that merely restate the code.

---

# 17. Testing Standards

Minimum expectations:

- Unit Tests
- Integration Tests
- API Tests
- Widget/UI Tests (Flutter)
- End-to-End Tests

Critical business logic should achieve high test coverage.

---

# 18. Security Best Practices

Developers shall:

- Validate all inputs.
- Sanitize external data.
- Apply least privilege.
- Protect secrets.
- Encrypt sensitive information.
- Use secure communication protocols.
- Follow OWASP guidance.

Security reviews are mandatory for sensitive features.

---

# 19. Performance Best Practices

Developers should:

- Avoid unnecessary allocations.
- Minimize database queries.
- Batch network requests.
- Cache where appropriate.
- Use asynchronous operations.
- Measure before optimizing.

Performance improvements must be supported by metrics.

---

# 20. Firestore Best Practices

Guidelines include:

- Keep documents small.
- Avoid unbounded collections.
- Design for indexed queries.
- Use batched writes where appropriate.
- Avoid hot document contention.
- Denormalize only when justified.

All production queries must be supported by indexes.

---

# 21. Flutter Best Practices

Applications shall:

- Use Material 3.
- Follow feature-first architecture.
- Minimize widget rebuilds.
- Separate UI from business logic.
- Support responsive layouts.
- Support accessibility.
- Support localization.

---

# 22. Backend Best Practices

Cloud Run services shall:

- Be stateless.
- Support horizontal scaling.
- Use dependency injection.
- Expose health endpoints.
- Emit structured logs.
- Validate inputs.
- Handle retries safely.

---

# 23. AI Coding Standards

AI components shall:

- Use Prompt Registry entries only.
- Execute registered Skills.
- Log prompt versions.
- Validate AI outputs.
- Respect governance policies.
- Record execution metrics.

AI-generated code must undergo the same review process as human-written code.

---

# 24. Code Review Checklist

Before approval verify:

- Architecture is respected.
- Code is readable.
- Tests are included.
- Documentation is updated.
- Logging is implemented.
- Security is considered.
- No duplicated logic exists.
- Naming conventions are followed.

---

# 25. Definition of Done

A task is complete only when:

- Requirements are implemented.
- Tests pass.
- Static analysis passes.
- Documentation is updated.
- Security review is complete.
- Performance requirements are met.
- Pull request is approved.
- CI/CD pipeline succeeds.

---

# 26. Anti-Patterns to Avoid

Avoid:

- God Classes
- Circular dependencies
- Deep inheritance
- Duplicate logic
- Hardcoded configuration
- Excessive nesting
- Long methods
- Long parameter lists
- Silent exception handling
- Tight coupling
- Premature optimization

Technical debt should be identified and resolved continuously.

---

# 27. Related Documents

- EOS-001-P1 AI Governance & Engineering Philosophy
- EOS-001-P2 Engineering Principles and Standards
- EOS-001-P3 AI-First Architecture Principles
- EOS-001-P4 Product Development Lifecycle
- EOS-001-P5 Documentation and Decision Records
- EOS-001-P7 Git Workflow and Version Control
- EOS-001-P8 Architecture Governance

---

# Revision History

| Version | Date | Description |
|----------|------|-------------|
| 1.0.0 | 2026-07-04 | Initial release |

---

# Approval

| Role | Status |
|------|--------|
| Chief Enterprise Architect | Pending |
| Engineering Manager | Pending |
| Technical Lead | Pending |
| QA Lead | Pending |

---

> The Coding Standards and Best Practices defined in this document establish a consistent engineering discipline for the HiLo Event Operating System. By following clean architecture, SOLID principles, secure coding practices, comprehensive testing, structured logging, and AI-aware development standards, engineering teams can deliver software that is maintainable, scalable, resilient, and production-ready while supporting long-term platform evolution and enterprise governance.
