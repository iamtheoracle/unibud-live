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
