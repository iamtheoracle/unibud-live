# UNIBUD Connect Opportunities — Product and Engineering Specification

Status: implementation specification; production capability is not yet wired.
Owner surface: Connect. Shared platform capabilities: Identity, Chat, Notifications, Verification, Safety, Marketplace and Payments (where approved).

## Product intent

Connect is both a people network and an opportunities network. A member can show what they do, publish what they can offer, ask for help, find work, recruit collaborators and negotiate a deal with another member. The opportunity layer must feel native to Connect and link every offer to its real owner profile and conversation.

Do not present seeded catalogue people or browser-local Zustand state as real cross-user listings, requests, contracts, payments or messages.

## Opportunity types

Use a typed discriminator rather than one ambiguous "job" record:

- job: an employer or organization is recruiting for a defined role.
- service: a provider offers a skill or service (design, tutoring, repairs, writing, photography, development, etc.).
- task: a buyer needs a specific task completed.
- collaboration: a person or team is seeking a co-founder, project partner, contributor or creative partner.
- internship: a structured work-learning placement.
- volunteer: unpaid community or cause-based work.
- resource: a person offers access to a resource, equipment or space, subject to lawful ownership and platform policy.

Each listing must clearly disclose whether it is paid, unpaid, negotiable or a barter arrangement. Never infer compensation from the category.

## Connect navigation

Keep existing people tabs (Discover, Requests, Sent, Connections, Following, Followers). Add a clearly visible Opportunities entry with sub-filters:

- For you
- Jobs
- Services
- Tasks
- Collaborations
- Internships
- My listings
- My applications / interests
- My deals

Provide a prominent "Post an opportunity" action. Do not bury opportunity listings inside the people directory or replace people discovery.

## Profile integration

A member profile can optionally show:
- What I do / professional headline
- Skills and experience
- Services I offer
- Work or project portfolio links/media
- Availability and preferred engagement mode
- Opportunity listings
- Reviews from verified completed engagements (only after a trustworthy completion signal)

Profile owners control visibility and can pause or remove their listings. Do not expose private contact details by default.

## Listing fields

Required:
- immutable ID and owner user ID from authenticated server context
- type, title, plain-language description
- category and skills/tags
- status: draft, published, paused, closed, expired or removed
- compensation mode: paid, unpaid, negotiable or barter
- location mode: remote, onsite, hybrid or not applicable; optional coarse location
- created/updated timestamps and expiry
- visibility/audience
- contact/application method

Conditional fields:
- price or budget with currency and whether fixed/range/hourly/per-task
- job location, employment type, schedule, eligibility and application deadline
- service scope, deliverables, turnaround estimate and revision terms
- task requirements, deadline and acceptance criteria
- collaboration role, expected contribution, ownership/equity terms (must be explicit and never implied)
- internship duration, learning objectives and whether paid
- resource availability and usage conditions

Validate currency, dates, text lengths, links, and type-specific required fields on the server. Do not accept a client-supplied owner ID.

## Deal lifecycle

Keep the lifecycle explicit and auditable:

1. interested: a user sends an inquiry or application; no commitment is implied.
2. conversation: the parties discuss scope, fit, price and terms in Chat.
3. proposed: one party sends a structured deal proposal.
4. revision requested: the other party asks for changes.
5. accepted: both parties explicitly confirm the same immutable proposal version.
6. in progress: work starts, based on the agreed start condition.
7. submitted: provider submits deliverables or reports completion.
8. completion confirmed: the other party confirms receipt/acceptance.
9. completed: both sides have confirmed completion, or an approved dispute process resolves it.
10. cancelled, declined, expired or disputed: terminal/exception states with reason, actor and timestamp.

An "Accept deal" action must show the full final scope, deliverables, amount/currency or unpaid status, deadlines, cancellation terms and any milestones. Require explicit confirmation. Store an immutable proposal version and acceptance records for both parties. Never silently change terms after acceptance.

For simple no-payment collaborations, allow parties to agree on scope and milestones without claiming the platform guarantees outcomes. For paid deals, payment collection, release, refunds and escrow-like holding must use a properly approved payment provider and comply with applicable laws. Do not hold customer funds in an ordinary UNIBUD balance or imply escrow exists before it is implemented and approved.

## Applications and inquiries

- A listing owner can review, shortlist, message, accept or decline an application.
- Applicants can withdraw before acceptance.
- Prevent duplicate active applications per user/listing unless the owner explicitly permits reapplication.
- Keep private application answers visible only to the applicant and authorized listing owner/reviewers.
- Show clear status and timestamp to both parties.
- Never expose one applicant's private application to another applicant.

## Trust, safety and fraud controls

- Authenticated ownership and server-side authorization on every read/write.
- Report listing, report user, block user, mute and hide.
- Blocked users cannot contact each other or see each other's restricted listings.
- Rate-limit publishing, inquiries, proposals and repeated edits.
- Detect duplicate/spam listings, suspicious off-platform payment requests, impersonation and prohibited goods/services.
- Warn users against advance-fee scams, fake checks, requests for account credentials, identity documents in chat, and pressure to pay outside approved flows.
- No guaranteed job, earnings, identity or service quality claims.
- Verification badges must state what was verified (for example, university email, identity, organization) and must not imply a blanket guarantee.
- Reviews only from eligible, completed engagements; prevent self-review, duplicate review and retaliation abuse. Provide reporting and moderation appeals.
- Age, labor, employment, consumer, privacy and marketplace restrictions must be applied for the user's jurisdiction and listing type.

## Data model (logical)

- opportunity_listings: listing content, owner, type, status, visibility, compensation, location, expiry.
- opportunity_applications: listing, applicant, message, private answers, status and timestamps.
- opportunity_conversations: link to the canonical Chat conversation; no duplicate messaging subsystem.
- deal_proposals: parties, listing/application references, immutable version, scope, amount/currency, milestones, terms, expiry.
- deal_acceptances: proposal version, accepting user, accepted timestamp and server-recorded audit metadata.
- deal_events: append-only lifecycle history with actor, event, reason and timestamp.
- deal_reviews: eligible post-completion reviews with moderation state.
- opportunity_reports: reports and moderation decisions.
- user_blocks: canonical block relationships shared across Connect, Chat and opportunities.

Use database constraints for valid states, uniqueness and referential integrity. Index published listings by status/type/category/created time and use safe search indexing for title, description and skills. Add pagination/cursors; do not load the entire directory.

## Permissions

- Public/campus/connections visibility must be enforced on the server, not just hidden in the UI.
- Only owners can edit, pause, close or delete their listings (moderation roles can act with an audit trail).
- Only authorized listing owners can review applications.
- Only deal participants can read deal details and events.
- Only the authenticated participant can record their own acceptance.
- Server verifies both parties and the exact proposal version before transitioning to accepted.
- Prevent a user from accepting their own listing or creating a deal with themselves.

## User experience

Listing cards should show title, type, concise summary, owner/profile link, verification context, location mode, compensation mode and freshness. Avoid fake ratings, fake availability and fabricated activity.

Detail pages show the complete scope and terms, owner profile, safety actions and one primary action appropriate to the listing:
- Jobs/internships: Apply
- Services: Contact provider / Request service
- Tasks: Offer to do this
- Collaboration: Express interest

After an inquiry, continue in the existing Chat surface. Deal proposals and state changes should be structured system events in that conversation, with notifications that deep-link to the exact listing/deal.

Design for mobile first, accessible controls, loading/error/empty states, clear currency and timezone display, and resumable drafts.

## Delivery sequence and release gates

1. Inspect the canonical unibud-app data/auth architecture and the current unibud-live Connect/Chat surfaces before choosing migrations or APIs.
2. Define shared listing/deal types and validation schemas; agree the contract before UI work.
3. Implement authenticated server APIs and migrations with ownership/visibility constraints.
4. Build listing creation/editing, discovery, filters and profile integration.
5. Build applications and route all communication through canonical Chat.
6. Build proposal versioning, dual acceptance, audit events and cancellation/dispute paths.
7. Integrate notifications, blocking, reports, moderation and verified identity signals.
8. Add payment-provider integration only after provider, jurisdiction and compliance approval; otherwise keep paid deal settlement external and clearly disclosed.
9. Add tests for authorization, race conditions, duplicate requests, blocked users, visibility leaks, proposal version mismatch, double acceptance, expiry, cancellation and dispute transitions.
10. Run typecheck, lint, unit/integration tests and production build; perform mobile and desktop browser QA.

Release only when cross-account tests prove that two distinct authenticated users can discover a real listing, inquire, negotiate, accept the same proposal version, and see consistent deal state. Local browser persistence is not a substitute for this gate.


## Compact everyday services, local commerce and campus food

Connect must support informal, short-lived, everyday offers in addition to formal employment. Do not force every post into a conventional job application. Model intent and transaction type explicitly:

- Remote/digital work: design, writing, coding, tutoring, editing and admin support.
- Local/domestic services: cleaning, laundry, repairs, errands, cooking and other permitted services.
- Delivery and collection: pickup/drop-off, courier tasks, campus deliveries and goods handoff.
- Goods and food: prepared meals, snacks, groceries and permitted household goods.
- Campus vendors and cafeterias: daily menus, limited batches, pre-orders, collection windows and delivery.
- Concierge requests: help arranging an eligible service, purchase, booking or delivery.
- Formal work: jobs, internships, freelance contracts, projects and collaborations.

A listing may be one-time, scheduled, recurring, time-limited or stock/batch-based. Capture fulfillment mode (remote/digital, pickup, delivery, onsite, scheduled) separately from category.

### Fast, lightweight posting

The common mobile path should be short: choose what is being posted, add a short description, optionally add a photo, set price or mark free/negotiable, choose pickup/delivery/remote, set availability or quantity, and publish. Ask for extra details only when required by the selected type. Save drafts; let owners edit, pause, resume, mark sold out, close or delete. Do not make casual food posts complete a long job form. Use progressive disclosure and type-specific fields.

### Time-limited food and vendor offers

Support posts such as: "Good afternoon — jollof rice and chicken available this afternoon. Send orders." A cafeteria, independent cook or vendor can publish today's menu or a limited batch, specify price, portions remaining, order cutoff, ready time, collection point or delivery area, and ordering method.

The owner must be able to turn ordering on/off instantly, pause new orders while preparing, update quantity without overselling, mark sold out/unavailable/finished for today, set automatic expiry/close time, and reopen with a new batch or next-day offer.

Customers can view the offer, ask a question, place an order, choose pickup or delivery where offered, see confirmation and receive status updates. Reserve/decrement stock safely on the server to prevent concurrent orders from overselling the last portion. Never show an item as available after it is sold out or its service window has ended.

Order states are distinct from job/deal states: draft, submitted, confirmed, preparing, ready for pickup, out for delivery, fulfilled, cancelled, refunded (only with approved payment/refund integration), rejected and expired. Show who must act next. Vendors can reject before confirmation with a reason; after confirmation apply a clear cancellation/refund policy.

For food, collect only operationally necessary details such as item/options, quantity, pickup/delivery choice, delivery instructions and contact through UNIBUD Chat or an approved contact flow. Display allergen/ingredient information when supplied, but do not invent safety claims. Apply local food-business, hygiene, consumer, tax and delivery requirements. Do not imply UNIBUD inspected a kitchen unless it actually has.

### Concierge participation

Concierge is a permission-scoped service workflow, not a fake person or an agent with unlimited authority. A user may ask Concierge to find eligible offers, compare options, contact a provider with permission, coordinate pickup/delivery or track a request.

- Require confirmation before placing an order, accepting a quote, committing money, changing an address, sharing personal information or confirming a deal.
- Show the exact vendor, item/service, quantity, price, fees, delivery/pickup details and terms before confirmation.
- Never claim a booking, purchase, order, payment or delivery is complete until confirmed by the provider/system.
- Escalate exceptions, safety issues, disputes and actions requiring a human operator or regulated partner.
- Keep an auditable record of user authorization; do not expose private vendor/customer data to unrelated parties.

### Orders, deals and payments are related but separate

Use a lightweight order workflow for food and goods, a service/task workflow for on-demand work, and the versioned deal lifecycle above for negotiated work or contracts. Link them to the same canonical Chat thread and notification system without conflating their states. Display total price, currency, delivery fee, taxes where known, payment method and refund/cancellation terms transparently. Payment processing, custody, escrow, payouts and refunds remain disabled until an approved provider integration and jurisdictional controls are in place. Never invent payment success.

### Compact Connect experience

Keep people discovery intact. Add a compact Opportunities entry and concise filters such as For you, Work, Services, Food & goods, Deliveries and Requests. Use compact cards and inline status chips. Put Post in a prominent but space-efficient action. Avoid a permanent row of many tabs or a separate screen for every category.

A listing card should quickly answer: what is available, who offers it, where/how it is fulfilled, price/compensation, availability/stock and the next action. Expired, paused, sold-out and closed listings must be visibly unavailable and excluded from active discovery by default.

## Mini-app ecosystem inside Connect

Connect is the discovery and relationship host. SoulLync and WAYWARD are integrated experiences accessible from within Connect, with their own clear purpose and identity; do not flatten them into generic job categories or duplicate their existing capabilities.

- SoulLync: integrated dating/relationship discovery. Respect its own matching, consent, age eligibility, privacy and safety rules. Dating intent and profile data must never be exposed as job/service listings or used for employment recommendations.
- WAYWARD: integrated events, culture, community and peer marketplace/discovery. Relevant events and peer opportunities can be surfaced in Connect where the user has permission, while its own experience remains accessible.
- Shared identity, profile, Chat, notifications, blocking and reporting should be reused where appropriate. Each mini-app must preserve its own consent, visibility, data boundaries and moderation policies.

Do not make SoulLync or WAYWARD decorative tiles. Their entry points must route to actual functioning surfaces. If a surface is not connected, show an honest unavailable/coming-soon state rather than simulating it.

## Additional quality and release tests

- A food/vendor owner can publish a limited batch, accept orders, prevent overselling under concurrent requests, pause ordering and mark sold out; the item disappears from active availability.
- A customer can place an order and see accurate confirmation and fulfillment states across two authenticated accounts.
- Pickup and delivery instructions are visible only to the parties and authorized fulfillment/concierge roles.
- Remote-work listings do not require physical addresses; delivery listings collect only the location details needed for fulfillment and only after the user chooses that flow.
- Concierge cannot commit a purchase, order, booking, payment or deal without explicit user authorization.
- SoulLync dating data is excluded from employment/service matching; WAYWARD routes to its real surface.
- All listing and order actions respect blocks, privacy, moderation, jurisdictional eligibility and audit requirements.
