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

  const handleComboClick = (offer) => {
    if (offer.comboProducts && offer.comboProducts.length > 0) {
      router.push(`/Comboes/${offer._id}`);
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
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          Combo Offers
        </h2>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="inline-flex items-center gap-3 bg-white rounded-xl px-6 py-4 shadow-sm">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-orange-500 border-t-transparent"></div>
            <span className="text-gray-600 font-medium">
              Loading combo offers...
            </span>
          </div>
        </div>
      ) : comboOffers.length === 0 ? (
        <div className="text-center py-20">
          <div className="inline-flex items-center gap-3 bg-orange-50 text-orange-600 rounded-xl px-6 py-4">
            <Gift size={20} />
            <span className="font-medium">No combo offers available at the moment.</span>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {comboOffers.slice(0, 6).map((offer) => {
              const pricing = calculateComboPrice(offer.comboProducts, offer.discountPercentage);
              
              return (
                
                <div
                  key={offer._id}
                  className="group relative bg-white rounded-2xl md:rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-500 overflow-hidden cursor-pointer transform hover:-translate-y-2"
                  onMouseEnter={() => setHoveredOffer(offer._id)}
                  onMouseLeave={() => setHoveredOffer(null)}
                  onClick={() => handleComboClick(offer)}
                >
                  {/* Combo Badge */}
                  <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-white text-sm font-medium bg-gradient-to-r from-orange-500 to-red-500 shadow-lg">
                    <div className="flex items-center gap-1">
                      <Gift size={14} />
                      COMBO
                    </div>
                  </div>

                  {/* Discount Badge */}
                  {offer.discountPercentage > 0 && (
                    <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full text-white text-sm font-bold bg-green-500 shadow-lg">
                      {offer.discountPercentage}% OFF
                    </div>
                  )}

                  {/* Favorite Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(offer._id);
                    }}
                    className="absolute top-16 right-4 z-10 p-2 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 hover:bg-white hover:scale-110 transition-all duration-200 shadow-lg"
                  >
                    <Heart
                      size={18}
                      className={`${
                        favorites.has(offer._id)
                          ? "fill-red-500 text-red-500"
                          : "text-gray-400 hover:text-red-500"
                      } transition-colors duration-200`}
                    />
                  </button>

                  {/* Products Images */}
                  <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 rounded-t-3xl p-4">
                    <div className="grid grid-cols-2 gap-2 h-48 md:h-60">
                      {offer.comboProducts.slice(0, 4).map((product, index) => (
                        <div key={product._id} className="relative overflow-hidden rounded-xl bg-white">
                          <img
                            src={product.productImageURL}
                            alt={product.productName}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          {index === 3 && offer.comboProducts.length > 4 && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                              <span className="text-white font-bold text-lg">
                                +{offer.comboProducts.length - 3}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Add to Cart Button */}
                    <div
                      className={`hidden md:block absolute inset-x-4 bottom-4 transform transition-all duration-300 ${
                        hoveredOffer === offer._id
                          ? "translate-y-0 opacity-100"
                          : "translate-y-4 opacity-0"
                      }`}
                    >
                      <button
                        className={`w-full bg-gradient-to-r from-green-600 to-green-600 hover:from-green-700 hover:to-green-700 text-white py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl ${
                          addingToCart === offer._id
                            ? "from-green-700 to-green-700 scale-95"
                            : ""
                        }`}
                        onClick={(e) => handleAddComboToCart(offer, e)}
                        disabled={addingToCart === offer._id}
                      >
                        {addingToCart === offer._id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                            Adding...
                          </>
                        ) : (
                          <>
                            <ShoppingCart size={18} />
                            Add Combo
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Offer Info */}
                  <div className="p-6">
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors duration-200 leading-snug">
                      {offer.title}
                    </h3>

                    {/* Products Count */}
                    <div className="mb-4">
                      <span className="text-sm text-green-600 font-semibold uppercase tracking-wide bg-green-50 px-2 py-1 rounded-lg">
                        {offer.comboProducts.length} Products Bundle
                      </span>
                    </div>

                    {/* Product Names */}
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {offer.comboProducts.map(p => p.productName).join(" + ")}
                      </p>
                    </div>

                    {/* Pricing */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-lg md:text-2xl font-bold text-gray-900">
                        ₹{pricing.finalPrice.toFixed(2)}
                      </span>
                      <span className="text-sm md:text-lg text-gray-500 line-through">
                        ₹{pricing.originalPrice.toFixed(2)}
                      </span>
                      {pricing.savings > 0 && (
                        <span className="text-sm font-bold text-green-700 bg-green-100 px-3 py-1 rounded-full">
                          Save ₹{pricing.savings.toFixed(2)}
                        </span>
                      )}
                    </div>

                    {/* Validity */}
                    {offer.endDate && (
                      <div className="mt-3 text-xs text-gray-500">
                        Valid until: {new Date(offer.endDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Show More/Less Button */}
          {comboOffers.length > 6 && (
            <div className="text-center mt-16">
              <button
                onClick={() => router.push("/combo-offers")}
                className="bg-gradient-to-r from-green-600 to-green-600 hover:from-green-700 hover:to-green-700 text-white px-10 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-500/50"
              >
                View All Combo Offers
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ComboProductsShowcase;