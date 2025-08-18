// "use client";
// import React, { useEffect, useState } from "react";
// import Link from "next/link";
// import axios from "axios";
// import { ShoppingCart, Heart, Star, Check, X } from "lucide-react";
// import { useCart } from "@/context/CartContext";
// import { useRouter } from "next/navigation";

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

// // Categories data
// const categories = [
//   {
//     name: "Gummies",
//     image: "/9.png",
//   },
//   {
//     name: " Protein & Energy",
//     image: "/10.png",
//   },
//   {
//     name: "Wellness",
//     image: "/11.png",
//   },
//   {
//     name: "Baby Care",
//     image: "/12.png",
//   },
//   {
//     name: "Personal Care",
//     image: "/13.png",
//   },
// ];

// // Star Rating Component
// const StarRating = ({ rating, reviews }) => {
//   const stars = [];
//   const fullStars = Math.floor(rating);
//   const hasHalfStar = rating % 1 !== 0;

//   for (let i = 0; i < 5; i++) {
//     if (i < fullStars) {
//       stars.push(
//         <span key={i} className="text-green-500">
//           ★
//         </span>
//       );
//     } else if (i === fullStars && hasHalfStar) {
//       stars.push(
//         <span key={i} className="text-green-500">
//           ★
//         </span>
//       );
//     } else {
//       stars.push(
//         <span key={i} className="text-gray-300">
//           ★
//         </span>
//       );
//     }
//   }

//   return (
//     <div className="flex items-center gap-1">
//       <div className="flex">{stars}</div>
//       <span className="text-gray-500 text-sm">({reviews})</span>
//     </div>
//   );
// };

// // Main Component combining both sections
// const SecondWithBestSellers = () => {
//   return (
//     <>
//       <ShopByCategory />
//       <BestSellers />
//     </>
//   );
// };

// export default SecondWithBestSellers;

// // Shop by Category Section Component
// const ShopByCategory = () => {
//   return (
//     <div className="w-full bg-white py-16 px-4">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex items-center justify-center mb-12">
//           <div className="text-center">
//             <h1 className="text-gray-800 text-[32px] font-bold mb-2">
//               Shop by Category
//             </h1>
//             <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-green-600 mx-auto rounded-full"></div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
//           {categories.map((item, index) => (
//             <Link
//               key={index}
//               href={`/category/${encodeURIComponent(item.name.trim())}`}
//               className="group bg-white cursor-pointer overflow-hidden block rounded-2xl shadow-sm hover:shadow-xl hover:shadow-green-100 transition-all duration-300 border border-gray-100 hover:border-green-200 hover:-translate-y-1"
//             >
//               <div className="relative overflow-hidden">
//                 <img
//                   src={item.image}
//                   alt={item.name}
//                   className="w-full h-52 object-cover group-hover:scale-110 transition-transform duration-500"
//                 />
//                 <div className="absolute inset-0 bg-gradient-to-t from-green-600/0 to-green-600/0 group-hover:from-green-600/20 group-hover:to-transparent transition-all duration-300"></div>
//               </div>
//               <div className="p-6 text-center relative">
//                 <h2 className="text-gray-800 font-semibold text-lg group-hover:text-green-600 transition-colors">
//                   {item.name}
//                 </h2>
//                 <div className="w-0 group-hover:w-12 h-0.5 bg-green-500 mx-auto mt-2 transition-all duration-300"></div>
//               </div>
//             </Link>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// // Best Sellers Section Component

// const BestSellers = () => {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [hoveredProduct, setHoveredProduct] = useState(null);
//   const [favorites, setFavorites] = new Set();
//   const [toast, setToast] = useState(null);
//   const [addingToCart, setAddingToCart] = useState(null);
//   const { addToCart } = useCart();
//   const router = useRouter();

//   useEffect(() => {
//     const fetchBestSellers = async () => {
//       try {
//         const apiUrl =
//           process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
//         const res = await axios.get(`${apiUrl}/api/products`, {
//           headers: {
//             Accept: "application/json",
//             "Content-Type": "application/json",
//           },
//           timeout: 10000, // 10 second timeout
//           withCredentials: true,
//         });
//         // filter the ones with 'Best Seller' badge
//         const filtered = res.data.filter(
//           (product) => product.badge?.toLowerCase() === "best seller"
//         );
//         setProducts(filtered);
//       } catch (error) {
//         console.error("Error fetching best sellers:", error);
//         let errorMessage = "Failed to load products. Please try again.";
//         if (error.code === "ECONNABORTED") {
//           errorMessage = "Request timed out. Please check your connection.";
//         } else if (!navigator.onLine) {
//           errorMessage = "No internet connection. Please check your network.";
//         } else if (error.response) {
//           errorMessage =
//             error.response.data?.message || "Server error. Please try again.";
//         }
//         setToast({
//           message: errorMessage,
//           type: "error",
//         });
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBestSellers();
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
//     switch (badge?.toLowerCase()) {
//       case "best seller":
//         return "bg-emerald-500";
//       case "new":
//         return "bg-blue-500";
//       case "premium":
//         return "bg-purple-500";
//       case "limited":
//         return "bg-orange-500";
//       default:
//         return "bg-gray-500";
//     }
//   };

//   const displayedProducts = products.slice(0, 16);

//   return (
//     <div className="w-full bg-gradient-to-br from-green-50 to-white py-16 px-4">
//       {/* Toast Notification */}
//       {toast && (
//         <Toast
//           message={toast.message}
//           type={toast.type}
//           onClose={() => setToast(null)}
//         />
//       )}

//       <div className="max-w-7xl mx-auto">
//         <div className="flex items-center justify-between mb-12">
//           <div className="flex items-center gap-3">
//             <div className="w-1 h-8 bg-green-500 rounded-full"></div>
//             <h1 className="text-gray-800 text-[32px] font-bold">
//               Best Sellers
//             </h1>
//           </div>
//           {products.length > 16 && (
//             <button
//               className="text-green-600 hover:text-green-800 transition-colors font-medium border-b border-green-300 hover:border-green-500"
//               onClick={() => router.push("/products/bestsellers")}
//             >
//               See all products →
//             </button>
//           )}
//         </div>

//         {loading ? (
//           <div className="text-center py-16">
//             <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
//             <p className="text-gray-600 mt-4">Loading amazing products...</p>
//           </div>
//         ) : products.length === 0 ? (
//           <div className="text-center py-16 text-red-500">
//             <div className="text-6xl mb-4">🔍</div>
//             <p className="text-xl">No Best Sellers Found</p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
//             {displayedProducts.map((product) => (
//               <div
//                 key={product._id}
//                 className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-green-100 transition-all duration-300 cursor-pointer hover:-translate-y-2 relative"
//                 onMouseEnter={() => setHoveredProduct(product._id)}
//                 onMouseLeave={() => setHoveredProduct(null)}
//                 onClick={() => router.push(`/products/${product._id}`)}
//               >
//                 {/* Gradient overlay on hover */}
//                 <div className="absolute inset-0 bg-gradient-to-t from-green-50/0 to-green-50/0 group-hover:from-green-50/20 group-hover:to-transparent transition-all duration-300 rounded-2xl z-10"></div>

//                 {/* Favorite Button */}
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     toggleFavorite(product._id);
//                   }}
//                   className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 hover:bg-white hover:scale-110 transition-all duration-200 shadow-lg"
//                 >
//                   <Heart
//                     size={18}
//                     className={`${
//                       favorites.has(product._id)
//                         ? "fill-red-500 text-red-500"
//                         : "text-gray-400 hover:text-red-500"
//                     } transition-colors duration-200`}
//                   />
//                 </button>

//                 {/* Product Image with Badge */}
//                 <div className="relative overflow-hidden">
//                   <img
//                     src={product.productImageURL}
//                     alt={product.productName}
//                     className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
//                   />
//                   {product.badge && (
//                     <span
//                       className={`absolute top-4 left-4 px-3 py-1 text-xs font-bold rounded-full shadow-lg ${
//                         product.badge === "NEW"
//                           ? "bg-emerald-600 text-white"
//                           : "bg-gradient-to-r from-green-500 to-green-600 text-white"
//                       }`}
//                     >
//                       {product.badge}
//                     </span>
//                   )}

//                   {/* Quick view overlay */}
//                   <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
//                     <button className="bg-white text-green-600 px-6 py-2 rounded-full font-medium opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-green-50">
//                       Quick View
//                     </button>
//                   </div>
//                 </div>

//                 {/* Product Details */}
//                 <div className="p-6 relative z-20">
//                   <div className="mb-3">
//                     <span className="text-2xl font-bold text-green-600">
//                       ₹{product.price}
//                     </span>
//                     {product.originalPrice && (
//                       <span className="ml-2 text-sm text-gray-500 line-through">
//                         ₹{product.originalPrice}
//                       </span>
//                     )}
//                   </div>

//                   <h3 className="text-lg font-semibold text-gray-800 mb-3 group-hover:text-green-700 transition-colors line-clamp-2">
//                     {product.productName}
//                   </h3>

//                   <div className="mb-3">
//                     <StarRating
//                       rating={product.rating || 4}
//                       reviews={product.reviewsCount || 0}
//                     />
//                   </div>

//                   <p className="text-gray-600 text-sm mb-6 line-clamp-2">
//                     {product.description}
//                   </p>

//                   <button
//                     className={`w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 px-6 rounded-full transition-all duration-300 font-semibold transform hover:scale-105 shadow-lg hover:shadow-xl ${
//                       addingToCart === product._id
//                         ? "from-green-700 to-green-800 scale-95"
//                         : ""
//                     }`}
//                     onClick={(e) => handleAddToCart(product, e)}
//                     disabled={addingToCart === product._id}
//                   >
//                     {addingToCart === product._id ? (
//                       <div className="flex items-center justify-center gap-2">
//                         <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
//                         Adding...
//                       </div>
//                     ) : (
//                       "Add to Cart"
//                     )}
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { ShoppingCart, Heart, Star, Check, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

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

// Categories data
const categories = [
  {
    name: "Gummies",
    image: "/9.png",
  },
  {
    name: " Protein & Energy",
    image: "/10.png",
  },
  {
    name: "Wellness",
    image: "/11.png",
  },
  {
    name: "Baby Care",
    image: "/12.png",
  },
  {
    name: "Personal Care",
    image: "/13.png",
  },
];

// Star Rating Component
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

// Main Component combining both sections
const SecondWithBestSellers = () => {
  return (
    <>
      <ShopByCategory />
      <BestSellers />
    </>
  );
};

export default SecondWithBestSellers;

// Shop by Category Section Component
const ShopByCategory = () => {
  return (
    <div className="w-full bg-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center mb-12">
          <div className="text-center">
            <h1 className="text-gray-800 text-[32px] font-bold mb-2">
              Shop by Category
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-green-600 mx-auto rounded-full"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {categories.map((item, index) => (
            <Link
              key={index}
              href={`/category/${encodeURIComponent(item.name.trim())}`}
              className="group bg-white cursor-pointer overflow-hidden block rounded-2xl shadow-sm hover:shadow-xl hover:shadow-green-100 transition-all duration-300 border border-gray-100 hover:border-green-200 hover:-translate-y-1"
            >
              <div className="relative overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-52 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-green-600/0 to-green-600/0 group-hover:from-green-600/20 group-hover:to-transparent transition-all duration-300"></div>
              </div>
              <div className="p-6 text-center relative">
                <h2 className="text-gray-800 font-semibold text-lg group-hover:text-green-600 transition-colors">
                  {item.name}
                </h2>
                <div className="w-0 group-hover:w-12 h-0.5 bg-green-500 mx-auto mt-2 transition-all duration-300"></div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

// Best Sellers Section Component

const BestSellers = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [favorites, setFavorites] = useState(new Set()); // Corrected Initialization
  const [toast, setToast] = useState(null);
  const [addingToCart, setAddingToCart] = useState(null);
  const { addToCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await axios.get(`${apiUrl}/api/products`, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          timeout: 10000, // 10 second timeout
          withCredentials: true,
        });
        // filter the ones with 'Best Seller' badge
        const filtered = res.data.filter(
          (product) => product.badge?.toLowerCase() === "best seller"
        );
        setProducts(filtered);
      } catch (error) {
        console.error("Error fetching best sellers:", error);
        let errorMessage = "Failed to load products. Please try again.";
        if (error.code === "ECONNABORTED") {
          errorMessage = "Request timed out. Please check your connection.";
        } else if (!navigator.onLine) {
          errorMessage = "No internet connection. Please check your network.";
        } else if (error.response) {
          errorMessage =
            error.response.data?.message || "Server error. Please try again.";
        }
        setToast({
          message: errorMessage,
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBestSellers();
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
    switch (badge?.toLowerCase()) {
      case "best seller":
        return "bg-emerald-500";
      case "new":
        return "bg-blue-500";
      case "premium":
        return "bg-purple-500";
      case "limited":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  const displayedProducts = products.slice(0, 8);

  return (
    <div className=" bg-gradient-to-br from-green-50 to-white py-16 px-4 flex flex-col justify-center items-center">
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-green-500 rounded-full"></div>
            <h1 className="text-gray-800 text-[32px] font-bold">
              Best Sellers
            </h1>
          </div>
          {products.length > 16 && (
            <button
              className="text-green-600 hover:text-green-800 transition-colors font-medium border-b border-green-300 hover:border-green-500"
              onClick={() => router.push("/bestsellers")}
            >
              See all products →
            </button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
            <p className="text-gray-600 mt-4">Loading amazing products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 text-red-500">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-xl">No Best Sellers Found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {displayedProducts.map((product) => (
              <div
                key={product._id}
                className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-green-100 transition-all duration-300 cursor-pointer hover:-translate-y-2 relative"
                onMouseEnter={() => setHoveredProduct(product._id)}
                onMouseLeave={() => setHoveredProduct(null)}
                onClick={() => router.push(`/products/${product._id}`)}
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-green-50/0 to-green-50/0 group-hover:from-green-50/20 group-hover:to-transparent transition-all duration-300 rounded-2xl z-10"></div>

                {/* Favorite Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(product._id);
                  }}
                  className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 hover:bg-white hover:scale-110 transition-all duration-200 shadow-lg"
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

                {/* Product Image with Badge */}
                <div className="relative overflow-hidden">
                  <img
                    src={product.productImageURL}
                    alt={product.productName}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.badge && (
                    <span
                      className={`absolute top-4 left-4 px-3 py-1 text-xs font-bold rounded-full shadow-lg ${
                        product.badge === "NEW"
                          ? "bg-emerald-600 text-white"
                          : "bg-gradient-to-r from-green-500 to-green-600 text-white"
                      }`}
                    >
                      {product.badge}
                    </span>
                  )}

                  {/* Quick view overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                    <button className="bg-white text-green-600 px-6 py-2 rounded-full font-medium opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-green-50">
                      Quick View
                    </button>
                  </div>
                </div>

                {/* Product Details */}
                <div className="p-6 relative z-20">
                  <div className="mb-3">
                    <span className="text-2xl font-bold text-green-600">
                      ₹{product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="ml-2 text-sm text-gray-500 line-through">
                        ₹{product.originalPrice}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-semibold text-gray-800 mb-3 group-hover:text-green-700 transition-colors line-clamp-2">
                    {product.productName}
                  </h3>

                  <div className="mb-3">
                    <StarRating
                      rating={product.rating || 4}
                      reviews={product.reviewsCount || 0}
                    />
                  </div>

                  <p className="text-gray-600 text-sm mb-6 line-clamp-2">
                    {product.description}
                  </p>

                  <button
                    className={`w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 px-6 rounded-full transition-all duration-300 font-semibold transform hover:scale-105 shadow-lg hover:shadow-xl ${
                      addingToCart === product._id
                        ? "from-green-700 to-green-800 scale-95"
                        : ""
                    }`}
                    onClick={(e) => handleAddToCart(product, e)}
                    disabled={addingToCart === product._id}
                  >
                    {addingToCart === product._id ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Adding...
                      </div>
                    ) : (
                      "Add to Cart"
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="text-center mt-16">
        <button
          onClick={() => router.push("/bestsellers")}
          className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-10 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-500/50"
        >
          View All Products
        </button>
      </div>
    </div>
  );
};
