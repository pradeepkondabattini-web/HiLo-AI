---
title: EOS-004 Part 09 - Analytics, BigQuery and Business Intelligence
document_id: EOS-004-P9
book: Book 03 – Data Architecture
version: 1.0.0
status: Approved
classification: Data Analytics Architecture
project: EOS (Event Operating System)
product: HiLo
owner: Data Engineering Team
created: 2026-07-04
last_updated: 2026-07-04
---

# EOS-004
# Part 09
# Analytics, BigQuery and Business Intelligence

> This document defines the analytics architecture, event tracking standards, BigQuery data warehouse, KPI framework, dashboards, AI analytics, predictive reporting, and business intelligence strategy for the HiLo platform.

---

# 1. Purpose

Analytics is a first-class capability within HiLo.

Objectives:

- Measure platform health
- Improve AI recommendations
- Optimize user experience
- Track revenue
- Support business decisions
- Enable predictive analytics

---

# 2. Analytics Architecture

```
Flutter Apps
      │
      ▼
Firebase Analytics
      │
      ▼
Google Analytics 4
      │
      ▼
BigQuery
      │
      ▼
Data Models
      │
      ▼
Looker Studio
      │
      ▼
Executive Dashboards
```

Future:

```
BigQuery

↓

Vertex AI

↓

Predictive Analytics

↓

AI Decision Engine
```

---

# 3. Data Sources

Primary Sources

- Firebase Analytics
- Firestore
- Cloud Run
- Firebase Storage
- Cloud Logging

External Sources

- Google Maps Platform
- Swiggy APIs
- Canva MCP
- WhatsApp Business
- Razorpay
- Cashfree

Future

- CRM
- ERP
- Marketing Platforms

---

# 4. Analytics Categories

Platform Analytics

Business Analytics

Operational Analytics

AI Analytics

Commerce Analytics

Vendor Analytics

Venue Analytics

User Behaviour Analytics

Marketing Analytics

---

# 5. Event Tracking Standards

Naming Convention

```
category_action_object
```

Examples

```
event_created

venue_selected

vendor_booked

payment_completed

food_ordered

theme_generated

ai_recommendation_accepted

group_created

whatsapp_invite_sent
```

---

# 6. Core User Events

Authentication

- login
- logout
- signup
- profile_completed

Events

- event_created
- event_updated
- event_deleted
- event_completed

Venue

- venue_search
- venue_view
- venue_shortlisted
- venue_booked

Vendor

- vendor_search
- vendor_contacted
- vendor_quote_received
- vendor_selected

Commerce

- swiggy_order_created
- grocery_order_created

Payments

- payment_initiated
- payment_completed
- payment_failed
- payment_refunded

---

# 7. AI Analytics

Track:

- AI requests
- AI latency
- Tokens consumed
- Skills executed
- MCP calls
- Memory retrievals
- Recommendation acceptance
- AI errors
- Conversation length

Example Metrics

```
AI Success Rate

AI Cost per Event

Average AI Response Time

Memory Hit Rate

Tool Invocation Accuracy
```

---

# 8. MCP Analytics

Track usage for:

Google Maps MCP

Canva MCP

Swiggy MCP

WhatsApp MCP

Payment MCP

Metrics

- Requests
- Success rate
- Failures
- Average latency
- Cost
- User satisfaction

---

# 9. Business KPIs

Growth

- Registered Users
- Monthly Active Users
- Daily Active Users

Engagement

- Events Created
- Events Completed
- Invitations Sent
- RSVP Rate

Commerce

- Vendor Bookings
- Venue Bookings
- Food Orders

Revenue

- GMV
- Platform Revenue
- Average Order Value

---

# 10. Consumer KPIs

Measure

- Budget adherence
- Planning duration
- AI adoption
- Guest participation
- Photo uploads
- Repeat event creation
- Referral rate

---

# 11. Business Partner KPIs

Vendors

- Booking rate
- Quote acceptance
- Revenue
- Ratings

Venues

- Search ranking
- Conversion
- Occupancy
- Reviews

---

# 12. Executive Dashboard

Widgets

- Daily Users
- Revenue
- Events Created
- AI Requests
- Active Vendors
- Venue Searches
- Payment Success
- Error Rate

Refresh

Every 15 minutes

---

# 13. Product Dashboard

Measures

- Feature adoption
- User journeys
- Drop-off points
- Session duration
- Screen usage
- Navigation paths

---

# 14. Marketing Dashboard

Channels

- Organic
- Paid
- Referral
- WhatsApp
- Google

KPIs

- CAC
- LTV
- Conversion Rate
- Retention
- Campaign ROI

---

# 15. AI Operations Dashboard

Displays

- Agent utilization
- Skill execution counts
- MCP health
- AI costs
- Token consumption
- Memory usage
- Error distribution

---

# 16. BigQuery Data Warehouse

Datasets

```
users

events

vendors

venues

payments

commerce

analytics

ai

system

audit
```

Partitioning

- Daily

Clustering

- eventId
- userId
- city

---

# 17. Data Export Strategy

Automatic exports from:

Firebase Analytics

Firestore (scheduled)

Cloud Logging

Cloud Monitoring

Payment reports

Storage metadata

---

# 18. Predictive Analytics

Future capabilities

- Event budget prediction
- Venue demand forecasting
- Vendor demand forecasting
- AI cost forecasting
- User churn prediction
- Revenue prediction
- Guest attendance prediction

Powered by:

BigQuery ML

Vertex AI

---

# 19. Machine Learning Features

Potential features

- Vendor recommendation score
- Venue recommendation score
- Dynamic pricing insights
- Preferred cuisine prediction
- Budget optimization
- Event success score

---

# 20. Data Quality

Validation Rules

- No duplicate events
- Mandatory timestamps
- Valid user references
- Consistent currency
- Schema compliance

Automated quality checks run daily.

---

# 21. Privacy & Compliance

Analytics must:

- Respect user consent
- Support data deletion
- Exclude sensitive payment data
- Anonymize reporting where required

Compliance

- India DPDP Act
- GDPR readiness

---

# 22. Performance Targets

| Metric | Target |
|--------|--------|
| Analytics Event Processing | <5 sec |
| BigQuery Export | <15 min |
| Dashboard Refresh | <15 min |
| Executive KPI Load | <3 sec |
| AI Dashboard Load | <5 sec |

---

# 23. Roles & Responsibilities

| Role | Responsibility |
|------|----------------|
| Data Engineering | Warehouse & Pipelines |
| Product Team | KPI Definition |
| AI Team | AI Metrics |
| Finance | Revenue Reports |
| Operations | Operational Dashboards |
| Executive Team | Strategic Dashboards |

---

# 24. Acceptance Criteria

This analytics architecture is accepted when:

- Analytics events are standardized.
- Firebase Analytics is configured.
- BigQuery exports are automated.
- KPI definitions are documented.
- Executive dashboards are available.
- AI metrics are captured.
- Data quality checks are operational.
- Privacy requirements are enforced.

---

# 25. Related Documents

- EOS-003-P3 Firebase Backend Architecture
- EOS-004-P4 Firestore Document Schemas
- EOS-004-P5 Indexes, Partitioning and Query Optimization
- EOS-004-P7 AI Memory, Context, Vector and Knowledge Graph
- EOS-005 AI Platform Architecture

---

# Revision History

| Version | Date | Description |
|----------|------|-------------|
| 1.0.0 | 2026-07-04 | Initial release |

---

# Approval

| Role | Status |
|------|--------|
| Chief Data Officer | Pending |
| Data Engineering Lead | Pending |
| Product Analytics Lead | Pending |
| Product Owner | Pending |

---

> The Analytics, BigQuery and Business Intelligence architecture transforms HiLo into a data-driven platform. By combining operational analytics, AI telemetry, business KPIs, predictive modeling, and executive dashboards, the platform enables continuous optimization of user experiences, business performance, and AI capabilities while maintaining privacy, governance, and enterprise scalability.
