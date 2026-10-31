# UNIBUD Social Live & Podcasts

Status: product and engineering specification. Social media for entertainment, learning and general-interest discovery.

## Product boundary

This is a social-media experience for general audiences and interests. Podcasts explicitly include both education and entertainment: explainers, science, technology, history, languages, business, career insights, personal growth, interviews and expert conversations sit alongside comedy, culture, music, lifestyle, relationships, gaming and stories. Educational podcasts are welcome in the main podcast discovery experience. Formal course delivery, class spaces, attendance, assignments and academic progress tracking remain separate UNIBUD education features; do not turn the podcast feed into a course-management system.

The social context belongs to Square and includes Live, Podcasts, Stories, Watch, Events and Discovery. Live and Podcasts are contextual destinations, not new permanent primary-navigation tabs.

## Information architecture

One social destination with two distinct top-level modes:

- **Live** — broadcasts, spontaneous rooms, random matching and live conversations.
- **Podcasts** — creator shows, recorded episodes, playlists, follows and listening history.

Keep the two modes visually related but do not collapse their content models or playback states.

## Live experiences

1. Public video broadcasts.
2. Public audio-only rooms.
3. Text-first live rooms for users who do not want camera or microphone access.
4. Random one-to-one matching, with explicit opt-in, skip/leave controls, block/report, and no automatic camera or microphone activation before consent.
5. Guest requests and host approval; hosts can remove/mute guests and moderate chat.
6. Audience chat, reactions, follows, sharing and creator notifications.
7. Live podcast sessions with scheduled or spontaneous guests and audience participation.

Random matching must never expose private profile fields, precise location, contact details or account identifiers. Matching must apply block lists in both directions and age/safety eligibility before pairing. Provide immediate leave, next/skip, report and block controls. Do not reveal a user's exact location.

## Podcast experiences

- Discover shows and episodes by topic, creator, language, format and intent, including education/learning and entertainment.
- Education categories include science, technology, history, languages, business, career insights, personal development and explainers.
- Creator pages, show descriptions, episode artwork, transcripts/captions when available, follow, save, playlists, playback progress and share.
- Publishing workflow for show metadata, episode media, artwork, visibility and moderation status.
- Live podcast sessions can link to a live room, but remain distinct from recorded episodes.
- Never label a demo toggle as actual audio playback. A playable episode needs a real media asset and functioning player.

## Creator and audience safety

- Authenticated creator identity and clear host/guest/audience roles.
- Reporting, blocking, mute, moderation queue, rate limits and repeat-abuse controls.
- Consent before camera/microphone capture and before inviting a guest on air.
- Visible recording/live indicators and clear notice when a session is recorded.
- Copyright and rights declaration for uploaded audio/video; takedown workflow.
- Privacy settings for public, followers-only and private/unlisted sessions where supported.
- Age-appropriate discovery and matching; never pair users who are ineligible under the platform's safety policy.
- No monetization, paid access, tips or purchases until payment, refund, fraud and regulatory controls are implemented and tested.

## Engineering truth and dependencies

The existing `/live` route is a mock broadcast and the existing `/podcasts` route is an educational podcast demo. The Studio LiveDesk captures local camera/microphone and maintains local client state; that alone does not provide multi-user streaming. Do not present these as production social streaming or podcast playback.

Before enabling real multi-user sessions, implement and verify:
- A real-time media provider or WebRTC SFU with authenticated short-lived room tokens.
- Server-authorized room creation/join/leave, host/guest permissions and participant presence.
- Signaling, reconnect handling, network adaptation, TURN fallback and device permission failure states.
- Server-backed chat/reactions with moderation and rate limiting.
- Recording/storage/transcoding pipeline only if recording is enabled, with explicit consent and retention/deletion rules.
- Media upload validation, storage access controls, playback delivery and content moderation.
- Durable show/episode/creator/follow/save/playback models and APIs.
- Observability for connection quality, failed joins, abuse reports and media processing.

## Acceptance criteria

- Live, random matching and Podcasts are social-only surfaces.
- A user can decline camera/mic access and still use text rooms or browse podcasts.
- No random match starts without explicit opt-in; users can leave or skip immediately.
- Blocked users are never paired or shown to each other in matching results.
- Host controls and moderation actions are server-authorized.
- Real live sessions show real participant counts; no fabricated viewers or chat.
- Podcast playback only appears for episodes with valid playable media.
- Educational and entertainment podcasts can appear together in the social podcast experience, with clear topic labels and user-controlled discovery filters.
- Formal academic course tools remain separate from podcast listening and publishing.
- No feature is marked live/available until its provider, backend, safety and end-to-end tests pass.
