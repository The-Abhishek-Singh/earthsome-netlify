'use client';

import React, { useEffect, useState } from 'react';
import { useParams, notFound, useRouter } from 'next/navigation';
import ImageGallery from '@/Components/ImageGallery';
import { useCart } from '@/context/CartContext';
import { 
  ShoppingCart, 
  Heart, 
  Star, 
  Check, 
  X, 
  ArrowLeft, 
  Shield, 
  Truck, 
  RotateCcw,
  Package,
  Award,
  Tag
} from 'lucide-react';

// Toast Component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-20 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-lg shadow-lg transform transition-all duration-300 ease-out ${
      type === 'success' 
        ? 'bg-green-50 border border-green-200 text-green-800' 
        : 'bg-red-50 border border-red-200 text-red-800'
    }`}>
      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
      }`}>
        {type === 'success' ? <Check size={14} className="text-white" /> : <X size={14} className="text-white" />}
      </div>
      <span className="font-medium">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 opacity-60 hover:opacity-100 transition-opacity"
      >
        <X size={14} />
      </button>
    </div>
  );
};

// Loading Component
const ProductSkeleton = () => (
  <div className="min-h-screen bg-white">
    <div className="max-w-6xl mx-auto px-6 py-8 my-28">
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-32 mb-8"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-4">
            <div className="bg-gray-200 rounded-lg h-96"></div>
            <div className="flex gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-gray-200 rounded-md h-16 w-16"></div>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-gray-200 rounded h-8 w-3/4"></div>
            <div className="bg-gray-200 rounded h-12 w-full"></div>
            <div className="bg-gray-200 rounded h-24 w-full"></div>
            <div className="bg-gray-200 rounded h-16 w-full"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Combo Product Card Component
const ComboProductCard = ({ product }) => {
  const saveAmount = product.originalPrice ? product.originalPrice - product.price : 0;
  const savePercentage = product.originalPrice
    ? Math.round((saveAmount / product.originalPrice) * 100)
    : 0;

  return (
    <div className="border rounded-lg p-4 bg-white">
      <div className="flex gap-4">
        <div className="flex-shrink-0 w-20 h-20">
          <img
            src={product.productImageURL}
            alt={product.productName}
            className="w-full h-full object-cover rounded-md"
          />
        </div>
        <div className="flex-grow">
          <h3 className="font-medium text-gray-900">{product.productName}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-lg font-semibold text-gray-900">₹{product.price}</span>
            {product.originalPrice && (
              <>
                <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
                {savePercentage > 0 && (
                  <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded">
                    {savePercentage}% OFF
                  </span>
                )}
              </>
            )}
          </div>
          {product.rating && (
            <div className="flex items-center gap-1 mt-1">
              <Star size={12} className="text-yellow-400 fill-current" />
              <span className="text-xs text-gray-600">{product.rating}</span>
              {product.reviewsCount && (
                <span className="text-xs text-gray-500">({product.reviewsCount})</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function ComboProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const id = params?.id;

  const [comboOffer, setComboOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    if (!id) {
      notFound();
      return;
    }

    const fetchComboOffer = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/offers/combo/${id}`, {
          cache: 'no-store',
        });

        if (!res.ok) {
          if (res.status === 404) {
            notFound();
            return;
          }
          throw new Error(`Failed to fetch combo offer: ${res.status} ${res.statusText}`);
        }

        const offerData = await res.json();
        setComboOffer(offerData.offer);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching combo offer:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchComboOffer();
  }, [id]);

  // Use the same calculation logic as ComboProductsShowcase
  const calculateComboPrice = (products, discountPercentage) => {
    const totalOriginalPrice = products.reduce((sum, product) => sum + product.price, 0);
    const discountAmount = (totalOriginalPrice * discountPercentage) / 100;
    const finalPrice = totalOriginalPrice - discountAmount;
    return { originalPrice: totalOriginalPrice, finalPrice, savings: discountAmount };
  };

  const handleAddToCart = async () => {
    if (!comboOffer) return;
    
    setAddingToCart(true);
    try {
      // Use the same calculation as ComboProductsShowcase
      const pricing = calculateComboPrice(comboOffer.comboProducts, comboOffer.discountPercentage);
      
      // Create a combo product object with the calculated combo price
      const comboProduct = {
        _id: comboOffer._id,
        productName: comboOffer.title,
        price: pricing.finalPrice,
        originalPrice: pricing.originalPrice,
        productImageURL: comboOffer.comboProducts[0]?.productImageURL || '',
        isCombo: true,
        comboProducts: comboOffer.comboProducts,
        comboImages: comboOffer.comboProducts.map(p => p.productImageURL),
        quantity: 1,
        discountPercentage: comboOffer.discountPercentage
      };
      
      await addToCart(comboProduct);
      
      setToast({
        message: `Combo "${comboOffer.title}" added to cart!`,
        type: 'success'
      });
    } catch (error) {
      setToast({
        message: 'Failed to add combo to cart',
        type: 'error'
      });
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!comboOffer) return;
    
    setBuyingNow(true);
    try {
      // Use the same calculation as ComboProductsShowcase
      const pricing = calculateComboPrice(comboOffer.comboProducts, comboOffer.discountPercentage);
      
      // Create a combo product object with the calculated combo price
      const comboProduct = {
        _id: comboOffer._id,
        productName: comboOffer.title,
        price: pricing.finalPrice,
        originalPrice: pricing.originalPrice,
        productImageURL: comboOffer.comboProducts[0]?.productImageURL || '',
        isCombo: true,
        comboProducts: comboOffer.comboProducts,
        comboImages: comboOffer.comboProducts.map(p => p.productImageURL),
        quantity: 1,
        discountPercentage: comboOffer.discountPercentage
      };
      
      await addToCart(comboProduct);
      router.push('/cart');
    } catch (error) {
      setToast({
        message: 'Failed to proceed to checkout',
        type: 'error'
      });
    } finally {
      setBuyingNow(false);
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    setToast({
      message: isFavorite ? 'Removed from favorites' : 'Added to favorites',
      type: 'success'
    });
  };

  if (loading) return <ProductSkeleton />;
  if (error) throw new Error(error);
  if (!comboOffer) return notFound();

  // Use the same calculation as ComboProductsShowcase
  const pricing = calculateComboPrice(comboOffer.comboProducts, comboOffer.discountPercentage);
  const totalPrice = pricing.finalPrice;
  const totalOriginalPrice = pricing.originalPrice;
  const totalSavings = pricing.savings;
  const discountPercentage = comboOffer.discountPercentage;

  // Get all images from all products in the combo
  // const allComboImages = comboOffer.comboProducts.flatMap(product => 
  //   [product.productImageURL, ...(product.images || [])]
  // ).filter((url, index, self) => 
  //   url && self.indexOf(url) === index
  // );
  const allComboImages = comboOffer.comboProducts
  .map(product => product.productImageURL)
  .filter((url, index, self) => url && self.indexOf(url) === index);


  return (
    <div id="combo-page-top" className="min-h-screen bg-white mb-[900px] sm:mb-[700px] md:mb-[600px] lg:mb-[485px]">
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Back Button */}
      <div className="max-w-6xl mx-auto px-6 pt-8 mt-20">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-gray-500 hover:text-green-600 transition-colors duration-200 mb-8 font-medium"
        >
          <ArrowLeft size={18} />
          Back to Offers
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Image Gallery */}
          <div className="order-1">
            <div className="sticky top-8">
              <ImageGallery 
                images={allComboImages} 
                // productName={comboOffer.title}
                selectedIndex={selectedImageIndex}
                onSelectImage={setSelectedImageIndex}
              />
              
            
            </div>
          </div>

          {/* Combo Information */}
          <div className="order-2">
            {/* Header Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-green-600 font-medium">
                  <Tag size={16} />
                  <span>COMBO OFFER</span>
                </div>
                <button
                  onClick={toggleFavorite}
                  className="p-2 rounded-full hover:bg-gray-50 transition-colors"
                >
                  <Heart
                    size={20}
                    className={`${
                      isFavorite
                        ? 'fill-red-500 text-red-500'
                        : 'text-gray-400 hover:text-red-500'
                    } transition-colors duration-200`}
                  />
                </button>
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {comboOffer.title}
              </h1>

              {/* Combo Savings Badge */}
              <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg mb-6 inline-flex items-center gap-2">
                <span className="font-semibold">Save {discountPercentage}%</span>
                <span>on this combo</span>
              </div>

              {/* Price Section */}
              <div className="mb-8">
                <div className="flex items-baseline gap-4 mb-2">
                  <span className="text-3xl font-bold text-gray-900">₹{totalPrice.toFixed(2)}</span>
                  <span className="text-lg text-gray-500 line-through">₹{totalOriginalPrice.toFixed(2)}</span>
                  <span className="bg-red-100 text-red-600 text-sm font-medium px-2 py-1 rounded">
                    {discountPercentage}% OFF
                  </span>
                </div>
                <p className="text-green-600 text-sm font-medium">
                  You&apos;ll save ₹{totalSavings.toFixed(2)} with this combo
                </p>
              </div>

              {/* Products in this Combo */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Products in this Combo ({comboOffer.comboProducts.length})
                </h2>
                <div className="space-y-4">
                  {comboOffer.comboProducts.map((product) => (
                    <ComboProductCard key={product._id} product={product} />
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mb-8">
                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  className={`flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${
                    addingToCart ? 'opacity-75' : ''
                  }`}
                >
                  {addingToCart ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Adding...
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={18} />
                      Add Combo to Cart
                    </>
                  )}
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={buyingNow}
                  className={`flex-1 bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-medium transition-colors ${
                    buyingNow ? 'opacity-75' : ''
                  }`}
                >
                  {buyingNow ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Processing...
                    </>
                  ) : (
                    'Buy Combo Now'
                  )}
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-3 mb-8">
                <div className="text-center py-3 bg-green-50 rounded-lg">
                  <Shield size={20} className="text-green-600 mx-auto mb-1" />
                  <span className="text-xs text-gray-600">Secure Payment</span>
                </div>
                <div className="text-center py-3 bg-green-50 rounded-lg">
                  <Truck size={20} className="text-green-600 mx-auto mb-1" />
                  <span className="text-xs text-gray-600">Free Shipping</span>
                </div>
                <div className="text-center py-3 bg-green-50 rounded-lg">
                  <RotateCcw size={20} className="text-green-600 mx-auto mb-1" />
                  <span className="text-xs text-gray-600">Easy Returns</span>
                </div>
              </div>
            </div>

            {/* Offer Details */}
            {comboOffer.startDate && (
              <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="font-semibold text-yellow-800 mb-2">Offer Details</h3>
                <p className="text-sm text-yellow-700">
                  This combo offer is valid from {new Date(comboOffer.startDate).toLocaleDateString()} 
                  {comboOffer.endDate && ` to ${new Date(comboOffer.endDate).toLocaleDateString()}`}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}