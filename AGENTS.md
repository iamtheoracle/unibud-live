# UNIBUD — Base44 Workspace

## Running the app

```bash
docker compose -f docker-compose.base44.yml up -d
```

App serves on **port 3000** (mapped from internal 8080). Health: `curl http://localhost:3000/`.

Dev server is Vite 8 + TanStack Start with HMR — edits appear live without restart.

## Environment

- **`.env.base44-defaults`** — dev defaults (overridden by `/run/base44/app.env`):
  - `USE_PGLITE=true` — in-memory PGlite database (no PostgreSQL service needed for dev)
  - `VITE_AUTH_ENABLED=false` — auth disabled, uses `DEV_USER` fallback (id: `dev-user`)
- To use real PostgreSQL: set `DATABASE_URL` in app secrets (overrides PGlite automatically)
- To enable real auth: set `VITE_AUTH_ENABLED=true` + `GROK_AUTH_*` + `BETTER_AUTH_SECRET` in app secrets

## Stack

- TanStack Start + React 19 + Vite 8
- Tailwind v4, Radix UI, Zustand, TanStack Query/Router/Table
- Better Auth (federated via Grok broker in production)
- PostgreSQL in production; PGlite (in-memory) for local dev behind `USE_PGLITE=true`
- Nitro preset: netlify (production only; dev uses Vite dev server)

## Architecture

- **Bud** is the only visible AI to the student. Spark and specialist agents are internal.
- Internal routing: User → Bud → Spark → agents → Spark → Bud → User
- Primary nav: Square · Connect · Quad · Chat
- Square = discovery/social feed; Connect = people; Quad = academics; Chat = Bud conversations
- Orbit = browsing/search/research inside Bud

## Key directories

- `src/routes/` — file-based routes (TanStack Router)
- `src/lib/bud/` — Bud agent system (provider, spark, communication, oracle-layer)
- `src/lib/agents/` — agent contracts, registry, runtime
- `src/lib/unibud/` — domain layer (academic, catalog, map, types, square-stream)
- `src/lib/auth/` — auth server, client, gates, middleware
- `src/lib/db.ts` — database abstraction (PostgreSQL / PGlite)
- `migrations/` — SQL migrations (applied by PGlite on boot or `npm run db:migrate` for PostgreSQL)

## Tests

```bash
npm test          # unit + agent tests
npm run typecheck # TypeScript
npm run lint      # ESLint
```

## Quirks

- `scripts/with-app-env.mjs` wraps `vite dev` — it merges `.grok/app-env.json` into env before Vite starts. Only `VITE_`-prefixed keys are honored. Compose `environment:` / `env_file:` values take precedence.
- PGlite is in-memory (`dataDir: "memory://"`); data is lost on container restart.
- Auth server still initializes Better Auth even when disabled, but `getSessionUser()` returns null and `requireUserId()` returns `DEV_USER_ID`.
- `databaseConfigured()` checks `DATABASE_URL` only — PGlite doesn't count as "configured" for auth fail-closed logic.
- The app redirects to `/welcome` for onboarding when `onboardingDone` is false in the campus store.
