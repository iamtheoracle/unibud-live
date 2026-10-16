# The Quarter — Product Scope and Acceptance Gates

Status: working implementation contract for the Quarter feature branch. This document describes intended behavior; it does not claim these capabilities are already implemented.

## Product purpose

The Quarter is one connected everyday-commerce space inside UNIBUD. It helps teenagers and young adults find what they need, earn money through small businesses, resell goods, offer services, find housing, and learn practical commerce skills. Keep the experience simple and relatable while the underlying workflows remain reliable.

Do not split the experience into separate apps for shopping, P2P, housing, and money. P2P is a marketplace mode. Money and property are connected pillars within the same Quarter experience.

## The three connected pillars

1. **Money:** balance and ledger, transfers, payment requests, limits, payment methods, cards, and financing. Demo ledger actions must remain unmistakably simulated. Real movement requires an authorized provider and must not be implied until connected and verified.
2. **Property & stays:** properties for sale or rent, house agents, hostels, university dorms, bed spaces, shared rooms, roommates, apartments, and short stays. Viewing, rental enquiry, and booking are distinct workflows.
3. **Marketplace & P2P:** new and used goods, groceries, food, gadgets, clothing, books, furniture, household essentials, handmade products, small-business storefronts, services, direct resale, and person-to-person deals.

## Listing taxonomy

Every listing has a primary listing type and category. P2P is a sale method, not a separate category.

- Goods: gadgets/electronics, groceries, prepared food, fashion, books/study supplies, furniture, household goods, beauty/personal care, transport, events, and other lawful goods.
- Pre-owned goods: condition must be explicit (new, like new, good, fair, for parts/repair where appropriate); disclose known defects and what is included.
- Food: distinguish groceries/ingredients from prepared meals; support unit/portion, quantity, preparation or expiry details where relevant, pickup/delivery and allergen information where relevant.
- Services: service type, provider description, service area, price basis, estimated duration, availability, and portfolio/work samples where appropriate.
- Property sale/rent: property type, location, bedrooms/occupancy where applicable, price and period, deposit/mandatory fees, availability, viewing arrangements, and whether the offer is from owner or agent.
- Hostels/dorms: institution/location, room or bed-space type, occupancy, amenities, rules, academic session or date range, price period, and availability.
- Short stays: guest capacity, available dates, amenities, nightly price, cleaning/other mandatory fees, cancellation terms, and host confirmation state.
- Agents and accommodation providers: profile and contact details, properties managed, fee disclosure, and verification state. Never show “verified” unless a check was actually completed.

## Listing publishing and qualification

- Support drafts separately from published listings.
- Required fields depend on the listing type; do not force irrelevant fields onto every seller.
- Require a meaningful title, category, description, price basis, location or service area where applicable, and type-appropriate details.
- Images: add, preview, reorder, and remove multiple photos; validate type/size; store them through a configured upload mechanism; use honest alt text. Do not substitute stock imagery for the actual item/property while implying it is the seller's photo.
- Price: store integer minor units, currency, and price basis/period separately. Display “per item”, “per kg”, “per plate”, “per night”, “per month”, “per session”, “starting at”, “negotiable”, or “request a quote” explicitly. Mandatory fees must be visible before commitment.
- Inventory/availability: only claim stock or dates if seller-managed data exists. Never invent availability.
- Qualification is not identity verification. Separate “complete listing”, “seller verified”, “property/agent checked”, and “transaction protected” states.
- Provide clear reasons when a listing cannot be published and allow saving a draft.

## Buyer experience

- One search across goods, services, property, hostels/dorms, stays, sellers, and relevant money services.
- Clear category navigation and filters appropriate to each type: new/used condition, price, location, quantity, date availability, property type, room occupancy, facilities, seller/provider type.
- Listing cards show real image when available, useful category/type labels, clear price and unit, location, and honest trust/status indicators.
- Detail pages explain what is included, known condition/limitations, fees, fulfilment or viewing/booking process, seller/provider identity, and how to ask questions or report a concern.
- Support save/favourite, seller contact, cart for eligible goods, and separate enquiry/viewing/booking flows for property and services.
- Never treat a message, enquiry, payment attempt, or booking request as a confirmed order/booking.

## Commerce and money integrity

- Persistent cart supports add/remove, quantity changes, and a clear subtotal/fees/total.
- Checkout reloads trusted listing prices on the server, validates quantity and availability, prevents duplicate submissions, and creates an order record before reporting an order as created.
- Order status and payment status are distinct. Refunds, cancellation, fulfilment, and disputes must have auditable state transitions.
- Transfer/payment/request operations need server-side validation, explicit transaction and daily limits, recipient/ownership checks, idempotency where appropriate, and concurrency-safe ledger updates.
- Payment requests must not let a requester mark their own request as paid to credit their own wallet. No arbitrary client-driven status changes or repeat crediting.
- Demo balances and demo payment actions must be labelled as simulations and must never be represented as real money movement.
- Do not store payment-card secrets or sensitive identity data unnecessarily. Use authorized payment providers for live financial services.

## Help, safety, and learning

- Contextual help for selling, pricing, photos, orders, payments, limits, property enquiries, hostel scams, and disputes.
- Report listing/seller/agent, block unsafe contact, support case references and case status, and clear resolution history.
- Educate without shaming: practical prompts for pricing, product photos, clear descriptions, fair dealing, customer messages, and keeping simple business records.
- Because teenagers may use UNIBUD, use age-appropriate privacy defaults, safe-meetup guidance, careful contact disclosure, and escalation rules for regulated/restricted goods and risky transactions. Do not imply that every user is an adult or that every listing is automatically safe.
- Do not publish private residential details by default. Give providers control over what location detail is visible and provide safer contact paths.

## Operational and engineering gates

- Database migrations must be additive and included in the repository's migration plan.
- Server validation is authoritative; UI-only validation is insufficient.
- Seed/fixture content must not be passed off as real user inventory or activity.
- Add tests for required-field rules, price parsing, type-specific validation, permissions, status transitions, limit enforcement, duplicate checkout, and ledger invariants.
- Run typecheck, lint where practical, build, migration verification, and relevant tests. Report exact results; never claim a gate passed without evidence.
- Work only on the development branch until review. Do not deploy or alter the frozen production site without explicit authorization and successful release gates.

## Recommended implementation order

1. Secure money ledger, payment requests, price trust, and limit rules.
2. Define listing domain types and additive schema for listing state, condition, price basis/currency, multiple images, and type-specific attributes.
3. Build a type-aware seller publishing flow with drafts, image handling, labels, and price clarity.
4. Build category/search/filter and listing-detail experiences for new/used goods, groceries/food, gadgets, services, agents, hostels/dorms, property, and short stays.
5. Add persistent cart, trusted server-side checkout, orders, receipts, fulfilment, cancellation/refund/dispute state.
6. Add contextual help, reporting, support cases, safety guidance, and seller learning.
7. Verify the full user journeys on a non-production environment before considering release.

## Definition of done

The Quarter is not complete merely because its cards look polished. A feature is complete when the data model, UI, server rules, permissions, error states, audit trail, tests, and relevant user journey work together. Anything waiting on a provider or verification must be clearly identified as unavailable or simulated.
