// "use client";
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useRouter } from "next/navigation";
// import { Heart, Check, X } from "lucide-react";
// import { useCart } from "@/context/CartContext";

// // It is highly recommended to create these components in separate files
// // for better code organization, as shown in the previous responses.
// // I've included them here for a complete, self-contained example.

// // Toast Component
// const Toast = ({ message, type, onClose }) => {
// useEffect(() => {
//     const timer = setTimeout(() => {
//     onClose();
//     }, 3000);
//     return () => clearTimeout(timer);
// }, [onClose]);

// return (
//     <div
//     className={`fixed top-20 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl transform transition-all duration-500 ease-out bg-white border ${
//         type === "success"
//         ? "border-green-200 shadow-green-100/50"
//         : "border-red-200 shadow-red-100/50"
//     } backdrop-blur-sm`}
//     >
//     <div
//         className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
//         type === "success" ? "bg-green-500" : "bg-red-500"
//         }`}
//     >
//         {type === "success" ? (
//         <Check size={16} className="text-white" />
//         ) : (
//         <X size={16} className="text-white" />
//         )}
//     </div>
//     <span className="font-semibold text-gray-800">{message}</span>
//     <button
//         onClick={onClose}
//         className="ml-2 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
//     >
//         <X size={16} />
//     </button>
//     </div>
// );
// };

// // Star Rating Component
// const StarRating = ({ rating, reviews }) => {
// const stars = [];
// const fullStars = Math.floor(rating);
// const hasHalfStar = rating % 1 !== 0;

// for (let i = 0; i < 5; i++) {
//     if (i < fullStars) {
//     stars.push(
//         <span key={i} className="text-green-500">
//         ★
//         </span>
//     );
//     } else if (i === fullStars && hasHalfStar) {
//     stars.push(
//         <span key={i} className="text-green-500">
//         ★
//         </span>
//     );
//     } else {
//     stars.push(
//         <span key={i} className="text-gray-300">
//         ★
//         </span>
//     );
//     }
// }

// return (
//     <div className="flex items-center gap-1">
//     <div className="flex">{stars}</div>
//     <span className="text-gray-500 text-sm">({reviews})</span>
//     </div>
// );
// };

// // Best Sellers Page Component
// const BestsellersPage = () => {
// const [products, setProducts] = useState([]);
// const [loading, setLoading] = useState(true);
// const [favorites, setFavorites] = useState(new Set());
// const [toast, setToast] = useState(null);
// const [addingToCart, setAddingToCart] = useState(null);
// const { addToCart } = useCart();
// const router = useRouter();

// useEffect(() => {
//     const fetchBestSellers = async () => {
//     try {
//         const apiUrl =
//         process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
//         const res = await axios.get(`${apiUrl}/api/products`, {
//         headers: {
//             Accept: "application/json",
//             "Content-Type": "application/json",
//         },
//         timeout: 10000,
//         withCredentials: true,
//         });
//         const filtered = res.data.filter(
//         (product) => product.badge?.toLowerCase() === "best seller"
//         );
//         setProducts(filtered);
//     } catch (error) {
//         console.error("Error fetching best sellers:", error);
//         let errorMessage = "Failed to load products. Please try again.";
//         if (error.code === "ECONNABORTED") {
//         errorMessage = "Request timed out. Please check your connection.";
//         } else if (!navigator.onLine) {
//         errorMessage = "No internet connection. Please check your network.";
//         } else if (error.response) {
//         errorMessage =
//             error.response.data?.message || "Server error. Please try again.";
//         }
//         setToast({
//         message: errorMessage,
//         type: "error",
//         });
//     } finally {
//         setLoading(false);
//     }
//     };

//     fetchBestSellers();
// }, []);

// const toggleFavorite = (productId) => {
//     const newFavorites = new Set(favorites);
//     newFavorites.has(productId)
//     ? newFavorites.delete(productId)
//     : newFavorites.add(productId);
//     setFavorites(newFavorites);
// };

// const handleAddToCart = async (product, e) => {
//     e.stopPropagation();
//     setAddingToCart(product._id);

//     try {
//     await addToCart(product);
//     setToast({
//         message: `${product.productName} added to cart!`,
//         type: "success",
//     });
//     } catch (error) {
//     setToast({
//         message: "Failed to add product to cart",
//         type: "error",
//     });
//     } finally {
//     setTimeout(() => setAddingToCart(null), 300);
//     }
// };

// return (
//     <div className="w-full bg-gradient-to-br from-green-50 to-white py-16 px-4 mt-20">
//     {toast && (
//         <Toast
//         message={toast.message}
//         type={toast.type}
//         onClose={() => setToast(null)}
//         />
//     )}

//     <div className="max-w-7xl mx-auto">
//         <div className="text-center mb-20">
//         <h1 className="text-4xl font-extrabold text-green-700">
//             All Best Sellers
//         </h1>
//         <p className="mt-2 text-lg text-gray-600">
//             Explore our most popular and highly-rated products.
//         </p>
//         </div>

//         {loading ? (
//         <div className="text-center py-16">
//             <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
//             <p className="text-gray-600 mt-4">Loading best sellers...</p>
//         </div>
//         ) : products.length === 0 ? (
//         <div className="text-center py-16 text-red-500">
//             <div className="text-6xl mb-4">🔍</div>
//             <p className="text-xl">No Best Sellers Found</p>
//         </div>
//         ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
//             {products.map((product) => (
//             <div
//                 key={product._id}
//                 className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-green-100 transition-all duration-300 cursor-pointer hover:-translate-y-2 relative"
//                 onClick={() => router.push(`/products/${product._id}`)}
//             >
//                 <div className="absolute inset-0 bg-gradient-to-t from-green-50/0 to-green-50/0 group-hover:from-green-50/20 group-hover:to-transparent transition-all duration-300 rounded-2xl z-10"></div>

//                 <button
//                 onClick={(e) => {
//                     e.stopPropagation();
//                     toggleFavorite(product._id);
//                 }}
//                 className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 hover:bg-white hover:scale-110 transition-all duration-200 shadow-lg"
//                 >
//                 <Heart
//                     size={18}
//                     className={`${
//                     favorites.has(product._id)
//                         ? "fill-red-500 text-red-500"
//                         : "text-gray-400 hover:text-red-500"
//                     } transition-colors duration-200`}
//                 />
//                 </button>

//                 <div className="relative overflow-hidden">
//                 <img
//                     src={product.productImageURL}
//                     alt={product.productName}
//                     className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
//                 />
//                 {product.badge && (
//                     <span
//                     className={`absolute top-4 left-4 px-3 py-1 text-xs font-bold rounded-full shadow-lg ${
//                         product.badge === "NEW"
//                         ? "bg-emerald-600 text-white"
//                         : "bg-gradient-to-r from-green-500 to-green-600 text-white"
//                     }`}
//                     >
//                     {product.badge}
//                     </span>
//                 )}

//                 <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
//                     <button className="bg-white text-green-600 px-6 py-2 rounded-full font-medium opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-green-50">
//                     Quick View
//                     </button>
//                 </div>
//                 </div>

//                 <div className="p-6 relative z-20">
//                 <div className="mb-3">
//                     <span className="text-2xl font-bold text-green-600">
//                     ₹{product.price}
//                     </span>
//                     {product.originalPrice && (
//                     <span className="ml-2 text-sm text-gray-500 line-through">
//                         ₹{product.originalPrice}
//                     </span>
//                     )}
//                 </div>
//                 <h3 className="text-lg font-semibold text-gray-800 mb-3 group-hover:text-green-700 transition-colors line-clamp-2">
//                     {product.productName}
//                 </h3>
//                 <div className="mb-3">
//                     <StarRating
//                     rating={product.rating || 4}
//                     reviews={product.reviewsCount || 0}
//                     />
//                 </div>
//                 <p className="text-gray-600 text-sm mb-6 line-clamp-2">
//                     {product.description}
//                 </p>
//                 <button
//                     className={`w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 px-6 rounded-full transition-all duration-300 font-semibold transform hover:scale-105 shadow-lg hover:shadow-xl ${
//                     addingToCart === product._id
//                         ? "from-green-700 to-green-800 scale-95"
//                         : ""
//                     }`}
//                     onClick={(e) => handleAddToCart(product, e)}
//                     disabled={addingToCart === product._id}
//                 >
//                     {addingToCart === product._id ? (
//                     <div className="flex items-center justify-center gap-2">
//                         <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
//                         Adding...
//                     </div>
//                     ) : (
//                     "Add to Cart"
//                     )}
//                 </button>
//                 </div>
//             </div>
//             ))}
//         </div>
//         )}
//     </div>
//     </div>
// );
// };

// export default BestsellersPage;

"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Heart, Check, X, Search } from "lucide-react";
import { useCart } from "@/context/CartContext";

// It is highly recommended to create these components in separate files
// for better code organization.
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

// Best Sellers Page Component
const BestsellersPage = () => {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState(new Set());
  const [toast, setToast] = useState(null);
  const [addingToCart, setAddingToCart] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8; // Display 9 products per page

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
          timeout: 10000,
          withCredentials: true,
        });
        const filtered = res.data.filter(
          (product) => product.badge?.toLowerCase() === "best seller"
        );
        setAllProducts(filtered);
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

  useEffect(() => {
    const filtered = allProducts.filter((product) =>
      product.productName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setProducts(filtered);
    setCurrentPage(1); // Reset to the first page on new search
  }, [searchTerm, allProducts]);

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

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(products.length / productsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="w-full bg-gradient-to-br from-green-50 to-white py-16 px-4 mt-20">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-extrabold text-green-700">
              All Best Sellers
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Explore our most popular and highly-rated products.
            </p>
          </div>
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-black w-full pl-12 pr-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors shadow-sm"
            />
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
            <p className="text-gray-600 mt-4">Loading best sellers...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 text-red-500">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-xl">No products match your search.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {currentProducts.map((product) => (
                <div
                  key={product._id}
                  className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-green-100 transition-all duration-300 cursor-pointer hover:-translate-y-2 relative"
                  onClick={() => router.push(`/products/${product._id}`)}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-green-50/0 to-green-50/0 group-hover:from-green-50/20 group-hover:to-transparent transition-all duration-300 rounded-2xl z-10"></div>
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
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                      <button className="bg-white text-green-600 px-6 py-2 rounded-full font-medium opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-green-50">
                        Quick View
                      </button>
                    </div>
                  </div>
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

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-12 gap-4">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-full border border-green-300 text-green-600 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <span className="text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-full border border-green-300 text-green-600 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BestsellersPage;
