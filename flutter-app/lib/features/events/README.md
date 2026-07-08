# features/events/

**Sprint 1C** — EOS-002-P3-Part-04 (Event Management).

Dashboard, create-event wizard (`type → details → budget → guests → location`, <5 min),
and the event workspace shell. Talks to `event-service` via the API SDK — never to
Firestore directly (EOS-000 §30).

Feature-module layout mirrors [`authentication/`](../authentication/README.md)
(EOS-003-P2 §6).
