# UNIBUD

UNIBUD is a student social + academic platform. Square is the social home. Bud is the visible AI. Board, Studies, Chat, Communities, and Connect sit around that.

This repository is the standalone UNIBUD application (auth, Square, Bud, Studio, Board, Studies). It is not the older Base44 app in `iamtheoracle/unibud`. UNIBUD has its own public product identity; it is not presented as Oracle Arc.

## Stack

- TanStack Start + React
- Better Auth
- Postgres in production; local development uses the repository's local database path
- Zustand campus store

## Run

```bash
npm install
npm run db:migrate
npm run dev
```

Dev server: `http://localhost:8080`

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Local app |
| `npm run typecheck` | TypeScript |
| `npm test` | Unit tests |
| `npm run lint` | ESLint |
| `npm run build` | Production build + migrate |

## Product notes

- **Bud** is the only visible AI. Spark and specialists stay internal.
- External providers are optional capability boundaries; the core application must not silently depend on them.
- Syllabus belongs to the **course**. Bud uses enrolled courses as context.
- Board is the classroom layer. It is not Bud.
- Music for Drops / Stories / Peek is licensed-catalogue architecture, not user uploads of commercial tracks.
- Image/GIF generation in Bud is wired in-conversation; a generation provider is not connected yet.


## UNIBUD Flow

**Flow** is the unified premium experience across UNIBUD's student tools—not a collection of disconnected mini-apps. It brings the most useful parts of campus life into one consistent navigation and design system while allowing each feature to keep its purpose.

- **Home & Discover:** a personal starting point, useful recommendations, campus updates, and routes into the right feature.
- **Square & Connect:** social discovery, people, communities, and trusted connections.
- **Quad & Chat:** conversations, group coordination, and shared campus activity.
- **Studies & Stories:** course support, Board/classroom tools, study resources, and student expression.
- **Marketplace:** student-to-student listings and services, with safety and seller trust signals.
- **Bud:** the visible AI helper that explains, drafts, plans, and helps students navigate the platform.
- **Flow Student Bank:** one place for the wallet demo, shared-cost requests, funding notes, and—after proper provider integration—accounts, cards, transfers, and payments.
- **Safety & control:** verification signals, blocking/reporting, privacy controls, account security, and clear boundaries for AI and financial actions.

### Student Bank implementation truth

The current `/money` experience uses a **demo ledger**. Its balance, add/send/withdraw actions, marketplace payments, and “mark paid” request action are simulations; they do not move money. Funding notes are private tracking notes, not an official NELFUND application. The UI must keep those distinctions visible.

Real banking requires a licensed provider and approved operating model, secure server-side integration, identity and fraud controls, transaction authorization, reconciliation, audit trails, support/dispute handling, and legal/compliance review. No screen may claim a transfer succeeded until the provider confirms it.

See [Flow Student Bank product plan](docs/flow-student-bank.md) for the benefits map, capability status, and implementation gates.
