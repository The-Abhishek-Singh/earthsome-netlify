// "use client"

// import { useState, useEffect } from "react";
// import {
//   FiFilter,
//   FiHeart,
//   FiStar,
//   FiChevronDown,
//   FiChevronUp,
//   FiX,
//   FiShoppingCart,
// } from "react-icons/fi";
// import axios from "axios";
// import { useRouter } from "next/navigation";
// import { useCart } from "@/context/CartContext";

// const ProductListingPage = () => {
//   const router = useRouter();
//   const { addToCart } = useCart();
//   const [products, setProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showMobileFilters, setShowMobileFilters] = useState(false);
//   const [filters, setFilters] = useState({
//     category: [],
//     priceRange: null,
//     rating: null,
//   });
//   const [favorites, setFavorites] = useState(new Set());
//   const [addingToCart, setAddingToCart] = useState(null);
//   const [toast, setToast] = useState(null);

//   // Fetch products from backend
//   const fetchProducts = async () => {
//     try {
//       const res = await axios.get(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/products`
//       );
//       setProducts(res.data);
//       setFilteredProducts(res.data);
//     } catch (err) {
//       console.error("Error fetching products:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   useEffect(() => {
//     applyFilters();
//   }, [filters, products]);

//   const applyFilters = () => {
//     let result = [...products];

//     // Category filter
//     if (filters.category.length > 0) {
//       result = result.filter((product) =>
//         filters.category.includes(product.category)
//       );
//     }

//     // Price range filter
//     if (filters.priceRange) {
//       const [min, max] = filters.priceRange.split("-").map(Number);
//       result = result.filter((product) => {
//         if (max === 0) return product.price >= min;
//         return product.price >= min && product.price <= max;
//       });
//     }

//     // Rating filter
//     if (filters.rating) {
//       result = result.filter(
//         (product) => product.rating >= Number(filters.rating)
//       );
//     }

//     setFilteredProducts(result);
//   };

//   const handleCategoryChange = (category) => {
//     setFilters((prev) => {
//       if (prev.category.includes(category)) {
//         return {
//           ...prev,
//           category: prev.category.filter((c) => c !== category),
//         };
//       } else {
//         return {
//           ...prev,
//           category: [...prev.category, category],
//         };
//       }
//     });
//   };

//   const handlePriceChange = (range) => {
//     setFilters((prev) => ({
//       ...prev,
//       priceRange: prev.priceRange === range ? null : range,
//     }));
//   };

//   const handleRatingChange = (rating) => {
//     setFilters((prev) => ({
//       ...prev,
//       rating: prev.rating === rating ? null : rating,
//     }));
//   };

//   const clearAllFilters = () => {
//     setFilters({
//       category: [],
//       priceRange: null,
//       rating: null,
//     });
//   };

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

//   // Extract unique categories from products
//   const categories = [...new Set(products.map((product) => product.category))];

//   const priceRanges = [
//     { label: "Under ₹200", value: "0-200" },
//     { label: "₹200 - ₹400", value: "200-400" },
//     { label: "₹400 - ₹600", value: "400-600" },
//     { label: "Over ₹600", value: "600-0" },
//   ];

//   // Toast Component
//   const Toast = ({ message, type, onClose }) => {
//     useEffect(() => {
//       const timer = setTimeout(() => {
//         onClose();
//       }, 3000);
//       return () => clearTimeout(timer);
//     }, [onClose]);

//     return (
//       <div
//         className={`mt- fixed top-20 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl transform transition-all duration-500 ease-out bg-white border ${
//           type === "success"
//             ? "border-green-200 shadow-green-100/50"
//             : "border-red-200 shadow-red-100/50"
//         } backdrop-blur-sm`}
//       >
//         <div
//           className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
//             type === "success" ? "bg-green-500" : "bg-red-500"
//           }`}
//         >
//           {type === "success" ? (
//             <FiStar size={16} className="text-white" />
//           ) : (
//             <FiX size={16} className="text-white" />
//           )}
//         </div>
//         <span className="font-semibold text-gray-800">{message}</span>
//         <button
//           onClick={onClose}
//           className="ml-2 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
//         >
//           <FiX size={16} />
//         </button>
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-white mt-20">
//       {/* Toast Notification */}
//       {toast && (
//         <Toast
//           message={toast.message}
//           type={toast.type}
//           onClose={() => setToast(null)}
//         />
//       )}

//       {/* Main Content */}
//       <main className="container mx-auto p-4">
//         {/* Mobile Filter Button */}
//         <div className="md:hidden mb-4">
//           <button
//             onClick={() => setShowMobileFilters(true)}
//             className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-md"
//           >
//             <FiFilter /> Filters
//           </button>
//         </div>

//         <div className="flex flex-col md:flex-row gap-6">
//           {/* Desktop Filters */}
//           <aside className="hidden md:block w-64 bg-white p-4 rounded-lg shadow-md sticky top-25 h-fit border border-gray-200">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-lg font-semibold text-black">Filters</h2>
//               <button
//                 onClick={clearAllFilters}
//                 className="text-green-500 text-sm hover:text-green-600"
//               >
//                 Clear all
//               </button>
//             </div>

//             {/* Category Filter */}
//             <FilterSection title="Category">
//               {categories.map((category) => (
//                 <div key={category} className="flex items-center mb-2">
//                   <input
//                     type="checkbox"
//                     id={`cat-${category}`}
//                     checked={filters.category.includes(category)}
//                     onChange={() => handleCategoryChange(category)}
//                     className="mr-2 text-green-500 rounded border-gray-300"
//                   />
//                   <label
//                     htmlFor={`cat-${category}`}
//                     className="text-sm text-black"
//                   >
//                     {category} (
//                     {products.filter((p) => p.category === category).length})
//                   </label>
//                 </div>
//               ))}
//             </FilterSection>

//             {/* Price Filter */}
//             <FilterSection title="Price">
//               {priceRanges.map((range) => (
//                 <div key={range.value} className="flex items-center mb-2">
//                   <input
//                     type="radio"
//                     id={`price-${range.value}`}
//                     name="priceRange"
//                     checked={filters.priceRange === range.value}
//                     onChange={() => handlePriceChange(range.value)}
//                     className="mr-2 text-green-500 border-gray-300"
//                   />
//                   <label
//                     htmlFor={`price-${range.value}`}
//                     className="text-sm text-black"
//                   >
//                     {range.label}
//                   </label>
//                 </div>
//               ))}
//             </FilterSection>

//             {/* Rating Filter */}
//             <FilterSection title="Rating">
//               {[4, 3, 2, 1].map((rating) => (
//                 <div key={rating} className="flex items-center mb-2">
//                   <input
//                     type="radio"
//                     id={`rating-${rating}`}
//                     name="rating"
//                     checked={filters.rating === rating.toString()}
//                     onChange={() => handleRatingChange(rating.toString())}
//                     className="mr-2 text-green-500 border-gray-300"
//                   />
//                   <label
//                     htmlFor={`rating-${rating}`}
//                     className="flex items-center text-sm text-black"
//                   >
//                     {Array.from({ length: 5 }).map((_, i) => (
//                       <FiStar
//                         key={i}
//                         className={`w-4 h-4 ${
//                           i < rating
//                             ? "text-yellow-400 fill-yellow-400"
//                             : "text-gray-300"
//                         }`}
//                       />
//                     ))}
//                     {rating > 0 && <span className="ml-1">& Up</span>}
//                   </label>
//                 </div>
//               ))}
//             </FilterSection>
//           </aside>

//           {/* Mobile Filters */}
//           {showMobileFilters && (
//             <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
//               <div className="bg-white w-4/5 h-full overflow-y-auto p-4">
//                 <div className="flex justify-between items-center mb-4">
//                   <h2 className="text-lg font-semibold text-black">Filters</h2>
//                   <button onClick={() => setShowMobileFilters(false)}>
//                     <FiX className="w-6 h-6 text-black" />
//                   </button>
//                 </div>
//                 <button
//                   onClick={clearAllFilters}
//                   className="text-green-500 text-sm mb-4 hover:text-green-600"
//                 >
//                   Clear all
//                 </button>

//                 {/* Category Filter */}
//                 <FilterSection title="Category">
//                   {categories.map((category) => (
//                     <div key={category} className="flex items-center mb-2">
//                       <input
//                         type="checkbox"
//                         id={`mob-cat-${category}`}
//                         checked={filters.category.includes(category)}
//                         onChange={() => handleCategoryChange(category)}
//                         className="mr-2 text-green-500 rounded border-gray-300"
//                       />
//                       <label
//                         htmlFor={`mob-cat-${category}`}
//                         className="text-sm text-black"
//                       >
//                         {category} (
//                         {products.filter((p) => p.category === category).length}
//                         )
//                       </label>
//                     </div>
//                   ))}
//                 </FilterSection>

//                 {/* Price Filter */}
//                 <FilterSection title="Price">
//                   {priceRanges.map((range) => (
//                     <div key={range.value} className="flex items-center mb-2">
//                       <input
//                         type="radio"
//                         id={`mob-price-${range.value}`}
//                         name="mob-priceRange"
//                         checked={filters.priceRange === range.value}
//                         onChange={() => handlePriceChange(range.value)}
//                         className="mr-2 text-green-500 border-gray-300"
//                       />
//                       <label
//                         htmlFor={`mob-price-${range.value}`}
//                         className="text-sm text-black"
//                       >
//                         {range.label}
//                       </label>
//                     </div>
//                   ))}
//                 </FilterSection>

//                 {/* Rating Filter */}
//                 <FilterSection title="Rating">
//                   {[4, 3, 2, 1].map((rating) => (
//                     <div key={rating} className="flex items-center mb-2">
//                       <input
//                         type="radio"
//                         id={`mob-rating-${rating}`}
//                         name="mob-rating"
//                         checked={filters.rating === rating.toString()}
//                         onChange={() => handleRatingChange(rating.toString())}
//                         className="mr-2 text-green-500 border-gray-300"
//                       />
//                       <label
//                         htmlFor={`mob-rating-${rating}`}
//                         className="flex items-center text-sm text-black"
//                       >
//                         {Array.from({ length: 5 }).map((_, i) => (
//                           <FiStar
//                             key={i}
//                             className={`w-4 h-4 ${
//                               i < rating
//                                 ? "text-yellow-400 fill-yellow-400"
//                                 : "text-gray-300"
//                             }`}
//                           />
//                         ))}
//                         {rating > 0 && <span className="ml-1">& Up</span>}
//                       </label>
//                     </div>
//                   ))}
//                 </FilterSection>

//                 <button
//                   onClick={() => setShowMobileFilters(false)}
//                   className="w-full bg-green-500 text-white py-2 rounded-md mt-4 hover:bg-green-600"
//                 >
//                   Apply Filters
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* Product Grid */}
//           <div className="flex-1">
//             <div className="mb-4">
//               <h2 className="text-xl font-semibold text-black">
//                 {filteredProducts.length} Products
//                 {filters.category.length > 0 &&
//                   ` in ${filters.category.join(", ")}`}
//               </h2>
//             </div>

//             {loading ? (
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                 {Array.from({ length: 8 }).map((_, i) => (
//                   <div
//                     key={i}
//                     className="bg-gray-100 rounded-lg p-4 animate-pulse h-64"
//                   ></div>
//                 ))}
//               </div>
//             ) : filteredProducts.length === 0 ? (
//               <div className="text-center py-12">
//                 <h3 className="text-lg font-medium mb-2 text-black">
//                   No products found
//                 </h3>
//                 <p className="text-gray-600 mb-4">
//                   Try adjusting your filters or search again
//                 </p>
//                 <button
//                   onClick={clearAllFilters}
//                   className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
//                 >
//                   Clear Filters
//                 </button>
//               </div>
//             ) : (
//               <>
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                   {filteredProducts.map((product) => (
//                     <ProductCard
//                       key={product._id}
//                       product={product}
//                       onAddToCart={handleAddToCart}
//                       addingToCart={addingToCart}
//                       isFavorite={favorites.has(product._id)}
//                       onToggleFavorite={toggleFavorite}
//                       router={router}
//                     />
//                   ))}
//                 </div>

//                 {/* Pagination/Load More */}
//                 <div className="mt-8 flex justify-center">
//                   <button className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600">
//                     Load More
//                   </button>
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// // Reusable Filter Section Component
// const FilterSection = ({ title, children }) => {
//   const [isOpen, setIsOpen] = useState(true);

//   return (
//     <div className="mb-6 border-b border-gray-200 pb-4">
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className="flex justify-between items-center w-full mb-2"
//       >
//         <h3 className="font-medium text-black">{title}</h3>
//         {isOpen ? (
//           <FiChevronUp className="text-black" />
//         ) : (
//           <FiChevronDown className="text-black" />
//         )}
//       </button>
//       {isOpen && <div className="pl-2">{children}</div>}
//     </div>
//   );
// };

// // Product Card Component
// const ProductCard = ({
//   product,
//   onAddToCart,
//   addingToCart,
//   isFavorite,
//   onToggleFavorite,
//   router,
// }) => {
//   const [hovered, setHovered] = useState(false);
//   const discountPercentage = Math.round(
//     ((product.originalPrice - product.price) / product.originalPrice) * 100
//   );

//   return (
//     <div
//       className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-200 relative"
//       onMouseEnter={() => setHovered(true)}
//       onMouseLeave={() => setHovered(false)}
//       onClick={() => router.push(`/products/${product._id}`)}
//     >
//       {/* Favorite Button */}
//       <button
//         onClick={(e) => {
//           e.stopPropagation();
//           onToggleFavorite(product._id);
//         }}
//         className="absolute top-2 right-2 z-10 p-2 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 hover:bg-white hover:scale-110 transition-all duration-200 shadow-lg"
//       >
//         <FiHeart
//           size={18}
//           className={`${
//             isFavorite
//               ? "fill-red-500 text-red-500"
//               : "text-gray-400 hover:text-red-500"
//           } transition-colors duration-200`}
//         />
//       </button>

//       {/* Product Image */}
//       <div className="relative">
//         <img
//           src={product.productImageURL}
//           alt={product.productName}
//           className="w-full h-48 object-contain p-4 hover:scale-105 transition-transform duration-300"
//         />
//         {product.badge && (
//           <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
//             {product.badge}
//           </span>
//         )}
//         {discountPercentage > 0 && (
//           <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
//             {discountPercentage}% OFF
//           </span>
//         )}

//         {/* Add to Cart Button - Only visible on hover */}
//         {hovered && (
//           <div className="absolute inset-x-4 bottom-4 transform transition-all duration-300">
//             <button
//               className={`w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md font-medium flex items-center justify-center gap-2 transition-all duration-200 shadow-lg ${
//                 addingToCart === product._id ? "bg-green-700 scale-95" : ""
//               }`}
//               onClick={(e) => onAddToCart(product, e)}
//               disabled={addingToCart === product._id}
//             >
//               {addingToCart === product._id ? (
//                 <>
//                   <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
//                   Adding...
//                 </>
//               ) : (
//                 <>
//                   <FiShoppingCart size={16} />
//                   Add to Cart
//                 </>
//               )}
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Product Info */}
//       <div className="p-4">
//         <h3 className="font-medium text-sm mb-1 line-clamp-1 text-black">
//           {product.productName}
//         </h3>
//         <p className="text-gray-600 text-xs mb-2 line-clamp-2">
//           {product.description}
//         </p>

//         <div className="flex items-center mb-2">
//           <div className="flex">
//             {Array.from({ length: 5 }).map((_, i) => (
//               <FiStar
//                 key={i}
//                 className={`w-3 h-3 ${
//                   i < Math.floor(product.rating)
//                     ? "text-yellow-400 fill-yellow-400"
//                     : "text-gray-300"
//                 }`}
//               />
//             ))}
//           </div>
//           <span className="text-gray-500 text-xs ml-1">
//             ({product.reviewsCount})
//           </span>
//         </div>

//         <div className="flex items-center mb-3">
//           <span className="font-bold text-black">₹{product.price}</span>
//           {product.originalPrice > product.price && (
//             <span className="text-gray-500 text-xs line-through ml-2">
//               ₹{product.originalPrice}
//             </span>
//           )}
//         </div>

//         {/* Static Add to Cart Button - Visible when not hovered */}
//         {!hovered && (
//           <button
//             className="w-full py-2 rounded-md text-sm font-medium bg-green-500 hover:bg-green-600 text-white flex items-center justify-center gap-2"
//             onClick={(e) => {
//               e.stopPropagation();
//               onAddToCart(product, e);
//             }}
//           >
//             <FiShoppingCart size={14} />
//             Add to Cart
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ProductListingPage;

"use client";
import { useState, useEffect } from "react";
import {
  FiFilter,
  FiHeart,
  FiStar,
  FiChevronDown,
  FiChevronUp,
  FiX,
  FiShoppingCart,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

const ProductListingPage = () => {
  const router = useRouter();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: [],
    priceRange: null,
    rating: null,
  });
  const [favorites, setFavorites] = useState(new Set());
  const [addingToCart, setAddingToCart] = useState(null);
  const [toast, setToast] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products`
      );
      setProducts(res.data);
      setFilteredProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, products]);

  const applyFilters = () => {
    let result = [...products];

    // Category filter
    if (filters.category.length > 0) {
      result = result.filter((product) =>
        filters.category.includes(product.category)
      );
    }

    // Price range filter
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split("-").map(Number);
      result = result.filter((product) => {
        if (max === 0) return product.price >= min;
        return product.price >= min && product.price <= max;
      });
    }

    // Rating filter
    if (filters.rating) {
      result = result.filter(
        (product) => product.rating >= Number(filters.rating)
      );
    }

    setFilteredProducts(result);
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleCategoryChange = (category) => {
    setFilters((prev) => {
      if (prev.category.includes(category)) {
        return {
          ...prev,
          category: prev.category.filter((c) => c !== category),
        };
      } else {
        return {
          ...prev,
          category: [...prev.category, category],
        };
      }
    });
  };

  const handlePriceChange = (range) => {
    setFilters((prev) => ({
      ...prev,
      priceRange: prev.priceRange === range ? null : range,
    }));
  };

  const handleRatingChange = (rating) => {
    setFilters((prev) => ({
      ...prev,
      rating: prev.rating === rating ? null : rating,
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      category: [],
      priceRange: null,
      rating: null,
    });
  };

  const toggleFavorite = (productId, e) => {
    e.stopPropagation();
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

  // Extract unique categories from products
  const categories = [...new Set(products.map((product) => product.category))];

  const priceRanges = [
    { label: "Under ₹200", value: "0-200" },
    { label: "₹200 - ₹400", value: "200-400" },
    { label: "₹400 - ₹600", value: "400-600" },
    { label: "Over ₹600", value: "600-0" },
  ];

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
            <FiStar size={16} className="text-white" />
          ) : (
            <FiX size={16} className="text-white" />
          )}
        </div>
        <span className="font-semibold text-gray-800">{message}</span>
        <button
          onClick={onClose}
          className="ml-2 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
        >
          <FiX size={16} />
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white mt-20">
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Main Content */}
      <main className="container mx-auto p-4">
        {/* Mobile Filter Button */}
        <div className="md:hidden mb-4">
          <button
            onClick={() => setShowMobileFilters(true)}
            className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-md"
          >
            <FiFilter /> Filters
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Desktop Filters */}
          <aside className="hidden md:block w-64 bg-white p-4 rounded-lg shadow-md sticky top-25 h-fit border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-black">Filters</h2>
              <button
                onClick={clearAllFilters}
                className="text-green-500 text-sm hover:text-green-600"
              >
                Clear all
              </button>
            </div>

            {/* Category Filter */}
            <FilterSection title="Category">
              {categories.map((category) => (
                <div key={category} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id={`cat-${category}`}
                    checked={filters.category.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                    className="mr-2 text-green-500 rounded border-gray-300"
                  />
                  <label
                    htmlFor={`cat-${category}`}
                    className="text-sm text-black"
                  >
                    {category} (
                    {products.filter((p) => p.category === category).length})
                  </label>
                </div>
              ))}
            </FilterSection>

            {/* Price Filter */}
            <FilterSection title="Price">
              {priceRanges.map((range) => (
                <div key={range.value} className="flex items-center mb-2">
                  <input
                    type="radio"
                    id={`price-${range.value}`}
                    name="priceRange"
                    checked={filters.priceRange === range.value}
                    onChange={() => handlePriceChange(range.value)}
                    className="mr-2 text-green-500 border-gray-300"
                  />
                  <label
                    htmlFor={`price-${range.value}`}
                    className="text-sm text-black"
                  >
                    {range.label}
                  </label>
                </div>
              ))}
            </FilterSection>

            {/* Rating Filter */}
            <FilterSection title="Rating">
              {[4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center mb-2">
                  <input
                    type="radio"
                    id={`rating-${rating}`}
                    name="rating"
                    checked={filters.rating === rating.toString()}
                    onChange={() => handleRatingChange(rating.toString())}
                    className="mr-2 text-green-500 border-gray-300"
                  />
                  <label
                    htmlFor={`rating-${rating}`}
                    className="flex items-center text-sm text-black"
                  >
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FiStar
                        key={i}
                        className={`w-4 h-4 ${
                          i < rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    {rating > 0 && <span className="ml-1">& Up</span>}
                  </label>
                </div>
              ))}
            </FilterSection>
          </aside>

          {/* Mobile Filters */}
          {showMobileFilters && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
              <div className="bg-white w-4/5 h-full overflow-y-auto p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-black">Filters</h2>
                  <button onClick={() => setShowMobileFilters(false)}>
                    <FiX className="w-6 h-6 text-black" />
                  </button>
                </div>
                <button
                  onClick={clearAllFilters}
                  className="text-green-500 text-sm mb-4 hover:text-green-600"
                >
                  Clear all
                </button>

                {/* Category Filter */}
                <FilterSection title="Category">
                  {categories.map((category) => (
                    <div key={category} className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        id={`mob-cat-${category}`}
                        checked={filters.category.includes(category)}
                        onChange={() => handleCategoryChange(category)}
                        className="mr-2 text-green-500 rounded border-gray-300"
                      />
                      <label
                        htmlFor={`mob-cat-${category}`}
                        className="text-sm text-black"
                      >
                        {category} (
                        {products.filter((p) => p.category === category).length}
                        )
                      </label>
                    </div>
                  ))}
                </FilterSection>

                {/* Price Filter */}
                <FilterSection title="Price">
                  {priceRanges.map((range) => (
                    <div key={range.value} className="flex items-center mb-2">
                      <input
                        type="radio"
                        id={`mob-price-${range.value}`}
                        name="mob-priceRange"
                        checked={filters.priceRange === range.value}
                        onChange={() => handlePriceChange(range.value)}
                        className="mr-2 text-green-500 border-gray-300"
                      />
                      <label
                        htmlFor={`mob-price-${range.value}`}
                        className="text-sm text-black"
                      >
                        {range.label}
                      </label>
                    </div>
                  ))}
                </FilterSection>

                {/* Rating Filter */}
                <FilterSection title="Rating">
                  {[4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center mb-2">
                      <input
                        type="radio"
                        id={`mob-rating-${rating}`}
                        name="mob-rating"
                        checked={filters.rating === rating.toString()}
                        onChange={() => handleRatingChange(rating.toString())}
                        className="mr-2 text-green-500 border-gray-300"
                      />
                      <label
                        htmlFor={`mob-rating-${rating}`}
                        className="flex items-center text-sm text-black"
                      >
                        {Array.from({ length: 5 }).map((_, i) => (
                          <FiStar
                            key={i}
                            className={`w-4 h-4 ${
                              i < rating
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                        {rating > 0 && <span className="ml-1">& Up</span>}
                      </label>
                    </div>
                  ))}
                </FilterSection>

                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="w-full bg-green-500 text-white py-2 rounded-md mt-4 hover:bg-green-600"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}

          {/* Product Grid */}
          <div className="flex-1">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-black">
                {filteredProducts.length} Products
                {filters.category.length > 0 &&
                  ` in ${filters.category.join(", ")}`}
              </h2>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-gray-100 rounded-lg p-4 animate-pulse h-64"
                  ></div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium mb-2 text-black">
                  No products found
                </h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters or search again
                </p>
                <button
                  onClick={clearAllFilters}
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {currentProducts.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      onAddToCart={handleAddToCart}
                      addingToCart={addingToCart}
                      isFavorite={favorites.has(product._id)}
                      onToggleFavorite={toggleFavorite}
                      router={router}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center items-center gap-2">
                    <button
                      onClick={() => paginate(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FiChevronLeft />
                    </button>

                    {Array.from({ length: Math.min(5, totalPages) }).map(
                      (_, index) => {
                        // Show pages around current page
                        let pageNumber;
                        if (totalPages <= 5) {
                          pageNumber = index + 1;
                        } else if (currentPage <= 3) {
                          pageNumber = index + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNumber = totalPages - 4 + index;
                        } else {
                          pageNumber = currentPage - 2 + index;
                        }

                        return (
                          <button
                            key={pageNumber}
                            onClick={() => paginate(pageNumber)}
                            className={`w-10 h-10 rounded-md ${
                              currentPage === pageNumber
                                ? "bg-green-500 text-white"
                                : "border border-gray-300"
                            }`}
                          >
                            {pageNumber}
                          </button>
                        );
                      }
                    )}

                    <button
                      onClick={() =>
                        paginate(Math.min(totalPages, currentPage + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FiChevronRight />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

// Reusable Filter Section Component
const FilterSection = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="mb-6 border-b border-gray-200 pb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full mb-2"
      >
        <h3 className="font-medium text-black">{title}</h3>
        {isOpen ? (
          <FiChevronUp className="text-black" />
        ) : (
          <FiChevronDown className="text-black" />
        )}
      </button>
      {isOpen && <div className="pl-2">{children}</div>}
    </div>
  );
};

// Product Card Component
const ProductCard = ({
  product,
  onAddToCart,
  addingToCart,
  isFavorite,
  onToggleFavorite,
  router,
}) => {
  const discountPercentage = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  return (
    <div
      className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-200 relative"
      onClick={() => router.push(`/products/${product._id}`)}
    >
      {/* Favorite Button */}
      <button
        onClick={(e) => onToggleFavorite(product._id, e)}
        className="absolute top-2 right-2 z-10 p-2 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 hover:bg-white hover:scale-110 transition-all duration-200 shadow-lg"
      >
        <FiHeart
          size={18}
          className={`${
            isFavorite
              ? "fill-red-500 text-red-500"
              : "text-gray-400 hover:text-red-500"
          } transition-colors duration-200`}
        />
      </button>

      {/* Product Image */}
      <div className="relative">
        <img
          src={product.productImageURL}
          alt={product.productName}
          className="w-full h-48 object-contain p-4 hover:scale-105 transition-transform duration-300"
        />
        {product.badge && (
          <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
            {product.badge}
          </span>
        )}
        {discountPercentage > 0 && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            {discountPercentage}% OFF
          </span>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-medium text-sm mb-1 line-clamp-1 text-black">
          {product.productName}
        </h3>
        <p className="text-gray-600 text-xs mb-2 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center mb-2">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <FiStar
                key={i}
                className={`w-3 h-3 ${
                  i < Math.floor(product.rating)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-gray-500 text-xs ml-1">
            ({product.reviewsCount})
          </span>
        </div>

        <div className="flex items-center mb-3">
          <span className="font-bold text-black">₹{product.price}</span>
          {product.originalPrice > product.price && (
            <span className="text-gray-500 text-xs line-through ml-2">
              ₹{product.originalPrice}
            </span>
          )}
        </div>

        <button
          className="w-full py-2 rounded-md text-sm font-medium bg-green-500 hover:bg-green-600 text-white flex items-center justify-center gap-2"
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product, e);
          }}
        >
          {addingToCart === product._id ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              Adding...
            </>
          ) : (
            <>
              <FiShoppingCart size={14} />
              Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductListingPage;
