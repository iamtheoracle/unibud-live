# UNIBUD entry, guest Riff, and first-use journeys

Status: product requirements and implementation checklist. Items labelled pending are not live functionality.

## Design direction

Keep the current restrained UNIBUD visual system: generous whitespace, simple typography, rounded controls, clear hierarchy, and a single obvious next action. Keep the approved UNIBUD wordmark. Use Orbit as the initialization/loading mark; do not add a second decorative brand system.

## First visit

1. Show the UNIBUD logo on a clean welcome splash with the Orbit loading animation.
2. Automatically continue to the single sign-in/sign-up screen, with a visible Continue action for accessibility and slower devices.
3. The account screen uses email and password only. Do not offer social-login buttons in this flow.
4. Keep these guest paths visible on that same screen:
   - Try Bud as a guest.
   - Join the Riff.
5. Explain the social promise plainly: “You don’t need an account to roast, rizz, gossip or gist.”
6. Do not imply that a capability works until its actual backend path is connected and tested.

## New account

1. Create the account with email and password.
2. Ask for full name and a unique username after account creation.
3. Offer a short optional interests step and relevant communities. Do not block entry on interests, school, demographics, or dating questions.
4. Suggest people to follow only from a real, populated directory. Never display fabricated people or fake activity as recommendations.
5. Move additional details to the relevant profile or product area, where they can be skipped or changed.

## Anonymous Riff

Target guest capabilities:
- Read Riff.
- Publish text posts, attach pictures, reply, mention/tag users, and invite Bud to help formulate a response.
- Use a pseudonymous guest identity without requiring an account or email.
- Upgrade to an account without losing the content they intentionally choose to keep.

Required backend work before advertising anonymous publishing as live:
- Persist posts, replies, mentions, moderation state, and ownership server-side. The current Riff composer writes to the browser's Zustand store and is not a shared public feed.
- Add bounded anonymous-session rate limits, content-size validation, report/block controls, and server-side abuse protections.
- Use a real image-storage path with upload validation, size limits, and safe rendering. Do not store unbounded image data in the post table as a shortcut.
- Enforce guest Bud usage limits server-side, not just with a client-side counter.
- Preserve privacy: never require email, phone, or a legal name for anonymous Riff use.

## Product-specific first-use questions

### Bud
When someone first opens Bud, ask which school or institution they attend, and only then ask the minimum optional course/programme context needed to improve study help. Provide “skip for now.” Keep guest Bud use available but bounded by a server-enforced limit. Do not block Riff on academic onboarding.

### SouLync
Ask about dating/relationship goals only when the user enters SouLync. Make every answer optional, explain profile visibility and privacy before saving sensitive relationship preferences, and keep the questions out of global sign-up.

### Banking / Money
Do not present demo wallet balances or demo transfers as real banking. When a user asks to set up banking, ask:
- Their country.
- What they need from a bank in that country.
- A phone number they can actually answer, or a WhatsApp number they actively use.

Explain clearly: “Your request is pending verification. One of our agents will contact you for a verification call.” Confirm consent to share the contact number with the authorized operations team before sending it. Store the request with a pending-verification status and an audit trail. Only send operator email when a real email-delivery provider and recipient list are configured; never claim that an email or call was sent unless delivery is confirmed. Do not promise account opening, regulatory approval, or banking availability.

## Current implementation status for this change

- Implemented in this branch: Orbit welcome splash, clean email/password-only sign-in/sign-up screen, visible guest entry points, and a shorter first-run profile step for full name, username, and optional interests.
- Not implemented by this change: shared server-backed anonymous Riff publishing, image uploads, persistent replies/mentions, server-enforced Bud guest limits, SouLync dating onboarding, and the banking request/email/verification workflow. These require backend, storage, privacy, abuse-control, and delivery tests before being advertised as working.
- Production remains frozen. This branch must pass typecheck, lint, tests, build, and preview smoke tests before merge or deployment.
