import { describe, it, expect } from 'vitest';
import {
  formatCurrency,
  changeDirection,
  changeColor,
  buildRevenueSeries,
  buildTopProfitSeries,
  hasSalesData,
} from './dashboard';

describe('formatCurrency', () => {
  it('formats a number to two decimal places with a dollar sign', () => {
    expect(formatCurrency(12.5)).toBe('$12.50');
  });

  it('parses numeric strings from the API', () => {
    expect(formatCurrency('33.00')).toBe('$33.00');
  });

  it('falls back to $0.00 for non-numeric input', () => {
    expect(formatCurrency(undefined)).toBe('$0.00');
    expect(formatCurrency('not-a-number')).toBe('$0.00');
  });
});

describe('changeDirection', () => {
  it('reports up for positive change', () => {
    expect(changeDirection(12.5)).toBe('up');
  });

  it('reports down for negative change', () => {
    expect(changeDirection(-4)).toBe('down');
  });

  it('reports flat for zero or missing change (no prior-month data)', () => {
    expect(changeDirection(0)).toBe('flat');
    expect(changeDirection(null)).toBe('flat');
    expect(changeDirection(undefined)).toBe('flat');
  });
});

describe('changeColor', () => {
  it('maps direction to a tailwind color class', () => {
    expect(changeColor(5)).toBe('text-green-500');
    expect(changeColor(-5)).toBe('text-red-500');
    expect(changeColor(null)).toBe('text-gray-400');
  });
});

describe('buildRevenueSeries', () => {
  it('maps daily_revenue rows into chart categories and numeric data', () => {
    const daily = [
      { date: '2026-08-01', revenue: '12.00' },
      { date: '2026-08-02', revenue: '6.00' },
    ];
    expect(buildRevenueSeries(daily)).toEqual({
      categories: ['2026-08-01', '2026-08-02'],
      data: [12, 6],
    });
  });

  it('handles an empty series', () => {
    expect(buildRevenueSeries([])).toEqual({ categories: [], data: [] });
    expect(buildRevenueSeries()).toEqual({ categories: [], data: [] });
  });
});

describe('buildTopProfitSeries', () => {
  it('maps best_sellers_by_profit rows into chart categories and numeric data', () => {
    const rows = [
      { product_name: 'Cake', profit: '10.00' },
      { product_name: 'Cookie', profit: '5.00' },
    ];
    expect(buildTopProfitSeries(rows)).toEqual({
      categories: ['Cake', 'Cookie'],
      data: [10, 5],
    });
  });

  it('limits to the requested number of entries', () => {
    const rows = [1, 2, 3].map((n) => ({ product_name: `P${n}`, profit: String(n) }));
    expect(buildTopProfitSeries(rows, 2).categories).toEqual(['P1', 'P2']);
  });
});

describe('hasSalesData', () => {
  it('is false when analytics is missing or has no daily revenue', () => {
    expect(hasSalesData(null)).toBe(false);
    expect(hasSalesData({ daily_revenue: [] })).toBe(false);
  });

  it('is true when there is at least one day of revenue', () => {
    expect(hasSalesData({ daily_revenue: [{ date: '2026-08-01', revenue: '1.00' }] })).toBe(true);
  });
});
