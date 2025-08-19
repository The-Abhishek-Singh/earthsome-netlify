"use client";
import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  Lock,
  Truck,
  Shield,
  Tag,
  X,
  Check,
  Gift,
} from "lucide-react";
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import ShippingForm from "@/Components/Checkout/ShippingForm";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";

const CartPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession(); // Add status to track loading
  const { cartItems, increaseQuantity, decreaseQuantity, removeFromCart } =
    useCart();

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [freeGiftAdded, setFreeGiftAdded] = useState(false);
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);
  // Track applied coupons to prevent reuse in same session
  const [sessionAppliedCoupons, setSessionAppliedCoupons] = useState(new Set());

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const savings = cartItems.reduce((sum, item) => {
    const original = item.originalPrice || item.price;
    return sum + (original - item.price) * item.quantity;
  }, 0);

  const baseShipping = subtotal > 50 ? 0 : 0;

  // Enhanced coupon discount calculation
  const calculateCouponDiscount = () => {
    if (!appliedCoupon) return { discount: 0, shipping: baseShipping, message: "" };

    let discount = 0;
    let shipping = baseShipping;
    let message = "";
    
    // Check minimum cart value first
    if (appliedCoupon.minCartValue && subtotal < appliedCoupon.minCartValue) {
      return {
        discount: 0,
        shipping: baseShipping,
        message: `Add ₹${(appliedCoupon.minCartValue - subtotal).toFixed(2)} more to apply this discount`
      };
    }

    switch (appliedCoupon.type) {
      case "flat":
        discount = Math.min(appliedCoupon.value, subtotal);
        message = `₹${appliedCoupon.value} off applied`;
        break;

      case "percentage":
        discount = (subtotal * appliedCoupon.value) / 100;
        if (appliedCoupon.maxDiscountValue) {
          discount = Math.min(discount, appliedCoupon.maxDiscountValue);
        }
        message = `${appliedCoupon.value}% off applied`;
        break;

      case "bundle":
        // Check if all bundle products are in cart
        const bundleProducts = appliedCoupon.bundleProducts || [];
        const bundleItemsInCart = cartItems.filter(item => 
          bundleProducts.includes(item._id)
        );
        
        if (bundleItemsInCart.length === bundleProducts.length) {
          // Calculate bundle discount
          const bundleSubtotal = bundleItemsInCart.reduce(
            (sum, item) => sum + (item.price * item.quantity),
            0
          );
          discount = (bundleSubtotal * appliedCoupon.value) / 100;
          message = `Bundle discount: ${appliedCoupon.value}% off`;
        } else {
          const missingItems = bundleProducts.length - bundleItemsInCart.length;
          message = `Add ${missingItems} more bundle item(s) to get ${appliedCoupon.value}% off`;
          discount = 0;
        }
        break;

      case "bogo":
        // Enhanced BOGO calculation
        const { buyQuantity, getQuantity, bogoApplicableProducts } = appliedCoupon;
        let bogoDiscount = 0;
        
        // If specific products are defined for BOGO
        if (bogoApplicableProducts && bogoApplicableProducts.length > 0) {
          // Filter items that are eligible for BOGO
          const eligibleItems = cartItems.filter(item => 
            bogoApplicableProducts.some(p => p.productId === item._id)
          ).sort((a, b) => a.price - b.price); // Sort by price to give cheaper items free
          
          let totalEligibleQuantity = eligibleItems.reduce((sum, item) => sum + item.quantity, 0);
          
          if (totalEligibleQuantity >= buyQuantity) {
            // Calculate how many sets of "buy X get Y" can be applied
            const sets = Math.floor(totalEligibleQuantity / (buyQuantity + getQuantity));
            const totalFreeItems = sets * getQuantity;
            
            // Apply discount to the cheapest eligible items
            let remainingFreeItems = totalFreeItems;
            for (const item of eligibleItems) {
              if (remainingFreeItems <= 0) break;
              const freeFromThisItem = Math.min(remainingFreeItems, item.quantity);
              bogoDiscount += freeFromThisItem * item.price;
              remainingFreeItems -= freeFromThisItem;
            }
          }
        } else {
          // If no specific products are defined, apply to all items
          const sortedItems = [...cartItems].sort((a, b) => a.price - b.price);
          const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
          
          if (totalItems >= buyQuantity) {
            // Calculate how many sets of "buy X get Y" can be applied
            const sets = Math.floor(totalItems / (buyQuantity + getQuantity));
            const totalFreeItems = sets * getQuantity;
            
            // Apply discount to the cheapest items
            let remainingFreeItems = totalFreeItems;
            for (const item of sortedItems) {
              if (remainingFreeItems <= 0) break;
              const freeFromThisItem = Math.min(remainingFreeItems, item.quantity);
              bogoDiscount += freeFromThisItem * item.price;
              remainingFreeItems -= freeFromThisItem;
            }
          }
        }
        
        discount = bogoDiscount;
        message = bogoDiscount > 0 
          ? `Buy ${buyQuantity} Get ${getQuantity} Free Applied`
          : `Add ${buyQuantity - (cartItems.reduce((sum, item) => sum + item.quantity, 0))} more items for BOGO offer`;
        break;

      case "free_gift":
        // Free gift doesn't reduce cart total but adds value
        discount = 0;
        message = `Free ${appliedCoupon.giftProduct} included`;
        break;

      case "free_shipping":
        if (subtotal >= appliedCoupon.freeShippingThreshold) {
          shipping = 0;
          message = "Free shipping applied";
        } else {
          message = `Add ₹${(appliedCoupon.freeShippingThreshold - subtotal).toFixed(2)} more for free shipping`;
        }
        break;

      case "referral":
        discount = (subtotal * appliedCoupon.value) / 100;
        if (appliedCoupon.maxDiscountValue) {
          discount = Math.min(discount, appliedCoupon.maxDiscountValue);
        }
        message = `Referral discount: ${appliedCoupon.value}% off`;
        break;

      case "first_time":
        discount = (subtotal * appliedCoupon.value) / 100;
        if (appliedCoupon.maxDiscountValue) {
          discount = Math.min(discount, appliedCoupon.maxDiscountValue);
        }
        message = `First purchase discount: ${appliedCoupon.value}% off`;
        break;

      default:
        discount = 0;
        message = "Discount applied";
    }

    return { discount, shipping, message };
  };

  const couponResult = calculateCouponDiscount();
  const couponDiscount = couponResult.discount;
  const shipping = couponResult.shipping;
  const couponMessage = couponResult.message;

  const total = subtotal + shipping - couponDiscount;

  // Apply coupon function - COMPLETELY REWRITTEN
  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }

    // Wait for session to load if it's still loading
    if (status === 'loading') {
      setCouponError("Loading user session, please wait...");
      return;
    }

    // STRICT REQUIREMENT: User must be authenticated to use coupons
    if (status === 'unauthenticated' || !session?.user) {
      setCouponError("Please login to apply coupon codes");
      return;
    }

    console.log('🔍 Session check passed, user:', session.user);
    console.log('🔍 Session user ID:', session.user.id);
    console.log('🔍 Session user email:', session.user.email);

    setCouponLoading(true);
    setCouponError("");

    try {
      // STEP 1: ALWAYS ensure MongoDB user exists (for production compatibility)
      let mongoUserId = null;
      
      console.log('🔄 Ensuring MongoDB user exists for production...');
      console.log('🔍 Session user data:', {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name
      });
      
      try {
        const userData = {
          email: session.user.email,
          name: session.user.name,
          image: session.user.image,
          sub: session.user.sub || session.user.id
        };
        
        console.log('📝 Creating/finding MongoDB user with data:', userData);
        
        const mongoUserResponse = await fetch(`${API_URL}/api/users/google-user`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData)
        });
        
        console.log('🌐 MongoDB user response status:', mongoUserResponse.status);
        
        if (!mongoUserResponse.ok) {
          const errorText = await mongoUserResponse.text();
          console.error('❌ Failed to create/find MongoDB user:', errorText);
          throw new Error('Failed to setup user account for coupon usage');
        }
        
        const mongoUserData = await mongoUserResponse.json();
        console.log('✅ MongoDB user response:', mongoUserData);
        
        if (!mongoUserData.success || !mongoUserData.user?._id) {
          throw new Error('Invalid response from user service');
        }
        
        mongoUserId = mongoUserData.user._id;
        console.log('✅ Using MongoDB user ID:', mongoUserId);
        
      } catch (userError) {
        console.error('❌ Failed to setup MongoDB user:', userError);
        setCouponError('Failed to setup your account for coupon usage. Please try again.');
        setCouponLoading(false);
        return;
      }

      // STEP 2: Get and validate discount
      const discountResponse = await fetch(`${API_URL}/api/discounts`);
      
      if (!discountResponse.ok) {
        throw new Error('Failed to fetch available discounts');
      }
      
      const discounts = await discountResponse.json();
      
      const discount = discounts.find(
        (d) => d.code.toLowerCase() === couponCode.toLowerCase()
      );

      if (!discount) {
        setCouponError("Invalid coupon code");
        setCouponLoading(false);
        return;
      }

      // Check if expired
      if (discount.expiryDate && new Date(discount.expiryDate) < new Date()) {
        setCouponError("This coupon has expired");
        setCouponLoading(false);
        return;
      }

      // STEP 3: Check if user has already used this coupon
      console.log('🔍 Checking if user has already used coupon:', mongoUserId, discount.code);
      
      const usedCouponsResponse = await fetch(`${API_URL}/api/discounts/used/${mongoUserId}`);
      
      if (!usedCouponsResponse.ok) {
        throw new Error('Failed to verify coupon usage');
      }
      
      const usedCoupons = await usedCouponsResponse.json();
      console.log('✅ User used coupons:', usedCoupons);
      
      const hasUsedCoupon = usedCoupons.some(used => used.code === discount.code);
      console.log('❓ Has user used this coupon?', hasUsedCoupon);
      
      if (hasUsedCoupon) {
        setCouponError("You have already used this coupon");
        setCouponLoading(false);
        return;
      }

      // STEP 4: Validate discount requirements
      switch (discount.type) {
        case 'bundle':
          const bundleProducts = discount.bundleProducts || [];
          const bundleItemsInCart = cartItems.filter(item => 
            bundleProducts.includes(item._id)
          );
          if (bundleItemsInCart.length === 0) {
            setCouponError("Add bundle items to cart first");
            setCouponLoading(false);
            return;
          }
          break;
          
        case 'bogo':
          const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
          if (itemCount < discount.buyQuantity) {
            setCouponError(`Add ${discount.buyQuantity - itemCount} more items for BOGO offer`);
            setCouponLoading(false);
            return;
          }
          break;

        case 'first_time':
          try {
            // Check user's order history from localStorage
            const orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
            if (orderHistory.length > 0) {
              setCouponError("This discount is only valid for first-time purchases");
              setCouponLoading(false);
              return;
            }
          } catch (err) {
            console.error("Error checking order history:", err);
          }
          break;
          
        case 'free_gift':
          if (subtotal < discount.giftThreshold) {
            setCouponError(`Minimum cart value of ₹${discount.giftThreshold} required for free gift`);
            setCouponLoading(false);
            return;
          }
          break;
          
        default:
          // Check minimum cart value for other discount types
          if (discount.minCartValue && subtotal < discount.minCartValue) {
            setCouponError(`Minimum cart value of ₹${discount.minCartValue} required`);
            setCouponLoading(false);
            return;
          }
      }

      // STEP 5: Reserve the coupon to prevent concurrent usage
      try {
        console.log('🔒 Reserving coupon:', discount.code, 'for user:', mongoUserId);
        
        const reserveResponse = await fetch(`${API_URL}/api/discounts/reserve`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: mongoUserId,
            couponCode: discount.code,
            sessionId: Date.now().toString(),
            orderValue: subtotal
          })
        });

        console.log('🌐 Reserve response status:', reserveResponse.status);

        if (!reserveResponse.ok) {
          const errorData = await reserveResponse.json().catch(() => ({}));
          console.log('❌ Reserve error:', errorData);
          throw new Error(errorData.error || 'This coupon is no longer available');
        }
        
        const reserveData = await reserveResponse.json();
        console.log('✅ Coupon reserved successfully:', reserveData);
        
      } catch (reserveError) {
        console.error('Failed to reserve coupon:', reserveError);
        setCouponError(reserveError.message || 'This coupon is currently unavailable');
        setCouponLoading(false);
        return;
      }

      // STEP 6: Apply the coupon locally
      setAppliedCoupon(discount);
      setCouponCode("");
      setCouponError("");
      
      // Track this coupon in session to prevent immediate reuse
      const sessionKey = `${mongoUserId}-${discount.code}`;
      setSessionAppliedCoupons(prev => new Set([...prev, sessionKey]));
      
      // STEP 7: Handle special coupon types
      if (discount.type === 'free_gift') {
        // Check if we haven't already added the gift
        if (!freeGiftAdded) {
          try {
            // Fetch the actual gift product from the products API
            const productsResponse = await fetch(`${API_URL}/api/products`);
            const products = await productsResponse.json();
            
            // Find the product that matches the gift name
            const giftProduct = products.find(p => 
              p.productName.toLowerCase() === discount.giftProduct.toLowerCase()
            );

            if (giftProduct) {
              // Add the actual product as a gift to cart
              const giftItem = {
                ...giftProduct,
                price: 0, // Make it free
                quantity: 1,
                isGift: true, // Flag to identify this as a gift item
                originalPrice: giftProduct.price // Store original price for reference
              };
              cartItems.push(giftItem);
              setFreeGiftAdded(true);
            } else {
              console.warn("Gift product not found in inventory");
            }
          } catch (error) {
            console.error("Error fetching gift product:", error);
          }
        }
      }

      console.log('✅ Coupon applied successfully:', discount.code);
      
    } catch (error) {
      console.error("Error applying coupon:", error);
      setCouponError(error.message || "Failed to apply coupon. Please try again.");
    } finally {
      setCouponLoading(false);
    }
  };

  // Remove coupon function
  const removeCoupon = () => {
    // If there was a free gift, remove it from cart
    if (appliedCoupon?.type === 'free_gift' && freeGiftAdded) {
      const updatedItems = cartItems.filter(item => !item.isGift);
      cartItems.length = 0;
      cartItems.push(...updatedItems);
    }
    
    // Release the reserved coupon when user removes it
    if (appliedCoupon && session?.user) {
      const userId = session.user.id;
      releaseReservedCoupon(appliedCoupon.code, userId);
    }
    
    // Remove from session tracking
    if (appliedCoupon && session?.user?.id) {
      const sessionKey = `${session.user.id}-${appliedCoupon.code}`;
      setSessionAppliedCoupons(prev => {
        const newSet = new Set(prev);
        newSet.delete(sessionKey);
        return newSet;
      });
    }
    
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
    setFreeGiftAdded(false);
  };

  // Function to release a reserved coupon
  const releaseReservedCoupon = async (couponCode, userId) => {
    if (!couponCode || !userId) return;
    
    try {
      console.log('🔓 Releasing reserved coupon:', couponCode);
      await fetch(`${API_URL}/api/discounts/release`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          couponCode: couponCode
        })
      });
    } catch (error) {
      console.error('Error releasing reserved coupon:', error);
      // Non-critical error, don't show to user
    }
  };

  // Handle checkout process
  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      return;
    }

    setIsProcessingCheckout(true);
    try {
      // SECURITY: Verify authentication before allowing checkout with coupon
      if (appliedCoupon && (!session || !session.user)) {
        alert('Please sign in to complete checkout with coupon codes.');
        setIsProcessingCheckout(false);
        return;
      }

      // Save order details and coupon information to localStorage for checkout
      const checkoutData = {
        items: cartItems,
        subtotal,
        shipping,
        couponDiscount,
        total,
        originalTotal: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
        appliedCoupon: appliedCoupon ? {
          code: appliedCoupon.code,
          type: appliedCoupon.type,
          value: appliedCoupon.value,
          discount: couponDiscount,
          message: couponMessage,
          _id: appliedCoupon._id,
          // SECURITY: Add session signature to prevent tampering
          userId: session?.user?.id,
          userEmail: session?.user?.email
        } : null,
        timestamp: new Date().toISOString(),
        // SECURITY: Add session info to validate in checkout
        sessionSignature: appliedCoupon ? {
          userId: session?.user?.id,
          userEmail: session?.user?.email,
          timestamp: new Date().toISOString()
        } : null
      };

      // Store checkout data for the checkout page
      localStorage.setItem('checkoutData', JSON.stringify(checkoutData));

      // Redirect to checkout page using Next.js router
      router.push('/checkout');
    } catch (error) {
      console.error('Error processing checkout:', error);
    } finally {
      setIsProcessingCheckout(false);
    }
  };

  return (
    <div className="min-h-screen mt-6  sm:mt-28 bg-white mb-[481px]">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/"> 
                <button className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors">
                  <ArrowLeft size={20} /> 
                  <span className="hidden sm:inline">Continue Shopping</span>
                </button> 
              </Link>
              <div className="h-6 w-px bg-gray-300 hidden sm:block"></div>
              <h1 className="text-2xl font-bold text-black">Shopping Cart</h1>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <ShoppingBag size={20} />
              <span className="text-sm">{cartItems.length} items</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-black">Your Items</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <div key={item._id} className="p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-shrink-0 relative">
                        <Image
                          src={item.productImageURL}
                          alt={item.productName}
                          width={128}
                          height={128}
                          className="rounded-lg object-cover w-32 h-32"
                        />
                        {item.bogoFreeItems > 0 && (
                          <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                            {item.bogoFreeItems} Free with BOGO
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="font-semibold text-black text-lg mb-1">
                              {item.name}
                            </h3>
                            <p className="text-gray-600 text-sm mb-2">
                              {item.description}
                            </p>

                            {/* Stock status */}
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-2 h-2 rounded-full bg-green-500"></div>
                              <span className="text-xs font-medium text-green-600">
                                In Stock
                              </span>
                            </div>

                            {/* Price */}
                            <div className="flex items-center gap-2 mb-4">
                              <span className="text-lg font-bold text-black">
                                ₹{item.price.toFixed(2)}
                              </span>
                              {item.originalPrice &&
                                item.originalPrice > item.price && (
                                  <span className="text-sm text-gray-500 line-through">
                                    ₹{item.originalPrice.toFixed(2)}
                                  </span>
                                )}
                            </div>

                            {/* Quantity controls */}
                            <div className="flex items-center gap-4">
                              <div className="flex items-center border border-black rounded-lg">
                                <button
                                  className="p-2 hover:bg-gray-100 transition-colors text-black"
                                  onClick={() => decreaseQuantity(item._id)}
                                >
                                  <Minus size={16} />
                                </button>
                                <span className="px-4 py-2 text-sm font-medium text-black">
                                  {item.quantity}
                                </span>
                                <button
                                  className="p-2 hover:bg-gray-100 transition-colors text-black"
                                  onClick={() => increaseQuantity(item._id)}
                                >
                                  <Plus size={16} />
                                </button>
                              </div>
                              <button
                                className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors text-sm"
                                onClick={() => removeFromCart(item._id)}
                              >
                                <Trash2 size={16} />
                                Remove
                              </button>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-xl font-bold text-black">
                              ₹{(item.price * (item.quantity - (item.bogoFreeItems || 0))).toFixed(2)}
                            </div>
                            {item.originalPrice &&
                              item.originalPrice > item.price && (
                                <div className="text-sm text-green-600 font-medium">
                                  Save ₹
                                  {(item.originalPrice - item.price) *
                                    (item.quantity - (item.bogoFreeItems || 0))}
                                </div>
                              )}
                            {item.bogoFreeItems > 0 && (
                              <div className="text-sm text-green-600 font-medium">
                                + {item.bogoFreeItems} items free with BOGO
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {cartItems.length === 0 && (
                  <div className="p-6 text-gray-500 text-center">
                    Your cart is empty.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary with Coupon */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border sticky top-8">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-black">
                  Order Summary
                </h2>
              </div>
              
              {/* Coupon Section */}
              <div className="p-6 border-b border-gray-200">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Tag size={16} className="inline mr-2" />
                    Have a coupon code?
                  </label>
                  
                  {/* Authentication Status */}
                  <div className={`text-xs mb-3 p-2 rounded ${
                    status === 'loading' 
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : session?.user 
                      ? 'bg-green-50 text-green-700 border border-green-200' 
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    {status === 'loading' 
                      ? '⏳ Loading user session...'
                      : session?.user 
                      ? `✓ Signed in as ${session.user.name || session.user.email} - You can apply coupon codes` 
                      : '🔒 Please sign in to apply coupon codes - Each coupon can only be used once per account'
                    }
                  </div>
                  
                  {/* Sign in link for guest users */}
                  {status !== 'loading' && !session?.user && (
                    <div className="mb-4 text-center">
                      <Link 
                        href="/Login" 
                        className="text-sm text-blue-600 hover:text-blue-800 underline font-medium"
                      >
                        Sign in to your account →
                      </Link>
                    </div>
                  )}
                  
                  {!appliedCoupon ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder={session?.user ? "Enter coupon code" : "Sign in to use coupons"}
                        disabled={!session?.user || status === 'loading'}
                        className={`flex-1 px-3 py-2 text-black border rounded-md focus:outline-none text-sm ${
                          session?.user && status !== 'loading'
                            ? 'border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500' 
                            : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && session?.user && status !== 'loading') {
                            applyCoupon();
                          }
                        }}
                      />
                      <button
                        onClick={applyCoupon}
                        disabled={couponLoading || !session?.user || status === 'loading'}
                        className={`px-4 py-2 rounded-md transition-colors text-sm font-medium ${
                          session?.user && status !== 'loading'
                            ? 'bg-green-500 text-white hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed' 
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                        title={!session?.user ? "Please sign in to use coupons" : ""}
                      >
                        {couponLoading ? "..." : "Apply"}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-md p-3">
                        <div className="flex items-center gap-2">
                          <Check size={16} className="text-green-600" />
                          <span className="text-sm font-medium text-green-800">
                            {appliedCoupon.code}
                          </span>
                        </div>
                        <button
                          onClick={removeCoupon}
                          className="text-green-600 hover:text-green-800 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                      <p className="text-xs text-green-600">{couponMessage}</p>
                    </div>
                  )}
                  
                  {couponError && (
                    <p className="text-red-600 text-xs mt-2">{couponError}</p>
                  )}
                </div>
              </div>

              {/* Order Summary */}
              <div className="p-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-black font-medium">
                      ₹{subtotal.toFixed(2)}
                    </span>
                  </div>
                  
                  {savings > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Savings</span>
                      <span className="text-green-600 font-medium">
                        -₹{savings.toFixed(2)}
                      </span>
                    </div>
                  )}
                  
                  {appliedCoupon && couponDiscount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Coupon Discount</span>
                      <span className="text-green-600 font-medium">
                        -₹{couponDiscount.toFixed(2)}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-black font-medium">
                      {shipping === 0 ? "FREE" : `₹${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-3">
                    <span className="text-black">Total</span>
                    <span className="text-black">₹{total.toFixed(2)}</span>
                  </div>
                </div>

                <button 
                  onClick={handleCheckout}
                  className="w-full bg-green-500 text-white py-4 px-6 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={cartItems.length === 0 || isProcessingCheckout}
                >
                  <Lock size={18} />
                  {isProcessingCheckout ? (
                    "Processing..."
                  ) : (
                    "Secure Checkout"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;