---
title: EOS-002-P3 Part 04 - Event Management
document_id: EOS-002-P3-P04
book: Book 01 – Business & Product
version: 1.0.0
status: Approved
classification: Functional Specification
project: EOS (Event Operating System)
product: HiLo
owner: Product Engineering
created: 2026-07-04
last_updated: 2026-07-04
---

# EOS-002-P3
# Part 04
# Event Management

> Event Management is the heart of the HiLo platform. It orchestrates event planning, venue discovery, vendor coordination, collaboration, budgeting, payments, media management, AI assistance, and post-event memories.

---

# 1. Purpose

The Event Management module provides an end-to-end workflow for creating, planning, executing, and archiving events.

It integrates all platform capabilities into a unified workspace.

---

# 2. Objectives

The module shall enable users to:

- Create events in less than 5 minutes.
- Receive AI-assisted planning.
- Discover nearby venues.
- Book vendors.
- Collaborate with guests.
- Track budgets.
- Collect payments.
- Order food.
- Share media.
- Archive completed events.

---

# 3. Supported Event Types

## Personal

- Birthday
- Anniversary
- Baby Shower
- Housewarming
- Engagement
- Wedding
- Reception
- Naming Ceremony

## Social

- Reunion
- Festival Celebration
- Community Gathering
- Cultural Event

## Corporate

- Conference
- Seminar
- Workshop
- Product Launch
- Team Outing
- Annual Day

## Educational

- College Fest
- Alumni Meet
- Convocation

The list shall remain configurable via Firestore.

---

# 4. Event Creation Workflow

```
Dashboard

↓

Create Event

↓

Select Event Type

↓

Enter Details

↓

Choose Budget

↓

Estimate Guest Count

↓

Select Location

↓

AI Planning

↓

Venue Suggestions

↓

Vendor Suggestions

↓

Theme Suggestions

↓

Create Workspace
```

---

# 5. Event Information

Required fields

- Event Name
- Event Type
- Date
- Start Time
- End Time
- City
- Budget
- Expected Guests

Optional

- Description
- Dress Code
- Theme
- Parking Notes
- Special Instructions
- Accessibility Notes

---

# 6. AI Event Planner

The AI Planner shall automatically generate:

- Planning checklist
- Budget allocation
- Vendor recommendations
- Venue recommendations
- Timeline
- Reminder schedule
- Food estimate
- Decoration estimate
- Suggested invitations
- Risk alerts

Users may modify all AI suggestions.

---

# 7. Event Lifecycle

```
Draft

↓

Planning

↓

Venue Reserved

↓

Vendor Confirmed

↓

Invitations Sent

↓

RSVP Collection

↓

Payments

↓

Ready

↓

Live Event

↓

Completed

↓

Archived
```

Every event progresses through these states.

---

# 8. Event Dashboard

Each event has its own workspace displaying:

- Event Overview
- Countdown
- Budget Summary
- Guest Count
- Venue Status
- Vendor Status
- Payment Status
- RSVP Status
- AI Readiness Score
- Recent Activity

---

# 9. Event Workspace

The workspace shall include:

- Shared Chat
- Shared Gallery
- Task Board
- Polls & Voting
- Guest List
- Budget Tracker
- Timeline
- Vendor Contacts
- Venue Details
- Documents

---

# 10. Budget Management

Users define:

- Total Budget
- Contingency Budget (optional)

AI recommends allocations:

| Category | Suggested % |
|----------|-------------|
| Venue | 40% |
| Food | 30% |
| Decoration | 10% |
| Photography | 8% |
| Entertainment | 5% |
| Invitations | 2% |
| Miscellaneous | 5% |

Budgets are editable.

---

# 11. Venue Integration

Venue recommendations use:

- Google Maps Platform
- Distance
- Ratings
- Capacity
- Budget compatibility
- Availability (where supported)

Each venue displays:

- Photos
- Reviews
- Directions
- Contact information
- Estimated pricing

---

# 12. Vendor Integration

Supported categories:

- Caterers
- Decorators
- Photographers
- Videographers
- DJs
- Event Planners
- Makeup Artists
- Transportation
- Entertainment

AI ranks vendors using:

- Distance
- Budget fit
- Marketplace Trust Score
- Ratings
- Reviews

---

# 13. Canva Theme Integration

Users can generate:

- Invitations
- Posters
- Banners
- Welcome Boards
- Social Media Graphics
- Thank-you Cards

Templates are selected based on:

- Event type
- Theme
- Colour palette
- Audience

---

# 14. Guest Management

The event host may:

- Add guests manually
- Import contacts
- Share invitation link
- Send WhatsApp invitations
- Track RSVP status

Guest statuses:

- Invited
- Accepted
- Declined
- Tentative
- Checked-in

---

# 15. Group Collaboration

Each event automatically creates:

- Group workspace
- Shared chat
- Shared gallery
- Polls
- Voting
- Shared task list
- Expense tracker

All invited members collaborate within the HiLo application.

---

# 16. WhatsApp Integration

Supported actions:

- Invitation messages
- Reminder messages
- Venue location sharing
- RSVP reminders
- Payment reminders

Messages are generated from templates and require user confirmation before sending.

---

# 17. Food & Commerce

Swiggy integration enables:

- Catering orders
- Grocery orders
- Last-minute essentials
- Beverage ordering

Future enhancements may include:

- Live delivery tracking
- AI meal recommendations

---

# 18. Payment Collection

Supported gateways:

- Razorpay
- Cashfree

Supported payment methods:

- UPI
- Credit Card
- Debit Card
- Net Banking

Track:

- Total Budget
- Contributions Received
- Outstanding Balance

---

# 19. Discount Engine

Group discounts:

| Participants | Discount |
|--------------|----------|
| 5 | 5% |
| 10 | 10% |
| 15 | 15% |
| 20 | 20% |

AI recommends inviting additional participants where applicable to unlock discounts.

---

# 20. Media Management

Users may:

- Upload photos
- Upload videos
- Organize albums
- Tag guests
- Download memories
- Share highlights

AI generates:

- Event highlights
- Best moments
- Album cover suggestions
- Memory timeline

---

# 21. Notifications

Event reminders include:

- Upcoming milestones
- Pending RSVPs
- Budget alerts
- Vendor confirmations
- Payment reminders
- Delivery updates
- Event countdown

Channels:

- Push
- Email
- WhatsApp

---

# 22. Firestore Collections

```
events/

event_members/

event_tasks/

event_chat/

event_gallery/

event_payments/

event_budgets/

event_polls/

event_timeline/

event_documents/

event_notifications/

event_ai_sessions/
```

---

# 23. API Endpoints

| Endpoint | Method | Purpose |
|-----------|--------|---------|
| /events | POST | Create event |
| /events/{id} | GET | Retrieve event |
| /events/{id} | PUT | Update event |
| /events/{id}/members | POST | Add participant |
| /events/{id}/budget | PUT | Update budget |
| /events/{id}/gallery | POST | Upload media |
| /events/{id}/timeline | GET | Retrieve timeline |
| /events/{id}/summary | GET | AI-generated summary |

---

# 24. Business Rules

- One owner per event.
- Multiple co-hosts supported.
- Event names are editable until completion.
- Archived events are read-only.
- AI suggestions never overwrite user choices automatically.
- Guest access is limited to invited participants.

---

# 25. Error Handling

| Scenario | Behaviour |
|----------|-----------|
| Venue unavailable | Recommend alternatives |
| Budget exceeded | Suggest reductions |
| Payment failed | Retry with explanation |
| Vendor unavailable | Display similar vendors |
| Network interruption | Queue offline changes for synchronization |

---

# 26. Acceptance Criteria

The module is complete when users can:

- Create an event.
- Invite guests.
- Collaborate in real time.
- Discover venues.
- Select vendors.
- Manage budgets.
- Collect payments.
- Order food.
- Share media.
- Archive completed events.

---

# 27. Dependencies

- Firebase Authentication
- Cloud Firestore
- Firebase Storage
- Firebase Cloud Messaging
- Google Maps Platform
- OpenAI Responses API
- Canva MCP
- WhatsApp Business Platform
- Swiggy Developer APIs
- Razorpay / Cashfree

---

# 28. Related Documents

- EOS-000 Project Charter
- EOS-001-P1 AI Governance & Engineering Philosophy
- EOS-001-P2 Master AI Governance System Prompt
- EOS-002-P1 Living Product Requirements Document
- EOS-002-P2 User Personas & User Journeys
- EOS-002-P3-Part-01 Platform Foundation & Core Architecture
- EOS-002-P3-Part-02 Authentication & Identity
- EOS-002-P3-Part-03 User Profile & Account Management

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
| Solution Architect | Pending |
| Engineering Lead | Pending |

---

> The Event Management module is the core domain of the HiLo platform. It unifies AI planning, venue discovery, vendor coordination, collaboration, commerce, and post-event memories into a single intelligent workspace, enabling users to plan and manage events efficiently from creation to archival.
