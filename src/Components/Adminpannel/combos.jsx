"use client"
import React, { useState, useEffect } from "react";
import { Tag, Combine, Copy, Search, X } from "lucide-react";

// Main application component to manage and display all offer types
const Bogo = () => {
  // State to store the list of offers fetched from the backend
  const [offers, setOffers] = useState([]);
  // State for loading and error handling
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // State to manage which offer creation form is active
  const [activeTab, setActiveTab] = useState("simple");

  // State for the three different offer creation forms
  const [simpleOffer, setSimpleOffer] = useState({
    title: "",
    productId: null,
    discountPercentage: "",
    startDate: "",
    endDate: "",
  });
  const [bogoOffer, setBogoOffer] = useState({
    title: "",
    productId: null,
    startDate: "",
    endDate: "",
  });
  const [comboOffer, setComboOffer] = useState({
    title: "",
    comboProducts: [],
    discountPercentage: "",
    startDate: "",
    endDate: "",
  });

  // State for product search functionality
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  // State for edit functionality
  const [editingOffer, setEditingOffer] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    productId: null,
    comboProducts: [],
    discountPercentage: "",
    startDate: "",
    endDate: "",
  });

  // Base URLs for the APIs.
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL + "/api/offers";
  const PRODUCT_API_URL = process.env.NEXT_PUBLIC_API_URL + "/api/products";

  // Function to fetch all offers from the backend
  const fetchOffers = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setOffers(data.offers);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching offers:", err);
    } finally {
      setLoading(false);
    }
  };

  // Function to search for products
  const searchProducts = async (query) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    setSearchLoading(true);
    try {
      // The backend endpoint returns all products, so we'll filter on the frontend.
      // In a production app, you would add a search parameter to the backend.
      const response = await fetch(PRODUCT_API_URL);
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const products = await response.json();
      const filtered = products.filter((product) =>
        product.productName.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filtered);
    } catch (err) {
      console.error("Error searching products:", err);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  // useEffect hook to fetch offers on initial component mount
  useEffect(() => {
    fetchOffers();
  }, []);

  // Generic handler for form input changes
  const handleInputChange = (e, formStateSetter) => {
    const { name, value } = e.target;
    formStateSetter((prevState) => ({ ...prevState, [name]: value }));
  };

  // Handle product selection for simple and BOGO offers
  const handleProductSelect = (product, formType) => {
    if (formType === "simple") {
      setSimpleOffer((prevState) => ({ ...prevState, productId: product }));
    } else if (formType === "bogo") {
      setBogoOffer((prevState) => ({ ...prevState, productId: product }));
    }
    setSearchQuery("");
    setSearchResults([]);
  };

  // Handle product selection for combo offers (multiple products)
  const handleComboProductSelect = (product) => {
    if (
      comboOffer.comboProducts.length < 2 &&
      !comboOffer.comboProducts.find((p) => p._id === product._id)
    ) {
      setComboOffer((prevState) => ({
        ...prevState,
        comboProducts: [...prevState.comboProducts, product],
      }));
      setSearchQuery("");
      setSearchResults([]);
    }
  };

  // Remove a product from the combo offer
  const handleRemoveComboProduct = (productId) => {
    setComboOffer((prevState) => ({
      ...prevState,
      comboProducts: prevState.comboProducts.filter((p) => p._id !== productId),
    }));
  };

  // Helper function to handle form submissions
  const handleSubmit = async (e, formState, endpoint) => {
    e.preventDefault();
    try {
      const payload = { ...formState };
      if (endpoint === "/combo") {
        payload.comboProducts = formState.comboProducts.map((p) => p._id);
        if (payload.comboProducts.length < 2) {
          throw new Error("A combo offer requires at least two products.");
        }
      } else {
        payload.productId = formState.productId._id;
        if (!payload.productId) {
          throw new Error("A product must be selected for this offer.");
        }
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `Failed to create offer for endpoint ${endpoint}`
        );
      }

      await fetchOffers(); // Refresh the offers list
      // Reset the forms
      setSimpleOffer({
        title: "",
        productId: null,
        discountPercentage: "",
        startDate: "",
        endDate: "",
      });
      setBogoOffer({ title: "", productId: null, startDate: "", endDate: "" });
      setComboOffer({
        title: "",
        comboProducts: [],
        discountPercentage: "",
        startDate: "",
        endDate: "",
      });

      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error submitting offer:", err);
    }
  };

  // Helper function to format dates for display
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Delete offer function
  const handleDeleteOffer = async (offerId) => {
    if (window.confirm("Are you sure you want to delete this offer?")) {
      try {
        const response = await fetch(`${API_BASE_URL}/${offerId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete offer");
        }

        await fetchOffers(); // Refresh the offers list
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error("Error deleting offer:", err);
      }
    }
  };

  // Start editing an offer
  const handleEditOffer = (offer) => {
    setEditingOffer(offer);
    setEditForm({
      title: offer.title,
      productId: offer.product && offer.product.length > 0 ? offer.product[0] : null,
      comboProducts: offer.comboProducts || [],
      discountPercentage: offer.discountPercentage || "",
      startDate: offer.startDate ? offer.startDate.split('T')[0] : "",
      endDate: offer.endDate ? offer.endDate.split('T')[0] : "",
    });
  };

  // Update offer function
  const handleUpdateOffer = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...editForm };
      
      if (editingOffer.type === "COMBO") {
        payload.comboProducts = editForm.comboProducts.map((p) => p._id);
        if (payload.comboProducts.length < 2) {
          throw new Error("A combo offer requires at least two products.");
        }
      } else {
        payload.productId = editForm.productId._id;
        if (!payload.productId) {
          throw new Error("A product must be selected for this offer.");
        }
      }

      const response = await fetch(`${API_BASE_URL}/${editingOffer._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update offer");
      }

      await fetchOffers(); // Refresh the offers list
      setEditingOffer(null);
      setEditForm({
        title: "",
        productId: null,
        comboProducts: [],
        discountPercentage: "",
        startDate: "",
        endDate: "",
      });
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error updating offer:", err);
    }
  };

  // Handle edit form product selection
  const handleEditProductSelect = (product) => {
    if (editingOffer.type === "COMBO") {
      if (
        editForm.comboProducts.length < 2 &&
        !editForm.comboProducts.find((p) => p._id === product._id)
      ) {
        setEditForm((prevState) => ({
          ...prevState,
          comboProducts: [...prevState.comboProducts, product],
        }));
      }
    } else {
      setEditForm((prevState) => ({ ...prevState, productId: product }));
    }
    setSearchQuery("");
    setSearchResults([]);
  };

  // Remove product from edit combo offer
  const handleEditRemoveComboProduct = (productId) => {
    setEditForm((prevState) => ({
      ...prevState,
      comboProducts: prevState.comboProducts.filter((p) => p._id !== productId),
    }));
  };

  return (
    <div className="bg-gray-100 min-h-screen font-sans p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-10">
          Offer Management Dashboard
        </h1>

        {/* Offer Creation Forms Section */}
        <div className="bg-white p-8 rounded-xl shadow-lg mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Create a New Offer
          </h2>

          {/* Tab Navigation for Forms */}
          <div className="flex justify-center border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab("simple")}
              className={`flex-1 flex items-center justify-center px-4 py-3 text-sm font-semibold rounded-t-lg transition-colors
                ${
                  activeTab === "simple"
                    ? "bg-green-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
            >
              <Tag size={18} className="mr-2" /> Simple Offer
            </button>
            <button
              onClick={() => setActiveTab("bogo")}
              className={`flex-1 flex items-center justify-center px-4 py-3 text-sm font-semibold rounded-t-lg transition-colors
                ${
                  activeTab === "bogo"
                    ? "bg-green-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
            >
              <Copy size={18} className="mr-2" /> BOGO Offer
            </button>
            <button
              onClick={() => setActiveTab("combo")}
              className={`flex-1 flex items-center justify-center px-4 py-3 text-sm font-semibold rounded-t-lg transition-colors
                ${
                  activeTab === "combo"
                    ? "bg-green-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
            >
              <Combine size={18} className="mr-2" /> Combo Offer
            </button>
          </div>

          {/* Conditional Rendering of Forms */}
          {activeTab === "simple" && (
            <form
              onSubmit={(e) => handleSubmit(e, simpleOffer, "/")}
              className="space-y-4 text-black"
            >
              <input
                type="text"
                name="title"
                placeholder="Offer Title (e.g., 20% Off TVs)"
                value={simpleOffer.title}
                onChange={(e) => handleInputChange(e, setSimpleOffer)}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              />

              <div className="relative">
                <input
                  type="text"
                  name="productSearch"
                  placeholder="Search for a product"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    searchProducts(e.target.value);
                  }}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <Search
                  size={20}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                {searchLoading && (
                  <p className="text-gray-500 text-sm mt-2">Searching...</p>
                )}
                {searchResults.length > 0 && (
                  <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto mt-1">
                    {searchResults.map((product) => (
                      <li
                        key={product._id}
                        className="flex items-center p-2 cursor-pointer hover:bg-gray-100"
                        onClick={() => handleProductSelect(product, "simple")}
                      >
                        <img
                          src={
                            product.productImageURL ||
                            "https://placehold.co/40x40/f1f5f9/a0a4a8?text=NO+IMG"
                          }
                          alt={product.productName}
                          className="w-10 h-10 rounded-full mr-3 object-cover"
                        />
                        <span className="font-medium text-gray-800">
                          {product.productName}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {simpleOffer.productId && (
                <div className="flex items-center bg-gray-200 p-3 rounded-lg">
                  <span className="font-semibold text-gray-800">
                    Selected Product:{" "}
                  </span>
                  <img
                    src={
                      simpleOffer.productId.productImageURL ||
                      "https://placehold.co/40x40/f1f5f9/a0a4a8?text=NO+IMG"
                    }
                    alt={simpleOffer.productId.productName}
                    className="w-8 h-8 rounded-full ml-3 mr-2 object-cover"
                  />
                  <span className="text-gray-600">
                    {simpleOffer.productId.productName}
                  </span>
                </div>
              )}

              <input
                type="number"
                name="discountPercentage"
                placeholder="Discount Percentage"
                value={simpleOffer.discountPercentage}
                onChange={(e) => handleInputChange(e, setSimpleOffer)}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="date"
                name="startDate"
                value={simpleOffer.startDate}
                onChange={(e) => handleInputChange(e, setSimpleOffer)}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="date"
                name="endDate"
                value={simpleOffer.endDate}
                onChange={(e) => handleInputChange(e, setSimpleOffer)}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                type="submit"
                className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition duration-300"
              >
                Create Simple Offer
              </button>
            </form>
          )}

          {activeTab === "bogo" && (
            <form
              onSubmit={(e) => handleSubmit(e, bogoOffer, "/bogo")}
              className="space-y-4 text-black"
            >
              <input
                type="text"
                name="title"
                placeholder="Offer Title (e.g., BOGO T-Shirts)"
                value={bogoOffer.title}
                onChange={(e) => handleInputChange(e, setBogoOffer)}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              />

              <div className="relative">
                <input
                  type="text"
                  name="productSearch"
                  placeholder="Search for a product"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    searchProducts(e.target.value);
                  }}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <Search
                  size={20}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                {searchLoading && (
                  <p className="text-gray-500 text-sm mt-2">Searching...</p>
                )}
                {searchResults.length > 0 && (
                  <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto mt-1">
                    {searchResults.map((product) => (
                      <li
                        key={product._id}
                        className="flex items-center p-2 cursor-pointer hover:bg-gray-100"
                        onClick={() => handleProductSelect(product, "bogo")}
                      >
                        <img
                          src={
                            product.productImageURL ||
                            "https://placehold.co/40x40/f1f5f9/a0a4a8?text=NO+IMG"
                          }
                          alt={product.productName}
                          className="w-10 h-10 rounded-full mr-3 object-cover"
                        />
                        <span className="font-medium text-gray-800">
                          {product.productName}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {bogoOffer.productId && (
                <div className="flex items-center bg-gray-200 p-3 rounded-lg">
                  <span className="font-semibold text-gray-800">
                    Selected Product:{" "}
                  </span>
                  <img
                    src={
                      bogoOffer.productId.productImageURL ||
                      "https://placehold.co/40x40/f1f5f9/a0a4a8?text=NO+IMG"
                    }
                    alt={bogoOffer.productId.productName}
                    className="w-8 h-8 rounded-full ml-3 mr-2 object-cover"
                  />
                  <span className="text-gray-600">
                    {bogoOffer.productId.productName}
                  </span>
                </div>
              )}

              <input
                type="date"
                name="startDate"
                value={bogoOffer.startDate}
                onChange={(e) => handleInputChange(e, setBogoOffer)}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="date"
                name="endDate"
                value={bogoOffer.endDate}
                onChange={(e) => handleInputChange(e, setBogoOffer)}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                type="submit"
                className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition duration-300"
              >
                Create BOGO Offer
              </button>
            </form>
          )}

          {activeTab === "combo" && (
            <form
              onSubmit={(e) => handleSubmit(e, comboOffer, "/combo")}
              className="space-y-4 text-black"
            >
              <input
                type="text"
                name="title"
                placeholder="Offer Title (e.g., Summer Combo Pack)"
                value={comboOffer.title}
                onChange={(e) => handleInputChange(e, setComboOffer)}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              />

              <div className="relative">
                <input
                  type="text"
                  name="productSearch"
                  placeholder="Search for a product"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    searchProducts(e.target.value);
                  }}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <Search
                  size={20}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                {searchLoading && (
                  <p className="text-gray-500 text-sm mt-2">Searching...</p>
                )}
                {searchResults.length > 0 && (
                  <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto mt-1">
                    {searchResults.map((product) => (
                      <li
                        key={product._id}
                        className="flex items-center p-2 cursor-pointer hover:bg-gray-100"
                        onClick={() => handleComboProductSelect(product)}
                      >
                        <img
                          src={
                            product.productImageURL ||
                            "https://placehold.co/40x40/f1f5f9/a0a4a8?text=NO+IMG"
                          }
                          alt={product.productName}
                          className="w-10 h-10 rounded-full mr-3 object-cover"
                        />
                        <span className="font-medium text-gray-800">
                          {product.productName}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {comboOffer.comboProducts.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-600">
                    Selected Products:
                  </p>
                  {comboOffer.comboProducts.map((product) => (
                    <div
                      key={product._id}
                      className="flex items-center justify-between bg-gray-200 p-2 rounded-lg"
                    >
                      <div className="flex items-center">
                        <img
                          src={
                            product.productImageURL ||
                            "https://placehold.co/30x30/f1f5f9/a0a4a8?text=NO+IMG"
                          }
                          alt={product.productName}
                          className="w-6 h-6 rounded-full mr-2 object-cover"
                        />
                        <span className="text-sm text-gray-600">
                          {product.productName}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveComboProduct(product._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <input
                type="number"
                name="discountPercentage"
                placeholder="Discount Percentage"
                value={comboOffer.discountPercentage}
                onChange={(e) => handleInputChange(e, setComboOffer)}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="date"
                name="startDate"
                value={comboOffer.startDate}
                onChange={(e) => handleInputChange(e, setComboOffer)}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="date"
                name="endDate"
                value={comboOffer.endDate}
                onChange={(e) => handleInputChange(e, setComboOffer)}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                type="submit"
                className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition duration-300"
              >
                Create Combo Offer
              </button>
            </form>
          )}
        </div>

        {/* Edit Offer Modal */}
        {editingOffer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-800">Edit Offer</h3>
                  <button
                    onClick={() => setEditingOffer(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleUpdateOffer} className="space-y-4 text-black">
                  <input
                    type="text"
                    name="title"
                    placeholder="Offer Title"
                    value={editForm.title}
                    onChange={(e) => handleInputChange(e, setEditForm)}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />

                  <div className="relative">
                    <input
                      type="text"
                      name="productSearch"
                      placeholder="Search for a product"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        searchProducts(e.target.value);
                      }}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <Search
                      size={20}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    {searchLoading && (
                      <p className="text-gray-500 text-sm mt-2">Searching...</p>
                    )}
                    {searchResults.length > 0 && (
                      <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto mt-1">
                        {searchResults.map((product) => (
                          <li
                            key={product._id}
                            className="flex items-center p-2 cursor-pointer hover:bg-gray-100"
                            onClick={() => handleEditProductSelect(product)}
                          >
                            <img
                              src={
                                product.productImageURL ||
                                "https://placehold.co/40x40/f1f5f9/a0a4a8?text=NO+IMG"
                              }
                              alt={product.productName}
                              className="w-10 h-10 rounded-full mr-3 object-cover"
                            />
                            <span className="font-medium text-gray-800">
                              {product.productName}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {editingOffer.type !== "COMBO" && editForm.productId && (
                    <div className="flex items-center bg-gray-200 p-3 rounded-lg">
                      <span className="font-semibold text-gray-800">
                        Selected Product:{" "}
                      </span>
                      <img
                        src={
                          editForm.productId.productImageURL ||
                          "https://placehold.co/40x40/f1f5f9/a0a4a8?text=NO+IMG"
                        }
                        alt={editForm.productId.productName}
                        className="w-8 h-8 rounded-full ml-3 mr-2 object-cover"
                      />
                      <span className="text-gray-600">
                        {editForm.productId.productName}
                      </span>
                    </div>
                  )}

                  {editingOffer.type === "COMBO" && editForm.comboProducts.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-gray-600">
                        Selected Products:
                      </p>
                      {editForm.comboProducts.map((product) => (
                        <div
                          key={product._id}
                          className="flex items-center justify-between bg-gray-200 p-2 rounded-lg"
                        >
                          <div className="flex items-center">
                            <img
                              src={
                                product.productImageURL ||
                                "https://placehold.co/30x30/f1f5f9/a0a4a8?text=NO+IMG"
                              }
                              alt={product.productName}
                              className="w-6 h-6 rounded-full mr-2 object-cover"
                            />
                            <span className="text-sm text-gray-600">
                              {product.productName}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleEditRemoveComboProduct(product._id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {(editingOffer.type === "SIMPLE" || editingOffer.type === "COMBO") && (
                    <input
                      type="number"
                      name="discountPercentage"
                      placeholder="Discount Percentage"
                      value={editForm.discountPercentage}
                      onChange={(e) => handleInputChange(e, setEditForm)}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  )}

                  <input
                    type="date"
                    name="startDate"
                    value={editForm.startDate}
                    onChange={(e) => handleInputChange(e, setEditForm)}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <input
                    type="date"
                    name="endDate"
                    value={editForm.endDate}
                    onChange={(e) => handleInputChange(e, setEditForm)}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />

                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      className="flex-1 bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition duration-300"
                    >
                      Update Offer
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingOffer(null)}
                      className="flex-1 bg-gray-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-gray-700 transition duration-300"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Display Offers Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">All Offers</h2>
          {loading && (
            <div className="text-center py-10">
              <p className="text-gray-600 animate-pulse">Loading offers...</p>
            </div>
          )}
          {error && (
            <div className="text-center py-10 text-red-600">
              <p>Error: {error}</p>
            </div>
          )}
          {!loading && offers.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-500">
                No offers found. Create one above!
              </p>
            </div>
          )}

          {/* Offers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((offer) => (
              <div
                key={offer._id}
                className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`px-3 py-1 text-sm font-semibold rounded-full capitalize ${
                      offer.type === "COMBO"
                        ? "bg-orange-100 text-orange-800"
                        : offer.type === "BOGO"
                        ? "bg-green-100 text-green-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {offer.type}
                  </span>
                  <span className="text-sm font-medium text-gray-500">
                    {offer.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {offer.title}
                </h3>

                {/* Conditionally display details based on offer type */}
                {offer.type === "COMBO" && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">
                      Combo Products:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {offer.comboProducts && offer.comboProducts.length > 0 ? (
                        offer.comboProducts.map((product) => (
                          <div
                            key={product._id}
                            className="flex flex-col items-center"
                          >
                            <img
                              src={
                                product.productImageURL ||
                                "https://placehold.co/60x60/f1f5f9/a0a4a8?text=NO+IMG"
                              }
                              alt={product.productName}
                              className="w-10 h-10 rounded-full object-cover border-2 border-gray-300"
                            />
                            <span className="text-xs text-center mt-1 font-semibold text-green-600">
                              {product.productName}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">
                          No combo products found.
                        </p>
                      )}
                    </div>
                    <p className="text-lg font-bold text-green-600 mt-2">
                      {offer.discountPercentage}% Off
                    </p>
                  </div>
                )}

                {offer.type === "BOGO" && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      Buy One Get One Free:
                    </p>
                    {offer.product && offer.product.length > 0 ? (
                      <div className="flex items-center">
                        <img
                          src={
                            offer.product[0].productImageURL ||
                            "https://placehold.co/60x60/f1f5f9/a0a4a8?text=NO+IMG"
                          }
                          alt={offer.product[0].productName}
                          className="w-10 h-10 rounded-full mr-3 object-cover border-2 border-gray-300"
                        />
                        <p className="text-sm font-semibold text-green-600">
                          {offer.product[0].productName}
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No product found.</p>
                    )}
                  </div>
                )}

                {offer.type === "SIMPLE" && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Product:</p>
                    {offer.product && offer.product.length > 0 ? (
                      <div className="flex items-center">
                        <img
                          src={
                            offer.product[0].productImageURL ||
                            "https://placehold.co/60x60/f1f5f9/a0a4a8?text=NO+IMG"
                          }
                          alt={offer.product[0].productName}
                          className="w-10 h-10 rounded-full mr-3 object-cover border-2 border-gray-300"
                        />
                        <p className="text-sm font-semibold text-green-600">
                          {offer.product[0].productName}
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No product found.</p>
                    )}
                    <p className="text-lg font-bold text-green-600 mt-2">
                      {offer.discountPercentage}% Off
                    </p>
                  </div>
                )}

                <div className="mt-4 border-t border-gray-100 pt-4 text-sm text-gray-500">
                  <p>Starts: {formatDate(offer.startDate)}</p>
                  <p>Ends: {formatDate(offer.endDate)}</p>
                </div>

                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => handleEditOffer(offer)}
                    className="flex-1 bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteOffer(offer._id)}
                    className="flex-1 bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition duration-300 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bogo;