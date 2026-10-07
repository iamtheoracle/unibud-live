/**
 * Deterministic Fixer pricing — pure functions, no DB/AI.
 * AI may interpret requests; this module owns final numeric calculation rules.
 */

export type PricingBreakdown = {
  providerCostKobo: number | null;
  unibudCostKobo: number;
  unibudMarginKobo: number;
  customerPriceKobo: number | null;
  providerPayoutKobo: number | null;
  isEstimate: boolean;
  inputs: Record<string, unknown>;
};

export function calculateFixerPricing(input: {
  providerBaseKobo?: number | null;
  optionPriceKobo?: number | null;
  quantity?: number;
  deliveryKobo?: number;
  platformFeeBps?: number;
}): PricingBreakdown {
  const qty = Math.max(1, input.quantity ?? 1);
  const base =
    input.optionPriceKobo != null
      ? input.optionPriceKobo
      : input.providerBaseKobo != null
        ? input.providerBaseKobo
        : null;
  const delivery = Math.max(0, input.deliveryKobo ?? 0);
  const feeBps = Math.min(5000, Math.max(0, input.platformFeeBps ?? 500));

  if (base == null) {
    return {
      providerCostKobo: null,
      unibudCostKobo: 0,
      unibudMarginKobo: 0,
      customerPriceKobo: null,
      providerPayoutKobo: null,
      isEstimate: true,
      inputs: { qty, delivery, feeBps, reason: "no_verified_price" },
    };
  }

  const providerCost = base * qty;
  const margin = Math.round((providerCost * feeBps) / 10000);
  const unibudCost = 0;
  const customerPrice = providerCost + margin + delivery + unibudCost;
  const providerPayout = providerCost;

  return {
    providerCostKobo: providerCost,
    unibudCostKobo: unibudCost,
    unibudMarginKobo: margin,
    customerPriceKobo: customerPrice,
    providerPayoutKobo: providerPayout,
    isEstimate: false,
    inputs: { qty, delivery, feeBps, base },
  };
}
