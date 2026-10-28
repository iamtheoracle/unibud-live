# UNIBUD Unified Integration Contract

## Product decision

UNIBUD is one application assembled from the strongest parts of the existing projects. Do not treat the source repositories as separate products and do not replace the established UNIBUD-live interface with a new redesign.

## Source-of-truth responsibilities

- **UI/UX reference and integration host:** `iamtheoracle/unibud-live`. Preserve its existing visual language, navigation, responsive behavior, and product identity. New modules must fit its established experience.
- **Unique product capabilities:** `iamtheoracle/arc-project-one` and `iamtheoracle/arc-project-one-v2`. Audit their code, domain models, feature notes, attachments, and documented requirements; port the useful capabilities into UNIBUD-live rather than swapping the UI.
- **Local AI and extensible tools:** `iamtheoracle/arc-project-two`. Review its Ollama/local inference, agent loop, plugin discovery, tools, and conversation-memory implementation. Integrate through a provider boundary so UNIBUD can still run when local AI is unavailable.
- **Starter foundations:** `iamtheoracle/next-platform-starter` is the connected repository that appears to correspond to Project Starter. Use only relevant, compatible patterns; do not import its example routes wholesale.
- **Existing product/backend work:** `iamtheoracle/unibud-app`, including the open `reconcile/unibud-production` work, must be reviewed for authentication, database persistence, ownership checks, migrations, and tests. Reuse the sound work after comparing it with UNIBUD-live; do not blindly overwrite either implementation.

## Integration principles

1. Keep UNIBUD-live's established UI/UX as the visual acceptance reference.
2. Preserve Arc Project One's differentiating functionality and intended upgrades; don't reduce the result to a generic campus social app.
3. Bring in Arc Project Two's useful AI/tooling as modular capabilities, not as a second competing app or second visible assistant.
4. Keep one visible Bud assistant. Spark and specialist capabilities remain internal services unless the existing product explicitly exposes them.
5. Integrate Studies, Board, social/community, messaging, discovery, marketplace/P2P, profiles, safety/trust, and AI tools through consistent navigation and shared identity where supported by the actual code.
6. Preserve authentication, per-user authorization, data ownership, migrations, and real persistence. Do not add fabricated production activity or seed fake users/listings/posts.
7. Reuse source code only after checking framework compatibility, dependencies, licenses, secrets, and tests. Prefer adapters and incremental ports over wholesale file copying.
8. Keep all work on this integration branch and use Deploy Preview/CI for verification. Do not merge or deploy to production without explicit approval.

## Required audit before feature porting

- Inventory routes, screens, components, domain types, database schemas/migrations, server functions, agent/tool interfaces, environment variables, tests, and deployment configuration in each source.
- Map each capability to its original source, target module, dependencies, migration needs, and acceptance tests.
- Identify duplicates and conflicts explicitly; resolve them without silently dropping a capability.
- Treat `next-platform-starter` as a candidate for reusable foundation only, not automatically as the canonical product.

## Definition of done

- UNIBUD-live's key flows remain recognizable and work on mobile and desktop.
- Arc Project One's verified unique features are available from the unified app.
- Selected Arc Project Two capabilities are integrated behind a stable provider/tool interface with graceful failure when optional local services are absent.
- Relevant reusable backend work from `unibud-app` is reconciled without breaking auth, ownership, or persistence.
- No dead-end navigation, fake production records, or duplicate competing assistant experiences are introduced.
- Typecheck, lint, tests, production build, auth/ownership checks, and key-flow browser checks pass.
- A reviewable pull request and Deploy Preview are available; production remains untouched.
