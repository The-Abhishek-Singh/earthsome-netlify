"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Star, ShoppingCart, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';

const SearchModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const searchInputRef = useRef(null);
  const modalRef = useRef(null);
  const desktopInputRef = useRef(null);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch all products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          timeout: 10000,
          withCredentials: true
        });
        setAllProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        let errorMessage = 'Failed to load products. Please try again.';
        if (error.code === 'ECONNABORTED') {
          errorMessage = 'Request timed out. Please check your connection.';
        } else if (!navigator.onLine) {
          errorMessage = 'No internet connection. Please check your network.';
        } else if (error.response) {
          errorMessage = error.response.data?.message || 'Server error. Please try again.';
        }
        setError(errorMessage);
        setAllProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle search when searchTerm changes
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchResults([]);
      return;
    }

    if (allProducts.length === 0) {
      return;
    }

    const searchTimeout = setTimeout(() => {
      try {
        const filtered = allProducts.filter(product => {
          const searchLower = searchTerm.toLowerCase();
          return (
            product.productName?.toLowerCase().includes(searchLower) ||
            product.category?.toLowerCase().includes(searchLower) ||
            product.sku?.toLowerCase().includes(searchLower) ||
            product.description?.toLowerCase().includes(searchLower)
          );
        });
        setSearchResults(filtered);
      } catch (error) {
        console.error('Search filtering error:', error);
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [searchTerm, allProducts]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Handle click outside modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleOpen = () => {
    setIsOpen(true);
    setSearchTerm('');
    setSearchResults([]);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSearchTerm('');
    setSearchResults([]);
  };

  const handleResultClick = () => {
    setIsOpen(false);
    setSearchTerm('');
    setSearchResults([]);
  };

  const handleDesktopFocus = () => {
    setIsOpen(true);
  };

  const handleDesktopChange = (e) => {
    setSearchTerm(e.target.value);
    if (!isOpen) setIsOpen(true);
  };

  // Mobile version - shows as button
  if (isMobile) {
    return (
      <>
        {/* Mobile Search Button */}
        <button
          onClick={handleOpen}
          className="p-2.5 hover:bg-gray-100 text-gray-700 hover:text-green-600 rounded-full transition-all duration-300"
          aria-label="Search products"
        >
          <Search size={20} className="flex-shrink-0" />
        </button>

        {/* Search Modal */}
        {isOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-start justify-center z-50 p-4 pt-20">
            <div 
              ref={modalRef}
              className="bg-white/90 backdrop-blur-md rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.1)] animate-slide-down border border-white/20"
            >
              {/* Search Input */}
              <div className="p-4 border-b border-gray-200/50 backdrop-blur-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black" size={20} />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full text-black pl-10 pr-12 py-3.5 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 outline-none text-sm shadow-inner transition-all duration-300"
                  />
                  <button
                    onClick={handleClose}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Search Results */}
              <div className="max-h-96 overflow-y-auto">
                {loading ? (
                  <div className="p-12 text-center">
                    <div className="relative w-16 h-16 mx-auto mb-4">
                      <Loader2 className="w-16 h-16 animate-spin text-green-500/40 absolute" />
                      <Loader2 className="w-16 h-16 animate-spin text-green-500 absolute animate-delay-150" />
                    </div>
                    <p className="text-gray-600 font-medium">Loading products...</p>
                  </div>
                ) : error ? (
                  <div className="p-12 text-center">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100">
                      <AlertCircle className="w-8 h-8 text-red-400" />
                    </div>
                    <p className="text-gray-800 text-lg font-medium mb-2">Oops! Something went wrong</p>
                    <p className="text-gray-500 mb-4">{error}</p>
                    <button
                      onClick={() => window.location.reload()}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                ) : searchTerm.trim() === '' ? (
                  <div className="p-12 text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                      <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-800 text-lg font-medium mb-2">Start typing to search products</p>
                    <p className="text-gray-500">Search by product name, category, or SKU</p>
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                      <div className="text-3xl">🔍</div>
                    </div>
                    <p className="text-gray-800 text-lg font-medium mb-2">No products found</p>
                    <p className="text-gray-500">Try different keywords or check spelling</p>
                  </div>
                ) : (
                  <div className="p-4 space-y-2.5">
                    {searchResults.map((product) => (
                      <Link
                        key={product._id}
                        href={`/products/${product._id}`}
                        onClick={handleResultClick}
                        className="block p-4 rounded-xl hover:bg-white/80 transition-all duration-300 border border-gray-100 hover:border-gray-200 hover:shadow-lg group backdrop-blur-sm"
                      >
                        <div className="flex items-center gap-4">
                          <div className="relative w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 group-hover:shadow-md transition-all duration-300">
                            <Image
                              src={product.productImageURL}
                              alt={product.productName}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                              sizes="80px"
                            />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-gray-900 truncate">
                              {product.productName}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-lg font-semibold text-green-600">
                                ₹{product.price}
                              </span>
                              {product.originalPrice && product.originalPrice > product.price && (
                                <span className="text-gray-500 line-through text-sm">
                                  ₹{product.originalPrice}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center gap-1 text-sm text-gray-600">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span>{product.rating}</span>
                                <span className="text-gray-400">({product.reviewsCount})</span>
                              </div>
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                {product.category}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex-shrink-0">
                            <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                              <ShoppingCart size={16} />
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {searchResults.length > 0 && (
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Found {searchResults.length} product{searchResults.length !== 1 ? 's' : ''}</span>
                    <Link
                      href={`/search?q=${encodeURIComponent(searchTerm)}`}
                      onClick={handleResultClick}
                      className="text-green-600 hover:text-green-700 font-medium"
                    >
                      View all results →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <style jsx>{`
          @keyframes slide-down {
            from {
              transform: translateY(-20px);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }
          
          .animate-slide-down {
            animation: slide-down 0.2s ease-out;
          }
        `}</style>
      </>
    );
  }

  // Desktop version - shows as full search bar
  return (
    <>
      {/* Desktop Search Bar */}
      <div className="w-full relative ">
        <div className="relative  ">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-black" size={20} />
          <input
            ref={desktopInputRef}
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleDesktopChange}
            onFocus={handleDesktopFocus}
            className=" w-full pl-12 pr-4 py-3  border-2 text-black border-green-500 rounded-2xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500/50 outline-none text-sm transition-all duration-300 hover:bg-gray-100/50"
          />
        </div>

        {/* Search Results Dropdown */}
        {isOpen && (
          <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-40" onClick={handleClose}></div>
            
            {/* Results Container */}
            <div 
              ref={modalRef}
              className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 max-h-96 overflow-hidden"
            >
              {/* Search Results */}
              <div className="max-h-96 overflow-y-auto">
                {loading ? (
                  <div className="p-8 text-center">
                    <div className="relative w-12 h-12 mx-auto mb-3">
                      <Loader2 className="w-12 h-12 animate-spin text-green-500/40 absolute" />
                      <Loader2 className="w-12 h-12 animate-spin text-green-500 absolute animate-delay-150" />
                    </div>
                    <p className="text-gray-600 font-medium">Loading products...</p>
                  </div>
                ) : error ? (
                  <div className="p-8 text-center">
                    <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3 border border-red-100">
                      <AlertCircle className="w-6 h-6 text-red-400" />
                    </div>
                    <p className="text-gray-800 font-medium mb-2">Something went wrong</p>
                    <p className="text-gray-500 text-sm mb-3">{error}</p>
                    <button
                      onClick={() => window.location.reload()}
                      className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      Try Again
                    </button>
                  </div>
                ) : searchTerm.trim() === '' ? (
                  <div className="p-8 text-center">
                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 border border-gray-100">
                      <Search className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-gray-800 font-medium mb-1">Start typing to search</p>
                    <p className="text-gray-500 text-sm">Search by product name, category, or SKU</p>
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 border border-gray-100">
                      <div className="text-2xl">🔍</div>
                    </div>
                    <p className="text-gray-800 font-medium mb-1">No products found</p>
                    <p className="text-gray-500 text-sm">Try different keywords or check spelling</p>
                  </div>
                ) : (
                  <div className="p-3 space-y-1">
                    {searchResults.slice(0, 6).map((product) => (
                      <Link
                        key={product._id}
                        href={`/products/${product._id}`}
                        onClick={handleResultClick}
                        className="block p-3 rounded-xl hover:bg-gray-50 transition-all duration-200 group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={product.productImageURL}
                              alt={product.productName}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-300"
                              sizes="48px"
                            />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-gray-900 truncate text-sm">
                              {product.productName}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-sm font-semibold text-green-600">
                                ₹{product.price}
                              </span>
                              {product.originalPrice && product.originalPrice > product.price && (
                                <span className="text-gray-400 line-through text-xs">
                                  ₹{product.originalPrice}
                                </span>
                              )}
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded ml-auto">
                                {product.category}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                    
                    {searchResults.length > 6 && (
                      <div className="border-t border-gray-100 pt-2 mt-2">
                        <Link
                          href={`/search?q=${encodeURIComponent(searchTerm)}`}
                          onClick={handleResultClick}
                          className="block p-3 text-center text-green-600 hover:text-green-700 font-medium text-sm hover:bg-green-50 rounded-lg transition-colors"
                        >
                          View all {searchResults.length} results →
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default SearchModal;