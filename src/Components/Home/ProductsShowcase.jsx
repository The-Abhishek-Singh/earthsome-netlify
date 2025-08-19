// "use client";
// import React, { useEffect, useState, useRef } from "react";
// import axios from "axios";
// import { useRouter } from "next/navigation";
// import { ShoppingCart, Heart, Star, Check, X } from "lucide-react";
// import { useCart } from "@/context/CartContext";

// // Toast Component
// const Toast = ({ message, type, onClose }) => {
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       onClose();
//     }, 3000);
//     return () => clearTimeout(timer);
//   }, [onClose]);

//   return (
//     <div
//       className={`fixed top-20 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl transform transition-all duration-500 ease-out bg-white border ${
//         type === "success"
//           ? "border-green-200 shadow-green-100/50"
//           : "border-red-200 shadow-red-100/50"
//       } backdrop-blur-sm`}
//     >
//       <div
//         className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
//           type === "success" ? "bg-green-500" : "bg-red-500"
//         }`}
//       >
//         {type === "success" ? (
//           <Check size={16} className="text-white" />
//         ) : (
//           <X size={16} className="text-white" />
//         )}
//       </div>
//       <span className="font-semibold text-gray-800">{message}</span>
//       <button
//         onClick={onClose}
//         className="ml-2 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
//       >
//         <X size={16} />
//       </button>
//     </div>
//   );
// };

// const ProductsShowcase = () => {
//   const router = useRouter();
//   const { addToCart } = useCart();
//   const [hoveredProduct, setHoveredProduct] = useState(null);
//   const [favorites, setFavorites] = useState(new Set());
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showAll, setShowAll] = useState(false);
//   const [toast, setToast] = useState(null);
//   const [addingToCart, setAddingToCart] = useState(null);
//   const containerRef = useRef(null);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const res = await axios.get(
//           `${process.env.NEXT_PUBLIC_API_URL}/api/products`
//         );
//         setProducts(res.data);
//       } catch (err) {
//         console.error("Error fetching products:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProducts();
//   }, []);

//   const toggleFavorite = (productId) => {
//     const newFavorites = new Set(favorites);
//     newFavorites.has(productId)
//       ? newFavorites.delete(productId)
//       : newFavorites.add(productId);
//     setFavorites(newFavorites);
//   };

//   const handleAddToCart = async (product, e) => {
//     e.stopPropagation();
//     setAddingToCart(product._id);

//     try {
//       await addToCart(product);
//       setToast({
//         message: `${product.productName} added to cart!`,
//         type: "success",
//       });
//     } catch (error) {
//       setToast({
//         message: "Failed to add product to cart",
//         type: "error",
//       });
//     } finally {
//       setTimeout(() => setAddingToCart(null), 300);
//     }
//   };

//   const getBadgeColor = (badge) => {
//     switch (badge) {
//       case "Best Seller":
//         return "bg-emerald-500";
//       case "New":
//         return "bg-blue-500";
//       case "Premium":
//         return "bg-purple-500";
//       case "Limited":
//         return "bg-orange-500";
//       default:
//         return "bg-gray-500";
//     }
//   };

//   return (
//     <div className="w-full max-w-7xl mx-auto px-4 py-16">
//       {/* Toast Notification */}
//       {toast && (
//         <Toast
//           message={toast.message}
//           type={toast.type}
//           onClose={() => setToast(null)}
//         />
//       )}

//       {/* Header Section */}
//       <div className="text-center mb-16">
//         <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
//           <Star size={16} className="text-green-600" />
//           Premium Collection
//         </div>
//         <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
//           Featured Products
//         </h2>
//         <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
//           Discover our curated range of products crafted for healthier, glowing
//           skin.
//         </p>
//       </div>

//       {loading ? (
//         <div className="text-center py-20">
//           <div className="inline-flex items-center gap-3 bg-white rounded-xl px-6 py-4 shadow-sm">
//             <div className="animate-spin rounded-full h-6 w-6 border-2 border-green-500 border-t-transparent"></div>
//             <span className="text-gray-600 font-medium">
//               Loading products...
//             </span>
//           </div>
//         </div>
//       ) : products.length === 0 ? (
//         <div className="text-center py-20">
//           <div className="inline-flex items-center gap-3 bg-red-50 text-red-600 rounded-xl px-6 py-4">
//             <X size={20} />
//             <span className="font-medium">No products found.</span>
//           </div>
//         </div>
//       ) : (
//         <>
//           <div
//             ref={containerRef}
//             className={`transition-all duration-700 ease-in-out overflow-hidden ${
//               showAll ? "max-h-[5000px]" : "max-h-[2000px]"
//             }`}
//           >
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
//               {(showAll ? products : products.slice(0, 8)).map((product) => (
//                 <div
//                   key={product._id}
//                   className="group relative bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-green-500/10 transition-all duration-500 overflow-hidden cursor-pointer transform hover:-translate-y-2"
//                   onMouseEnter={() => setHoveredProduct(product._id)}
//                   onMouseLeave={() => setHoveredProduct(null)}
//                   onClick={() => router.push(`/products/${product._id}`)}
//                 >
//                   {/* Badge */}
//                   {product.badge && (
//                     <div
//                       className={`absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-white text-sm font-medium ${getBadgeColor(
//                         product.badge
//                       )} shadow-lg`}
//                     >
//                       {product.badge}
//                     </div>
//                   )}

//                   {/* Favorite Button */}
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       toggleFavorite(product._id);
//                     }}
//                     className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 hover:bg-white hover:scale-110 transition-all duration-200 shadow-lg"
//                   >
//                     <Heart
//                       size={18}
//                       className={`${
//                         favorites.has(product._id)
//                           ? "fill-red-500 text-red-500"
//                           : "text-gray-400 hover:text-red-500"
//                       } transition-colors duration-200`}
//                     />
//                   </button>

//                   {/* Image */}
//                   <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 rounded-t-3xl">
//                     <img
//                       src={product.productImageURL}
//                       alt={product.productName}
//                       className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-500"
//                     />
//                     <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

//                     {/* Add to Cart Button */}
//                     <div
//                       className={`absolute inset-x-4 bottom-4 transform transition-all duration-300 ${
//                         hoveredProduct === product._id
//                           ? "translate-y-0 opacity-100"
//                           : "translate-y-4 opacity-0"
//                       }`}
//                     >
//                       <button
//                         className={`w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl ${
//                           addingToCart === product._id
//                             ? "bg-green-700 scale-95"
//                             : ""
//                         }`}
//                         onClick={(e) => handleAddToCart(product, e)}
//                         disabled={addingToCart === product._id}
//                       >
//                         {addingToCart === product._id ? (
//                           <>
//                             <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
//                             Adding...
//                           </>
//                         ) : (
//                           <>
//                             <ShoppingCart size={18} />
//                             Quick Add
//                           </>
//                         )}
//                       </button>
//                     </div>
//                   </div>

//                   {/* Product Info */}
//                   <div className="p-6">
//                     {product.category && (
//                       <div className="mb-3">
//                         <span className="text-sm text-green-600 font-semibold uppercase tracking-wide bg-green-50 px-2 py-1 rounded-lg">
//                           {product.category}
//                         </span>
//                       </div>
//                     )}
//                     <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors duration-200 leading-snug">
//                       {product.productName}
//                     </h3>

//                     {product.rating && (
//                       <div className="flex items-center gap-2 mb-4">
//                         <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg">
//                           <Star
//                             size={16}
//                             className="text-yellow-500 fill-current"
//                           />
//                           <span className="text-sm font-semibold text-gray-700 ml-1">
//                             {product.rating}
//                           </span>
//                         </div>
//                         {product.reviewsCount !== undefined && (
//                           <span className="text-sm text-gray-500">
//                             ({product.reviewsCount} reviews)
//                           </span>
//                         )}
//                       </div>
//                     )}

//                     <div className="flex items-center gap-3 flex-wrap">
//                       <span className="text-2xl font-bold text-gray-900">
//                         ₹{product.price}
//                       </span>
//                       {product.originalPrice && (
//                         <>
//                           <span className="text-lg text-gray-500 line-through">
//                             ₹{product.originalPrice}
//                           </span>
//                           {product.originalPrice - product.price > 0 && (
//                             <span className="text-sm font-bold text-green-700 bg-green-100 px-3 py-1 rounded-full">
//                               Save ₹
//                               {(product.originalPrice - product.price).toFixed(
//                                 2
//                               )}
//                             </span>
//                           )}
//                         </>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Show More/Less Button */}
//           {products.length > 9 && (
//             <div className="text-center mt-16">
//               <button
//                 onClick={() => setShowAll(!showAll)}
//                 className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-10 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-500/50"
//               >
//                 {showAll ? "View Less" : "View All Products"}
//               </button>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default ProductsShowcase;

"use client";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ShoppingCart, Heart, Star, Check, X } from "lucide-react";
import { useCart } from "@/context/CartContext";

// Toast Component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-20 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl transform transition-all duration-500 ease-out bg-white border ${
        type === "success"
          ? "border-green-200 shadow-green-100/50"
          : "border-red-200 shadow-red-100/50"
      } backdrop-blur-sm`}
    >
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          type === "success" ? "bg-green-500" : "bg-red-500"
        }`}
      >
        {type === "success" ? (
          <Check size={16} className="text-white" />
        ) : (
          <X size={16} className="text-white" />
        )}
      </div>
      <span className="font-semibold text-gray-800">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
      >
        <X size={16} />
      </button>
    </div>
  );
};

const StarRating = ({ rating, reviews }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(
        <span key={i} className="text-green-500">
          ★
        </span>
      );
    } else if (i === fullStars && hasHalfStar) {
      stars.push(
        <span key={i} className="text-green-500">
          ★
        </span>
      );
    } else {
      stars.push(
        <span key={i} className="text-gray-300">
          ★
        </span>
      );
    }
  }

  return (
    <div className="flex items-center gap-1">
      <div className="flex">{stars}</div>
      <span className="text-gray-500 text-sm">({reviews})</span>
    </div>
  );
};

const ProductsShowcase = () => {
  const router = useRouter();
  const { addToCart } = useCart();
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [favorites, setFavorites] = useState(new Set());
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [addingToCart, setAddingToCart] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/products`
        );
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const toggleFavorite = (productId) => {
    const newFavorites = new Set(favorites);
    newFavorites.has(productId)
      ? newFavorites.delete(productId)
      : newFavorites.add(productId);
    setFavorites(newFavorites);
  };

  const handleAddToCart = async (product, e) => {
    e.stopPropagation();
    setAddingToCart(product._id);

    try {
      await addToCart(product);
      setToast({
        message: `${product.productName} added to cart!`,
        type: "success",
      });
    } catch (error) {
      setToast({
        message: "Failed to add product to cart",
        type: "error",
      });
    } finally {
      setTimeout(() => setAddingToCart(null), 300);
    }
  };

  const getBadgeColor = (badge) => {
    switch (badge) {
      case "Best Seller":
        return "bg-emerald-500";
      case "New":
        return "bg-blue-500";
      case "Premium":
        return "bg-purple-500";
      case "Limited":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-16">
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header Section */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
          <Star size={16} className="text-green-600" />
          Premium Collection
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          Featured Products
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
          Discover our curated range of products crafted for healthier, glowing
          skin.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="inline-flex items-center gap-3 bg-white rounded-xl px-6 py-4 shadow-sm">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-green-500 border-t-transparent"></div>
            <span className="text-gray-600 font-medium">
              Loading products...
            </span>
          </div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <div className="inline-flex items-center gap-3 bg-red-50 text-red-600 rounded-xl px-6 py-4">
            <X size={20} />
            <span className="font-medium">No products found.</span>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-8">
            {products.slice(0, 8).map((product) => (
              <div
                key={product._id}
                className="group relative bg-white rounded-2xl md:rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-green-500/10 transition-all duration-500 overflow-hidden cursor-pointer transform hover:-translate-y-2"
                onMouseEnter={() => setHoveredProduct(product._id)}
                onMouseLeave={() => setHoveredProduct(null)}
                onClick={() => router.push(`/products/${product._id}`)}
              >
                {/* Badge */}
                {product.badge && (
                  <div
                    className={`absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-white text-sm font-medium ${getBadgeColor(
                      product.badge
                    )} shadow-lg`}
                  >
                    {product.badge}
                  </div>
                )}

                {/* Favorite Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(product._id);
                  }}
                  className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 hover:bg-white hover:scale-110 transition-all duration-200 shadow-lg"
                >
                  <Heart
                    size={18}
                    className={`${
                      favorites.has(product._id)
                        ? "fill-red-500 text-red-500"
                        : "text-gray-400 hover:text-red-500"
                    } transition-colors duration-200`}
                  />
                </button>

                {/* Image */}
                <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 rounded-t-3xl">
                  <img
                    src={product.productImageURL}
                    alt={product.productName}
                    className="w-full h-44 md:h-72 object-contain md:object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Add to Cart Button */}
                  <div
                    className={`hidden md:block absolute inset-x-4 bottom-4 transform transition-all duration-300 ${
                      hoveredProduct === product._id
                        ? "translate-y-0 opacity-100"
                        : "translate-y-4 opacity-0"
                    }`}
                  >
                    <button
                      className={`w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl ${
                        addingToCart === product._id
                          ? "bg-green-700 scale-95"
                          : ""
                      }`}
                      onClick={(e) => handleAddToCart(product, e)}
                      disabled={addingToCart === product._id}
                    >
                      {addingToCart === product._id ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          Adding...
                        </>
                      ) : (
                        <>
                          <ShoppingCart size={18} />
                          Quick Add
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-6">
                  {product.category && (
                    <div className="mb-3">
                      <span className="text-sm text-green-600 font-semibold uppercase tracking-wide bg-green-50 md:px-2 md:py-1 rounded-lg">
                        {product.category}
                      </span>
                    </div>
                  )}
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors duration-200 leading-snug">
                    {product.productName}
                  </h3>

                  {product.rating && (
                    <div className=" hidden md:bloack items-center gap-2 mb-4">
                      <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg">
                        <Star
                          size={16}
                          className="text-yellow-500 fill-current"
                        />
                        <span className="text-sm font-semibold text-gray-700 ml-1">
                          {product.rating}
                        </span>
                      </div>
                      {product.reviewsCount !== undefined && (
                        <span className="text-sm text-gray-500">
                          ({product.reviewsCount} reviews)
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-lg md:text-2xl font-bold text-gray-900">
                      ₹{product.price}
                    </span>
                    {product.originalPrice && (
                      <>
                        <span className="text-sm md:text-lg text-gray-500 line-through">
                          ₹{product.originalPrice}
                        </span>
                        {product.originalPrice - product.price > 0 && (
                          <span className="text-sm font-bold text-green-700 bg-green-100 px-3 py-1 rounded-full">
                            Save ₹
                            {(product.originalPrice - product.price).toFixed(2)}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Show More/Less Button */}
          {products.length > 8 && (
            <div className="text-center mt-16">
              <button
                onClick={() => router.push("/all-featured")}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-10 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-500/50"
              >
                View All Products
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductsShowcase;
