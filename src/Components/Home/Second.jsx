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

// Star Rating Component
const StarRating = ({ rating, reviews }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(
        <span key={i} className="text-[#ff8a05]">
          ★
        </span>
      );
    } else if (i === fullStars && hasHalfStar) {
      stars.push(
        <span key={i} className="text-[#ff8a05]">
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

// Profile Circle Component
const ProfileCircle = ({ imageUrl, size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "h-12 w-12 md:h-16 md:w-16",
    md: "h-16 w-16 md:h-20 md:w-20 lg:h-24 lg:w-24",
    lg: "h-20 w-20 md:h-24 md:w-24 lg:h-28 lg:w-28"
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-600 rounded-full p-1 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
        <div className="w-full h-full bg-white rounded-full overflow-hidden flex items-center justify-center">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt="Profile" 
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
              <span className="text-gray-400 text-xs md:text-sm">IMG</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Main Component combining both sections
const SecondWithBestSellers = () => {
  return (
    <>
      <BestSellers />
    </>
  );
};

export default SecondWithBestSellers;

// Best Sellers Section Component
const BestSellers = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [favorites, setFavorites] = useState(new Set());
  const [toast, setToast] = useState(null);
  const [addingToCart, setAddingToCart] = useState(null);
  const { addToCart } = useCart();
  const router = useRouter();

  // Sample profile images - you can replace these with actual image URLs
  const leftProfiles = [
    { id: 1, imageUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face" },
    { id: 2, imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" },
    { id: 3, imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" }
  ];

  const rightProfiles = [
    { id: 4, imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face" },
    { id: 5, imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" },
    { id: 6, imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face" }
  ];

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

  // const toggleFavorite = (productId) => {
  //   const newFavorites = new Set(favorites);
  //   newFavorites.has(productId)
  //     ? newFavorites.delete(productId)
  //     : newFavorites.add(productId);
  //   setFavorites(newFavorites);
  // };

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
        return "bg-[#ff8a05]";
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

  // Only show first 4 products as per new design
  const displayedProducts = products.slice(0, 4);

  return (
    <div className="bg-gradient-to-b from-white via-white to-white py-20 px-4">
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header Section with Batman Quote and Profile Circles */}
        <div className="text-center mb-16">
          {/* Hero Section with Profile Circles */}
          <div className="flex flex-row lg:flex-row items-center justify-center gap-8 lg:gap-12 mb-16">
            {/* Left Profile Circles - Hidden on mobile, visible on lg+ */}
            <div className="hidden lg:flex flex-row gap-4 opacity-50">
              {leftProfiles.map((profile, index) => (
                <div
                  key={profile.id}
                  // className="animate-pulse"
                  style={{
                    animationDelay: `${index * 0.2}s`,
                    animationDuration: '2s'
                  }}
                >
                  <ProfileCircle 
                    imageUrl={profile.imageUrl}
                    size="md"
                    className=" transition-transform duration-300"
                  />
                </div>
              ))}
            </div>

            {/* Center Content */}
            <div className="flex-1 max-w-4xl">
              {/* Mobile Profile Circles - Only visible on mobile */}
              <div className="flex lg:hidden justify-center gap-4 mb-8">
                {leftProfiles.slice(0, 3).map((profile, index) => (
                  <ProfileCircle 
                    key={profile.id}
                    imageUrl={profile.imageUrl}
                    size="sm"
                    className="hover:scale-110 transition-transform duration-300"
                  />
                ))}
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-800 mb-6 leading-tight">
                I am Batman
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed px-4">
                If you make yourself more than just a man, if you devote
                <br className="hidden sm:block" />
                yourself to an ideal, you become something else entirely
              </p>

              {/* Mobile Profile Circles - Second row for mobile */}
              <div className="flex lg:hidden justify-center gap-4 mt-8">
                {rightProfiles.slice(0, 3).map((profile, index) => (
                  <ProfileCircle 
                    key={profile.id}
                    imageUrl={profile.imageUrl}
                    size="sm"
                    className="hover:scale-110 transition-transform duration-300"
                  />
                ))}
              </div>
            </div>

            {/* Right Profile Circles - Hidden on mobile, visible on lg+ */}
            <div className="hidden lg:flex flex-row gap-4 opacity-50">
              {rightProfiles.map((profile, index) => (
                <div
                  key={profile.id}
                  // className="animate-pulse"
                  style={{
                    animationDelay: `${(index + 3) * 0.2}s`,
                    animationDuration: '2s'
                  }}
                >
                  <ProfileCircle 
                    imageUrl={profile.imageUrl}
                    size="md"
                    className=" transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Best Seller Title */}
          <div className="flex justify-center mb-12 mt-36">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800">
              Best Seller
            </h2>
          </div>
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
          <>
            {/* Products Grid - Only 4 products in a row */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-8 mb-16">
              {displayedProducts.map((product) => (
                <div
                  key={product._id}
                  className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-green-100 transition-all duration-300 cursor-pointer hover:-translate-y-2 relative"
                  onMouseEnter={() => setHoveredProduct(product._id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                  onClick={() => {
                    router.push(`/products/${product._id}`);
                  }}
                >
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-green-50/0 to-green-50/0 group-hover:from-green-50/20 group-hover:to-transparent transition-all duration-300 rounded-2xl z-10"></div>

                  {/* Favorite Button */}
                  {/* <button
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
                  </button> */}

                  {/* Product Image with Badge */}
                  <div className="relative overflow-hidden">
                    <img
                      src={product.productImageURL}
                      alt={product.productName}
                      className="w-full h-32 md:h-64 object-contain md:object-cover group-hover:scale-105 transition-transform duration-300"
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
                  <div className="p-4 relative z-20">
                    <div className="mb-2 flex items-center justify-between">
                      <div>
                        <span className="text-xl md:text-2xl font-bold text-green-600">
                          ₹{product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="ml-2 text-sm text-gray-500 line-through">
                            ₹{product.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>

                    <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-1 group-hover:text-green-700 transition-colors line-clamp-2">
                      {product.productName}
                    </h3>

                    {/* Rating and description hidden on small screens */}
                    <div className="hidden md:block">
                      {/* <div className="mb-3">
                        <StarRating
                          rating={product.rating || 4}
                          reviews={product.reviewsCount || 0}
                        />
                      </div> */}
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {product.description}
                      </p>
                    </div>

                    <button
                      className={`hidden sm:block w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white md:py-3 md:px-6 rounded-full transition-all duration-300 font-semibold transform hover:scale-105 shadow-lg hover:shadow-xl ${
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

            {/* All Products Button */}
            <div className="text-center">
              <button
                onClick={() => router.push("/all-product")}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 sm:px-12 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-500/50"
              >
                All Products
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};