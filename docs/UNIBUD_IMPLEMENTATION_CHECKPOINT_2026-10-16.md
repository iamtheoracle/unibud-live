# UNIBUD Implementation Checkpoint — 2026-10-16

## Scope completed in this checkpoint

Branch: `fix/guest-riff-readonly-2026-10-16`
Starting source commit: `bd750f4931c3c2f3ac374d750415acfdb2d188eb`

### Changes committed
- `src/routes/_app/riff.tsx`
  - Guest users now see an explicit read-only notice and sign-in CTA instead of a composer.
  - Guest users no longer see client-side controls for liking, quoting, following, or reporting a Riff.
  - Reading a Riff thread and asking Bud remain available.
- `src/routes/_app/riff.$id.tsx`
  - Guest users no longer see follow or reply controls in a thread.
  - Authenticated users retain the existing interaction controls.

### Verified source observations
- Riff posts, replies, likes, follows, and flags are currently handled by the client-side Zustand campus store in `src/lib/unibud/campus-store.ts`.
- The store uses Zustand persistence with key `unibud-campus`.
- The inspected `src/lib/social/server.ts` contains authenticated server functions for conversations, community membership, and Square posts, but no Riff persistence/API functions were found in that file.
- Therefore, this checkpoint improves the guest-facing read-only experience but **does not establish server-side Riff authorization**. No Riff server write endpoint was identified in the inspected source. UI guards are not a security boundary.

## Validation status

- Source edits were committed to the dedicated branch.
- Typecheck, lint, unit tests, production build, browser tests, and database-isolation tests were **not run** in this environment. Do not treat this change as release-certified.
- No merge, migration, deployment, or production change was performed.

## Required next actions (in order)

1. Inspect the current migration/schema conventions and existing auth middleware before designing Riff persistence.
2. Decide and document the Riff data model for posts, replies, reactions, follows, and reports; preserve guest-readable public content while requiring authenticated identity for all writes.
3. Add server-side Riff read/write functions protected by the existing authentication middleware. Never trust a client-supplied author handle or user ID.
4. Add tests proving unauthenticated create/reply/react/follow/report attempts are rejected, authenticated writes are scoped to the authenticated user, and guest reads cannot mutate persisted state.
5. Integrate the Riff UI with the server contract; retain clear unavailable/error states and avoid presenting local-only changes as shared activity.
6. Run typecheck, lint, relevant tests, production build, and browser smoke tests; record exact command outputs and any failures.
7. Re-check branch ancestry against current `main` before proposing any integration. Do not merge or deploy without explicit authorization.

## Architectural constraints preserved

- UNIBUD remains the application and keeps its product identity.
- Primary navigation remains Square → Connect → Quad → Chat.
- Bud remains the only user-facing conversational AI; Spark and specialists remain internal.
- Guest Riff access is intended to be read-only; protected actions must be enforced server-side.
- The Quarter remains inside the existing UNIBUD application; no independent application or Arc infrastructure was introduced.
