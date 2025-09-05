'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';

const FloatingCart = () => {
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);

  // Function to get cart count from localStorage
  const getCartData = () => {
    try {
      const cart = localStorage.getItem('cart');
      if (cart) {
        const cartData = JSON.parse(cart);
        if (Array.isArray(cartData)) {
          const count = cartData.reduce((total, item) => total + (item.quantity || 1), 0);
          const total = cartData.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0);
          return { count, total };
        }
        if (cartData.items && Array.isArray(cartData.items)) {
          const count = cartData.items.reduce((total, item) => total + (item.quantity || 1), 0);
          const total = cartData.items.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0);
          return { count, total };
        }
        if (cartData.totalItems) {
          return { count: cartData.totalItems, total: cartData.totalAmount || 0 };
        }
      }
      return { count: 0, total: 0 };
    } catch (error) {
      console.error('Error reading cart from localStorage:', error);
      return { count: 0, total: 0 };
    }
  };

  useEffect(() => {
    const { count, total } = getCartData();
    setCartCount(count);
    setCartTotal(total);

    const handleStorageChange = (e) => {
      if (e.key === 'cart') {
        const { count, total } = getCartData();
        setCartCount(count);
        setCartTotal(total);
      }
    };

    const handleCartUpdate = () => {
      const { count, total } = getCartData();
      setCartCount(count);
      setCartTotal(total);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cartUpdated', handleCartUpdate);

    const interval = setInterval(() => {
      const { count, total } = getCartData();
      if (count !== cartCount || total !== cartTotal) {
        setCartCount(count);
        setCartTotal(total);
      }
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', handleCartUpdate);
      clearInterval(interval);
    };
  }, [cartCount, cartTotal]);

  return (
    <>
      {/* Shake animation */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0) translateY(-50%); }
          25% { transform: translateX(-8px) translateY(-50%); }
          75% { transform: translateX(8px) translateY(-50%); }
        }
        .floating-cart-shake {
          animation: shake 0.6s ease-in-out infinite;
          animation-delay: 3s;
          animation-iteration-count: 4;
          animation-direction: alternate;
        }
        .floating-cart-shake:hover {
          animation: none !important;
        }
      `}</style>

      <Link
        href="/cart"
        className="fixed right-4 top-[85%] -translate-y-1/2 z-50 group floating-cart-shake"
      >
        <div className="group relative w-[60px] h-[60px] rounded-full bg-black border-none flex items-center justify-center shadow-2xl  cursor-pointer transition-all duration-300 overflow-hidden hover:w-[120px] hover:rounded-[30px] ">
          
          {/* Cart details - hidden by default, shown on hover */}
          <div className="absolute inset-0 flex items-center justify-center gap-1 px-3 opacity-0 transition-all duration-300 group-hover:opacity-100">
            <span className="text-[13px] font-semibold text-white whitespace-nowrap">
              Total :
            </span>
            {cartCount > 0 && (
              <span className="text-[13px] font-semibold text-green-400 mr-2">
                ₹{cartTotal.toFixed(0)}
              </span>
            )}
          </div>
          
          {/* Shopping Cart Icon */}
          <ShoppingCart 
            size={22} 
            className="text-white transition-all duration-300 group-hover:opacity-0 group-hover:scale-0" 
            strokeWidth={2.5}
          />
          
          {/* Cart count badge - Always visible */}
          {cartCount > 0 && (
            <div className="absolute top-2 right-2 bg-green-400 hover:hidden text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-[1.25rem] shadow-lg border-2 border-white z-10">
              {cartCount > 99 ? '99+' : cartCount}
            </div>
          )}
        </div>
      </Link>
    </>
  );
};

export default FloatingCart;