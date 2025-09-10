"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";

const FloatingCart = () => {
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);

  // Function to get cart count from localStorage
  const getCartData = () => {
    try {
      const cart = localStorage.getItem("cart");
      if (cart) {
        const cartData = JSON.parse(cart);
        if (Array.isArray(cartData)) {
          const count = cartData.reduce(
            (total, item) => total + (item.quantity || 1),
            0
          );
          const total = cartData.reduce(
            (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
            0
          );
          return { count, total };
        }
        if (cartData.items && Array.isArray(cartData.items)) {
          const count = cartData.items.reduce(
            (total, item) => total + (item.quantity || 1),
            0
          );
          const total = cartData.items.reduce(
            (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
            0
          );
          return { count, total };
        }
        if (cartData.totalItems) {
          return {
            count: cartData.totalItems,
            total: cartData.totalAmount || 0,
          };
        }
      }
      return { count: 0, total: 0 };
    } catch (error) {
      console.error("Error reading cart from localStorage:", error);
      return { count: 0, total: 0 };
    }
  };

  useEffect(() => {
    const { count, total } = getCartData();
    setCartCount(count);
    setCartTotal(total);

    const handleStorageChange = (e) => {
      if (e.key === "cart") {
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

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("cartUpdated", handleCartUpdate);

    const interval = setInterval(() => {
      const { count, total } = getCartData();
      if (count !== cartCount || total !== cartTotal) {
        setCartCount(count);
        setCartTotal(total);
      }
    }, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("cartUpdated", handleCartUpdate);
      clearInterval(interval);
    };
  }, [cartCount, cartTotal]);

  return (
    <>
      {/* Shake animation */}
      <style jsx>{`
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0) translateY(-50%);
          }
          25% {
            transform: translateX(-8px) translateY(-50%);
          }
          75% {
            transform: translateX(8px) translateY(-50%);
          }
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
              {cartCount > 99 ? "99+" : cartCount}
            </div>
          )}
        </div>
      </Link>
    </>
  );
};

export default FloatingCart;

// "use client";

// import React, { useState, useEffect } from "react";
// import Link from "next/link";
// import { ShoppingCart } from "lucide-react";

// const FloatingCart = () => {
//   const [cartCount, setCartCount] = useState(0);
//   const [cartTotal, setCartTotal] = useState(0);
//   const [ripples, setRipples] = useState([]);
//   const [showAnimations, setShowAnimations] = useState(false);
//   const [isScrolling, setIsScrolling] = useState(false);

//   // Function to get cart count from localStorage
//   const getCartData = () => {
//     try {
//       const cart = localStorage.getItem("cart");
//       if (cart) {
//         const cartData = JSON.parse(cart);
//         if (Array.isArray(cartData)) {
//           const count = cartData.reduce(
//             (total, item) => total + (item.quantity || 1),
//             0
//           );
//           const total = cartData.reduce(
//             (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
//             0
//           );
//           return { count, total };
//         }
//         if (cartData.items && Array.isArray(cartData.items)) {
//           const count = cartData.items.reduce(
//             (total, item) => total + (item.quantity || 1),
//             0
//           );
//           const total = cartData.items.reduce(
//             (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
//             0
//           );
//           return { count, total };
//         }
//         if (cartData.totalItems) {
//           return {
//             count: cartData.totalItems,
//             total: cartData.totalAmount || 0,
//           };
//         }
//       }
//       return { count: 0, total: 0 };
//     } catch (error) {
//       console.error("Error reading cart from localStorage:", error);
//       return { count: 0, total: 0 };
//     }
//   };

//   // Handle ripple effect
//   const handleRipple = (e) => {
//     const button = e.currentTarget;
//     const rect = button.getBoundingClientRect();
//     const size = Math.max(rect.width, rect.height);
//     const x = e.clientX - rect.left - size / 2;
//     const y = e.clientY - rect.top - size / 2;

//     const newRipple = {
//       id: Date.now(),
//       x,
//       y,
//       size,
//     };

//     setRipples((prev) => [...prev, newRipple]);

//     // Remove ripple after animation
//     setTimeout(() => {
//       setRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id));
//     }, 600);
//   };

//   useEffect(() => {
//     const { count, total } = getCartData();
//     setCartCount(count);
//     setCartTotal(total);

//     const handleStorageChange = (e) => {
//       if (e.key === "cart") {
//         const { count, total } = getCartData();
//         setCartCount(count);
//         setCartTotal(total);
//       }
//     };

//     const handleCartUpdate = () => {
//       const { count, total } = getCartData();
//       setCartCount(count);
//       setCartTotal(total);
//     };

//     // Scroll detection
//     let scrollTimer;
//     const handleScroll = () => {
//       setIsScrolling(true);
//       setShowAnimations(false);

//       clearTimeout(scrollTimer);
//       scrollTimer = setTimeout(() => {
//         setIsScrolling(false);
//         // Start animations after user stops scrolling for 3 seconds
//         setTimeout(() => {
//           setShowAnimations(true);
//         }, 3000);
//       }, 150);
//     };

//     // Initial animation trigger after 5 seconds
//     const initialTimer = setTimeout(() => {
//       if (!isScrolling) {
//         setShowAnimations(true);
//       }
//     }, 5000);

//     window.addEventListener("storage", handleStorageChange);
//     window.addEventListener("cartUpdated", handleCartUpdate);
//     window.addEventListener("scroll", handleScroll);

//     const interval = setInterval(() => {
//       const { count, total } = getCartData();
//       if (count !== cartCount || total !== cartTotal) {
//         setCartCount(count);
//         setCartTotal(total);
//       }
//     }, 1000);

//     return () => {
//       window.removeEventListener("storage", handleStorageChange);
//       window.removeEventListener("cartUpdated", handleCartUpdate);
//       window.removeEventListener("scroll", handleScroll);
//       clearInterval(interval);
//       clearTimeout(initialTimer);
//       clearTimeout(scrollTimer);
//     };
//   }, [cartCount, cartTotal, isScrolling]);

//   // Animation classes based on conditions
//   const getAnimationClasses = () => {
//     let classes =
//       "fixed right-4 top-[85%] -translate-y-1/2 z-50 group floating-cart";

//     if (showAnimations && !isScrolling) {
//       if (cartCount > 0) {
//         classes += " floating-cart-attract floating-cart-wiggle";
//       } else {
//         classes += " floating-cart-gentle";
//       }
//     }

//     return classes;
//   };

//   return (
//     <>
//       {/* Animations */}
//       <style jsx>{`
//         @keyframes shake {
//           0%,
//           100% {
//             transform: translateX(0) translateY(-50%);
//           }
//           25% {
//             transform: translateX(-8px) translateY(-50%);
//           }
//           75% {
//             transform: translateX(8px) translateY(-50%);
//           }
//         }

//         @keyframes ripple {
//           0% {
//             transform: scale(0);
//             opacity: 0.6;
//           }
//           100% {
//             transform: scale(2);
//             opacity: 0;
//           }
//         }

//         @keyframes pulse {
//           0%,
//           100% {
//             transform: scale(1) translateY(-50%);
//             box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
//           }
//           50% {
//             transform: scale(1.05) translateY(-50%);
//             box-shadow: 0 0 0 20px rgba(34, 197, 94, 0);
//           }
//         }

//         @keyframes gentlePulse {
//           0%,
//           100% {
//             transform: scale(1) translateY(-50%);
//             box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4);
//           }
//           50% {
//             transform: scale(1.02) translateY(-50%);
//             box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
//           }
//         }

//         @keyframes bounce {
//           0%,
//           100% {
//             transform: translateY(-50%);
//             animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
//           }
//           50% {
//             transform: translateY(-58%);
//             animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
//           }
//         }

//         @keyframes gentleBob {
//           0%,
//           100% {
//             transform: translateY(-50%);
//           }
//           50% {
//             transform: translateY(-54%);
//           }
//         }

//         @keyframes glow {
//           0%,
//           100% {
//             box-shadow: 0 0 20px rgba(34, 197, 94, 0.3),
//               0 0 40px rgba(34, 197, 94, 0.1);
//           }
//           50% {
//             box-shadow: 0 0 30px rgba(34, 197, 94, 0.6),
//               0 0 60px rgba(34, 197, 94, 0.3);
//           }
//         }

//         @keyframes gentleGlow {
//           0%,
//           100% {
//             box-shadow: 0 0 15px rgba(59, 130, 246, 0.2),
//               0 0 30px rgba(59, 130, 246, 0.1);
//           }
//           50% {
//             box-shadow: 0 0 20px rgba(59, 130, 246, 0.4),
//               0 0 40px rgba(59, 130, 246, 0.2);
//           }
//         }

//         @keyframes wiggle {
//           0%,
//           100% {
//             transform: rotate(0deg) translateY(-50%);
//           }
//           25% {
//             transform: rotate(-3deg) translateY(-50%);
//           }
//           75% {
//             transform: rotate(3deg) translateY(-50%);
//           }
//         }

//         @keyframes badgeBounce {
//           0%,
//           100% {
//             transform: scale(1);
//           }
//           50% {
//             transform: scale(1.2);
//           }
//         }

//         .floating-cart-attract {
//           animation: pulse 2s infinite, bounce 4s infinite 1s,
//             glow 3s infinite 0.5s;
//         }

//         .floating-cart-gentle {
//           animation: gentlePulse 3s infinite, gentleBob 4s infinite 1s,
//             gentleGlow 3.5s infinite 0.5s;
//         }

//         .floating-cart-wiggle {
//           animation-delay: 8s;
//           animation: wiggle 0.5s ease-in-out 6;
//         }

//         .floating-cart:hover {
//           animation: none !important;
//           transform: scale(1.1) translateY(-50%) !important;
//         }

//         .badge-animate {
//           animation: badgeBounce 1.5s infinite;
//           animation-delay: 3s;
//         }

//         .ripple {
//           position: absolute;
//           border-radius: 50%;
//           background: rgba(255, 255, 255, 0.4);
//           pointer-events: none;
//           animation: ripple 0.6s ease-out;
//         }
//       `}</style>

//       <Link
//         href="/cart"
//         className={getAnimationClasses()}
//         onClick={handleRipple}
//       >
//         <div className="h-50 w-50 bg-transparent flex justify-center items-center">
//           {/* in this div's background add the animation round round circle outline that rippel  */}
//           <div className=" group relative w-[60px] h-[60px] rounded-full bg-black border-none flex items-center justify-center shadow-2xl cursor-pointer transition-all duration-300 overflow-hidden hover:w-[120px] hover:rounded-[30px]">
//             {/* Ripple effects */}
//             {ripples.map((ripple) => (
//               <span
//                 key={ripple.id}
//                 className="ripple"
//                 style={{
//                   left: ripple.x,
//                   top: ripple.y,
//                   width: ripple.size,
//                   height: ripple.size,
//                 }}
//               />
//             ))}

//             {/* Cart details - hidden by default, shown on hover */}
//             <div className="absolute inset-0 flex items-center justify-center gap-1 px-3 opacity-0 transition-all duration-300 group-hover:opacity-100">
//               <span className="text-[13px] font-semibold text-white whitespace-nowrap">
//                 Total :
//               </span>
//               {cartCount > 0 && (
//                 <span className="text-[13px] font-semibold text-green-400 mr-2">
//                   ₹{cartTotal.toFixed(0)}
//                 </span>
//               )}
//             </div>

//             {/* Shopping Cart Icon */}
//             <ShoppingCart
//               size={22}
//               className="text-white transition-all duration-300 group-hover:opacity-0 group-hover:scale-0"
//               strokeWidth={2.5}
//             />

//             {/* Cart count badge - Always visible */}
//             {cartCount > 0 && (
//               <div
//                 className={`absolute top-2 right-2 bg-green-400 text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-[1.25rem] shadow-lg border-2 border-white z-10 ${
//                   showAnimations && !isScrolling ? "badge-animate" : ""
//                 }`}
//               >
//                 {cartCount > 99 ? "99+" : cartCount}
//               </div>
//             )}
//           </div>
//         </div>
//       </Link>
//     </>
//   );
// };

// export default FloatingCart;
