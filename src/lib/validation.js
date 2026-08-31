// Pure form validation — returns an { field: message } errors object, empty when valid.

export function validateIngredientForm({ name, costPerUnit, unit }) {
  const errors = {};
  if (!name || !name.trim()) errors.name = 'Name is required';
  if (costPerUnit === '' || costPerUnit === null || costPerUnit === undefined || Number.isNaN(Number(costPerUnit))) {
    errors.costPerUnit = 'Cost per unit must be a number';
  } else if (Number(costPerUnit) < 0) {
    errors.costPerUnit = 'Cost per unit cannot be negative';
  }
  if (!unit || !unit.trim()) errors.unit = 'Unit is required';
  return errors;
}

export function validateProductForm({ name, profitPercentage, ingredients }) {
  const errors = {};
  if (!name || !name.trim()) errors.name = 'Product name is required';
  if (profitPercentage === '' || profitPercentage === null || profitPercentage === undefined || Number.isNaN(Number(profitPercentage))) {
    errors.profitPercentage = 'Profit percentage must be a number';
  } else if (Number(profitPercentage) < 0) {
    errors.profitPercentage = 'Profit percentage cannot be negative';
  }
  if (!ingredients || ingredients.length === 0) {
    errors.ingredients = 'Add at least one ingredient';
  }
  return errors;
}

export function validateSaleForm({ product, quantity, soldAt }) {
  const errors = {};
  if (!product) errors.product = 'Select a product';
  if (quantity === '' || quantity === null || quantity === undefined || Number.isNaN(Number(quantity))) {
    errors.quantity = 'Quantity must be a number';
  } else if (Number(quantity) <= 0) {
    errors.quantity = 'Quantity must be greater than zero';
  }
  if (!soldAt) errors.soldAt = 'Sale date is required';
  return errors;
}

export function isValid(errors) {
  return Object.keys(errors).length === 0;
}
