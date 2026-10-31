# UNIBUD — Next-Generation Social Platform Blueprint

Status: product architecture and delivery contract
Last reviewed: 2026-10-31
Scope: UNIBUD social experience and shared platform capabilities

## Product ambition

UNIBUD is not a feature-for-feature clone of an existing social network. It is a trusted, intelligent social operating layer for students and wider communities: discover people and ideas, form relationships, create spaces, collaborate, learn, publish, host live experiences and exchange value in one coherent product.

"More advanced" means better outcomes, reliable capabilities, user control and explainable intelligence—not more notifications, addictive loops or decorative AI.

## Product invariants

1. One coherent product and design system. Preserve primary navigation: Square, Connect, Communities, Chat. Other destinations remain contextual or in the side menu.
2. Bud is the only visible conversational AI. Spark coordinates internal capabilities; Oracle remains the knowledge/intelligence core.
3. Never fabricate activity, users, views, trends, matches, messages, AI actions, playback, provider connections or marketplace inventory.
4. Every private operation is authorized server-side. Hiding a control in the client is not authorization.
5. Privacy, consent, accessibility, safety and user agency are core features.
6. Optimize for useful connections, collaboration, learning and creator outcomes—not time spent as the primary metric.
7. Payments, tips, paid access, lending or stored value remain disabled until provider, legal, fraud, refund, security and operational controls are approved and tested.

## Freshness, evidence and non-obsolescence policy

UNIBUD must not present stale facts as current facts.

- Time-sensitive content (events, schedules, availability, prices, policies, institution details, opportunities, news and platform status) must carry a source, last-checked timestamp and, where possible, a valid-through/expiry time.
- When a source has no reliable update timestamp, label the information "date unverified" and avoid presenting it as current.
- Refresh volatile data at a cadence appropriate to its change rate. Expired or failed refreshes must produce a visible "last updated" or "currently unavailable" state—not silently reuse stale data.
- For AI answers, summaries and recommendations, distinguish verified source facts, user-provided context, inference and generated suggestions. Link or cite source material where available.
- Show why a recommendation appears, the key factors used and controls to correct it. Never invent a reason or confidence score.
- Resolve conflicting sources by preferring authoritative primary sources, then more recent sources, and show the conflict when it materially affects a decision.
- Keep an audit trail for source changes, moderation decisions and consequential automated actions.
- Provide "report outdated information" and correction workflows for profiles, institutions, communities, listings and public resources.
- Do not claim the system is "real-time" unless the integration actually provides real-time updates and freshness monitoring.
- Keep standards and dependencies current through scheduled maintenance: security advisories, framework/runtime support windows, provider API changes, accessibility standards and applicable privacy/regulatory obligations. Pin versions, review upgrade notes and test before upgrading.
- Every major product or technical decision in the architecture register must include: decision, reason, alternatives considered, risks, owner, review date and conditions that trigger reconsideration.

Reason: users make decisions from UNIBUD. An old event, incorrect campus policy, expired opportunity or stale safety instruction can cause real harm. Freshness must therefore be an explicit product capability, not an assumption.

## 1. Square — context-aware social home

Square unifies:
- Following feed for people, communities and topics the user follows.
- Discovery feed for new voices, useful posts, events and communities, with "why am I seeing this?" explanations.
- Campus/community updates only for a context the user selected or verified; never expose precise location by inference.
- Text, images, short/long video, audio, polls and shared resources.
- Stories, Watch, Live, Podcasts, Events and Discovery as contextual destinations—not permanent extra navigation tabs.
- Saved collections and a personal read/listen/watch-later queue.

Offer chronological and relevance-based modes, topic controls, hide/mute, negative feedback, frequency controls and a reset option. Do not use sensitive attributes or private messages as undisclosed ranking inputs.

## 2. Identity and relationships

Profiles support user-controlled identity, biography, interests, skills, goals, languages and creator/organization context. Verification must state exactly what was checked, by which process, and when; it must be revocable and never imply general trustworthiness.

Follow, connect, subscribe-to-updates and invite are distinct actions. Provide visibility controls, audience previews, block, restrict, mute, report, export and deletion workflows. Do not invent a universal trust score or equate popularity with safety.

## 3. Connect — intentional discovery

Help users find collaborators, study partners, mentors, teammates, creators, campus peers and communities. Filters can include skills, interests, goals, languages and opted-in campus context. Explain match reasons without presenting compatibility as fact. Apply blocks in both directions, rate-limit invitations and require consent before contact where settings require it.

Random matching is explicit opt-in only, with immediate skip/leave/report/block, no automatic camera/microphone activation and no precise-location disclosure.

## 4. Communities — spaces that do work

Support public, discoverable, private and invite-only communities; roles (owner/admin/moderator/member/guest); topics; announcements; discussion channels; events; shared resources; projects; join requests; invitations; moderation queues; audit history and appeals.

Enforce membership, role and visibility checks server-side on every read and write. A room or community ID alone never grants access.

## 5. Chat — useful communication

Support direct/group conversations, replies, reactions, edits/deletes with clear state, attachments, safe link previews, access-scoped search, message requests, spam quarantine, block/restrict/report, group roles and invitation controls.

Presence and read receipts must respect user settings. Disappearing messages must explain limitations. Do not claim end-to-end encryption until key management, multi-device behavior, recovery, reporting trade-offs and independent security review are implemented.

## 6. Creation studio

A unified composer supports text, images, video, audio, polls, documents and events, with drafts, autosave, preview, audience selection, scheduling, alt text, captions, content warnings, rights declaration, moderation and clear upload/processing/retry/deletion states.

Never show media as published or playable until durable storage, processing and delivery succeed.

## 7. Live

Support public video, audio-only and text-first rooms, approved guests, audience chat/reactions, scheduled sessions and explicit random matching.

Production requirements: real WebRTC SFU or trusted provider; authenticated short-lived room tokens; server-authorized room lifecycle; signaling; TURN fallback; reconnect/network adaptation; host/moderator controls; rate limits; visible recording indicators; consent; retention/deletion rules; accurate participant counts and operational monitoring.

Local camera capture is not a broadcast. Mock rooms must be labelled previews.

## 8. Podcasts

One social discovery experience for educational and entertainment podcasts. Support creators, shows, episodes, topics, language, transcripts/captions where available, follows, playlists, playback progress and publishing moderation. Formal courses, assignments, attendance and academic progress remain in education features.

Playback requires an authorized playable asset. Publishing requires durable storage, validation, processing, rights declarations, takedown and moderation.

## 9. Events and collaboration

Events are shareable objects across Square, Communities and Chat. Include RSVP/capacity/waitlist, organizer roles, reminders, online/in-person/hybrid formats, time-zone-correct scheduling, calendar export and post-event resources. Protect attendee lists and exact venues according to organizer visibility.

Collaboration spaces support tasks, owners, due dates, files and activity history.

## 10. Marketplace and opportunities

Support structured listings for services, goods, projects and opportunities; categories; search; saved items; seller profiles; listing status; messaging; reporting; provenance and fraud review. Do not offer payments, escrow, lending or credit decisions until required regulated-provider, compliance, fraud, dispute, refund and security systems are approved and tested.

## 11. Bud — contextual intelligence

Bud can summarize accessible threads, community discussions and event details; turn discussions into draft plans/events/checklists/projects; help discover people/resources with reasons; draft posts/replies; translate and simplify; and explain platform settings.

Use only context the user is authorized to access and has permitted. Keep approved memory separate from restricted private content. Ask confirmation before publishing, messaging, inviting, joining, deleting or other consequential actions. Show evidence for factual claims and distinguish fact from inference. Never fabricate completed actions or current external information.

## Performance and efficiency contract

Performance is a product feature. UNIBUD must remain responsive on ordinary mobile devices, constrained networks and growing datasets; it must not require flagship hardware or unlimited data.

### User-facing performance budgets

Treat these as release targets, measured on representative mid-range mobile devices and realistic network profiles. Record field measurements and revise budgets only with evidence.

- Initial usable screen: target Largest Contentful Paint (LCP) at or below 2.5 seconds at the 75th percentile.
- Interaction responsiveness: target Interaction to Next Paint (INP) at or below 200 ms at the 75th percentile.
- Layout stability: target Cumulative Layout Shift (CLS) at or below 0.1 at the 75th percentile.
- Core navigation and common actions should acknowledge input immediately, show meaningful loading states, and avoid blocking the main thread.
- Feed, search and conversation lists must paginate or use cursor-based incremental loading; never fetch an unbounded timeline.
- Images and video must use responsive sizes, modern formats where supported, lazy loading below the fold, and explicit upload/compression limits.
- Heavy destinations (video editor, Live, Studio, analytics) must be route/code-split so they do not inflate the initial Square bundle.
- Cache only data whose privacy and freshness rules permit it. Private data must never enter shared/public caches. Mutations must invalidate or reconcile affected cached views.
- Avoid duplicate requests, N+1 query patterns, repeated catalog seeding on hot paths, and expensive synchronous work during rendering.
- Database queries used by feeds, search, memberships and messaging must be explainable with query plans and supported by appropriate indexes. Add indexes from measured access patterns, not guesswork.
- Use bounded retries with backoff for transient failures; do not retry authorization, validation or other permanent failures.
- Use idempotency for retryable writes and prevent duplicate posts, messages, RSVPs and notifications after reconnects.
- Provide graceful low-bandwidth behavior: text-first fallbacks, user-controlled autoplay, deferred media, resumable uploads where supported and clear data-use controls.

### Measurement and release gates

- Track real-user LCP, INP, CLS, route latency, API p50/p95/p99, database query latency, error rate, media processing time and failed uploads.
- Establish budgets for JavaScript bundle size, feed payload size, API response size and database query count; publish measured baselines before tightening limits.
- Load-test feed reads, search, chat fan-out, notifications and media metadata with realistic concurrency and skewed popular content.
- Test slow 3G/4G, high latency, packet loss, offline transitions, low memory and interrupted uploads.
- Use performance traces and profiling to find bottlenecks before adding infrastructure. Prefer simpler systems until measurements justify complexity.
- Block release on severe regressions, unbounded queries, repeated main-thread stalls, broken pagination, or cache/privacy leaks.
- Report measured results and test conditions. Never claim a speed advantage over Instagram or another platform without a fair, reproducible comparison on equivalent devices, networks and workloads.

Reason: a feature that loads slowly, drains data, freezes a phone or fails on a weak connection is not a better feature. Efficiency must be measured in real user conditions, not inferred from code or design.

## Shared platform services

Build reusable services for:
- Identity, sessions, device management and scoped verification.
- Authorization policies for ownership, membership, roles, visibility and blocks.
- Trust/safety: reports, moderation, appeals, rate limits, spam/fraud signals and audit trails.
- Privacy: audience selection, consent, export, deletion, retention and notification preferences.
- Search/discovery with access checks before results are returned.
- Notifications with category controls, batching, quiet hours and anti-spam limits.
- Media: validation, durable private object storage, scanning, processing, authorized delivery and deletion.
- Real-time events: authenticated channels, opt-in presence, reconnect and idempotency.
- Observability: structured logs, traces, metrics, error budgets and privacy-safe diagnostics.
- Accessibility: keyboard navigation, screen-reader labels, captions, reduced motion and contrast.
- Localization: language, time zones and locale-aware formatting.

## Canonical data and authorization model

Define explicit schemas, foreign keys, uniqueness rules, indexes and deletion semantics for:
users; profiles; verification_claims; follows; connections; blocks; mutes; posts; post_assets; audiences; reactions; comments; saves; communities; memberships; roles; invitations; conversations; conversation_memberships; messages; attachments; rooms; room_participants; room_events; creator_profiles; podcast_shows; podcast_episodes; episode_assets; listening_progress; events; attendees; reports; moderation_cases; appeals; audit_events; notification_preferences; notifications; privacy_settings.

Use transactions for multi-row changes and idempotency keys for retryable mutations. Enforce access rules in server queries and mutations; do not return private fields from broad profile queries.

## Recommendation and AI guardrails

User controls override ranking. Offer chronological and personalized modes. Explain recommendation reasons and allow correction. Exclude blocked relationships before ranking. Do not infer sensitive traits or use private messages as undisclosed ranking data. Evaluate diversity, freshness, harmful-content prevalence, creator exposure and user satisfaction—not only clicks or watch time. Keep provenance for AI summaries and recommendations. Never create fake social proof.

## Security threat model

Test IDOR, unauthorized access after membership revocation/block, join/invite race conditions, spam/scraping/enumeration, malicious uploads/MIME spoofing/oversized media, XSS/CSRF/injection/SSRF, session/OAuth/token leakage, privilege escalation, moderation evasion, report brigading and privacy leakage through notifications/search/analytics/logs/AI context.

Every sensitive endpoint needs tests for unauthenticated, unauthorized, revoked, blocked and valid access.

## Delivery roadmap and release gates

### Gate 0 — reliability and security
Reproducible dependency installation; passing typecheck/lint/tests/build; production auth and database fail-closed configuration; authorization audit; durable media adapter; migrations and recovery procedure; observability.

### Gate 1 — complete core social loop
Profiles/privacy; Square publishing/feed/reactions/comments/saves/search; Connect; Communities with membership/roles/moderation; Chat with access controls and message requests; notification preferences.

### Gate 2 — creator and real-time experiences
Durable media; Live provider and room lifecycle; podcast publishing/playback; Events; creator analytics.

### Gate 3 — intelligence and collaboration
Consent-aware Bud; explainable recommendations; discussion-to-event/project workflows; accessibility, localization and data portability.

### Gate 4 — responsible expansion
Marketplace trust workflows; institution partnerships; payment integrations only after approval; independent security review; load testing; disaster recovery and regional compliance review.

A capability is production-ready only when it uses a real backend and durable data, enforces authorization, passes privacy/block tests, has loading/empty/error/retry states, meets accessibility requirements, has observability and abuse response, passes clean-install CI, and has accurate dependency documentation.

## Success measures

Measure meaningful connections, useful community participation, successful collaboration, creator publishing success, listener satisfaction, search relevance, report/appeal resolution, unauthorized-access test coverage, incidents, reliability and accessibility defects. Do not define success solely by daily active time, endless scrolling, notification volume or follower counts.

## Decision record template

For each significant architectural choice record:
- Decision and date.
- User/product problem it solves.
- Reason and evidence.
- Alternatives considered and why rejected.
- Security, privacy, accessibility and operational impact.
- Dependencies and known limitations.
- Owner and next review date.
- Events or new evidence that would trigger reconsideration.
