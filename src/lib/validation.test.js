import { describe, it, expect } from 'vitest';
import { validateIngredientForm, validateProductForm, validateSaleForm, isValid } from './validation';

describe('validateIngredientForm', () => {
  it('passes for a complete valid ingredient', () => {
    const errors = validateIngredientForm({ name: 'Flour', costPerUnit: '2.50', unit: 'kg' });
    expect(isValid(errors)).toBe(true);
  });

  it('requires a name', () => {
    const errors = validateIngredientForm({ name: '  ', costPerUnit: '2', unit: 'kg' });
    expect(errors.name).toBeTruthy();
  });

  it('rejects a negative cost per unit', () => {
    const errors = validateIngredientForm({ name: 'Flour', costPerUnit: '-1', unit: 'kg' });
    expect(errors.costPerUnit).toBeTruthy();
  });

  it('rejects a non-numeric cost per unit', () => {
    const errors = validateIngredientForm({ name: 'Flour', costPerUnit: 'abc', unit: 'kg' });
    expect(errors.costPerUnit).toBeTruthy();
  });

  it('requires a unit', () => {
    const errors = validateIngredientForm({ name: 'Flour', costPerUnit: '2', unit: '' });
    expect(errors.unit).toBeTruthy();
  });
});

describe('validateProductForm', () => {
  it('passes for a complete valid product', () => {
    const errors = validateProductForm({
      name: 'Cake', profitPercentage: '50', ingredients: [{ ingredient: 1, quantity: 2 }],
    });
    expect(isValid(errors)).toBe(true);
  });

  it('requires a name', () => {
    const errors = validateProductForm({ name: '', profitPercentage: '50', ingredients: [{ ingredient: 1, quantity: 1 }] });
    expect(errors.name).toBeTruthy();
  });

  it('rejects a negative profit percentage', () => {
    const errors = validateProductForm({ name: 'Cake', profitPercentage: '-5', ingredients: [{ ingredient: 1, quantity: 1 }] });
    expect(errors.profitPercentage).toBeTruthy();
  });

  it('requires at least one ingredient', () => {
    const errors = validateProductForm({ name: 'Cake', profitPercentage: '50', ingredients: [] });
    expect(errors.ingredients).toBeTruthy();
  });
});

describe('validateSaleForm', () => {
  it('passes for a complete valid sale', () => {
    const errors = validateSaleForm({ product: 1, quantity: '2', soldAt: '2026-08-01' });
    expect(isValid(errors)).toBe(true);
  });

  it('requires a product', () => {
    const errors = validateSaleForm({ product: null, quantity: '2', soldAt: '2026-08-01' });
    expect(errors.product).toBeTruthy();
  });

  it('rejects a zero or negative quantity', () => {
    expect(validateSaleForm({ product: 1, quantity: '0', soldAt: '2026-08-01' }).quantity).toBeTruthy();
    expect(validateSaleForm({ product: 1, quantity: '-3', soldAt: '2026-08-01' }).quantity).toBeTruthy();
  });

  it('requires a sale date', () => {
    const errors = validateSaleForm({ product: 1, quantity: '2', soldAt: '' });
    expect(errors.soldAt).toBeTruthy();
  });
});
