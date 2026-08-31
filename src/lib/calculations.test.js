import { describe, it, expect } from 'vitest';
import {
  calculateTotalCost,
  calculateProfitAmount,
  calculateSellingPrice,
  calculateMarginPercent,
} from './calculations';

describe('calculateTotalCost', () => {
  it('sums cost * quantity across ingredients', () => {
    const ingredients = [
      { costPerUnit: 2, quantity: 3 },
      { costPerUnit: 1.5, quantity: 2 },
    ];
    expect(calculateTotalCost(ingredients)).toBeCloseTo(9);
  });

  it('returns 0 for an empty list', () => {
    expect(calculateTotalCost([])).toBe(0);
    expect(calculateTotalCost()).toBe(0);
  });

  it('ignores rows with non-numeric values', () => {
    const ingredients = [{ costPerUnit: 'abc', quantity: 2 }, { costPerUnit: 2, quantity: 3 }];
    expect(calculateTotalCost(ingredients)).toBeCloseTo(6);
  });

  it('accepts snake_case cost_per_unit as a fallback key', () => {
    expect(calculateTotalCost([{ cost_per_unit: 4, quantity: 2 }])).toBe(8);
  });
});

describe('calculateProfitAmount', () => {
  it('applies profit percentage to total cost', () => {
    expect(calculateProfitAmount(10, 50)).toBe(5);
  });

  it('treats missing values as zero', () => {
    expect(calculateProfitAmount(undefined, 50)).toBe(0);
    expect(calculateProfitAmount(10, undefined)).toBe(0);
  });
});

describe('calculateSellingPrice', () => {
  it('is cost plus profit', () => {
    expect(calculateSellingPrice(10, 50)).toBe(15);
  });

  it('equals cost when profit percentage is zero', () => {
    expect(calculateSellingPrice(10, 0)).toBe(10);
  });
});

describe('calculateMarginPercent', () => {
  it('computes profit as a percentage of the selling price', () => {
    // cost 4, price 6 -> profit 2 -> margin 2/6 = 33.33%
    expect(calculateMarginPercent(4, 6)).toBeCloseTo(33.33, 1);
  });

  it('returns 0 when price is zero to avoid division by zero', () => {
    expect(calculateMarginPercent(4, 0)).toBe(0);
  });

  it('returns a negative margin when cost exceeds price', () => {
    expect(calculateMarginPercent(10, 5)).toBeLessThan(0);
  });
});
