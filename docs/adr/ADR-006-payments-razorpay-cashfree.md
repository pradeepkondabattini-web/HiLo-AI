# ADR-006: Razorpay/Cashfree (UPI-first) for payments

- **Status:** Accepted
- **Date:** 2026-07-05
- **Deciders:** Pradeep, AI Engineering
- **Related:** EOS-000 §126 (Payment Platform); EOS-002-P3-Part-06/Part-08; EOS-BUILD-001

## Context

The launch market is **Hyderabad, India**, where **UPI** is the dominant payment rail.
EOS-000 §126 lists Stripe and PayPal as *future providers*, which do not fit an India-first,
UPI-centric launch. The Engineering Bible's payment detail specifies Indian providers.

## Decision

We will use **Razorpay and/or Cashfree** as the payment providers for the Indian launch,
**UPI-first**. This decision **supersedes the Stripe mention in EOS-000 §126** for the launch
market, consistent with the precedence model (domain-specific bible detail overrides EOS-000's
overall context).

Payments remain **abstracted behind a Payment Service** (EOS-000 §126): business domains stay
provider-independent, so additional/alternative providers can be added without changing domain
code. Payment operations require human-in-the-loop approval where applicable (EOS-000 §108).

## Consequences

- Native UPI support, contributions, and the group-discount engine (5/10/15/20%) target
  Indian rails from the start (delivered Sprint 6).
- Provider adapters implement a common Payment Service interface; no direct provider calls
  from application/UI code.
- International providers (Stripe/PayPal) can be introduced later via new adapters if needed.

## Alternatives considered

- **Stripe / PayPal as primary** — rejected for the India launch; limited/indirect UPI support
  and higher friction for the target market.

## References

- EOS-000 §126 (Payment Platform) — superseded for launch market by this ADR.
- Engineering Bible EOS-002-P3-Part-06/08; EOS-BUILD-001 Foundational Decisions.
