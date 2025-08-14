import { DollarSign, Percent, ShoppingCart, Gift, Truck, Users, Tag } from 'lucide-react';

export const DISCOUNT_TYPES = {
  PERCENTAGE: { value: 'percentage', label: 'Percentage Off', icon: Percent },
  FLAT: { value: 'flat', label: 'Fixed Amount', icon: DollarSign },
  BOGO: { value: 'bogo', label: 'Buy X Get Y', icon: Gift },
  BUNDLE: { value: 'bundle', label: 'Bundle Deal', icon: ShoppingCart },
  FREE_SHIPPING: { value: 'free_shipping', label: 'Free Shipping', icon: Truck },
  FREE_GIFT: { value: 'free_gift', label: 'Free Gift', icon: Gift },
  FIRST_TIME: { value: 'first_time', label: 'First Purchase', icon: Users },
  REFERRAL: { value: 'referral', label: 'Referral Code', icon: Users }
};

export const getDiscountTypeLabel = (type) => {
  return Object.values(DISCOUNT_TYPES).find(t => t.value === type)?.label || type;
};

export const getDiscountTypeIcon = (type) => {
  return Object.values(DISCOUNT_TYPES).find(t => t.value === type)?.icon || DollarSign;
};

export const formatDiscountValue = (discount) => {
  switch (discount.type) {
    case DISCOUNT_TYPES.FIXED.value:
      return `₹${discount.value}`;
    case DISCOUNT_TYPES.PERCENTAGE.value:
      return `${discount.value}%${discount.maxDiscountValue ? ` (max ₹${discount.maxDiscountValue})` : ''}`;
    case DISCOUNT_TYPES.BOGO.value:
      return `Buy ${discount.buyQuantity} Get ${discount.getQuantity}`;
    case DISCOUNT_TYPES.BUNDLE.value:
      return `${discount.value}% off on bundle`;
    case DISCOUNT_TYPES.FREE_SHIPPING.value:
      return `Free shipping above ₹${discount.minCartValue}`;
    case DISCOUNT_TYPES.FREE_GIFT.value:
      return `Free ${discount.giftProduct} above ₹${discount.giftThreshold}`;
    case DISCOUNT_TYPES.CATEGORY.value:
      return `${discount.value}% off on ${discount.categories?.join(', ')}`;
    case DISCOUNT_TYPES.FIRST_TIME.value:
      return `${discount.value}% off first order`;
    case DISCOUNT_TYPES.REFERRAL.value:
      return `${discount.value}% referral discount`;
    default:
      return '-';
  }
};
