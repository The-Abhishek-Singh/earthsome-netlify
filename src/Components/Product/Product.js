

"use client";
// import { useState, useEffect } from "react";
// import {
//   FiFilter,
//   FiHeart,
//   FiStar,
//   FiChevronDown,
//   FiChevronUp,
//   FiX,
//   FiShoppingCart,
//   FiChevronLeft,
//   FiChevronRight,
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
//   const [currentPage, setCurrentPage] = useState(1);
//   const productsPerPage = 8;

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
//     setCurrentPage(1); // Reset to first page when filters change
//   };

//   // Pagination logic
//   const indexOfLastProduct = currentPage * productsPerPage;
//   const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
//   const currentProducts = filteredProducts.slice(
//     indexOfFirstProduct,
//     indexOfLastProduct
//   );
//   const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

//   const paginate = (pageNumber) => setCurrentPage(pageNumber);

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

//   const toggleFavorite = (productId, e) => {
//     e.stopPropagation();
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
//         className={`fixed top-20 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl transform transition-all duration-500 ease-out bg-white border ${
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
//     <div className="bg-white my-30">
//       {/* Header */}
//       <div className="container mx-auto text-center py-8">
//         <h1 className="text-4xl font-extrabold text-green-700">
//           {" "}
//           All products
//         </h1>
//         <h4 className="text-4xl font-extrabold text-green-700">
//           {" "}
//           Shop the Complete Range
//         </h4>
//       </div>

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
//                   {currentProducts.map((product) => (
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

//                 {/* Pagination */}
//                 {totalPages > 1 && (
//                   <div className="mt-8 flex justify-center items-center gap-2 text-black">
//                     <button
//                       onClick={() => paginate(Math.max(1, currentPage - 1))}
//                       disabled={currentPage === 1}
//                       className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                       <FiChevronLeft />
//                     </button>

//                     {Array.from({ length: Math.min(5, totalPages) }).map(
//                       (_, index) => {
//                         // Show pages around current page
//                         let pageNumber;
//                         if (totalPages <= 5) {
//                           pageNumber = index + 1;
//                         } else if (currentPage <= 3) {
//                           pageNumber = index + 1;
//                         } else if (currentPage >= totalPages - 2) {
//                           pageNumber = totalPages - 4 + index;
//                         } else {
//                           pageNumber = currentPage - 2 + index;
//                         }

//                         return (
//                           <button
//                             key={pageNumber}
//                             onClick={() => paginate(pageNumber)}
//                             className={`w-10 h-10 rounded-md ${
//                               currentPage === pageNumber
//                                 ? "bg-green-500 text-white"
//                                 : "border border-gray-300"
//                             }`}
//                           >
//                             {pageNumber}
//                           </button>
//                         );
//                       }
//                     )}

//                     <button
//                       onClick={() =>
//                         paginate(Math.min(totalPages, currentPage + 1))
//                       }
//                       disabled={currentPage === totalPages}
//                       className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                       <FiChevronRight />
//                     </button>
//                   </div>
//                 )}
//               </>
//             )}
//           </div>
//         </div>
//         {/* next section */}
//         <div className="bg-gray-100 py-6 mt-8">
//           {/* horzontal cards with some other products. */}
//         </div>
//         {/* next section */}
//         <div className="bg-gray-100 py-6 mt-8">
//           {/* some advertisments */}
//         </div>
//         {/* next section */}
//         <div className="bg-gray-100 py-6 mt-8">
//           {/* these last section from your side. */}
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
//   const discountPercentage = Math.round(
//     ((product.originalPrice - product.price) / product.originalPrice) * 100
//   );

//   return (
//     <div
//       className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-200 relative"
//       onClick={() => router.push(`/products/${product._id}`)}
//     >
//       {/* Favorite Button */}
//       <button
//         onClick={(e) => onToggleFavorite(product._id, e)}
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

//         <button
//           className="w-full py-2 rounded-md text-sm font-medium bg-green-500 hover:bg-green-600 text-white flex items-center justify-center gap-2"
//           onClick={(e) => {
//             e.stopPropagation();
//             onAddToCart(product, e);
//           }}
//         >
//           {addingToCart === product._id ? (
//             <>
//               <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
//               Adding...
//             </>
//           ) : (
//             <>
//               <FiShoppingCart size={14} />
//               Add to Cart
//             </>
//           )}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ProductListingPage;

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
  FiTrendingUp,
  FiAward,
  FiTruck,
  FiShield,
  FiRefreshCw,
  FiPhone,
  FiMail,
  FiMapPin,
  FiClock,
  FiGift,
} from "react-icons/fi";

const ProductListingPage = () => {
  // Mock data for demonstration
  const mockProducts = [
    {
      _id: "1",
      productName: "Organic Green Tea",
      description: "Premium organic green tea leaves with natural antioxidants",
      price: 299,
      originalPrice: 399,
      rating: 4.5,
      reviewsCount: 128,
      category: "Tea",
      productImageURL:
        "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400",
      badge: "Best Seller",
    },
    {
      _id: "2",
      productName: "Herbal Face Cream",
      description: "Natural herbal face cream for all skin types",
      price: 450,
      originalPrice: 550,
      rating: 4.2,
      reviewsCount: 89,
      category: "Skincare",
      productImageURL:
        "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400",
      badge: "Organic",
    },
    {
      _id: "3",
      productName: "Essential Oil Set",
      description: "Collection of 6 premium essential oils",
      price: 799,
      originalPrice: 999,
      rating: 4.8,
      reviewsCount: 256,
      category: "Wellness",
      productImageURL:
        "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400",
      badge: "Premium",
    },
    {
      _id: "4",
      productName: "Bamboo Toothbrush",
      description: "Eco-friendly bamboo toothbrush pack of 4",
      price: 199,
      originalPrice: 299,
      rating: 4.0,
      reviewsCount: 67,
      category: "Oral Care",
      productImageURL:
        "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=400",
      badge: "Eco",
    },
    {
      _id: "5",
      productName: "Natural Honey",
      description: "Pure raw honey from organic farms",
      price: 350,
      originalPrice: 450,
      rating: 4.6,
      reviewsCount: 142,
      category: "Food",
      productImageURL:
        "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400",
      badge: "Pure",
    },
    {
      _id: "6",
      productName: "Yoga Mat",
      description: "Eco-friendly yoga mat with perfect grip",
      price: 1299,
      originalPrice: 1599,
      rating: 4.4,
      reviewsCount: 98,
      category: "Fitness",
      productImageURL:
        "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400",
      badge: "Popular",
    },
  ];

  const [products, setProducts] = useState(mockProducts);
  const [filteredProducts, setFilteredProducts] = useState(mockProducts);
  const [loading, setLoading] = useState(false);
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

  useEffect(() => {
    applyFilters();
  }, [filters, products]);

  const applyFilters = () => {
    let result = [...products];

    if (filters.category.length > 0) {
      result = result.filter((product) =>
        filters.category.includes(product.category)
      );
    }

    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split("-").map(Number);
      result = result.filter((product) => {
        if (max === 0) return product.price >= min;
        return product.price >= min && product.price <= max;
      });
    }

    if (filters.rating) {
      result = result.filter(
        (product) => product.rating >= Number(filters.rating)
      );
    }

    setFilteredProducts(result);
    setCurrentPage(1);
  };

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
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
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

  const categories = [...new Set(products.map((product) => product.category))];

  const priceRanges = [
    { label: "Under ₹200", value: "0-200" },
    { label: "₹200 - ₹400", value: "200-400" },
    { label: "₹400 - ₹600", value: "400-600" },
    { label: "Over ₹600", value: "600-0" },
  ];

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
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-50 to-green-100 border-b border-green-200">
        <div className="container mx-auto text-center py-12">
          <h1 className="text-5xl font-extrabold text-green-700 mb-2">
            All Products
          </h1>
          <h4 className="text-2xl font-medium text-green-600">
            Shop the Complete Range
          </h4>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Discover our curated collection of premium, eco-friendly products
            designed for your wellness and lifestyle needs.
          </p>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Mobile Filters Overlay */}
      {showMobileFilters && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
          <div className="bg-white w-full h-full overflow-y-auto p-6 animate-slide-in-right">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-black">Filters</h2>
              <button onClick={() => setShowMobileFilters(false)}>
                <FiX className="w-6 h-6 text-black" />
              </button>
            </div>
            <button
              onClick={clearAllFilters}
              className="text-green-500 text-sm mb-6 hover:text-green-600 font-medium"
            >
              Clear all
            </button>

            <FilterSection title="Category">
              {categories.map((category) => (
                <div key={category} className="flex items-center mb-3">
                  <input
                    type="checkbox"
                    id={`mob-cat-${category}`}
                    checked={filters.category.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                    className="mr-3 text-green-500 rounded border-gray-300"
                  />
                  <label
                    htmlFor={`mob-cat-${category}`}
                    className="text-sm text-black"
                  >
                    {category} (
                    {products.filter((p) => p.category === category).length})
                  </label>
                </div>
              ))}
            </FilterSection>

            <FilterSection title="Price Range">
              {priceRanges.map((range) => (
                <div key={range.value} className="flex items-center mb-3">
                  <input
                    type="radio"
                    id={`mob-price-${range.value}`}
                    name="mob-priceRange"
                    checked={filters.priceRange === range.value}
                    onChange={() => handlePriceChange(range.value)}
                    className="mr-3 text-green-500 border-gray-300"
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

            <FilterSection title="Customer Rating">
              {[4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center mb-3">
                  <input
                    type="radio"
                    id={`mob-rating-${rating}`}
                    name="mob-rating"
                    checked={filters.rating === rating.toString()}
                    onChange={() => handleRatingChange(rating.toString())}
                    className="mr-3 text-green-500 border-gray-300"
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
              className="w-full bg-green-500 text-white py-3 rounded-lg mt-6 hover:bg-green-600 font-medium"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto p-4">
        {/* Mobile Filter Button */}
        <div className="md:hidden mb-4">
          <button
            onClick={() => setShowMobileFilters(true)}
            className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors shadow-lg"
          >
            <FiFilter /> Filters
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Desktop Filters */}
          <aside className="hidden md:block w-64 bg-white p-6 rounded-xl shadow-lg sticky top-25 h-fit border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-black">Filters</h2>
              <button
                onClick={clearAllFilters}
                className="text-green-500 text-sm hover:text-green-600 font-medium"
              >
                Clear all
              </button>
            </div>

            <FilterSection title="Category">
              {categories.map((category) => (
                <div key={category} className="flex items-center mb-3">
                  <input
                    type="checkbox"
                    id={`cat-${category}`}
                    checked={filters.category.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                    className="mr-3 text-green-500 rounded border-gray-300 focus:ring-green-500"
                  />
                  <label
                    htmlFor={`cat-${category}`}
                    className="text-sm text-black cursor-pointer"
                  >
                    {category} (
                    {products.filter((p) => p.category === category).length})
                  </label>
                </div>
              ))}
            </FilterSection>

            <FilterSection title="Price Range">
              {priceRanges.map((range) => (
                <div key={range.value} className="flex items-center mb-3">
                  <input
                    type="radio"
                    id={`price-${range.value}`}
                    name="priceRange"
                    checked={filters.priceRange === range.value}
                    onChange={() => handlePriceChange(range.value)}
                    className="mr-3 text-green-500 border-gray-300 focus:ring-green-500"
                  />
                  <label
                    htmlFor={`price-${range.value}`}
                    className="text-sm text-black cursor-pointer"
                  >
                    {range.label}
                  </label>
                </div>
              ))}
            </FilterSection>

            <FilterSection title="Customer Rating">
              {[4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center mb-3">
                  <input
                    type="radio"
                    id={`rating-${rating}`}
                    name="rating"
                    checked={filters.rating === rating.toString()}
                    onChange={() => handleRatingChange(rating.toString())}
                    className="mr-3 text-green-500 border-gray-300 focus:ring-green-500"
                  />
                  <label
                    htmlFor={`rating-${rating}`}
                    className="flex items-center text-sm text-black cursor-pointer"
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

          {/* Product Grid */}
          <div className="flex-1">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-black mb-2">
                {filteredProducts.length} Products Found
                {filters.category.length > 0 &&
                  ` in ${filters.category.join(", ")}`}
              </h2>
              <p className="text-gray-600">
                Discover premium quality products curated just for you
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-gray-100 rounded-xl p-4 animate-pulse h-80"
                  ></div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                  <FiFilter className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-black">
                  No products found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your filters or search again
                </p>
                <button
                  onClick={clearAllFilters}
                  className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 font-medium"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {currentProducts.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      onAddToCart={handleAddToCart}
                      addingToCart={addingToCart}
                      isFavorite={favorites.has(product._id)}
                      onToggleFavorite={toggleFavorite}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex justify-center items-center gap-2">
                    <button
                      onClick={() => paginate(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="p-3 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      <FiChevronLeft />
                    </button>

                    {Array.from({ length: Math.min(5, totalPages) }).map(
                      (_, index) => {
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
                            className={`w-12 h-12 rounded-lg font-medium ${
                              currentPage === pageNumber
                                ? "bg-green-500 text-white"
                                : "border border-gray-300 hover:bg-gray-50"
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
                      className="p-3 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      <FiChevronRight />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Featured Products Section */}
        <div className="bg-gradient-to-r from-green-50 to-green-100 py-16 mt-16 rounded-2xl">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-green-700 mb-4">
                <FiTrendingUp className="inline mr-2" />
                Trending Products
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Discover what's popular right now - handpicked by our community
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {products.slice(0, 3).map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-green-100"
                >
                  <img
                    src={product.productImageURL}
                    alt={product.productName}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h3 className="font-bold text-lg text-black mb-2">
                    {product.productName}
                  </h3>
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xl text-green-600">
                      ₹{product.price}
                    </span>
                    <button
                      onClick={(e) => handleAddToCart(product, e)}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Promotional Banners Section */}
        <div className="py-16 mt-16">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-black mb-4">
                <FiGift className="inline mr-2" />
                Special Offers
              </h2>
              <p className="text-gray-600">
                Don't miss out on these amazing deals
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-r from-green-400 to-green-600 rounded-xl p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full transform translate-x-8 -translate-y-8"></div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-2">Free Shipping</h3>
                  <p className="mb-4">On orders above ₹500</p>
                  <div className="flex items-center">
                    <FiTruck className="mr-2" />
                    <span className="font-medium">Fast & Secure Delivery</span>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-gray-800 to-black rounded-xl p-8 text-white relative overflow-hidden">
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full transform -translate-x-6 translate-y-6"></div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-2">Premium Quality</h3>
                  <p className="mb-4">100% Organic & Natural</p>
                  <div className="flex items-center">
                    <FiAward className="mr-2" />
                    <span className="font-medium">Certified Products</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Support & Trust Indicators */}
        <div className="bg-white py-16 mt-16 border-t border-gray-200">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-black mb-4">
                Why Choose Us?
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                We're committed to providing you with the best shopping
                experience
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiTruck className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-bold text-lg text-black mb-2">
                  Fast Delivery
                </h3>
                <p className="text-gray-600">
                  Free shipping on orders above ₹500
                </p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiShield className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-bold text-lg text-black mb-2">
                  Secure Payment
                </h3>
                <p className="text-gray-600">
                  100% secure & encrypted transactions
                </p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiRefreshCw className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-bold text-lg text-black mb-2">
                  Easy Returns
                </h3>
                <p className="text-gray-600">
                  30-day hassle-free return policy
                </p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiPhone className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-bold text-lg text-black mb-2">
                  24/7 Support
                </h3>
                <p className="text-gray-600">
                  Round-the-clock customer assistance
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact & Newsletter Section */}
        <div className="bg-gradient-to-r from-green-600 to-green-800 py-16 mt-16 rounded-2xl text-white">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold mb-6">Stay Connected</h2>
                <p className="mb-6">
                  Subscribe to our newsletter for the latest updates and
                  exclusive offers
                </p>
                <div className="flex gap-3 mb-6">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-green-300"
                  />
                  <button className="bg-white text-green-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                    Subscribe
                  </button>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <FiMail className="w-5 h-5" />
                    <span>support@example.com</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiPhone className="w-5 h-5" />
                    <span>+91 12345 67890</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-6">Our Store Location</h3>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <FiMapPin className="w-5 h-5 mt-1" />
                    <div>
                      <p className="font-medium">Main Store</p>
                      <p className="text-green-100">
                        123 Green Street, Eco City
                      </p>
                      <p className="text-green-100">
                        Vidisha, Madhya Pradesh 464001
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FiClock className="w-5 h-5" />
                    <div>
                      <p className="font-medium">Store Hours</p>
                      <p className="text-green-100">
                        Mon - Sat: 9:00 AM - 8:00 PM
                      </p>
                      <p className="text-green-100">
                        Sunday: 10:00 AM - 6:00 PM
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
    <div className="mb-8 border-b border-gray-200 pb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full mb-4 hover:text-green-600 transition-colors"
      >
        <h3 className="font-bold text-black text-lg">{title}</h3>
        {isOpen ? (
          <FiChevronUp className="text-green-500" />
        ) : (
          <FiChevronDown className="text-green-500" />
        )}
      </button>
      {isOpen && <div className="space-y-2">{children}</div>}
    </div>
  );
};

// Enhanced Product Card Component
const ProductCard = ({
  product,
  onAddToCart,
  addingToCart,
  isFavorite,
  onToggleFavorite,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const discountPercentage = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  const handleProductClick = () => {
    // Simulate navigation to product detail page
    console.log(`Navigating to product: ${product._id}`);
  };

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 relative group cursor-pointer transform hover:-translate-y-1"
      onClick={handleProductClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Favorite Button */}
      <button
        onClick={(e) => onToggleFavorite(product._id, e)}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 hover:bg-white hover:scale-110 transition-all duration-200 shadow-lg"
      >
        <FiHeart
          size={20}
          className={`${
            isFavorite
              ? "fill-red-500 text-red-500"
              : "text-gray-400 hover:text-red-500"
          } transition-colors duration-200`}
        />
      </button>

      {/* Product Image */}
      <div className="relative overflow-hidden">
        <img
          src={product.productImageURL}
          alt={product.productName}
          className={`w-full h-56 object-cover transition-transform duration-500 ${
            isHovered ? "scale-110" : "scale-100"
          }`}
        />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.badge && (
            <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full font-medium shadow-lg">
              {product.badge}
            </span>
          )}
          {discountPercentage > 0 && (
            <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full font-medium shadow-lg">
              {discountPercentage}% OFF
            </span>
          )}
        </div>

        {/* Quick Actions Overlay */}
        <div
          className={`absolute inset-0 bg-black/20 flex items-center justify-center transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className="transform transition-transform duration-300"
            style={{
              transform: isHovered ? "translateY(0)" : "translateY(10px)",
            }}
          >
            <button
              className="bg-white text-black px-6 py-2 rounded-full font-medium hover:bg-gray-100 transition-colors shadow-lg"
              onClick={(e) => {
                e.stopPropagation();
                handleProductClick();
              }}
            >
              Quick View
            </button>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-6">
        <div className="mb-3">
          <h3 className="font-bold text-lg mb-2 line-clamp-1 text-black group-hover:text-green-600 transition-colors">
            {product.productName}
          </h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>
        </div>

        {/* Rating */}
        <div className="flex items-center mb-4">
          <div className="flex mr-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <FiStar
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-gray-500 text-sm">
            {product.rating} ({product.reviewsCount} reviews)
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xl text-black">
              ₹{product.price}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-gray-500 text-sm line-through">
                ₹{product.originalPrice}
              </span>
            )}
          </div>
          {discountPercentage > 0 && (
            <span className="text-green-600 text-sm font-medium">
              Save ₹{product.originalPrice - product.price}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          className="w-full py-3 rounded-xl text-sm font-bold bg-green-500 hover:bg-green-600 text-white flex items-center justify-center gap-2 transition-all duration-200 transform hover:scale-105 shadow-lg"
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product, e);
          }}
          disabled={addingToCart === product._id}
        >
          {addingToCart === product._id ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              Adding to Cart...
            </>
          ) : (
            <>
              <FiShoppingCart size={16} />
              Add to Cart
            </>
          )}
        </button>
      </div>

      {/* Quick Info Tags */}
      <div className="absolute bottom-4 left-4 flex gap-1">
        {product.category === "Organic" && (
          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
            <FiAward size={10} className="inline mr-1" />
            Organic
          </span>
        )}
      </div>
    </div>
  );
};

export default ProductListingPage;
