---
title: EOS-002-P3 Part 06 - Vendor Marketplace & AI Recommendation Engine
document_id: EOS-002-P3-P06
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
# Part 06
# Vendor Marketplace & AI Recommendation Engine

> This document defines the vendor marketplace architecture, onboarding process, AI-powered recommendation engine, marketplace governance, vendor intelligence, and booking workflows for the HiLo platform.

---

# 1. Purpose

The Vendor Marketplace enables users to discover, evaluate, compare, book, and collaborate with trusted vendors while providing vendors with tools to manage their services, availability, bookings, and business growth.

Unlike traditional directories, HiLo uses AI and hyperlocal intelligence to recommend the best vendors for each event.

---

# 2. Objectives

The module shall:

- Build a verified hyperlocal vendor marketplace.
- Recommend vendors intelligently.
- Match vendors to event requirements.
- Reduce booking effort.
- Improve vendor discovery.
- Support quotations.
- Enable transparent comparisons.
- Increase booking conversion.
- Learn continuously from completed events.

---

# 3. Supported Vendor Categories

## Food & Catering

- Caterers
- Live Food Counters
- Bakery
- Cake Vendors
- Beverage Suppliers

---

## Decoration

- Decorators
- Floral Designers
- Balloon Artists
- Stage Decorators
- Lighting Specialists

---

## Photography

- Photographers
- Videographers
- Drone Operators
- Live Streaming

---

## Entertainment

- DJs
- Live Bands
- Anchors (MC)
- Magicians
- Dance Performers
- Celebrity Management (Future)

---

## Beauty

- Makeup Artists
- Mehendi Artists
- Stylists

---

## Event Services

- Event Planners
- Coordinators
- Security
- Housekeeping
- Rental Equipment
- Furniture
- Sound Systems
- LED Walls

---

## Transportation

- Bus Operators
- Car Rentals
- Chauffeur Services
- Valet Parking

---

## Gifts

- Return Gifts
- Customized Merchandise
- Printing Services

---

# 4. Vendor Discovery Workflow

```
Create Event

↓

AI Understands Event

↓

Determine Required Vendor Categories

↓

Google Maps Search

↓

HiLo Marketplace Search

↓

Merge Vendor Results

↓

AI Recommendation Engine

↓

Rank Vendors

↓

Compare

↓

Shortlist

↓

Group Voting

↓

Request Quotations

↓

Confirm Booking
```

---

# 5. Vendor Onboarding

Every vendor shall provide:

### Business Information

- Business Name
- Category
- Description
- Contact Person
- Mobile Number
- Email

---

### Location

- Google Maps Location
- Address
- Service Radius

---

### Business Details

- GST Number (optional)
- PAN (optional)
- Years of Experience
- Team Size

---

### Portfolio

- Images
- Videos
- Canva-generated brochures
- Service catalogue

---

### Pricing

- Starting Price
- Package Pricing
- Add-on Services

---

### Availability

- Working Days
- Working Hours
- Holiday Calendar

---

# 6. Vendor Verification

Verification Levels

| Level | Description |
|---------|-------------|
| Level 1 | Email Verified |
| Level 2 | Mobile Verified |
| Level 3 | Business Documents Verified |
| Level 4 | HiLo Verified Partner |

Verification status appears on vendor cards.

---

# 7. Vendor Profile

Each vendor profile displays:

- Business logo
- Cover image
- Description
- Google Rating
- HiLo Trust Score
- Years of experience
- Completed bookings
- Service categories
- Pricing
- Portfolio
- Reviews
- Awards
- Availability
- Contact options

---

# 8. AI Recommendation Engine

Inputs:

- Event type
- Budget
- Guest count
- Venue
- Distance
- User preferences
- Previous bookings
- Vendor availability
- Reviews
- Marketplace Trust Score

Outputs:

- Ranked vendors
- Match score
- Recommendation explanation
- Suggested alternatives

---

# 9. Vendor Intelligence Score

Overall Vendor Score is calculated using configurable weights.

| Factor | Weight |
|----------|-------:|
| Budget Compatibility | 20% |
| Distance | 15% |
| Google Rating | 15% |
| HiLo Trust Score | 15% |
| Availability | 10% |
| Review Sentiment | 10% |
| Response Time | 5% |
| Cancellation Rate | 5% |
| Repeat Booking Rate | 5% |

The scoring engine shall remain configurable.

---

# 10. Hyperlocal Prioritization

Preferred vendor radius:

- 5 km
- 10 km (default)
- 20 km
- User-defined

The AI should prioritize nearby vendors to reduce travel costs and improve service reliability.

---

# 11. Vendor Comparison

Users may compare up to four vendors simultaneously.

Comparison includes:

- Pricing
- Packages
- Ratings
- Reviews
- Experience
- Distance
- Availability
- Response Time
- Trust Score

---

# 12. Smart Quotations

Users may:

- Request quotations.
- Receive multiple proposals.
- Compare proposals.
- Negotiate pricing.
- Accept or reject quotations.

Quote status:

- Requested
- Submitted
- Negotiating
- Accepted
- Expired
- Declined

---

# 13. Marketplace Promotions

Supported promotions:

- Seasonal offers
- Early booking discounts
- Bundle offers
- Venue + Vendor packages
- Festival campaigns
- Group booking discounts

The AI should surface relevant promotions automatically.

---

# 14. Group Collaboration

Participants can:

- View recommended vendors.
- Vote.
- Leave comments.
- Suggest alternatives.
- Share portfolios.

The event host retains final approval.

---

# 15. Swiggy Commerce Integration

Where supported:

- Catering orders
- Grocery replenishment
- Emergency supplies
- Beverage orders

Future capabilities:

- Live delivery tracking
- Inventory estimation
- AI reorder suggestions

---

# 16. WhatsApp Integration

Supported actions:

- Vendor quotation sharing
- Booking confirmation
- Reminder messages
- Vendor contact sharing

All outgoing messages require user confirmation.

---

# 17. Vendor Availability

Availability states:

- Available
- Busy
- Tentative
- Holiday
- Closed

The recommendation engine shall exclude unavailable vendors unless the user explicitly requests them.

---

# 18. Marketplace Trust Score

The proprietary HiLo Trust Score is calculated from:

- Google Rating
- Verified bookings
- Customer satisfaction
- Repeat customers
- Cancellation rate
- Complaint history
- Response time
- Portfolio quality
- Profile completeness
- Verification level

This score is recalculated periodically.

---

# 19. Vendor Analytics

Business users can view:

- Profile views
- Booking requests
- Conversion rate
- Revenue
- Customer ratings
- AI recommendation frequency
- Popular services
- Repeat customer percentage

---

# 20. Firestore Collections

```
vendors/

vendor_profiles/

vendor_categories/

vendor_services/

vendor_portfolios/

vendor_reviews/

vendor_quotes/

vendor_bookings/

vendor_promotions/

vendor_availability/

vendor_analytics/

vendor_trust_scores/

vendor_verification/

vendor_ai_rankings/
```

---

# 21. Cloud Run Services

Dedicated services:

- Vendor Service
- Marketplace Service
- Recommendation Engine
- Quote Service
- Availability Service
- Analytics Service
- Trust Score Service

Each service shall be independently deployable.

---

# 22. API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| /vendors/search | POST | Search vendors |
| /vendors/{id} | GET | Vendor details |
| /vendors/compare | POST | Compare vendors |
| /vendors/{id}/quote | POST | Request quotation |
| /vendors/{id}/availability | GET | Check availability |
| /vendors/recommendations | GET | AI recommendations |
| /vendors/{id}/reviews | GET | Retrieve reviews |
| /vendors/{id}/book | POST | Confirm booking |

---

# 23. MCP Integrations

The Vendor Marketplace integrates with:

| MCP | Purpose |
|------|---------|
| Google Maps Platform | Vendor discovery |
| OpenAI Responses API | Recommendation engine |
| Canva MCP | Promotional assets |
| Swiggy Developer APIs | Catering and supplies |
| WhatsApp Business Platform | Vendor communication |
| Razorpay / Cashfree | Payments |

---

# 24. Business Rules

- Vendors must complete verification before receiving a verified badge.
- AI recommendations shall always provide an explanation.
- Users may override AI recommendations.
- Quotes expire automatically after the configured validity period.
- Vendor availability shall be synchronized before confirming bookings.
- Marketplace Trust Scores shall be recalculated on a scheduled basis.

---

# 25. Error Handling

| Scenario | Behaviour |
|----------|-----------|
| Vendor unavailable | Recommend similar vendors |
| Quote expired | Prompt user to request a new quotation |
| Duplicate booking | Prevent confirmation |
| Google Maps unavailable | Display cached vendor data |
| Swiggy integration unavailable | Hide ordering options gracefully |

---

# 26. Acceptance Criteria

The module is complete when users can:

- Discover vendors.
- View detailed profiles.
- Compare vendors.
- Receive AI recommendations.
- Request quotations.
- Collaborate with event participants.
- Confirm bookings.
- Track vendor status.
- View marketplace analytics (business users).

---

# 27. Dependencies

- Firebase Authentication
- Cloud Firestore
- Firebase Storage
- Firebase Cloud Messaging
- Google Maps Platform
- OpenAI Responses API
- Canva MCP
- Swiggy Developer APIs
- WhatsApp Business Platform
- Razorpay / Cashfree
- Cloud Run

---

# 28. Related Documents

- EOS-000 Project Charter
- EOS-001-P1 AI Governance & Engineering Philosophy
- EOS-001-P2 Master AI Governance System Prompt
- EOS-002-P1 Living Product Requirements Document
- EOS-002-P2 User Personas & User Journeys
- EOS-002-P3-Part-01 Platform Foundation & Core Architecture
- EOS-002-P3-Part-04 Event Management
- EOS-002-P3-Part-05 Venue Discovery & Google Maps Integration

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

> The Vendor Marketplace & AI Recommendation Engine transforms HiLo into an intelligent hyperlocal marketplace by combining verified vendor data, Google Maps Platform, AI-driven ranking, collaborative decision-making, and explainable recommendations. Every completed event strengthens the recommendation engine, creating a continuously improving ecosystem for consumers and businesses.
