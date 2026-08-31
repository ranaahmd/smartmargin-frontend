// Pure helpers for turning the /api/analytics/monthly/ response into
// display-ready values, kept separate from Dashboard.jsx so they're testable
// without rendering.

export function formatCurrency(value) {
  const num = Number(value);
  return `$${(Number.isNaN(num) ? 0 : num).toFixed(2)}`;
}

export function changeDirection(changePct) {
  if (changePct === null || changePct === undefined) return 'flat';
  if (changePct > 0) return 'up';
  if (changePct < 0) return 'down';
  return 'flat';
}

export function changeColor(changePct) {
  const dir = changeDirection(changePct);
  if (dir === 'up') return 'text-green-500';
  if (dir === 'down') return 'text-red-500';
  return 'text-gray-400';
}

export function buildRevenueSeries(dailyRevenue = []) {
  return {
    categories: dailyRevenue.map((d) => d.date),
    data: dailyRevenue.map((d) => Number(d.revenue)),
  };
}

export function buildTopProfitSeries(bestSellersByProfit = [], limit = 5) {
  const rows = bestSellersByProfit.slice(0, limit);
  return {
    categories: rows.map((p) => p.product_name),
    data: rows.map((p) => Number(p.profit)),
  };
}

export function hasSalesData(analytics) {
  return !!analytics && Array.isArray(analytics.daily_revenue) && analytics.daily_revenue.length > 0;
}
