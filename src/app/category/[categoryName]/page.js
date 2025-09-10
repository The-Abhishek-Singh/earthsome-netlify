"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { ShoppingCart, Heart, Star, Check, X, Search } from "lucide-react";
import { useCart } from "@/context/CartContext";
import FloatingCart from "@/Components/hf.jsx/FloatingCart";

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

const CategoryPage = () => {
  const { categoryName } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const decodedCategory = decodeURIComponent(categoryName);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [favorites, setFavorites] = useState(new Set());
  const [toast, setToast] = useState(null);
  const [addingToCart, setAddingToCart] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/products`
        );
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [decodedCategory]);

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      product.category?.toLowerCase().trim() ===
      decodedCategory.toLowerCase().trim();
    const matchesSearch =
      product.productName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && (searchQuery === "" || matchesSearch);
  });

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

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

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center gap-3 bg-white rounded-xl px-6 py-4 shadow-sm">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-green-500 border-t-transparent"></div>
            <span className="text-gray-600 font-medium">
              Loading products...
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white mb-[660px] sm:mb-[465px] md:mb-[470px] lg:mb-[350px] xl:mb-[300px]">
      <FloatingCart />
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-2">
              {decodedCategory}
            </h1>
            <p className="text-gray-600 mt-4 text-lg">
              Discover our premium collection of {decodedCategory.toLowerCase()}{" "}
              products
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="w-full sm:w-auto">
            <p className="text-gray-600 text-sm font-medium">
              Showing {filteredProducts.length}{" "}
              {filteredProducts.length === 1 ? "product" : "products"}
            </p>
          </div>
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 text-black pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
          </div>
        </div>

        {currentProducts.length > 0 ? (
          <>
            {/* Products Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentProducts.map((product) => (
                <div
                  key={product._id}
                  className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-green-500/10 transition-all duration-500 overflow-hidden cursor-pointer transform hover:-translate-y-2"
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

                  {/* Product Image */}
                  <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 rounded-t-2xl">
                    <img
                      src={product.productImageURL}
                      alt={product.productName}
                      className="w-full h-56 sm:h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Add to Cart Button */}
                    <div
                      className={`absolute inset-x-4 bottom-4 transform transition-all duration-300 ${
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
                        <span className="text-sm text-green-600 font-semibold uppercase tracking-wide bg-green-50 px-2 py-1 rounded-lg">
                          {product.category}
                        </span>
                      </div>
                    )}

                    <h2 className="text-lg font-bold text-black mb-3 group-hover:text-green-600 transition-colors duration-200 leading-snug">
                      {product.productName}
                    </h2>

                    {product.rating && (
                      <div className="flex items-center gap-2 mb-4">
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

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>

                    {/* Price Section */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-2xl font-bold text-black">
                        ₹{product.price}
                      </span>
                      {product.originalPrice && (
                        <>
                          <span className="text-lg text-gray-500 line-through">
                            ₹{product.originalPrice}
                          </span>
                          {product.originalPrice - product.price > 0 && (
                            <span className="text-sm font-bold text-green-700 bg-green-100 px-3 py-1 rounded-full">
                              Save ₹
                              {(product.originalPrice - product.price).toFixed(
                                2
                              )}
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <nav
                  className="inline-flex items-center gap-1"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Prev
                  </button>

                  {/* Logic for pagination buttons */}
                  {Array.from({ length: totalPages }, (_, i) => {
                    const pageNumber = i + 1;
                    if (
                      pageNumber === 1 ||
                      pageNumber === totalPages ||
                      (pageNumber >= currentPage - 1 &&
                        pageNumber <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`px-4 py-2 rounded-lg border ${
                            currentPage === pageNumber
                              ? "bg-green-600 text-white border-green-600"
                              : "border-gray-200 text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    }
                    return null;
                  })}

                  {/* Ellipsis logic */}
                  {totalPages > 3 && currentPage < totalPages - 1 && (
                    <span className="px-2 py-2 text-gray-500">...</span>
                  )}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        ) : (
          /* Empty State */
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <X size={48} className="text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-black mb-2">
                No products found
              </h3>
              <p className="text-gray-600 mb-8">
                {searchQuery
                  ? `No products match your search for "${searchQuery}"`
                  : `We couldn't find any products in the "${decodedCategory}" category.`}
              </p>
              <button
                onClick={() => {
                  router.push("/all-product");
                  setSearchQuery("");
                  setCurrentPage(1);
                }}
                className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-full hover:bg-green-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>
                </svg>
                {searchQuery ? "Clear Search" : "Browse All Products"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
