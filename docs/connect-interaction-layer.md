# UNIBUD OS Connect: Real-time Interaction Layer

## Product definition

Connect is the real-time interaction layer of UNIBUD OS, not merely a messaging app. It is the unified place where conversations, collaboration, presence, broadcasts, meetings, classes, streams, audio and shared experiences happen. A user should not need to understand which backend module owns a capability before finding or joining an interaction.

The interface remains visually coherent while content and actions adapt to context. Connect does not replace Square, Bud, Board, Quad, SouLync, Wayward or Guild. It unifies authorized real-time interaction surfaces and routes users into the correct underlying experience.

## Context modes

- **Square context:** prioritize social conversations, creators, communities, live entertainment, music, podcasts, events and friendships.
- **Campus context:** prioritize academic collaboration, lecturers, classmates, research groups, departments, course discussions, office hours and live learning.
- Context changes ranking and scoped actions, not identity or authorization. Community membership does not automatically grant course enrollment or teaching-group access.

## Capability map

### Communication
- Direct and group messages
- Community, department, course, faculty, research and student-union conversations
- Announcements with publisher identity, audience scope and delivery state

### Calling and shared rooms
- Voice, video and group calls
- Audio rooms and voice notes
- Office hours and live study sessions
- Virtual classrooms
- Screen sharing and collaborative whiteboards

### Live experiences
- Live lectures, podcasts and creator streams
- Campus events, conferences, workshops and club broadcasts
- Sports streams and research presentations
- Clear scheduled/live/ended/recording/available states. Never fabricate live indicators.

### Audio
- Music listening, shared playlists and campus radio
- Podcasts and recorded lectures
- Audio spaces and voice notes
- Respect provider and content-rights rules; do not scrape private content or present unavailable media as playable.

### Collaboration
- Shared notes and documents
- Assignments, research papers and tasks
- Polls, calendars and meeting notes
- Project boards
- Every shared artifact needs an authoritative owner, membership scope, revision history and permissions.

### Presence
Support privacy-aware states such as online, studying, in a lecture, available, busy, listening to music, live now, in a call, streaming and presenting. Presence must be consent-aware, controllable, expire when stale and avoid leaking sensitive activity to unauthorized viewers.

### Bud assistance
Where authorized and requested, Bud can summarize conversations, translate messages, schedule meetings, draft meeting notes, recommend communities, find collaborators, organize files, generate action items, search conversations and surface important updates. AI results must be clearly identified, scoped to accessible data and reviewable before sending or publishing. Never use private conversations for staff analytics.

## Architecture and boundaries

- Connect is the interaction layer, not a replacement implementation for every domain.
- Reuse shared conversation, identity, notification, media and permission foundations. Domain modules supply scoped metadata and policies.
- Board remains the academic classroom and teaching authority; Spark Calendar remains inside Board. Connect can launch or join sessions but cannot grant class membership or teaching rights.
- Square owns the social feed, stories/status and Drop creation. Connect hosts associated social conversations and live interactions.
- Quad owns persistent interest-group membership and policies; Connect hosts authorized group conversations and events.
- SouLync remains separate romantic discovery with dedicated consent, privacy and safety controls.
- Wayward remains separate youth culture discovery. Connect can host authorized public broadcasts or event discussions without private scraping.
- Guild remains the umbrella for Quarter, Concierge and Board, not an AI agent.
- Fixer remains personal support and consent-based referrals, separate from Orbit and general calling features.

## Implementation sequence

1. Inventory current conversations, media assets, room messages, audio objects/events, live sessions, Board and Spark Calendar. Classify each as durable, authorized, provider-backed, demo-only or missing.
2. Define shared interaction primitives: conversation/room types, membership and roles, delivery state, presence expiry/visibility, media/session references, notification events, block/report hooks and audit events.
3. Enforce identity and resource-level permissions on every read/write. Distinguish community membership, course enrollment, teaching-group membership and live-session attendance.
4. Complete messaging reliability: persisted history, attachments, retries/idempotency, pagination, unread state, blocking/reporting and notification deep links.
5. Integrate real call/audio/live providers only after approved credentials and privacy/security review. Do not simulate successful calls or streams. Show honest unavailable states when a provider is absent.
6. Add durable collaboration tools with shared permissions and revision history. Calendar actions use the Board/Spark Calendar authority.
7. Add permission-aware Bud summaries, search, action items, translation and scheduling. Require user confirmation before external sends, bookings or publishing.
8. Build one consistent, accessible, mobile-first Connect shell with Square and Campus context modes.
9. Test cross-user and cross-role access, unauthorized IDs, membership changes, blocked users, stale presence, call join/leave/failure, upload failure, retries/duplicates, notifications, privacy preferences, mobile and low-bandwidth conditions.

## Acceptance criteria

- Users can enter Connect from Square or Campus and see the correct context in one coherent interaction model.
- Direct, group, community and academic interactions share infrastructure while enforcing distinct resource permissions.
- Call, live and stream controls reflect real session/provider state. Missing integrations are unavailable, never faked.
- Shared artifacts persist and enforce scope, revision history and deletion/correction rules.
- Presence is controllable, expires when stale and is hidden from disallowed audiences.
- Bud reads only conversations/files the user may access and never sends or publishes generated actions without required confirmation.
- Critical flows have automated tests for success, unauthorized access, retries, duplicates, concurrency and recovery.
- No production release until build, full lint, integration tests, browser/mobile smoke tests and deployment/auth/database verification pass.

## Current known baseline

The repository includes conversation/message tables, media assets, room messages, audio objects/events, Board routes and Spark-related code. These are useful foundations, not proof that calls, group calls, screen sharing, whiteboards, real live streaming, unified presence or collaborative documents already work. Trace each capability to durable server behavior and real integration status before marking it verified.
