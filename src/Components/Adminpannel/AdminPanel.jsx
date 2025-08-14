"use client";
import React, { useEffect, useState } from "react";
import {
  Plus,
  Save,
  X,
  Package,
  Star,
  Eye,
  Edit,
  Trash2,
  Upload,
  Download,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  Info,
  XCircle
} from "lucide-react";

// Mock axios for artifact - replace with your original import
import axios from "axios";

// Toast Component
const Toast = ({ message, type, onClose }) => {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info
  };
  
  const colors = {
    success: "bg-green-600 text-white",
    error: "bg-red-600 text-white", 
    warning: "bg-yellow-600 text-white",
    info: "bg-blue-600 text-white"
  };

  const Icon = icons[type] || Info;

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-4 right-4 z-50 ${colors[type]} px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 min-w-80 animate-slide-in`}>
      <Icon size={20} />
      <span className="font-medium">{message}</span>
      <button onClick={onClose} className="ml-auto hover:bg-white/20 p-1 rounded">
        <X size={16} />
      </button>
    </div>
  );
};

const AdminPanel = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [formData, setFormData] = useState({
    productName: "",
    price: "",
    originalPrice: "",
    productImageURL: "",
    images: "",
    category: "",
    badge: "",
    rating: "",
    reviewsCount: "",
    sku: "",
    ingredients: "",
    benefits: "",
    description: ""
  });
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [csvFile, setCsvFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [toast, setToast] = useState(null);

  // Get unique categories from products
  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    // Filter products based on search and category
    let filtered = products;
    
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    
    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory]);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/products`);
      setProducts(data);
    } catch (err) {
      console.error("Fetch error:", err);
      showToast("Failed to load products", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const payload = {
      productName: formData.productName,
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : 0,
      productImageURL: formData.productImageURL,
      images: formData.images ? formData.images.split(",").map(str => str.trim()) : [],
      category: formData.category,
      badge: formData.badge,
      rating: parseFloat(formData.rating),
      reviewsCount: parseInt(formData.reviewsCount),
      sku: formData.sku,
      ingredients: formData.ingredients ? formData.ingredients.split(",").map(str => str.trim()) : [],
      benefits: formData.benefits ? formData.benefits.split(",").map(str => str.trim()) : [],
      description: formData.description
    };

    try {
      if (isEditing) {
        await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${editingProductId}`, payload);
        showToast("Product updated successfully!", "success");
      } else {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, payload);
        showToast("Product added successfully!", "success");
      }

      setShowForm(false);
      resetForm();
      fetchProducts();
    } catch (err) {
      console.error("Submit error:", err);
      showToast("Failed to save product", "error");
    }
  };

  const resetForm = () => {
    setFormData({
      productName: "",
      price: "",
      originalPrice: "",
      productImageURL: "",
      images: "",
      category: "",
      badge: "",
      rating: "",
      reviewsCount: "",
      sku: "",
      ingredients: "",
      benefits: "",
      description: ""
    });
    setIsEditing(false);
    setEditingProductId(null);
  };

  const handleEdit = product => {
    setIsEditing(true);
    setEditingProductId(product._id);
    setFormData({
      productName: product.productName,
      price: product.price,
      originalPrice: product.originalPrice,
      productImageURL: product.productImageURL,
      images: product.images?.join(", ") || "",
      category: product.category,
      badge: product.badge || "",
      rating: product.rating,
      reviewsCount: product.reviewsCount,
      sku: product.sku || "",
      ingredients: product.ingredients?.join(", ") || "",
      benefits: product.benefits?.join(", ") || "",
      description: product.description || ""
    });
    setShowForm(true);
  };

  const handleDelete = async id => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`);
      showToast("Product deleted successfully!", "success");
      fetchProducts();
    } catch (err) {
      console.error("Delete failed:", err);
      showToast("Failed to delete product", "error");
    }
  };

  const handleCSVUpload = async () => {
    if (!csvFile) return showToast("Please select a CSV file", "warning");
    const formData = new FormData();
    formData.append("file", csvFile);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/products/upload-csv`, formData);
      showToast("CSV uploaded successfully!", "success");
      fetchProducts();
      setCsvFile(null);
    } catch (err) {
      console.error("CSV Upload Error:", err);
      showToast("CSV upload failed!", "error");
    }
  };

  const handleExportCSV = () => {
    try {
      window.open(`${process.env.NEXT_PUBLIC_API_URL}/api/products/export-csv`, "_blank");
      showToast("CSV export started!", "info");
    } catch (err) {
      showToast("Export failed!", "error");
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 ">
      <div className="max-w-8xl mx-auto space-y-6">
        
        {/* Toast Notifications */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}

        {/* Header */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="bg-green-600 p-3 rounded-lg">
                <Package className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Product Management
                </h1>
                <p className="text-gray-600 mt-1">Manage your product inventory</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => setCsvFile(e.target.files[0])}
                  className="hidden"
                  id="csv-upload"
                />
                <label
                  htmlFor="csv-upload"
                  className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors border"
                >
                  <Upload size={16} />
                  {csvFile ? csvFile.name.substring(0, 20) + '...' : 'Choose CSV'}
                </label>
                {csvFile && (
                  <button 
                    onClick={handleCSVUpload} 
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    Upload
                  </button>
                )}
              </div>
              
              <button 
                onClick={handleExportCSV} 
                className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors border border-gray-300"
              >
                <Download size={16} /> Export CSV
              </button>
              
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
                onClick={() => {
                  resetForm();
                  setShowForm(true);
                }}
              >
                <Plus size={18} /> Add Product
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search products, categories, or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              />
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="pl-10 pr-8 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none appearance-none bg-white"
                >
                  <option  value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              {(searchTerm || selectedCategory) && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
              <div className="sticky top-0 bg-white border-b p-6 rounded-t-lg">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {isEditing ? "Edit Product" : "Add New Product"}
                  </h2>
                  <button 
                    type="button" 
                    onClick={() => setShowForm(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X size={20} className="text-black" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { label: "Product Name", name: "productName", required: true },
                    { label: "Price (₹)", name: "price", type: "number", required: true },
                    { label: "Original Price (₹)", name: "originalPrice", type: "number" },
                    { label: "Category", name: "category", required: true },
                    { label: "Badge", name: "badge" },
                    { label: "Rating", name: "rating", type: "number", step: "0.1" },
                    { label: "Reviews Count", name: "reviewsCount", type: "number" },
                    { label: "SKU", name: "sku" }
                  ].map(field => (
                    <div key={field.name} className="space-y-2">
                      <label className="block text-sm font-medium text-black">
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      <input
                        type={field.type || "text"}
                        name={field.name}
                        step={field.step}
                        value={formData[field.name]}
                        onChange={handleChange}
                        required={field.required}
                        className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 placeholder-gray-500 bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent focus:bg-green-50/30 outline-none transition-colors"
                      />
                    </div>
                  ))}
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-black">
                      Main Image URL <span className="text-red-500 ">*</span>
                    </label>
                    <input
                      type="url"
                      name="productImageURL"
                      value={formData.productImageURL}
                      onChange={handleChange}
                      required
                      className="w-full border text-black border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-black">
                      Additional Image URLs (comma separated)
                    </label>
                    <input
                      type="text"
                      name="images"
                      value={formData.images}
                      onChange={handleChange}
                      placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                      className="w-full border text-black border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-black">
                      Ingredients (comma separated)
                    </label>
                    <input
                      type="text"
                      name="ingredients"
                      value={formData.ingredients}
                      onChange={handleChange}
                      placeholder="Water, Sugar, Natural Flavors"
                      className="w-full border text-black border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-black">
                      Benefits (comma separated)
                    </label>
                    <input
                      type="text"
                      name="benefits"
                      value={formData.benefits}
                      onChange={handleChange}
                      placeholder="Organic, Gluten-Free, Non-GMO"
                      className="w-full border text-black border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-black">
                      Description
                    </label>
                    <textarea
                      name="description"
                      rows="4"
                      value={formData.description}
                      onChange={handleChange}
                      className="w-full border  text-black border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                      placeholder="Detailed product description..."
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-black rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex gap-2 items-center transition-colors"
                  >
                    <Save size={16} /> 
                    {isEditing ? 'Update Product' : 'Add Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Product Grid */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="p-6 border-b bg-gray-50">
            <h2 className="text-lg font-semibold text-black">
              Products ({filteredProducts.length})
            </h2>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-4 text-black">Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-12 text-center">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-black text-lg">
                {products.length === 0 ? 'No products found' : 'No products match your search'}
              </p>
              {(searchTerm || selectedCategory) && (
                <button
                  onClick={clearFilters}
                  className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map(prod => (
                <div key={prod._id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow overflow-hidden">
                  <div className="relative overflow-hidden">
                    <img
                      src={prod.productImageURL}
                      alt={prod.productName}
                      className="w-full h-48 object-cover"
                    />
                    {prod.badge && (
                      <span className="absolute top-2 right-2 px-2 py-1 text-xs bg-green-600 text-white rounded-full font-medium">
                        {prod.badge}
                      </span>
                    )}
                  </div>
                  
                  <div className="p-4 space-y-3">
                    <h3 className="font-medium text-black line-clamp-2">
                      {prod.productName}
                    </h3>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-semibold text-green-600">₹{prod.price}</span>
                      {prod.originalPrice && prod.originalPrice > prod.price && (
                        <span className="text-black line-through text-sm">
                          ₹{prod.originalPrice}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-black">
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /> 
                        {prod.rating}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" /> 
                        {prod.reviewsCount}
                      </span>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {prod.category}
                      </span>
                    </div>
                    
                    <div className="flex justify-between pt-3 border-t">
                      <button 
                        onClick={() => handleEdit(prod)} 
                        className="flex items-center gap-2 text-green-600 hover:text-green-700 hover:bg-green-50 px-3 py-1 rounded transition-colors"
                      >
                        <Edit size={16} />
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(prod._id)} 
                        className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded transition-colors"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default AdminPanel;