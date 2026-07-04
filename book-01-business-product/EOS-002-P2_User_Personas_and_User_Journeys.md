---
title: EOS-002-P2 User Personas & User Journeys
document_id: EOS-002-P2
book: Book 01 – Business & Product
version: 1.0.0
status: Approved
classification: Product Design
project: EOS (Event Operating System)
product: HiLo
owner: Product & UX Team
created: 2026-07-04
last_updated: 2026-07-04
---

# EOS-002-P2
# User Personas & User Journeys

> This document defines the primary user personas, goals, pain points, workflows, and user journeys for the HiLo platform. It serves as the foundation for UX design, Flutter implementation, backend APIs, and AI workflows.

---

# 1. Purpose

The objectives of this document are to:

- Identify primary user groups.
- Understand user motivations.
- Define complete user journeys.
- Capture user stories.
- Establish acceptance criteria.
- Guide UI/UX design.
- Align engineering with business goals.

---

# 2. User Types

HiLo supports three primary user categories:

| User Type | Description |
|------------|-------------|
| Consumer | Creates and manages personal events |
| Business | Lists venues or services and receives bookings |
| Administrator | Governs the platform and marketplace |

---

# 3. Consumer Persona

## Persona Name

**Priya Sharma**

### Profile

- Age: 30
- Occupation: IT Professional
- Location: Hyderabad
- Tech Comfort: High

### Goals

- Find venues quickly.
- Stay within budget.
- Invite friends easily.
- Coordinate vendors.
- Collect payments.
- Share event memories.

### Pain Points

- Too many apps.
- Manual budgeting.
- No collaboration.
- Vendor uncertainty.
- Difficult RSVP tracking.

### HiLo Benefits

- AI planning.
- Budget optimization.
- Hyperlocal discovery.
- Shared workspace.
- Vendor recommendations.
- Integrated payments.

---

# 4. Business Persona

## Persona Name

**Royal Banquet Manager**

### Profile

- Business Owner
- Venue Capacity: 300 Guests
- Location: Hyderabad

### Goals

- Increase bookings.
- Improve visibility.
- Reduce inquiry response time.
- Manage availability.
- Build trust.

### Pain Points

- Low online visibility.
- Manual lead tracking.
- High marketing costs.
- Fake inquiries.

### HiLo Benefits

- Verified customers.
- AI recommendations.
- Booking dashboard.
- Marketplace Trust Score.
- Analytics.

---

# 5. Administrator Persona

## Persona Name

Platform Operations Manager

### Responsibilities

- Verify businesses.
- Moderate listings.
- Resolve disputes.
- Monitor analytics.
- Review AI quality.
- Manage platform health.

---

# 6. Consumer Journey

## Stage 1 — Registration

### Goal

Create an account securely.

User Actions

- Open app.
- Sign in using Google, Email, or Phone.
- Complete profile.

Acceptance Criteria

- Authentication succeeds.
- Profile created.
- User reaches dashboard.

---

## Stage 2 — Create Event

User provides:

- Event title
- Event type
- Date
- Budget
- Guest count
- Preferred location

AI generates:

- Event checklist
- Budget estimate
- Timeline
- Venue recommendations

Acceptance Criteria

- Event created.
- AI suggestions displayed.
- Event editable.

---

## Stage 3 — Venue Discovery

User selects:

- Budget
- Location
- Capacity
- Theme

Platform displays:

- Google Maps
- Nearby venues
- Ratings
- Photos
- Estimated pricing
- Directions

User selects preferred venue.

---

## Stage 4 — Vendor Selection

User searches:

- Catering
- Decoration
- Photography
- Entertainment
- Event Planner

AI ranks vendors using:

- Budget fit
- Ratings
- Distance
- Marketplace Trust Score
- Availability

---

## Stage 5 — Theme Selection

User opens Canva integration.

Platform suggests:

- Birthday themes
- Wedding themes
- Corporate themes
- Festival themes

Generated assets:

- Invitations
- Posters
- Banners
- Social media graphics

---

## Stage 6 — Guest Collaboration

User creates event workspace.

Features

- Invite participants.
- Generate WhatsApp invitation.
- Track RSVPs.
- Shared chat.
- Shared gallery.
- Task board.
- Budget contributions.

---

## Stage 7 — Payments

Participants contribute using:

- UPI
- Razorpay
- Cashfree

Platform tracks:

- Paid
- Pending
- Overdue

AI reminds pending contributors.

---

## Stage 8 — Event Day

Workspace becomes live.

Users can:

- Share photos.
- Upload videos.
- Chat.
- Track timeline.
- Contact vendors.
- Receive reminders.

---

## Stage 9 — Post Event

AI automatically creates:

- Event summary.
- Budget summary.
- Guest statistics.
- Photo album.
- Highlights.
- Expense report.

---

# 7. Business Journey

## Registration

Business registers.

Uploads:

- Business information
- Address
- Documents
- Pricing
- Availability
- Images

Admin verifies listing.

---

## Marketplace

Business receives:

- Booking requests
- Customer messages
- Notifications

Business manages:

- Calendar
- Availability
- Pricing
- Promotions

---

## Analytics

Dashboard shows:

- Views
- Leads
- Bookings
- Revenue
- Ratings
- Trust Score

---

# 8. Administrator Journey

Admin Dashboard includes:

- User Management
- Vendor Verification
- Venue Approval
- AI Monitoring
- Reports
- Payments
- Disputes
- Platform Health

---

# 9. User Stories

## Consumer

**As a consumer**

I want to create an event within five minutes

So that I can begin planning quickly.

---

**As a consumer**

I want AI to recommend venues

So that I don't need to search manually.

---

**As a consumer**

I want to invite guests through WhatsApp

So everyone joins the collaboration workspace easily.

---

**As a consumer**

I want contributors to pay using UPI

So I don't manually track expenses.

---

## Business

**As a venue owner**

I want to receive verified bookings

So I reduce fake inquiries.

---

**As a caterer**

I want AI to recommend my services

So I receive more qualified leads.

---

## Administrator

**As an administrator**

I want to verify vendors

So customers trust the marketplace.

---

# 10. Acceptance Criteria

A successful user journey enables users to:

- Register without assistance.
- Create events quickly.
- Discover nearby venues.
- Select trusted vendors.
- Invite guests.
- Track RSVPs.
- Collect payments.
- Collaborate in one workspace.
- Preserve event memories.

---

# 11. Success Metrics

| Metric | Target |
|----------|--------|
| Registration Success | >95% |
| Event Creation Time | <5 minutes |
| Venue Recommendation Click Rate | >60% |
| RSVP Response Rate | >70% |
| Payment Completion | >90% |
| User Satisfaction | >4.5/5 |

---

# 12. Related Documents

- EOS-000 Project Charter
- EOS-001-P1 AI Governance
- EOS-001-P2 Master AI Prompt
- EOS-002-P1 Living Product Requirements Document

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
| UX Lead | Pending |
| Engineering Lead | Pending |

---

> This document is the primary reference for designing user experiences across the HiLo platform. All UX flows, Flutter screens, APIs, and AI workflows shall trace back to these personas and user journeys.
