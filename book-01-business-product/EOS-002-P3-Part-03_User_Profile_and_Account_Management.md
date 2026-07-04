---
title: EOS-002-P3 Part 03 - User Profile & Account Management
document_id: EOS-002-P3-P03
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
# Part 03
# User Profile & Account Management

> This document defines the complete user profile lifecycle, account management capabilities, personalization settings, privacy controls, notification preferences, and account governance for the HiLo platform.

---

# 1. Purpose

The User Profile module enables every authenticated user to manage their personal information, preferences, business details, privacy settings, event history, and connected services from a centralized account dashboard.

This module serves as the identity layer for all platform interactions.

---

# 2. Objectives

The module shall:

- Maintain a unified user profile.
- Support multiple user roles.
- Store personalization preferences.
- Manage profile verification.
- Provide privacy controls.
- Enable notification preferences.
- Manage linked accounts.
- Support account deletion and recovery.
- Synchronize profile information across devices.

---

# 3. Supported Profile Types

| Profile Type | Description |
|--------------|-------------|
| Consumer | Personal event organizer |
| Business | Venue or vendor account |
| Administrator | Internal platform administrator |

A single account may contain multiple active roles.

---

# 4. Profile Dashboard

The profile dashboard shall display:

- Profile photo
- Full name
- Username
- Verification badges
- Email
- Mobile number
- City
- Member since
- Current role(s)
- Upcoming events
- Completed events
- Saved venues
- Saved vendors
- Wallet / Contributions
- Trust Score (future)
- Profile completion percentage

---

# 5. Profile Information

## Personal Information

Required fields:

- Full Name
- Email
- Mobile Number

Optional fields:

- Date of Birth
- Gender
- City
- State
- Country
- Bio
- Profile Photo

---

# 6. Business Profile

Additional information for business accounts:

- Business Name
- Business Category
- Description
- Address
- Google Maps Location
- GST Number (optional)
- Website
- Contact Person
- Logo
- Cover Image
- Operating Hours
- Service Areas

---

# 7. Profile Completion

The application shall calculate a profile completion percentage.

Example scoring:

| Item | Weight |
|------|--------|
| Name | 10% |
| Email | 10% |
| Mobile | 10% |
| Profile Photo | 10% |
| City | 10% |
| Preferences | 10% |
| Bio | 10% |
| Verified Email | 15% |
| Verified Phone | 15% |

Profiles above 90% completion receive a "Complete Profile" indicator.

---

# 8. Personalization Preferences

Users may configure:

- Preferred language
- Currency
- Time zone
- Preferred event types
- Budget range
- Preferred vendors
- Favourite cuisines
- Notification frequency
- AI assistance level

These preferences shall improve AI recommendations.

---

# 9. Privacy Settings

Users shall control visibility of:

- Email
- Mobile number
- Profile photo
- Event history
- Saved venues
- Saved vendors
- Shared albums

Visibility options:

- Public
- Friends / Event Members
- Private

---

# 10. Notification Preferences

Notification categories:

- Event reminders
- RSVP updates
- Budget alerts
- Vendor confirmations
- Payment reminders
- Chat messages
- Photo uploads
- Promotional offers
- Platform announcements

Delivery channels:

- Push Notification
- Email
- WhatsApp (where permitted)
- SMS (future)

---

# 11. Linked Accounts

Supported integrations:

- Google Account
- Apple ID (Phase 2)
- WhatsApp Number
- UPI Payment Provider
- Canva Account
- Future third-party integrations

Users may link or unlink supported services.

---

# 12. Saved Items

Users can save:

- Venues
- Vendors
- Event themes
- Invitation templates
- Food packages
- Favourite locations

Saved items shall sync across devices.

---

# 13. Event History

The profile shall display:

- Upcoming events
- Ongoing events
- Completed events
- Cancelled events
- Invitations received
- Events attended

Each event entry includes:

- Event name
- Date
- Venue
- Budget
- Guest count
- Status

---

# 14. Account Security

Users can:

- Change password
- Reset password
- Enable two-factor authentication (future)
- View active sessions
- Logout from all devices
- Review recent login history

---

# 15. Account Lifecycle

```
Registered

↓

Verified

↓

Active

↓

Inactive

↓

Suspended

↓

Reactivated

↓

Deleted
```

Each transition shall be logged for audit purposes.

---

# 16. Data Export

Users may request an export of:

- Profile information
- Event history
- Uploaded media
- Payment history
- Vendor reviews
- Chat history (where applicable)

Exports shall be provided in a machine-readable format.

---

# 17. Account Deletion

Users may permanently delete their account.

Deletion workflow:

1. User initiates deletion.
2. Identity verification required.
3. Warning about data loss.
4. Optional reason for leaving.
5. Grace period (configurable).
6. Permanent deletion.

Certain financial and audit records may be retained where required by law.

---

# 18. Firestore Collections

```
users/

user_preferences/

user_settings/

saved_venues/

saved_vendors/

saved_themes/

linked_accounts/

user_sessions/

profile_completion/

notification_preferences/
```

---

# 19. APIs

Primary endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| /profile | GET | Retrieve profile |
| /profile | PUT | Update profile |
| /preferences | GET | Retrieve preferences |
| /preferences | PUT | Update preferences |
| /saved-items | GET | Retrieve saved items |
| /saved-items | POST | Save item |
| /saved-items/{id} | DELETE | Remove saved item |
| /account/export | POST | Request data export |
| /account/delete | POST | Request account deletion |

---

# 20. Business Rules

- Email addresses must be unique.
- Mobile numbers must be verified before becoming primary contact numbers.
- Users may switch between roles without creating separate accounts.
- Business profiles require administrator approval before receiving a verified badge.
- Profile updates shall be reflected across all active sessions.

---

# 21. Error Handling

| Scenario | Expected Behaviour |
|----------|--------------------|
| Invalid profile image | Display validation message |
| Duplicate email | Prevent update |
| Weak password | Reject with guidance |
| Network interruption | Retry with user notification |
| Unauthorized request | Return authentication error |

---

# 22. Acceptance Criteria

The module is complete when users can:

- View and edit profiles.
- Configure preferences.
- Manage privacy settings.
- Link supported services.
- Save favourite venues and vendors.
- Review event history.
- Export personal data.
- Delete their account securely.

---

# 23. Dependencies

- Firebase Authentication
- Cloud Firestore
- Firebase Storage
- Firebase Cloud Messaging
- Google Maps Platform
- Canva MCP
- WhatsApp Business Platform
- Razorpay / Cashfree

---

# 24. Related Documents

- EOS-000 Project Charter
- EOS-001-P1 AI Governance & Engineering Philosophy
- EOS-001-P2 Master AI Governance System Prompt
- EOS-002-P1 Living Product Requirements Document
- EOS-002-P2 User Personas & User Journeys
- EOS-002-P3-Part-01 Platform Foundation & Core Architecture
- EOS-002-P3-Part-02 Authentication & Identity

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

> The User Profile & Account Management module establishes the persistent identity of every HiLo user. It enables secure account management, personalized experiences, privacy controls, and seamless integration across all platform features while maintaining user trust and regulatory compliance.
