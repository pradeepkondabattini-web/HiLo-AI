---
title: EOS-002-P3 Part 05 - Venue Discovery & Google Maps Integration
document_id: EOS-002-P3-P05
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
# Part 05
# Venue Discovery & Google Maps Integration

> This document defines the venue discovery engine, Google Maps Platform integration, AI-powered recommendations, location services, and venue selection workflow for the HiLo platform.

---

# 1. Purpose

The Venue Discovery module enables users to discover, compare, evaluate, shortlist, and select venues based on event requirements, location, budget, guest count, availability, and AI recommendations.

---

# 2. Objectives

The module shall:

- Discover nearby venues.
- Display venues on an interactive map.
- Rank venues intelligently.
- Recommend suitable venues using AI.
- Reduce venue search time.
- Support comparison and shortlisting.
- Provide navigation and contact details.

---

# 3. Supported Venue Categories

## Banquet Halls

## Hotels

## Convention Centres

## Wedding Lawns

## Farm Houses

## Resorts

## Restaurants

## Rooftop Venues

## Community Halls

## Club Houses

## Conference Centres

## Outdoor Event Spaces

## Party Halls

Venue categories shall be configurable through Firestore.

---

# 4. Data Sources

Primary source:

- Google Maps Platform

Secondary sources:

- HiLo verified venues
- Partner venue catalogue
- Manual onboarding
- Future integrations

---

# 5. Google Maps Platform APIs

The platform shall integrate:

- Places API
- Place Details API
- Nearby Search
- Text Search
- Geocoding API
- Reverse Geocoding
- Directions API
- Distance Matrix API
- Maps SDK (Flutter)
- Static Maps (optional)

---

# 6. Location Detection

Location sources:

1. Device GPS
2. User-selected location
3. Saved city
4. Event location

Users may change location at any time.

---

# 7. Search Workflow

```
Create Event

↓

Choose Location

↓

Detect User Position

↓

Define Search Radius

↓

Apply Filters

↓

Retrieve Google Places

↓

Merge HiLo Venues

↓

AI Ranking

↓

Display Results

↓

Compare

↓

Shortlist

↓

Select Venue
```

---

# 8. Search Filters

Users can filter by:

- Budget
- Capacity
- Distance
- Rating
- Venue type
- Indoor / Outdoor
- AC / Non-AC
- Parking
- Wheelchair accessibility
- Family friendly
- Pet friendly
- Alcohol permitted
- Catering availability
- Decoration policy
- Availability (future)

---

# 9. Search Radius

Default:

10 km

Supported values:

- 2 km
- 5 km
- 10 km
- 20 km
- 50 km

The AI should prefer venues within 10 km unless the user explicitly expands the radius.

---

# 10. Venue Card

Each venue shall display:

- Cover photo
- Venue name
- Distance
- Google rating
- HiLo Trust Score
- Estimated pricing
- Capacity
- Address
- Availability indicator (when available)
- Favourite button
- Compare button

---

# 11. Venue Details

Selecting a venue displays:

- Image gallery
- Description
- Google reviews summary
- Amenities
- Pricing estimate
- Capacity
- Contact information
- Navigation
- Website
- Opening hours
- Parking details
- Accessibility information
- Nearby landmarks

---

# 12. Interactive Map

Map capabilities:

- Current location
- Venue markers
- Clustered markers
- Zoom controls
- Re-center
- Directions
- Live traffic overlay (future)

---

# 13. AI Recommendation Engine

Inputs:

- Event type
- Budget
- Guest count
- Date
- Preferred location
- User preferences
- Venue ratings
- Distance
- Marketplace Trust Score

Outputs:

- Ranked venue list
- Explanation for ranking
- Alternative recommendations

---

# 14. Venue Ranking Algorithm

The recommendation score shall consider:

| Factor | Weight |
|---------|-------:|
| Budget compatibility | 25% |
| Capacity match | 20% |
| Distance | 15% |
| Google rating | 15% |
| HiLo Trust Score | 10% |
| Review sentiment | 5% |
| Amenities match | 5% |
| User preferences | 5% |

Weights should be configurable.

---

# 15. Comparison Tool

Users may compare up to four venues simultaneously.

Comparison fields:

- Budget
- Capacity
- Distance
- Rating
- Amenities
- Parking
- Accessibility
- Catering policy
- Decoration policy

---

# 16. Shortlisting

Users can:

- Save favourites
- Add notes
- Share shortlisted venues
- Vote within the event group

Shortlists are synchronized across all participants.

---

# 17. Event Group Collaboration

Guests may:

- View shortlisted venues
- Vote
- Comment
- Suggest alternatives

The host retains final selection authority.

---

# 18. Navigation

The module supports:

- Open in Google Maps
- Turn-by-turn directions
- Share location
- Estimated travel time

---

# 19. Business Integration

Verified venue owners can:

- Claim venue
- Update business information
- Add additional images
- Respond to reviews (future)
- Publish promotions
- Receive enquiries

---

# 20. Firestore Collections

```
venues/

venue_categories/

venue_shortlists/

venue_votes/

venue_reviews/

venue_images/

venue_rankings/

venue_claims/

venue_favourites/
```

---

# 21. APIs

| Endpoint | Method | Description |
|----------|--------|-------------|
| /venues/search | POST | Search venues |
| /venues/{id} | GET | Retrieve venue details |
| /venues/compare | POST | Compare venues |
| /venues/favourites | POST | Save favourite |
| /venues/vote | POST | Submit vote |
| /venues/recommendations | GET | AI recommendations |

---

# 22. MCP Integration

Google Maps Platform MCP responsibilities:

- Place search
- Place details
- Directions
- Distance calculations
- Geocoding

OpenAI MCP orchestration shall:

- Combine Google data
- Merge HiLo marketplace data
- Apply AI ranking
- Generate explanations

---

# 23. Business Rules

- AI recommendations never replace user choice.
- Google ratings remain read-only.
- HiLo Trust Score is calculated internally.
- Shortlists belong to the event workspace.
- Venue selection can be modified until booking confirmation.

---

# 24. Error Handling

| Scenario | Behaviour |
|----------|-----------|
| Location unavailable | Prompt user to select a location manually |
| No venues found | Expand radius and suggest alternatives |
| Google API quota exceeded | Use cached results and notify engineering |
| Maps unavailable | Display list view |
| Network interruption | Retry and offer offline cached data |

---

# 25. Acceptance Criteria

The module is complete when users can:

- Detect their location.
- Search nearby venues.
- View venues on a map.
- Apply filters.
- Compare venues.
- Save favourites.
- Vote within groups.
- Navigate to venues.
- Select a venue for an event.

---

# 26. Dependencies

- Flutter Google Maps SDK
- Google Maps Platform
- Places API
- Geocoding API
- Directions API
- Distance Matrix API
- Firebase Firestore
- OpenAI Responses API
- MCP Orchestrator

---

# 27. Related Documents

- EOS-000 Project Charter
- EOS-001-P1 AI Governance
- EOS-001-P2 Master AI Governance System Prompt
- EOS-002-P1 Living Product Requirements Document
- EOS-002-P2 User Personas & User Journeys
- EOS-002-P3-Part-01 Platform Foundation & Core Architecture
- EOS-002-P3-Part-04 Event Management

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

> The Venue Discovery module combines Google Maps Platform, HiLo marketplace intelligence, and AI-assisted ranking to deliver personalized, explainable, and hyperlocal venue recommendations. It enables users to discover the right venue efficiently while supporting collaborative decision-making within the event workspace.
