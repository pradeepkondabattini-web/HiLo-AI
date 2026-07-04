---
title: EOS-003 Part 02 - Flutter Application Architecture
document_id: EOS-003-P2
book: Book 02 – Technical Architecture
version: 1.0.0
status: Approved
classification: Technical Architecture
project: EOS (Event Operating System)
product: HiLo
owner: Mobile Engineering
created: 2026-07-04
last_updated: 2026-07-04
---

# EOS-003
# Part 02
# Flutter Application Architecture

> This document defines the architecture, coding standards, module organization, state management, navigation, dependency injection, offline-first strategy, testing approach, and UI engineering practices for the HiLo Flutter application.

---

# 1. Purpose

This document establishes a consistent engineering standard for building and maintaining the HiLo Flutter application across Android, iOS, Web, and future desktop platforms.

The architecture prioritizes maintainability, scalability, performance, and AI-assisted development.

---

# 2. Design Principles

The Flutter application shall follow:

- Feature-First Architecture
- Clean Architecture
- SOLID Principles
- MVVM-inspired Presentation Layer
- Repository Pattern
- Offline-First Design
- Responsive UI
- Accessibility by Default
- Test-Driven Development (where practical)
- AI-Assisted Engineering

---

# 3. Target Platforms

- Android
- iOS
- Web
- Windows (Future)
- macOS (Future)

---

# 4. Technology Stack

| Layer | Technology |
|--------|------------|
| UI | Flutter Material 3 |
| Language | Dart 3 |
| State Management | Riverpod |
| Routing | GoRouter |
| Dependency Injection | Riverpod Providers |
| Local Storage | Hive / Isar (evaluation) |
| Secure Storage | flutter_secure_storage |
| Networking | Dio |
| Serialization | json_serializable |
| Logging | logger |
| Crash Reporting | Firebase Crashlytics |
| Analytics | Firebase Analytics |
| Notifications | Firebase Cloud Messaging |

---

# 5. Folder Structure

```
lib/

app/
core/
shared/

features/

authentication/
events/
venues/
vendors/
payments/
budget/
media/
chat/
notifications/
ai/
marketplace/
settings/

main.dart
```

---

# 6. Feature Module Structure

Each feature follows the same layout:

```
feature_name/

presentation/
  pages/
  widgets/
  controllers/

domain/
  entities/
  repositories/
  usecases/

data/
  models/
  datasources/
  repositories/

application/

services/

tests/
```

---

# 7. Layer Responsibilities

### Presentation

- Screens
- Widgets
- State
- Navigation

### Domain

- Business rules
- Entities
- Use Cases
- Repository contracts

### Data

- Firebase
- REST APIs
- Local cache
- DTOs

### Infrastructure

- External SDKs
- MCP integrations
- Platform services

---

# 8. State Management

Riverpod is the standard.

Provider categories:

- Provider
- StateProvider
- FutureProvider
- StreamProvider
- AsyncNotifier
- Notifier

Business logic shall not reside inside Widgets.

---

# 9. Navigation

GoRouter shall manage:

- Deep Links
- Authentication Guards
- Nested Navigation
- Web URLs
- Mobile Navigation

---

# 10. Dependency Injection

Dependencies are registered through Riverpod.

No service locator pattern.

No global singletons except approved platform services.

---

# 11. Offline-First Strategy

The application shall:

- Cache event data
- Cache venues
- Cache vendors
- Queue writes
- Sync automatically
- Resolve conflicts deterministically

---

# 12. Design System

The UI follows Material 3.

Shared design tokens include:

- Colors
- Typography
- Spacing
- Icons
- Elevation
- Border Radius
- Motion

Future support:

- Dynamic Color (Android)
- Dark Mode
- High Contrast

---

# 13. Responsive Layout

Breakpoints:

| Width | Layout |
|-------|--------|
| <600 | Mobile |
| 600–1024 | Tablet |
| >1024 | Desktop/Web |

---

# 14. Accessibility

Support:

- Screen Readers
- Dynamic Text
- Keyboard Navigation
- Semantic Labels
- Color Contrast
- Focus Indicators

Target WCAG 2.1 AA compliance.

---

# 15. Networking

All API requests use Dio.

Responsibilities:

- Authentication headers
- Retry policy
- Logging
- Error mapping
- Token refresh

---

# 16. Firebase Integration

Modules:

- Authentication
- Firestore
- Storage
- Cloud Messaging
- Analytics
- Crashlytics
- Remote Config

---

# 17. AI Integration

The AI layer communicates only through the AI Gateway.

No direct OpenAI calls from Flutter.

Responsibilities:

- Prompt submission
- Streaming responses
- Approval dialogs
- Skill execution status
- Conversation history

---

# 18. Security

The application shall:

- Store secrets securely
- Validate JWT tokens
- Prevent sensitive logging
- Obfuscate release builds
- Detect rooted/jailbroken devices (future)

---

# 19. Performance Targets

- Cold Start < 3 seconds
- Warm Start < 1 second
- Frame Rate: 60 FPS minimum
- API Response Rendering < 300 ms (excluding network)
- Memory usage optimized for mid-range devices

---

# 20. Testing Strategy

### Unit Tests

- Use Cases
- Repositories
- Controllers

### Widget Tests

- Pages
- Widgets
- Navigation

### Integration Tests

- Login
- Event Creation
- Venue Booking
- AI Planner
- Payments

### End-to-End Tests

Critical user journeys.

Target Coverage:

- Business Logic: ≥90%
- UI: ≥70%

---

# 21. Coding Standards

- Follow Effective Dart
- Use lint rules (flutter_lints)
- Prefer immutable models
- Document public APIs
- Avoid business logic in UI
- Keep widgets small and reusable

---

# 22. Build Flavors

- Development
- QA
- Staging
- Production

Each flavor has:

- Firebase project
- API endpoints
- Feature flags
- Analytics configuration

---

# 23. CI/CD Integration

GitHub Actions shall:

- Run formatter
- Run analyzer
- Execute tests
- Build APK/AAB
- Build Web
- Upload artifacts
- Deploy to Firebase App Distribution

---

# 24. Acceptance Criteria

The Flutter architecture is accepted when:

- Every feature follows the defined module structure.
- State management uses Riverpod consistently.
- Navigation uses GoRouter.
- Offline synchronization functions reliably.
- Accessibility requirements are met.
- Performance targets are achieved.
- CI/CD pipelines build all supported targets successfully.

---

# 25. Related Documents

- EOS-003-P1 System Architecture & C4 Model
- EOS-003-P3 Firebase Architecture
- EOS-004 Book 03 – Data Architecture
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
| Mobile Architect | Pending |
| Engineering Lead | Pending |
| Product Owner | Pending |

---

> The Flutter Application Architecture defines the engineering standards for building HiLo as a scalable, maintainable, and AI-assisted cross-platform application. All mobile and web development shall conform to this architecture to ensure consistency, quality, and long-term extensibility.
