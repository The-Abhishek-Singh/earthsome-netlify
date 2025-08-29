"use client";
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart from localStorage on component mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(parsedCart);
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
  }, []);

  // Save cart to localStorage whenever cartItems change
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((prev) => {
      // Check if it's a combo product
      if (product.isCombo) {
        // For combo products, we add them as a single item
        const isExist = prev.find((item) => 
          item._id === product._id && item.isCombo
        );
        
        if (isExist) {
          return prev.map((item) =>
            item._id === product._id && item.isCombo
              ? { 
                  ...item, 
                  quantity: item.quantity + 1,
                }
              : item
          );
        }
        
        return [...prev, { 
          ...product, 
          quantity: 1,
          isCombo: true,
          comboProducts: product.comboProducts || []
        }];
      } else {
        // Regular product handling
        const isExist = prev.find((item) => 
          item._id === product._id && !item.isCombo
        );
        
        if (isExist) {
          return prev.map((item) =>
            item._id === product._id && !item.isCombo
              ? { 
                  ...item, 
                  quantity: item.quantity + 1,
                  bogoFreeItems: item.bogoFreeItems || 0
                }
              : item
          );
        }
        
        return [...prev, { 
          ...product, 
          quantity: 1, 
          bogoFreeItems: 0,
          isCombo: false
        }];
      }
    });
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item._id !== productId));
  };

  const increaseQuantity = (productId, amount = 1) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === productId
          ? { 
              ...item, 
              quantity: item.quantity + amount,
              bogoFreeItems: item.bogoFreeItems || 0
            }
          : item
      )
    );
  };

  const decreaseQuantity = (productId) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === productId
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item
      )
    );
  };

  return (
    <CartContext.Provider 
      value={{ 
        cartItems, 
        addToCart, 
        removeFromCart, 
        increaseQuantity, 
        decreaseQuantity,
        clearCart 
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

// "use client";
// import { createContext, useContext, useState, useEffect } from "react";

// const CartContext = createContext();

// export const CartProvider = ({ children }) => {
//   const [cartItems, setCartItems] = useState([]);

//   // Load cart from localStorage on component mount
//   useEffect(() => {
//     try {
//       const savedCart = localStorage.getItem("cart");
//       if (savedCart) {
//         const parsedCart = JSON.parse(savedCart);
//         setCartItems(parsedCart);
//       }
//     } catch (error) {
//       console.error("Error loading cart from localStorage:", error);
//     }
//   }, []);

//   // Save cart to localStorage whenever cartItems change
//   useEffect(() => {
//     try {
//       localStorage.setItem("cart", JSON.stringify(cartItems));
//     } catch (error) {
//       console.error("Error saving cart to localStorage:", error);
//     }
//   }, [cartItems]);

//   const addToCart = (product) => {
//     setCartItems((prev) => {
//       // Check if it's a combo product
//       if (product.isCombo) {
//         // For combo products, we add them as a single item
//         const isExist = prev.find(
//           (item) => item._id === product._id && item.isCombo
//         );

//         if (isExist) {
//           return prev.map((item) =>
//             item._id === product._id && item.isCombo
//               ? {
//                   ...item,
//                   quantity: item.quantity + 1,
//                 }
//               : item
//           );
//         }

//         return [
//           ...prev,
//           {
//             ...product,
//             quantity: 1,
//             isCombo: true,
//             comboProducts: product.comboProducts || [],
//             comboImages: product.comboImages || [],
//           },
//         ];
//       } else {
//         // Regular product handling
//         const isExist = prev.find(
//           (item) => item._id === product._id && !item.isCombo
//         );

//         if (isExist) {
//           return prev.map((item) =>
//             item._id === product._id && !item.isCombo
//               ? {
//                   ...item,
//                   quantity: item.quantity + 1,
//                   bogoFreeItems: item.bogoFreeItems || 0,
//                 }
//               : item
//           );
//         }

//         return [
//           ...prev,
//           {
//             ...product,
//             quantity: 1,
//             bogoFreeItems: 0,
//             isCombo: false,
//           },
//         ];
//       }
//     });
//   };

//   const clearCart = () => {
//     setCartItems([]);
//     localStorage.removeItem("cart");
//   };

//   const removeFromCart = (productId) => {
//     setCartItems((prev) => prev.filter((item) => item._id !== productId));
//   };

//   const increaseQuantity = (productId, amount = 1) => {
//     setCartItems((prev) =>
//       prev.map((item) =>
//         item._id === productId
//           ? {
//               ...item,
//               quantity: item.quantity + amount,
//               bogoFreeItems: item.bogoFreeItems || 0,
//             }
//           : item
//       )
//     );
//   };

//   const decreaseQuantity = (productId) => {
//     setCartItems((prev) =>
//       prev.map((item) =>
//         item._id === productId
//           ? { ...item, quantity: Math.max(1, item.quantity - 1) }
//           : item
//       )
//     );
//   };

//   return (
//     <CartContext.Provider
//       value={{
//         cartItems,
//         addToCart,
//         removeFromCart,
//         increaseQuantity,
//         decreaseQuantity,
//         clearCart,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// };

// export const useCart = () => useContext(CartContext);
