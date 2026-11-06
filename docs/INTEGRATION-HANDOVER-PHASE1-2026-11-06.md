# UNIBUD Live — Integration handover (Phase 1)

**Date:** 2026-11-06  
**Repository:** `iamtheoracle/unibud-live`  
**Baseline (main, untouched):** `d2f9c13bcd46e4fcd0ff128b1453454d50b59c46`  
**Working branch:** `integration/unibud-unified-platform-phase1`  
**Related historical branch (do not overwrite):** `integration/unibud-unified-platform` @ `b75e662b486c9a3682866daa55cde83294d66c5e`

## Boundaries observed

- `main` was not modified.
- No production deploy.
- No production data or credentials changed.
- Migration history was not deleted.
- No merge into `main`.

## Why a phase1 branch name

`integration/unibud-unified-platform` already existed (Oct 2026 tip) and is **behind** current `main`. Per instructions, existing work on that branch was **not overwritten**. Phase-1 repair was started from **current main** on `integration/unibud-unified-platform-phase1` so the Nov 6 workspace publish is the baseline.

## Phase 1 changes completed on this branch

### 1. Build vs migrations separation

**Problem:** `package.json` on main ran migrations during app build:

```json
"build": "node scripts/with-app-env.mjs vite build && npm run db:migrate"
```

Netlify also invoked `npm run build:netlify`, which was **missing** on main, so Netlify builds could fail or behave inconsistently.

**Fix applied:**

| Script | New behavior |
|--------|----------------|
| `build` | `vite build` only — **no** migrations |
| `build:netlify` | `vite build` only (matches `netlify.toml`) |
| `db:migrate` | Explicit, manual/CI step only |
| `test:agents` | Runs the agent organization test suite once modules are restored |

### 2. Agent / SPARK module status

| Location | Agent surface |
|----------|----------------|
| `main` / phase1 baseline | Slim set only: `activity.ts`, `contracts.ts`, `registry.ts`, `runtime.ts` + `src/lib/bud/spark.ts` |
| `integration/unibud-unified-platform` @ `b75e662` | **Full organization**: catalog, collaboration, activation, acceptance, organization (51 agents), core/, specialists/, response-policy, content-context, context-access, **7 test files** |

**Restoration status:** Source of truth for the full Agent + SPARK organization remains commit `b75e662`. Files must be copied/reconciled onto phase1 **without** discarding main’s newer app surfaces (SouLync, Flow, Connect, Wayward, etc.).

This is **not** claimed complete until those files are on phase1 and `npm run test:agents` passes.

### 3. package-lock.json

`package-lock.json` on main / workspace ZIP was left in place for this commit. After agent module restore, run `npm ci` and commit any intentional lockfile refresh if dependency versions change. Do not invent lockfile edits without `npm install` evidence.

## Commands (next developer / agent)

```bash
git fetch origin
git checkout integration/unibud-unified-platform-phase1
npm ci --legacy-peer-deps
npm run typecheck
npm run lint
npm test
npm run build          # must NOT run migrations
npm run build:netlify # must match Netlify
# after agent restore:
npm run test:agents
npm run db:migrate    # only against an intentional DB URL, never as part of Netlify build
```

### Results in this Grok session

| Check | Result |
|-------|--------|
| Remote branch created from main | Pass (`phase1` → `d2f9c13`) |
| `package.json` build/migrate split pushed | Pass (this branch) |
| `build:netlify` script present | Pass |
| Full agent module tree restored onto phase1 | **Not complete** — still on `b75e662` |
| `npm ci` / typecheck / test / build in this environment | **Blocked** — private clone requires credentials unavailable in this session |
| Merge to main | Not done (by design) |
| Production deploy | Not done (by design) |

## Migration compatibility warnings

- Never run `db:migrate` as part of Netlify or `vite build`.
- Do not delete either migration history tree if multiple histories exist.
- Confirm `DATABASE_URL` and migration runner target before any migrate in CI or staging.
- PGlite vs Postgres paths must stay honest: no pretend production balances.

## Flow UI note (product direction, not implemented in this commit)

AVCU-inspired Flow home: relationship-style balance card **without** a hard-coded `$` (or any single currency glyph) on primary balances so the product stays locale-flexible. FX / stocks surfaces may show explicit instruments and currencies when those markets are real. **Do not** invent balances or deposits.

## Exact next steps

1. Restore full `src/lib/agents/**` (and any missing SPARK contracts) from `b75e662` onto this branch; reconcile TypeScript against main’s `src/lib/bud/spark.ts` and Bud server.
2. Add missing agent tests if `tools.test.ts` / `catalog.test.ts` exist in history; align `test:agents` script.
3. Run `npm ci`, typecheck, lint, test, `test:agents`, `build`, `build:netlify` on a machine with GitHub access.
4. Commit lockfile only if install legitimately changes it.
5. Open a **draft** PR: `integration/unibud-unified-platform-phase1` → `main` for review (do not merge without authorization).
6. Optionally fast-forward or retarget the name `integration/unibud-unified-platform` after review so one branch remains the integration head.

## URLs (fill after push verification)

- Branch: https://github.com/iamtheoracle/unibud-live/tree/integration/unibud-unified-platform-phase1
- Baseline commit: https://github.com/iamtheoracle/unibud-live/commit/d2f9c13bcd46e4fcd0ff128b1453454d50b59c46
- Agent source commit: https://github.com/iamtheoracle/unibud-live/commit/b75e662b486c9a3682866daa55cde83294d66c5e
- CI: run after push via GitHub Actions / Netlify on the branch (do not treat green as production approval)
