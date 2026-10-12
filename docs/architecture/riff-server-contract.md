# Riff server contract

Status: implementation contract proposal for PR #11. This document does not add runtime endpoints, create database tables, or make Riff production-ready.

## Goal

Replace the Riff UI's device-local Zustand state with authenticated, database-backed posts and replies. Preserve the honest local-only UI in PR #9 until the server implementation, migration, and multi-account tests have landed and passed.

Follow the existing social server patterns in `src/lib/social/server.ts`, the repository's migration numbering, the canonical session identity, and existing media access checks. Do not create a parallel authentication system.

## Security invariants

1. Every Riff operation requires a valid authenticated session. Guests cannot create, reply, react, follow, report, or delete Riff content. Do not treat Bud-only guest access as permission to write to Riff.
2. The acting user ID comes only from the verified session on the server. Never accept `author_user_id`, `user_id`, or another identity field from a client payload as authority.
3. Every mutation checks ownership or the relevant relationship inside the server boundary. A user may soft-delete only their own post or reply.
4. Validate every referenced media item against the authenticated user's permitted ownership/attachment rules before attaching it to a post or reply. Do not accept arbitrary storage URLs or client-provided ownership.
5. Use parameterized SQL and transactions for multi-row mutations. Enforce uniqueness in the database, not only in UI code.
6. Do not return private storage keys, session material, internal moderation notes, or report-submitter identity to ordinary feed readers.
7. Report and soft-delete actions must be auditable. Soft-deleted content is excluded from normal feed/thread results while report records remain available to authorized moderation workflows.

## Proposed migration: `migrations/0027_riff.sql`

Use the existing canonical user ID representation and the repository's existing foreign-key conventions. Confirm exact user/media table names against the current schema during implementation; do not invent a second user table.

### `riff_posts`

- `id`: stable primary key.
- `author_user_id`: required canonical user ID.
- `body`: required text; trimmed content must not be empty and must be at most 10,000 characters.
- `community_id`: optional community reference, only when the existing community relationship can be validated.
- `quote_post_id`: optional self-reference to a quoted Riff post.
- `created_at`, `updated_at`: server-generated timestamps.
- `deleted_at`: nullable soft-delete timestamp.

Indexes: feed pagination by `created_at DESC, id DESC`; author history by `author_user_id, created_at DESC`; optional community feed by `community_id, created_at DESC, id DESC`.

### `riff_replies`

- `id`: stable primary key.
- `post_id`: required parent post reference.
- `parent_reply_id`: nullable reply reference for nested replies; must belong to the same post.
- `author_user_id`: required canonical user ID.
- `body`: required, trimmed, non-empty text with a 10,000-character maximum.
- `created_at`, `updated_at`, `deleted_at`: server-managed timestamps.

Index thread retrieval by `post_id, created_at DESC, id DESC`. Reply pages must be newest-first, with `id DESC` as a stable tie-breaker. Deleted replies are omitted from normal thread results.

### `riff_reactions`

- `post_id`, `user_id`, `created_at`.
- Primary key `(post_id, user_id)`, preventing duplicate likes.
- A toggle must insert or delete atomically and return the resulting state and authoritative count.

### `riff_follows`

- `post_id`, `user_id`, `created_at`.
- Primary key `(post_id, user_id)`, preventing duplicate follows.
- A toggle must be atomic and return the resulting state. This is a follow of a Riff conversation/post, not a replacement for the existing account-to-account social follow relation.

### `riff_reports`

- `id`, `reporter_user_id`, nullable `post_id`, nullable `reply_id`, `reason`, optional `details`, `created_at`, `status`.
- Exactly one of `post_id` or `reply_id` must be set.
- Validate that the target exists and is not already deleted when the report is submitted.
- Restrict report details and rate-limit submissions. Ordinary feed APIs must not expose reporter identity.

If the repository's existing identifier or moderation conventions differ, adapt the migration to those conventions before merging. Do not apply this migration to production from this contract document.

## Server module: `src/lib/riff/server.ts`

All functions use the existing server-only auth/session boundary and database helpers. Suggested public contract:

- `listRiffs(input)`: authenticated, cursor-paginated feed; excludes soft-deleted posts; deterministic newest-first order.
- `getRiff(input)`: authenticated post and reply view; replies sorted newest-first; deleted content omitted.
- `createRiff(input)`: validates body, community/quote references, and media ownership; derives author from session; returns persisted post.
- `replyToRiff(input)`: validates post and optional parent reply belong together; derives author from session; returns persisted reply.
- `toggleRiffLike(input)`: atomic per-user reaction toggle; returns `liked` and authoritative count.
- `toggleRiffFollow(input)`: atomic per-user conversation-follow toggle; returns `following`.
- `reportRiff(input)`: validates target and reason; records an auditable report without disclosing reporter details.
- `softDeleteRiffPost(input)` and `softDeleteRiffReply(input)`: only the session owner may delete; set `deleted_at` rather than hard-deleting content.

Input payloads must contain resource IDs and content only, never trusted author/user IDs. Return explicit typed results; avoid silently returning sample or in-memory data when database access fails.

## Error and pagination behavior

- Unauthenticated: use the repository's established unauthorized response/error.
- Missing or inaccessible resource: use the established not-found behavior; do not leak another user's private media metadata.
- Invalid content or mismatched parent/media references: validation error.
- Duplicate reaction/follow races: resolve through unique constraints and transaction-safe operations.
- Database failure: surface a real error to the caller and log safe diagnostic context; never report success with an unsaved local fallback.
- Pagination: opaque cursor based on stable sort keys; reject malformed cursors and cap page size.

## Frontend migration

Keep PR #9's local-only disclosure until the server functions are implemented and tested. Then replace the Riff composer, feed, thread replies, reactions, and follows with server-backed calls. Remove local persistence as the source of truth for shared Riff content; do not silently merge stale local drafts into other users' feeds.

## Required tests before Riff can be called working

1. Anonymous user cannot read or mutate endpoints contrary to the chosen authenticated-read policy; all writes require a session.
2. Account A creates a post; account B can see it from a fresh session/device and cannot impersonate A.
3. Account B replies; both accounts see the same persisted reply, newest first.
4. Likes and follows are unique per user and correct under repeated/concurrent toggles.
5. A cannot delete B's post/reply; deleted content disappears from normal feed/thread results.
6. A cannot attach B's private media or an arbitrary URL.
7. Reports persist, are rate-limited, and do not expose reporter identity to feed readers.
8. Database errors never produce false success or switch silently to local-only shared content.
9. Migration applies on a clean test database and against a representative existing database.
10. Netlify build, TypeScript, auth-policy, media, and relevant social/Riff tests pass.

## Scope boundary

This PR is the contract/specification only. The migration, server module, API routes or server actions, frontend wiring, and tests are separate implementation work and must be verified before merge. PR #9 remains an honesty patch, not a claim that Riff's shared backend works.
