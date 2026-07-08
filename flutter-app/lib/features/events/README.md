# features/events/

**Sprint 1C (Flutter slice)** — EOS-002-P3-Part-04 (Event Management). Implemented & verified
(`flutter analyze` clean, widget test passing).

Dashboard → create-event wizard (type → details → budget → guests → location) → event
workspace shell. The dashboard is the authenticated home (`/`).

## Structure (EOS-003-P2 §6)

```
events/
├── domain/            # framework-free
│   ├── event.dart · event_status.dart (12-state lifecycle) · event_budget.dart
│   ├── event_category.dart · create_event_input.dart
│   ├── events_repository.dart · events_failure.dart
├── data/
│   ├── models/        # event_dto.dart, event_budget_dto.dart (JSON ↔ domain)
│   ├── datasources/events_api_datasource.dart   # Dio → event-service
│   └── repositories/events_repository_impl.dart
├── application/
│   ├── events_providers.dart        # DI (reuses core authenticated Dio + Firebase token)
│   └── events_list_controller.dart  # AsyncNotifier dashboard state + refresh
└── presentation/
    ├── pages/    # events_dashboard, create_event_wizard, event_workspace
    └── widgets/  # event_card
```

## How it works

- Talks to **event-service** (`/api/v1/events…`) via a shared authenticated Dio
  ([`core/network/authenticated_dio.dart`](../../core/network/authenticated_dio.dart)) that
  injects the Firebase ID token; the UI never touches Firestore directly (EOS-000 §30).
- **Dashboard**: `eventsListControllerProvider` loads the caller's events; pull-to-refresh,
  empty state, and error state. FAB → create wizard; tap a card → workspace.
- **Create wizard**: a 5-step `Stepper` collecting the Part-04 §4 flow, submitted in one
  `POST /events`; on success the list is invalidated and refreshes.
- **Routes** (`core/router`): `/` dashboard · `/events/create` · `/events/:id` — all behind
  the auth guard.

## Not yet

Venue selection (Sprint 2), lifecycle transitions UI, budget editing, and workspace
collaboration tools (chat/tasks/guests) are stubs/future sprints.
