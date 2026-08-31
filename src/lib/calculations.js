// Pure pricing math shared by the product form (live preview) and tests.

export function calculateTotalCost(ingredients = []) {
  return ingredients.reduce((sum, item) => {
    const cost = Number(item.costPerUnit ?? item.cost_per_unit ?? 0);
    const quantity = Number(item.quantity ?? 0);
    if (Number.isNaN(cost) || Number.isNaN(quantity)) return sum;
    return sum + cost * quantity;
  }, 0);
}

export function calculateProfitAmount(totalCost, profitPercentage) {
  const cost = Number(totalCost) || 0;
  const pct = Number(profitPercentage) || 0;
  return (cost * pct) / 100;
}

export function calculateSellingPrice(totalCost, profitPercentage) {
  const cost = Number(totalCost) || 0;
  return cost + calculateProfitAmount(cost, profitPercentage);
}

// Margin = profit as a percentage of revenue (selling price), not of cost.
export function calculateMarginPercent(cost, price) {
  const c = Number(cost) || 0;
  const p = Number(price) || 0;
  if (p <= 0) return 0;
  return ((p - c) / p) * 100;
}
