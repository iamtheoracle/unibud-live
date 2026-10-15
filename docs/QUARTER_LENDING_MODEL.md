# The Quarter: Lending Product Model

Status: product requirements. No lending partner is implied to be connected or live.

The Quarter is one mini-app with separate finance journeys inside it. It should support two distinct lending product types through authorised lending organisations, not present UNIBUD as the direct lender unless the legal and regulatory structure explicitly supports that role.

## 1. Education loans
Purpose: eligible education-related costs, potentially including tuition and school fees, accommodation, books, learning materials, and other expenses permitted by the partner product.

Expected journey:
- Explain eligibility and required school/student information.
- Capture informed consent before sharing information with a lender.
- Route the application to a configured education-finance partner.
- Display application status and offers only from verified provider responses.
- Show the provider's terms, fees, repayment schedule, and agreement before acceptance.
- Show disbursement as complete only after the provider confirms it.

This is similar in purpose to education-finance programmes such as NELFUND, but UNIBUD must not imply affiliation, identical eligibility, or government backing without a real agreement.

## 2. Purchase credit
Purpose: approved credit for eligible purchases through the Quarter marketplace and participating merchants. Examples may include laptops, phones, books, school supplies, and other partner-approved goods or services.

Expected journey:
- Present either a partner-approved credit limit or a transaction-specific financing offer.
- Confirm product price, fees, repayment dates, and total repayment amount before acceptance.
- Send the transaction to the lending partner for its decision and funding/merchant-settlement workflow.
- Reflect repayment and available credit only from authoritative partner data.
- If revolving credit is offered, make clear that available credit returns only according to the actual product terms and posted repayments.

## Partner model and risk boundary
- Lending organisations make credit decisions and supply funding under the agreed arrangement.
- UNIBUD may provide discovery, application UX, integration, customer support routing, and permitted distribution/servicing functions under contract.
- A guarantee is a separate legal and financial commitment. Do not imply that UNIBUD guarantees approval or repayment. Any loss guarantee requires explicit terms, risk controls, appropriate authorisation, and legal review.
- Use provider adapters and explicit integration states. Never fabricate balances, offers, approvals, disbursements, repayments, or transaction success.
- Store credentials server-side. Use consent, audit trails, idempotency, reconciliation, secure webhooks, and least-privilege access.
- Confirm the applicable Nigerian lending, consumer-protection, privacy, and payment-services requirements before launch.

## UI language
Use plain, mature labels such as **Education loans** and **Purchase credit**. Explain that availability is subject to the relevant partner's assessment. Avoid “guaranteed” or “approved” until the responsible provider has confirmed the exact status.
