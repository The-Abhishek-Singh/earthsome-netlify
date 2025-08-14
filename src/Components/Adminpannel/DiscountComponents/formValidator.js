import { DISCOUNT_TYPES } from './DiscountTypes';

export const validateDiscountForm = (formData) => {
  const errors = {};

  // Basic validations
  if (!formData.code?.trim()) {
    errors.code = 'Discount code is required';
  }

  if (!formData.type) {
    errors.type = 'Discount type is required';
  }

  // Type specific validations
  switch (formData.type) {
    case DISCOUNT_TYPES.PERCENTAGE.value:
      if (!formData.value || formData.value <= 0 || formData.value > 100) {
        errors.value = 'Percentage must be between 0 and 100';
      }
      if (formData.maxDiscountValue && formData.maxDiscountValue <= 0) {
        errors.maxDiscountValue = 'Maximum discount must be greater than 0';
      }
      break;

    case DISCOUNT_TYPES.FIXED.value:
      if (!formData.value || formData.value <= 0) {
        errors.value = 'Discount amount must be greater than 0';
      }
      break;

    case DISCOUNT_TYPES.BOGO.value:
      if (!formData.buyQuantity || formData.buyQuantity < 1) {
        errors.buyQuantity = 'Buy quantity must be at least 1';
      }
      if (!formData.getQuantity || formData.getQuantity < 1) {
        errors.getQuantity = 'Get quantity must be at least 1';
      }
      if (!formData.applicableProducts?.length) {
        errors.applicableProducts = 'Select at least one product';
      }
      break;

    case DISCOUNT_TYPES.BUNDLE.value:
      if (!formData.bundleProducts?.length) {
        errors.bundleProducts = 'Select bundle products';
      }
      if (!formData.value || formData.value <= 0 || formData.value > 100) {
        errors.value = 'Bundle discount percentage must be between 0 and 100';
      }
      break;

    case DISCOUNT_TYPES.FREE_SHIPPING.value:
      if (!formData.minCartValue || formData.minCartValue < 0) {
        errors.minCartValue = 'Minimum cart value cannot be negative';
      }
      break;

    case DISCOUNT_TYPES.FREE_GIFT.value:
      if (!formData.giftProduct?.trim()) {
        errors.giftProduct = 'Gift product is required';
      }
      if (!formData.giftThreshold || formData.giftThreshold <= 0) {
        errors.giftThreshold = 'Minimum purchase amount is required';
      }
      break;

    case DISCOUNT_TYPES.CATEGORY.value:
      if (!formData.categories?.length) {
        errors.categories = 'Select at least one category';
      }
      if (!formData.value || formData.value <= 0 || formData.value > 100) {
        errors.value = 'Category discount percentage must be between 0 and 100';
      }
      break;
  }

  // Common validations
  if (formData.expiryDate) {
    const expiryDate = new Date(formData.expiryDate);
    if (expiryDate < new Date()) {
      errors.expiryDate = 'Expiry date cannot be in the past';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
