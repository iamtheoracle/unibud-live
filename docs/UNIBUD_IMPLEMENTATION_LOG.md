# UNIBUD Implementation Log

**Record date:** 2026-10-16  
**Application repository:** `iamtheoracle/unibud-live`  
**Base branch:** `rebuild/unibud-mini-apps-2026-10-16`  
**Base commit recorded at start:** `bd750f4931c3c2f3ac374d750415acfdb2d188eb`  
**Working branch:** `fix/riff-guest-readonly-2026-10-16`  
**Production state:** unchanged; no merge or deployment performed.

## Implementation slice: guest read-only Riff

### Verified findings before change
- `src/routes/_app/riff.tsx` read the globally persisted `unibud-campus` Zustand store and rendered local posts and engagement controls to guests.
- Guest users could compose and add a device-local Riff from the main Riff route.
- The Riff thread route allowed guests to read a thread from the same device-local store and exposed a local follow action.
- Riff challenge cards displayed hard-coded join counts (1,840; 920; 2,104) despite no connected shared challenge activity source.
- No shared Riff server API or Riff migration was present in this working branch. Therefore, this UI repair does not claim server-backed public feed or server-side mutation enforcement.

### Changes on this branch
- Added `src/lib/unibud/riff-access.ts` as a clearly documented client-side presentation policy; it is explicitly **not** an authorization boundary.
- Added `src/lib/unibud/riff-access.test.ts` covering guest visibility, authenticated local visibility, and non-mutation of the underlying collection.
- Updated `src/routes/_app/riff.tsx` so guests cannot see device-local Riff records or device-local follow state and do not receive a composer or mutation controls. Removed fabricated challenge join-count cards. The empty state now says the shared feed is not connected.
- Updated `src/routes/_app/riff.$id.tsx` so guests cannot view a device-local thread or use its local follow/reply controls. Authenticated local threads disclose that their content and interactions are not shared.
- Renamed the local “report” action to an honest device-only hide action; it does not claim to send a moderation report.
- Added the `test:riff-access` package script.
- Marked `UNIBUD_IMPLEMENTATION_HANDOFF.md` as a historical checkpoint because its repository and navigation references are stale.

### Verification status
- Automated CI, TypeScript, lint, and production build: **pending** at the time of this record. Do not treat the slice as verified until the workflow result is reviewed.
- The tests exercise the access policy helper. They do not prove server authorization.
- No database migration, production configuration change, merge, or deployment was performed.

### Known risks and blockers
1. **Shared Riff remains unimplemented in this branch.** There is no server-backed public feed, durable post/reply/reaction/follow storage, or moderation-report endpoint. The guest page therefore shows an honest empty state rather than pretending that device-local records are public.
2. **Client-side policy is not security enforcement.** Before introducing shared Riff mutation endpoints, require verified identity via `authMiddleware`, enforce permissions server-side, validate payloads and ownership, and test guest denial plus account A/B isolation. Public reads must return only explicitly public content.
3. **Campus store isolation needs a wider audit.** `unibud-campus` persists broad profile and engagement state under one browser storage key rather than a verified per-account namespace. This Riff change prevents the Riff UI from displaying local Riff state to guests; it does not solve cross-account exposure in other routes.
4. **Challenge/discovery fixtures need an inventory.** The false Riff join counts were removed from this route, but other hard-coded discovery content still needs classification and source verification before it is represented as live activity.

### Next actions
1. Review CI results for this branch: typecheck, targeted agent lint/tests, Riff access tests, and production build.
2. Recover and reconcile the existing Riff server contract (historically associated with PR #11) against the current branch before implementing a migration or server functions.
3. Implement shared Riff reads and member-only writes only after the contract and migration sequence are verified; include two-account isolation, guest-denial, payload validation, ownership, and moderation tests.
4. Audit the global Zustand persistence boundary for account-scoped state and define a safe migration that preserves user data.
5. Continue the whole-product mini-app inventory; do not equate visible routes with working backend workflows.
