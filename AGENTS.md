# Base44 Dev Environment

## Overview

UNIBUD is a TanStack Start + React + Vite app (student social/academic platform).
The dev server runs on port 8080 inside the container, mapped to host port 3000.

## Setup

- **Runtime:** Node 22 (via `docker-compose.base44.yml`)
- **Database:** PGlite (in-memory) — requires `USE_PGLITE=true` env var. No external Postgres needed for local dev.
- **Auth:** Off by default (no `VITE_AUTH_ENABLED` in `.grok/app-env.json`)
- **Start:** `docker compose -f docker-compose.base44.yml up -d`
- **Health:** `curl -sf http://localhost:3000/`

## Key files

- `docker-compose.base44.yml` — dev compose (bind-mounts source, `npm ci` on startup, `npm run dev`)
- `.base44/environment.json` — Base44 metadata
- `vite.config.ts` — Vite config (port 8080, TanStack Start, Nitro, PWA plugin)
- `src/lib/db.ts` — database runtime (PGlite when `USE_PGLITE=true`, Postgres when `DATABASE_URL` set)
- `scripts/with-app-env.mjs` — env wrapper that merges `.grok/app-env.json` before Vite starts

## Notes

- `npm run dev` must go through `scripts/with-app-env.mjs` (the npm script does this); never call `vite` directly.
- Migrations (`migrations/*.sql`) are applied automatically by PGlite at runtime via `import.meta.glob`.
- The `__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS` env var is passed bare for Vite host allowlisting.
- Vite 8.2.2 is used (transitive dependency, not in package.json directly).
