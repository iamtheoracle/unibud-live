# UNIBUD Flow — International Banking Platform Blueprint

## Purpose

UNIBUD Flow Student Bank is planned as an international student-focused banking and financial-services platform. It is not merely a wallet or a collection of fintech screens. Its architecture must support regulated financial products through an appropriately licensed banking entity, licensed partners, or a combination approved for each market.

The software architecture can be designed for international reach from the beginning. That does not mean every product is automatically available worldwide: account types, currencies, payment rails, lending, cards, deposits, investment services, age requirements, disclosures, and data handling must be enabled market by market after legal and provider approval.

## Product pillars

1. **Bank accounts and money movement** — supported accounts, balances, deposits, withdrawals, domestic transfers, cross-border transfers, beneficiaries, scheduled payments, statements, and payment receipts.
2. **Wallets and payment instruments** — purpose-based wallets or sub-accounts where supported, tokenized payment methods, physical cards, virtual cards, card controls, authorization events, disputes, replacements, and lifecycle management.
3. **Education finance** — academic-year funding records, tuition invoices, school and student references, disbursement tracking, payment reconciliation, repayment schedules, outstanding obligations, hardship/support workflows, and graduation transition.
4. **Savings and goals** — goals for tuition, rent, food, devices, and starting a business; recurring contributions; goal progress; and partner-backed savings products only where legally and operationally supported.
5. **Credit and lending** — product-specific applications and underwriting for tuition facilities, personal loans, instalment plans, and credit cards; affordability checks; decisions and reasons; limits; pricing/disclosures; repayment schedules; arrears support; restructuring where permitted; and collections controls.
6. **Credit information and risk** — consent and lawful-purpose tracking, data provenance, identity matching, credit-bureau adapters where available, internal risk grades, model versioning, score explanations appropriate to the product and law, correction/dispute workflows, fairness monitoring, and human review/appeals where applicable.
7. **Investing and wealth education** — financial education, goal planning, portfolio views, risk disclosures, and partner-provided investment execution/advice only through authorized firms and permitted markets. Never promise returns or present projections as guarantees.
8. **Payments across Flow** — user-approved transfers inside chat, requests, split expenses, marketplace checkout, groceries/food, books, subscriptions, school services, and shareable payment links. These surfaces must use the same server-side payment contracts, permissions, ledger, and audit trail.
9. **Bank operations and support** — customer service cases, KYC/AML review queues, fraud monitoring, transaction investigations, card disputes, credit underwriting and review, reconciliation exceptions, complaint handling, audit exports, and role-separated approvals.

## Student education-finance journey

The product should preserve an education-finance record across the student's entire academic journey, not just one semester.

- **Early years:** verify eligibility and school/fee details; present financing terms; record authorized disbursements and school payment confirmations; show the obligation and repayment terms clearly.
- **Middle years:** let students track outstanding balances, plan savings, see upcoming tuition deadlines, and make scheduled payments according to their signed agreement.
- **Later years and graduation:** show payoff estimates and outstanding obligations; allow eligible applications for further tuition support or a distinct personal loan; support repayment and servicing after graduation.
- **Every year:** keep statements, provider references, receipts, adjustments, disputes, and a timeline of decisions and payments.

Academic year alone must never trigger a loan, repayment, fee, or credit-limit change. Each change requires a valid product agreement, transparent terms, eligibility checks, and any required authorization.

## Credit decisions and limits

Do not create one universal score that automatically decides every product. Keep these concepts separate:

- External credit-bureau scores and reports, when available and lawfully obtained.
- Internal risk grades and model-generated recommendations.
- Affordability and capacity-to-repay assessments.
- Product-specific approved limits, available credit, utilized credit, and outstanding principal/fees/interest.
- Human or specialist review outcomes, overrides, reasons, and audit history.

A tuition loan, personal loan, and credit card have different purposes, repayment structures, loss risks, and limits. Use a documented decision policy per product and market. Store model/version, input-data provenance, consent or lawful basis, decision time, outcome, reason codes, and reviewer actions. Provide appropriate correction, dispute, explanation, and appeal paths. Validate models for performance, drift, disparate impact, and compliance before and after launch. Do not make lending decisions based on protected characteristics or unreliable proxies.

## International architecture

Use a shared core with market-specific adapters and policy configuration:

- **Global core:** customer identity references, account/ledger domain, transaction state machine, audit log, permissions, product catalogue, risk events, notifications, and reporting.
- **Market configuration:** eligible countries, currencies, supported products, age and identity requirements, transaction limits, disclosures, cooling-off/cancellation rules, data retention, complaint routes, and feature flags.
- **Provider adapters:** separate server-side interfaces for banking/account services, payment rails, card issuing/processing, credit bureaus, lending, FX, and investments. Avoid hard-coding one provider's fields into the core domain.
- **Money representation:** integer minor units plus ISO currency code; never use floating point for posted monetary values. Model FX quote, expiry, rate source, fees, customer confirmation, and settlement separately.
- **Ledger and transaction integrity:** immutable or correction-by-reversal entries, double-entry accounting where appropriate, idempotency keys, concurrency-safe posting, authenticated provider webhooks, reconciliation, and explicit pending/succeeded/failed/reversed/refunded/disputed states.
- **Security:** server-side authorization for every operation, least privilege, secrets management, encryption, key rotation, step-up authentication for sensitive actions, fraud/rate controls, device/session risk signals, and tamper-evident audit trails.
- **Privacy:** collect only necessary data, enforce retention and access rules, record consent or other lawful basis, and isolate data according to applicable regional requirements.
- **Operations:** monitoring, alerts, incident response, reconciliation exception queues, complaints, disputes, customer support, recovery plans, and independently reviewed privileged actions.

## Regulatory and operational boundary

Software does not itself create a banking licence or authorization to hold deposits, issue cards, lend, provide investment advice, execute trades, or move funds. Before a market or product is activated, identify the responsible licensed entity, confirm the permissions and contractual roles, complete local legal/compliance/privacy reviews, configure disclosures and controls, and test the provider's sandbox and operational processes.

Do not store card security codes or raw sensitive card credentials. Use compliant provider-hosted/tokenized card flows. Do not market an internal score as an official bureau score. Do not promise credit approval, investment returns, universal account availability, or instant settlement.

## Build sequence

1. Audit and fix the existing demo ledger: runtime validation, atomic balance changes, duplicate-credit prevention, explicit demo labels, and tests.
2. Define the core financial domain and invariants: customer/account references, double-entry ledger design, transactions, payment instructions, beneficiaries, cards, credit facilities, loan schedules, school-fee obligations, investment positions, provider events, disputes, and audit events.
3. Implement secure server-side contracts and test fixtures before choosing providers.
4. Add provider sandbox adapters incrementally, beginning with the core account/payment provider selected for the initial launch market.
5. Add the credit and education-finance workflow with manual-review support first; only enable automated decisions after validated models, policy review, monitoring, and required approvals.
6. Add card issuance, savings products, FX/cross-border rails, and investment integrations only after the relevant provider and legal gates are met.
7. Connect chat, marketplace, food/grocery, books, subscriptions, and student services to the shared financial contracts one by one.
8. Test failure paths, duplicate requests, concurrency, callback authenticity, reversals, reconciliation mismatches, permissions, accessibility, and mobile/desktop browser journeys.
9. Launch by market and product using feature flags, operational readiness checks, and explicit go/no-go approval. Never turn on live money movement merely because the UI is complete.

## Current implementation truth

The existing UNIBUD wallet is a demo ledger. No real bank, card issuer, lending provider, credit bureau, investment broker, FX provider, or payment rail is implied by this blueprint. This document describes the target architecture and acceptance direction, not completed integrations or legal approval.

## Definition of done for each real-money product

- Licensed/authorized provider and operating entity confirmed for the target market.
- Product terms, disclosures, eligibility, limits, fees, and support paths reviewed.
- Server-side authorization, validation, idempotency, audit, monitoring, and reconciliation implemented.
- Provider sandbox tests pass, including timeout, duplicate callback, rejection, reversal, and settlement mismatch cases.
- Security, privacy, legal/compliance, operational support, and incident response reviewed.
- Customer-visible states match authoritative provider records.
- Browser tests and automated tests pass; production release is explicitly approved.
