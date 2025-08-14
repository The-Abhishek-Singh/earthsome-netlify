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
  Award
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

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const id = params?.id;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (!id) {
      notFound();
      return;
    }

    const fetchProduct = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`, {
          cache: 'no-store',
        });

        if (!res.ok) {
          if (res.status === 404) {
            notFound();
            return;
          }
          throw new Error(`Failed to fetch product: ${res.status} ${res.statusText}`);
        }

        const productData = await res.json();
        setProduct(productData);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    
    setAddingToCart(true);
    try {
      await addToCart({ 
        ...product, 
        quantity: 1
      });
      setToast({
        message: `${product.productName} added to cart!`,
        type: 'success'
      });
    } catch (error) {
      setToast({
        message: 'Failed to add product to cart',
        type: 'error'
      });
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!product) return;
    
    setBuyingNow(true);
    try {
      await addToCart({ 
        ...product, 
        quantity: 1
      });
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

  const getBadgeColor = (badge) => {
    switch (badge) {
      case 'Best Seller': return 'bg-green-500';
      case 'New': return 'bg-green-600';
      case 'Premium': return 'bg-green-700';
      case 'Limited': return 'bg-green-800';
      default: return 'bg-gray-500';
    }
  };

  if (loading) return <ProductSkeleton />;
  if (error) throw new Error(error);
  if (!product) return notFound();

  const saveAmount = product.originalPrice ? product.originalPrice - product.price : 0;
  const savePercentage = product.originalPrice
    ? Math.round((saveAmount / product.originalPrice) * 100)
    : 0;

  const allImages = [product.productImageURL, ...(product.images || [])];

  return (
    <div className="min-h-screen bg-white mb-[481px] ">
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Back Button */}
      <div className="max-w-6xl mx-auto px-6 pt-8 my-20">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-gray-500 hover:text-green-600 transition-colors duration-200 mb-8 font-medium"
        >
          <ArrowLeft size={18} />
          Back to Products
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Image Gallery */}
          <div className="order-1">
            <div className="sticky top-8">
              <ImageGallery images={allImages} productName={product.productName} />
            </div>
          </div>

          {/* Product Information */}
          <div className="order-2">
            {/* Header Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {product.badge && (
                    <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getBadgeColor(product.badge)}`}>
                      {product.badge}
                    </span>
                  )}
                  {product.category && (
                    <span className="text-sm text-green-600 font-medium uppercase tracking-wider">
                      {product.category}
                    </span> 
                  )}
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
                {product.productName}
              </h1>

              {/* Rating */}
              {product.rating && (
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center gap-1">
                    <Star size={16} className="text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-gray-700">{product.rating}</span>
                  </div>
                  {product.reviewsCount !== undefined && (
                    <span className="text-sm text-gray-500">({product.reviewsCount} reviews)</span>
                  )}
                </div>
              )}

              {/* Price Section */}
              <div className="mb-8">
                <div className="flex items-baseline gap-4 mb-2">
                  <span className="text-3xl font-bold text-gray-900">₹{product.price}</span>
                  {product.originalPrice && (
                    <>
                      <span className="text-lg text-gray-500 line-through">₹{product.originalPrice}</span>
                      <span className="bg-red-100 text-red-600 text-sm font-medium px-2 py-1 rounded">
                        {savePercentage}% OFF
                      </span>
                    </>
                  )}
                </div>
                {saveAmount > 0 && (
                  <p className="text-green-600 text-sm font-medium">
                    You save ₹{saveAmount.toFixed(2)}
                  </p>
                )}
              </div>

              {/* Product Meta */}
              <div className="grid grid-cols-2 gap-4 mb-8 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 text-sm">
                  <Package size={14} className="text-gray-500" />
                  <span className="text-gray-600">SKU: {product.sku}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Award size={14} className="text-gray-500" />
                  <span className="text-gray-600">Category: {product.category}</span>
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
                      Add to Cart
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
                    'Buy Now'
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

            {/* Product Description */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Product Description</h2>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Key Ingredients */}
            {product.ingredients?.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Key Ingredients</h2>
                <div className="space-y-2">
                  {product.ingredients.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 py-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Benefits */}
            {product.benefits?.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Benefits</h2>
                <div className="space-y-2">
                  {product.benefits.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 py-2">
                      <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}