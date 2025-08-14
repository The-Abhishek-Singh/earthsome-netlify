"use client";
import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

const ProductSelector = ({ selected = [], onChange, multiple = true }) => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/products`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => 
    product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (product) => {
    if (multiple) {
      const newSelected = selected.includes(product._id)
        ? selected.filter(id => id !== product._id)
        : [...selected, product._id];
      onChange(newSelected);
    } else {
      onChange([product._id]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search products by name or SKU..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>

      {loading ? (
        <div className="text-center py-4 text-gray-500">Loading products...</div>
      ) : (
        <div className="border border-gray-300 rounded-md max-h-60 overflow-y-auto">
          {filteredProducts.map(product => (
            <label
              key={product._id}
              className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-200 last:border-b-0"
            >
              <input
                type={multiple ? "checkbox" : "radio"}
                checked={selected.includes(product._id)}
                onChange={() => handleSelect(product)}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <div className="ml-3 flex-1">
                <div className="text-sm font-medium text-gray-900">{product.productName}</div>
                <div className="text-xs text-gray-500">SKU: {product.sku || 'N/A'}</div>
              </div>
              <div className="text-sm font-medium text-gray-900">₹{product.price}</div>
            </label>
          ))}
          {filteredProducts.length === 0 && (
            <div className="text-center py-4 text-gray-500">No products found</div>
          )}
        </div>
      )}

      <div className="text-xs text-gray-500">
        {multiple ? 'Select multiple products' : 'Select one product'}
      </div>
    </div>
  );
};

export default ProductSelector;
