import { test } from "node:test";
import assert from "node:assert/strict";
import { calculateFixerPricing } from "./fixer-pricing.ts";

test("pricing without base is estimate with null customer price", () => {
  const p = calculateFixerPricing({});
  assert.equal(p.isEstimate, true);
  assert.equal(p.customerPriceKobo, null);
  assert.equal(p.providerCostKobo, null);
});

test("pricing with option price is deterministic", () => {
  const p = calculateFixerPricing({ optionPriceKobo: 10000, quantity: 2, platformFeeBps: 500 });
  assert.equal(p.isEstimate, false);
  assert.equal(p.providerCostKobo, 20000);
  assert.equal(p.unibudMarginKobo, 1000);
  assert.equal(p.customerPriceKobo, 21000);
  assert.equal(p.providerPayoutKobo, 20000);
});

test("delivery adds to customer price only", () => {
  const p = calculateFixerPricing({
    optionPriceKobo: 5000,
    quantity: 1,
    deliveryKobo: 1500,
    platformFeeBps: 0,
  });
  assert.equal(p.providerCostKobo, 5000);
  assert.equal(p.customerPriceKobo, 6500);
  assert.equal(p.providerPayoutKobo, 5000);
});
