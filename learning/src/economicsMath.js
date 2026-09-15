// Teaching examples, not estimates of an actual economy.
export const marketScenarios = {
  baseline: { label: 'もとの市場', demand: 0, cost: 0 },
  demand: { label: '買いたい人が増える', demand: 160, cost: 0 },
  cost: { label: '原材料が値上がりする', demand: 0, cost: 160 },
};
export function marketAt(scenario, price) {
  const { demand, cost } = marketScenarios[scenario];
  const quantity = (480 + demand - cost) / 8;
  return { quantity, price: 120 + cost + 4 * quantity,
    demanded: Math.max(0, (600 + demand - price) / 4),
    supplied: Math.max(0, (price - 120 - cost) / 4) };
}
export function spendingEquilibrium(consumptionBase, investment, propensity = .8) {
  const income = (consumptionBase + investment) / (1 - propensity);
  const consumption = consumptionBase + propensity * income;
  return { income, consumption, saving: income - consumption, investment };
}
export function productionAt(quantity, price = 240) {
  const fixed = 200, variable = 80 * quantity + 20 * quantity ** 2;
  return { quantity, revenue: price * quantity, fixed, variable, cost: fixed + variable,
    profit: price * quantity - fixed - variable,
    additionalCost: quantity ? 80 + 20 * (2 * quantity - 1) : null };
}
export function outputAt(price, quantity) {
  return { nominal: price * quantity, real: 300 * quantity, deflator: price / 300 * 100 };
}
