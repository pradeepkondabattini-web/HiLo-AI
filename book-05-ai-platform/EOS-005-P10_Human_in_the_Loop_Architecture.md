---
title: EOS-005 Part 10 - Human-in-the-Loop Architecture
document_id: EOS-005-P10
book: Book 05 – AI Platform Architecture
version: 1.0.0
status: Approved
classification: Enterprise Human-AI Collaboration
project: EOS (Event Operating System)
product: HiLo
owner: AI Platform Team
created: 2026-07-04
last_updated: 2026-07-04
---

# EOS-005
# Part 10
# Human-in-the-Loop (HITL) Architecture

> This document defines the Human-in-the-Loop (HITL) architecture for the HiLo Event Operating System (EOS). It establishes how AI collaborates with users, administrators, vendors, and enterprise operators to ensure critical decisions remain transparent, auditable, and under appropriate human control.

---

# 1. Purpose

The Human-in-the-Loop architecture ensures that AI recommendations are reviewed and approved whenever business, financial, legal, privacy, or operational risks exceed predefined thresholds.

The architecture supports:

- Human oversight
- Trustworthy AI
- Enterprise governance
- Regulatory compliance
- Safe automation
- Explainable decision-making

---

# 2. Design Principles

The HITL architecture shall be:

- Human-centered
- Risk-based
- Explainable
- Auditable
- Policy-driven
- Interruptible
- Recoverable
- Role-aware

---

# 3. High-Level Architecture

```
User Request

↓

AI Gateway

↓

AI Orchestrator

↓

Planning Engine

↓

AI Recommendation

↓

Risk Assessment Engine

↓

Approval Policy Engine

↓

Human Approval Required?

↓

YES ------------------------ NO

↓                             ↓

Approval Workflow        Execute Task

↓

Approve / Reject / Modify

↓

Resume Workflow

↓

Audit Logging

↓

Memory Update
```

---

# 4. Human Roles

The platform supports multiple approval roles.

## Consumer

Examples:

- Confirm venue booking
- Approve invitation
- Approve payment
- Modify AI suggestions

---

## Business User

Examples:

- Approve quotations
- Confirm vendor assignments
- Validate budgets

---

## Vendor

Examples:

- Accept bookings
- Confirm availability
- Update pricing

---

## Platform Administrator

Examples:

- Resolve AI incidents
- Review flagged content
- Manage policy exceptions

---

## Enterprise Administrator

Examples:

- Approve corporate budgets
- Review compliance workflows
- Configure governance policies

---

# 5. Approval Categories

## Informational

No approval required.

Examples:

- Theme suggestions
- Decoration ideas
- Venue rankings

---

## Advisory

User acknowledgement recommended.

Examples:

- Budget recommendations
- Vendor comparisons

---

## Operational

Explicit approval required.

Examples:

- Send invitations
- Schedule reminders
- Publish event

---

## Financial

Mandatory approval.

Examples:

- Vendor payment
- Refund
- Catering order
- Ticket purchase

---

## Regulatory

Highest approval level.

Examples:

- Contract acceptance
- Compliance reporting
- Organization-wide notifications

---

# 6. Risk Assessment

The Risk Assessment Engine evaluates:

- Financial impact
- Privacy impact
- Operational impact
- User confidence
- Organizational policy
- Regulatory requirements

Risk levels:

- Low
- Medium
- High
- Critical

---

# 7. Approval Policies

Policies define:

- Required approver
- Number of approvals
- Escalation rules
- Timeout duration
- Delegation permissions

Policies are centrally managed.

---

# 8. Approval Workflow

```
AI Recommendation

↓

Approval Request Created

↓

Notify Approver

↓

Pending Approval

↓

Approve

Reject

Modify

↓

Workflow Continues
```

Every decision is recorded.

---

# 9. Approval States

Supported states:

- Pending
- Approved
- Rejected
- Modified
- Expired
- Escalated
- Cancelled

State transitions are immutable.

---

# 10. Explainable Recommendations

Every approval request includes:

- AI recommendation
- Reasoning summary
- Supporting evidence
- Confidence score
- Estimated impact
- Alternative options

Users can understand why the recommendation was made.

---

# 11. Human Overrides

Authorized users may:

- Override recommendations
- Modify execution plans
- Change vendors
- Edit budgets
- Select alternative Skills

Overrides are preserved for future learning but never automatically treated as ground truth.

---

# 12. Workflow Resumption

After approval:

```
Approval Received

↓

AI Orchestrator

↓

Resume Workflow

↓

Continue Remaining Tasks

↓

Completion
```

Long-running workflows survive service restarts.

---

# 13. Escalation

If approval is delayed:

1. Reminder notification
2. Secondary approver
3. Supervisor escalation
4. Workflow timeout
5. Cancellation (if policy requires)

Escalation rules are configurable.

---

# 14. Notification Channels

Supported channels:

- Push notifications
- Email
- WhatsApp
- SMS (future)
- In-app notifications

Delivery preferences respect user settings.

---

# 15. Audit Logging

Every approval records:

- Request ID
- Workflow ID
- User ID
- Approver ID
- Timestamp
- Decision
- Reason (optional)
- AI recommendation
- Final outcome

Audit logs are immutable.

---

# 16. Security

Approval workflows enforce:

- Firebase Authentication
- RBAC
- ABAC
- MFA (where required)
- Session validation
- Tenant isolation

Unauthorized approvals are rejected.

---

# 17. Privacy

Approval requests expose only the minimum required information.

Sensitive data is:

- Masked
- Tokenized where appropriate
- Shared according to consent and role

---

# 18. Observability

Metrics include:

- Approval latency
- Approval rate
- Rejection rate
- Override frequency
- Escalation rate
- Workflow completion rate
- Human intervention frequency

---

# 19. Learning from Human Decisions

Approved and modified decisions may be used to improve:

- Prompt quality
- Planning strategies
- Agent recommendations
- Vendor rankings

Learning is governed by user consent and organizational policy.

---

# 20. Scalability

The HITL architecture supports:

- Multi-stage approvals
- Parallel approvals
- Delegated approvals
- Enterprise approval chains
- Long-running workflows
- Cross-organization collaboration

---

# 21. Technology Mapping

| Component | Technology |
|-----------|------------|
| Approval Service | Cloud Run |
| Workflow State | Cloud Firestore |
| Notifications | Firebase Cloud Messaging |
| Messaging | WhatsApp Business Platform |
| Audit Logs | Cloud Logging |
| Analytics | BigQuery |
| Identity | Firebase Authentication |
| Event Bus | Google Cloud Pub/Sub |

---

# 22. Acceptance Criteria

The Human-in-the-Loop architecture is complete when:

- Approval workflows are standardized.
- Risk assessment is implemented.
- Approval policies are configurable.
- Explainable recommendations are generated.
- Human overrides are supported.
- Workflow resumption is reliable.
- Audit logging is immutable.
- Observability dashboards are operational.

---

# 23. Related Documents

- EOS-005-P1 AI Platform Architecture
- EOS-005-P2 AI Orchestrator Architecture
- EOS-005-P3 Multi-Agent Framework
- EOS-005-P8 Planning Engine and Task Decomposition
- EOS-005-P9 AI Safety, Guardrails and Governance
- EOS-005-P11 AI Observability, Evaluation and Cost Optimization

---

# Revision History

| Version | Date | Description |
|----------|------|-------------|
| 1.0.0 | 2026-07-04 | Initial release |

---

# Approval

| Role | Status |
|------|--------|
| Chief AI Architect | Pending |
| Enterprise Architect | Pending |
| AI Governance Council | Pending |
| Product Owner | Pending |

---

> The Human-in-the-Loop Architecture ensures that HiLo combines the efficiency of AI with the judgment, accountability, and contextual understanding of human decision-makers. By integrating configurable approval workflows, explainable recommendations, policy-driven risk assessment, secure collaboration, and comprehensive auditability, the platform enables responsible automation while preserving user trust and enterprise governance.
