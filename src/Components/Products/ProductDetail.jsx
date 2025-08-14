"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, Save, X, Package, Star, Eye, Edit, Trash2 } from 'lucide-react';

const AdminPanel = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    productName: '',
    slug: '',
    price: '',
    originalPrice: '',
    productImageURL: '',
    category: '',
    badge: '',
    rating: '',
    reviewsCount: '',
    shortDescription: '',
    ingredients: '',
    weight: '',
    sku: ''
  });
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products`);
      setProducts(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const slugify = (str) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      slug: name === 'productName' ? slugify(value) : prev.slug
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newProduct = {
        ...formData,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        rating: parseFloat(formData.rating),
        reviewsCount: parseInt(formData.reviewsCount),
        ingredients: formData.ingredients?.split(',').map(ing => ing.trim()),
      };

      if (isEditing) {
        await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/products/${editingProductId}`, newProduct);
      } else {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/products`, newProduct);
      }

      closeForm();
      fetchProducts();
    } catch (err) {
      console.error("Error submitting product:", err.response?.data || err.message);
      alert("Failed to submit product");
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setIsEditing(false);
    setEditingProductId(null);
    setFormData({
      productName: '',
      slug: '',
      price: '',
      originalPrice: '',
      productImageURL: '',
      category: '',
      badge: '',
      rating: '',
      reviewsCount: '',
      shortDescription: '',
      ingredients: '',
      weight: '',
      sku: ''
    });
  };

  const handleCSVUpload = async (e) => {
    e.preventDefault();
    const fileInput = e.target.elements.csv;
    if (!fileInput.files.length) return alert("Please select a CSV file");

    const csvData = new FormData();
    csvData.append('file', fileInput.files[0]);

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/products/upload-csv`, csvData);
      alert("CSV uploaded successfully!");
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  const handleExportCSV = () => {
    window.open(`${process.env.NEXT_PUBLIC_API_URL}/products/export-csv`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
                <p className="text-gray-600">Manage your product inventory</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <form onSubmit={handleCSVUpload} className="flex items-center gap-2">
                <input type="file" name="csv" accept=".csv" className="block border px-2 py-1 rounded" />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                  Upload CSV
                </button>
              </form>
              <button
                onClick={handleExportCSV}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Export CSV
              </button>
              <button
                onClick={() => setShowForm(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-medium shadow-sm transition-colors"
              >
                <Plus size={20} />
                Add New Product
              </button>
            </div>
          </div>
        </div>

        {/* Add the form here to fill the new product detail fields */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.keys(formData).map((key) => (
                <div key={key} className="flex flex-col">
                  <label className="font-medium text-sm capitalize">{key}</label>
                  <input
                    type="text"
                    name={key}
                    value={formData[key]}
                    onChange={handleChange}
                    className="border rounded px-3 py-2 mt-1"
                  />
                </div>
              ))}
              <div className="col-span-full flex gap-4 mt-4">
                <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-lg">
                  {isEditing ? 'Update Product' : 'Add Product'}
                </button>
                <button type="button" onClick={closeForm} className="text-gray-600 px-6 py-2 rounded-lg border">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
