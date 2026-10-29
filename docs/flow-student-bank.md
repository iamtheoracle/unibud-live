# UNIBUD Flow — Student Bank and Platform Benefits

## Product direction

Flow is UNIBUD's single, premium student experience. Features should feel connected through consistent navigation, typography, interaction patterns, account context, and accessibility—not like unrelated mini-apps stitched together. Each mini-app keeps a clear job and its own useful depth.

**Student Bank direction:** full student banking with accounts, balances, cards, transfers, and payments through licensed providers. Until those integrations exist and are verified, the product must distinguish demos, guidance, planned capabilities, and confirmed provider-backed activity.

## Flow benefit map

| Flow area | Student benefit | Capability examples | Current truth |
|---|---|---|---|
| Home & Discover | Find the next useful action without hunting through separate apps | Personalized shortcuts, campus updates, feature discovery | Product direction; verify each existing surface before claiming complete |
| Square & Connect | Find people and communities that fit campus life | Profiles, social discovery, communities, trusted connections | Existing platform area; individual features require audit |
| Quad & Chat | Coordinate with classmates and friends | Direct/group chat, shared plans, group coordination | Existing platform area; individual features require audit |
| Studies & Stories | Learn, organize schoolwork, and share student work | Board/classroom layer, course context, study resources, Stories | Existing platform area; course and AI boundaries must remain clear |
| Marketplace | Find student goods and services with better trust cues | Listings, seller profiles, reporting, safe contact, checkout | Demo payment only where it uses the wallet demo ledger |
| Bud | Get complicated things explained in simple language | Explain, plan, draft, help navigate UNIBUD | Bud is the visible AI helper; provider-backed actions need permissions and safe fallbacks |
| Student Bank | Understand and organize student money in one place | Demo wallet, activity, requests/splits, funding notes, future accounts/cards/transfers | Wallet is demo-only; real bank rails are not connected |
| Safety & control | Feel safer and understand who can see or do what | Verification, block/report, privacy, account security, support | Must be verified per flow; never imply verification or protection that is not implemented |

## Student Bank benefits

### Available in the current demo
- A clearly labelled simulated naira balance.
- Demo add-funds, send, and withdrawal flows that write demo ledger entries only.
- Activity history with status and notes.
- Money requests and split calculations for trying the experience.
- Marketplace payment simulation.
- A personal student-funding notes tracker with a link to the official NELFUND site.

### Planned, not live
- Provider-backed student accounts and account details.
- Virtual and physical cards, card controls, and card lifecycle states.
- Transfers and bill/merchant payments.
- Provider-confirmed receipts, transaction statuses, reversals, refunds, and dispute handling.
- Budget categories for food, rent, transport, data, subscriptions, tuition, and other student costs.
- Savings goals, recurring-payment reminders, spending insights, and cash-flow forecasts.
- Officially supported funding-status integrations, if available and authorized.
- Stronger marketplace checkout and any escrow/payment protection only if a provider and legal model support it.

### Required before real money can move
1. Select a licensed provider and confirm permitted products, markets, settlement model, fees, limits, and service-level commitments.
2. Complete legal, regulatory, privacy, and compliance review for the operating country and target users.
3. Keep provider credentials and signing secrets server-side; never expose them in the browser or repository.
4. Implement server-authorized transactions, recipient validation, explicit confirmation, idempotency, replay protection, and provider status verification.
5. Maintain an auditable ledger with reconciliation against provider records; never treat a client-side event as proof of settlement.
6. Add risk controls, monitoring, rate limits, fraud/abuse handling, failed-payment recovery, refunds/reversals, and support/dispute workflows.
7. Test with provider sandbox cases, including timeouts, duplicate callbacks, insufficient funds, reversals, and mismatched settlement status.
8. Roll out behind a feature flag and only enable live features after successful security, integration, and operational review.

## Product-wide quality bar

- **One coherent Flow:** consistent navigation and design language; avoid duplicate mini-apps and competing labels.
- **Clear status language:** distinguish Live, Demo, Planned, and Provider required. Use “verified” only when verification actually occurred.
- **Trust by default:** make block/report, privacy choices, and support paths discoverable.
- **AI boundaries:** Bud can explain and prepare actions, but must not silently perform sensitive or financial actions.
- **Accessibility:** responsive layouts, keyboard support, readable contrast, clear labels, and useful empty/error/loading states.
- **Reliability:** server-side authorization, typed validation, observable failures, tests, and no false success messages.
- **Student-first utility:** reduce friction around learning, money, housing, transport, communities, campus services, and everyday coordination without making the app feel overloaded.

## Current implementation notes

The existing `src/routes/_app/money.tsx` uses the wallet demo. `src/lib/money/server.ts` labels operations as demo ledger entries and currently has no licensed bank/card/mobile-money integration. “Mark paid” is a simulated status update and must not be interpreted as receiving funds. Funding notes are personal tracking notes and are not submitted to NELFUND.

The private `iamtheoracle/arc-project-one` repository was discoverable but its application source was not available through the current GitHub file-fetch access during this work. This change is therefore being prepared in the accessible `iamtheoracle/unibud-live` repository, rather than claiming that Arc Project One itself was modified.

## Acceptance checklist

- [ ] All Flow entry points use consistent naming and navigation.
- [ ] The Student Bank demo label and no-real-money disclaimer remain visible.
- [ ] Planned accounts/cards/transfers are not represented as live functionality.
- [ ] Real provider actions are server-authorized and provider-confirmed.
- [ ] Transaction history, requests, errors, and empty states are tested.
- [ ] Mobile and desktop browser flows are audited.
- [ ] Typecheck, lint, tests, and production build pass.
- [ ] Provider, security, and compliance review is complete before any live-money release.


## Build order: banking first, Flow-wide connections second

Student Bank is the first implementation priority. Do not begin by wiring every mini-app into unfinished financial services. First establish a safe, testable financial foundation and its contracts; then connect Flow surfaces incrementally.

1. **Audit and harden the existing wallet demo:** make demo status unmistakable, review authorization and runtime validation, prevent invalid amounts/status transitions, and test ledger/activity behavior. Do not label this production banking.
2. **Define the core banking domain:** account, balance/ledger entry, transaction, beneficiary, payment instruction, card, provider event, dispute, and audit event. Keep monetary values in integer minor units and use explicit transaction states.
3. **Design the provider boundary:** server-only adapter contracts for accounts, balances, transfers, cards, and payment status. Provider credentials stay in server secrets; no real provider is assumed until selected and approved.
4. **Implement provider sandbox integration:** authentication, idempotency, signed callback verification, pending/failed/succeeded states, reconciliation, and failure recovery.
5. **Verify security and operations:** authorization, limits, fraud controls, monitoring, support/disputes, audit trails, and legal/compliance approval.
6. **Connect Flow one surface at a time:** marketplace checkout, shared expenses, subscriptions, student services, and other approved experiences call the same server-side financial contracts. Each integration needs explicit user consent, a clear confirmation step, and its own tests.
7. **Release gradually:** feature flags, sandbox validation, staff review, limited rollout, and provider-confirmed reconciliation before enabling production money movement.

### Non-negotiable rules

- A demo balance is not a deposit, and a demo transaction is not a payment.
- Never claim a transfer succeeded until the provider confirms it.
- Never trust client-supplied transaction status or provider callbacks that have not been authenticated.
- Never let the browser access provider secrets or perform privileged ledger writes.
- Keep every Flow integration on the same authorization, audit, and reconciliation foundation rather than implementing separate money logic in each mini-app.
