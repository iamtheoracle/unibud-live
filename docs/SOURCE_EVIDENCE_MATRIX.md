# UNIBUD source-evidence matrix

**Baseline repo:** `iamtheoracle/unibud-live`  
**Baseline branch:** `fix/production-plumbing-v2` → work branch `staging/auth-square-ownership`  
**Baseline commit (plumbing tip):** `15e8218a1a84fd9e1ebbca68f1502783f40e4859`  
**Reference date:** 10 October 2026  
**Production freeze:** ACTIVE — this matrix is not a production release certificate.

Status vocabulary: **In code** Yes / Partial / No · **Staging** Not tested · **Production** Not tested

| System | Files | Routes / APIs | In code | Staging | Production | Evidence notes |
|---|---|---|---|---|---|---|
| Authentication / sessions | `src/lib/auth/server.ts`, `verify.server.ts`, `middleware.ts`, `client.ts` | Better Auth session, `requireUserId`, `authMiddleware` | Yes | Not tested | Not tested | Fail-closed when DB set and auth off. Production must set `VITE_AUTH_ENABLED=true` + secrets. |
| Auth config (Netlify) | `netlify.toml` | build env | Partial | Not tested | Not tested | Plumbing branch no longer forces `VITE_AUTH_ENABLED=false`. Deployer must enable auth deliberately. |
| Ownership / RBAC | `authMiddleware`, `rbac.server.ts`, `isolation.server.ts` | protected server fns | Partial | Not tested | Not tested | Mutates must all use middleware; two-account isolation not run. |
| Square feed | `src/routes/_app/index.tsx`, `square-stream.ts`, `getCampusCatalog` | `/` | Partial | Not tested | Not tested | Lanes present; feed from DB posts; fixtures emptied. |
| Square publish (Drop) | `src/lib/social/server.ts` `createPost`, DropSheet, studio desks | POST createPost | Yes (restored) | Not tested | Not tested | **Was PLACEHOLDER on live branch — restored.** Session profile handle + `owner_user_id` (migration 0019). |
| Square like / comment | `src/lib/unibud/server.ts` `togglePostLike`, `addSquareReply` | server fns | Yes | Not tested | Not tested | Uses `authMiddleware` + `context.userId`. |
| Connect | `src/routes/_app/connect.tsx`, catalog people | `/connect` | Partial | Not tested | Not tested | Still imports `PEOPLE`; catalog empty so UI empty. Must bind to real directory/profiles. |
| Chat | `src/routes/_app/messages.tsx`, `social/server.ts` | `/messages` | Partial | Not tested | Not tested | list/open/send use `authMiddleware`. Suggested seed strip; no PEOPLE auto-reply. |
| Spark launcher | `src/components/shell/spark-gate.tsx` | Board `/board`, Commerce `/money`, Services `/creator` | Yes | Not tested | Not tested | Not a fifth primary tab. |
| Primary nav | `src/components/shell/primary-nav.tsx` | Square → Connect → Quad → Chat | Yes | Not tested | Not tested | Order locked. |
| Bud providers | `src/lib/bud/provider.ts`, `server.ts` | `/bud` | Yes | Not tested | Not tested | xAI → OpenAI → free fallback; free is explicit non-success. |
| Live | `src/routes/_app/live.tsx` | `/live` | Honest unavailable | Not tested | Not tested | No mock broadcast on this line. |
| Demo / seed leakage | `catalog.ts`, campus-moments, messages | production-reachable UI | Partial | Not tested | Not tested | Catalog fixtures empty; story clusters emptied on this branch; Connect still code-path imports PEOPLE. |
| Persistence | Postgres via `DATABASE_URL` / PGlite local | migrations through 0019 | Partial | Not tested | Not tested | Production DB + migrations not verified on Netlify. |
| Posts ownership column | `migrations/0019_posts_owner.sql` | `posts.owner_user_id` | Yes (migration added) | Not tested | Not tested | Apply in staging/prod migrate before relying on column. |

## Critical finding (this pass)

`src/lib/social/server.ts` on `unibud-live` was **`PLACEHOLDER` only**. Community/Square publish and Chat server APIs were non-functional until restored on `staging/auth-square-ownership`.

## Next staging tests (required before production)

1. Enable auth in staging env (`VITE_AUTH_ENABLED=true`, secrets, `DATABASE_URL`).
2. Apply migrations through `0019_posts_owner.sql`.
3. Account A: create profile → Drop post → like → comment → refresh (persist).
4. Account B: cannot mutate A’s post; cannot read A’s private conversations.
5. Connect empty or real profiles only — no seed names.
6. Live remains honest offline.
7. Bud: real provider reply or explicit unavailable.

## Production still blocked

- Netlify site still historically upload-deployed (`commit_ref` null) under `sparkfromoracle`.
- No production secrets verification in this pass.
- Two-account gate not executed.
- Freeze remains **ACTIVE**.
