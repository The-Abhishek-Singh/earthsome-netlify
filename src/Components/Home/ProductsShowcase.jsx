"use client";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ShoppingCart, Heart, Star, Check, X, Gift } from "lucide-react";
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

const ComboProductsShowcase = () => {
  const router = useRouter();
  const { addToCart } = useCart();
  const [hoveredOffer, setHoveredOffer] = useState(null);
  const [favorites, setFavorites] = useState(new Set());
  const [comboOffers, setComboOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [addingToCart, setAddingToCart] = useState(null);

  useEffect(() => {
    const fetchComboOffers = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/offers`
        );
        
        const combos = res.data.offers.filter(
          offer => offer.type === "COMBO" && offer.isActive
        );
        
        setComboOffers(combos);
      } catch (err) {
        console.error("Error fetching combo offers:", err);
        setToast({
          message: "Failed to load combo offers",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchComboOffers();
  }, []);

  const toggleFavorite = (offerId) => {
    const newFavorites = new Set(favorites);
    newFavorites.has(offerId)
      ? newFavorites.delete(offerId)
      : newFavorites.add(offerId);
    setFavorites(newFavorites);
  };

  const calculateComboPrice = (products, discountPercentage) => {
    const totalOriginalPrice = products.reduce((sum, product) => sum + product.price, 0);
    const discountAmount = (totalOriginalPrice * discountPercentage) / 100;
    const finalPrice = totalOriginalPrice - discountAmount;
    return { originalPrice: totalOriginalPrice, finalPrice, savings: discountAmount };
  };

  const handleAddComboToCart = async (offer, e) => {
    e.stopPropagation();
    setAddingToCart(offer._id);

    try {
      // Create a combo product object with the calculated combo price
      const pricing = calculateComboPrice(offer.comboProducts, offer.discountPercentage);
      
      const comboProduct = {
        _id: offer._id,
        productName: offer.title,
        price: pricing.finalPrice,
        originalPrice: pricing.originalPrice,
        productImageURL: offer.comboProducts[0]?.productImageURL || '',
        isCombo: true,
        comboProducts: offer.comboProducts,
        comboImages: offer.comboProducts.map(p => p.productImageURL),
        quantity: 1,
        discountPercentage: offer.discountPercentage
      };
      
      // Add the combo as a single product to cart
      await addToCart(comboProduct);
      
      setToast({
        message: `${offer.title} added to cart!`,
        type: "success",
      });
    } catch (error) {
      setToast({
        message: "Failed to add combo to cart",
        type: "error",
      });
    } finally {
      setTimeout(() => setAddingToCart(null), 300);
    }
  };

  const handleComboClick = (offer, e) => {
    // Prevent navigation if clicking on interactive elements
    if (e.target.closest('button')) return;
    
    if (offer.comboProducts && offer.comboProducts.length > 0) {
      router.push(`/Comboes/${offer._id}`);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header Section */}
      <div className="text-center mb-12 sm:mb-16">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
          Combo Offers
        </h2>
        {/* <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover incredible savings with our specially curated product bundles
        </p> */}
      </div>

      {loading ? (
        <div className="text-center py-16 sm:py-20">
          <div className="inline-flex items-center gap-3 bg-white rounded-xl px-6 py-4 shadow-lg border border-gray-100">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-orange-500 border-t-transparent"></div>
            <span className="text-gray-600 font-medium">
              Loading combo offers...
            </span>
          </div>
        </div>
      ) : comboOffers.length === 0 ? (
        <div className="text-center py-16 sm:py-20">
          <div className="inline-flex items-center gap-3 bg-orange-50 text-orange-600 rounded-xl px-6 py-4 border border-orange-100">
            <Gift size={20} />
            <span className="font-medium">No combo offers available at the moment.</span>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {comboOffers.slice(0, 8).map((offer) => {
              const pricing = calculateComboPrice(offer.comboProducts, offer.discountPercentage);
              
              return (
                <div
                  key={offer._id}
                  className="group relative bg-white rounded-xl lg:rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-2 hover:border-orange-300"
                  onMouseEnter={() => setHoveredOffer(offer._id)}
                  onMouseLeave={() => setHoveredOffer(null)}
                  onClick={(e) => handleComboClick(offer, e)}
                >
                  {/* Image Section - More Compact */}
                  <div className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-orange-100 h-44">
                    {/* Badges */}
                    <div className="absolute top-2 left-2 right-2 z-10 flex justify-between items-start">
                      <div className="flex gap-1">
                        <span className="px-2 py-1 rounded-md text-white text-xs font-bold bg-gradient-to-r from-orange-500 to-red-500 flex items-center gap-1">
                          <Gift size={10} />
                          COMBO
                        </span>
                        {offer.discountPercentage > 0 && (
                          <span className="px-2 py-1 rounded-md text-white text-xs font-bold bg-green-500">
                            {offer.discountPercentage}% OFF
                          </span>
                        )}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(offer._id);
                        }}
                        className="p-1.5 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white hover:scale-110 transition-all duration-200 shadow-md"
                      >
                        <Heart
                          size={14}
                          className={`${
                            favorites.has(offer._id)
                              ? "fill-red-500 text-red-500"
                              : "text-gray-400 hover:text-red-500"
                          } transition-colors duration-200`}
                        />
                      </button>
                    </div>

                    {/* Product Images Grid - Optimized */}
                    <div className="grid grid-cols-2 gap-1 p-3 pt-10 h-full">
                      {offer.comboProducts.slice(0, 4).map((product, index) => (
                        <div key={product._id} className="relative overflow-hidden rounded-lg bg-white shadow-sm">
                          <img
                            src={product.productImageURL}
                            alt={product.productName}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                          {index === 3 && offer.comboProducts.length > 4 && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                              <span className="text-white font-bold text-sm">
                                +{offer.comboProducts.length - 3}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Content Section - Compact but Complete */}
                  <div className="p-4">
                    {/* Title & Product Count */}
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-base font-bold text-gray-900 line-clamp-2 flex-1 pr-2 group-hover:text-green-600 transition-colors leading-tight">
                        {offer.title}
                      </h3>
                      <span className="text-xs text-green-700 font-bold bg-green-50 px-2 py-1 rounded whitespace-nowrap">
                        {offer.comboProducts.length} Items
                      </span>
                    </div>

                    {/* Product Description */}
                    <div className="mb-3">
                      <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                        {offer.comboProducts.map(p => p.productName).join(" • ")}
                      </p>
                    </div>

                    {/* Pricing - Compact */}
                    <div className="mb-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg font-bold text-gray-900">
                          ₹{pricing.finalPrice.toFixed(2)}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          ₹{pricing.originalPrice.toFixed(2)}
                        </span>
                      </div>
                      {pricing.savings > 0 && (
                        <div className="text-xs font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded inline-block">
                          You Save ₹{pricing.savings.toFixed(2)}
                        </div>
                      )}
                    </div>

                    {/* Validity - Compact */}
                    {offer.endDate && (
                      <div className="mb-3 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded inline-block">
                        Valid until: {new Date(offer.endDate).toLocaleDateString()}
                      </div>
                    )}

                    {/* Add to Cart Button - Smaller */}
                    <button
                      className={`w-full bg-gradient-to-r from-green-600 to-green-600 hover:from-green-700 hover:to-green-700 text-white py-2.5 px-4 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all duration-200 ${
                        addingToCart === offer._id
                          ? "from-green-700 to-green-700 scale-95"
                          : "hover:scale-[1.02] active:scale-95"
                      }`}
                      onClick={(e) => handleAddComboToCart(offer, e)}
                      disabled={addingToCart === offer._id}
                    >
                      {addingToCart === offer._id ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          <span>Adding...</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart size={16} />
                          <span>Add to Cart</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* View More Button */}
          {/* {comboOffers.length > 6 && (
            <div className="text-center mt-12 sm:mt-16">
              <button
                onClick={() => router.push("/combo-offers")}
                className="bg-gradient-to-r from-green-600 to-green-600 hover:from-green-700 hover:to-green-700 text-white px-8 sm:px-12 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold text-base sm:text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-500/50 active:scale-95"
              >
                View All Combo Offers ({comboOffers.length})
              </button>
            </div>
          )} */}
        </>
      )}
    </div>
  );
};

export default ComboProductsShowcase;