// "use client";
// import React, { useEffect, useState } from "react";
// import {
//   Plus, Edit, Trash2, X, Save, Calendar, Search, AlertCircle,
//   DollarSign, Percent, Gift, Truck, Users, ShoppingCart, Tag
// } from "lucide-react";
// import { DISCOUNT_TYPES, getDiscountTypeLabel, getDiscountTypeIcon, formatDiscountValue } from './DiscountComponents/DiscountTypes';
// import { validateDiscountForm } from './DiscountComponents/formValidator';
// import ProductSelector from './DiscountComponents/ProductSelector';

// const DiscountsPage = () => {
//   const [discounts, setDiscounts] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingDiscount, setEditingDiscount] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     code: "",
//     type: "flat",  // Use string value directly to match backend
//     value: "",
//     minCartValue: "",
//     expiryDate: "",
//     description: "",
//     // Enhanced fields for all discount types
//     maxDiscountValue: "",
//     freeShippingThreshold: "",
//     giftProduct: "",
//     giftThreshold: "",
//     categories: [],
//     applicableProducts: [],
//     // bundleProducts: [],
//     // bundleQuantity: "",
//     buyQuantity: "",
//     getQuantity: "",
//     stackable: false,
//     prepaidOnly: false,
//     influencerCode: false
//   });

//   const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

//   const discountTypes = Object.values(DISCOUNT_TYPES);

//   const fetchDiscounts = async () => {
//     try {
//       const res = await fetch(`${API_URL}/api/discounts`);
//       const data = await res.json();
//       setDiscounts(data);
//     } catch (err) {
//       console.error("Error fetching discounts", err);
//     }
//   };

//   useEffect(() => {
//     fetchDiscounts();
//   }, []);

//   const resetForm = () => {
//     setFormData({
//       code: "",
//       type: "flat",  // Use string value directly
//       value: "",
//       minCartValue: "",
//       expiryDate: "",
//       maxDiscountValue: "",
//       freeShippingThreshold: "",
//       giftProduct: "",
//       giftThreshold: "",
//       buyQuantity: "",
//       getQuantity: "",
//       categories: [],
//       applicableProducts: [],
//       // bundleProducts: [],
//       // bundleQuantity: "",
//       stackable: false,
//       prepaidOnly: false,
//       influencerCode: false,
//       description: ""
//     });
//     setEditingDiscount(null);
//   };

//   const openModal = (discount = null) => {
//     if (discount) {
//       setEditingDiscount(discount);
//         setFormData({
//           code: discount.code,
//           type: discount.type,
//           value: discount.value?.toString() || "",
//           minCartValue: discount.minCartValue?.toString() || "",
//           expiryDate: discount.expiryDate ? new Date(discount.expiryDate).toISOString().split('T')[0] : "",
//           maxDiscountValue: discount.maxDiscountValue?.toString() || "",
//           freeShippingThreshold: discount.freeShippingThreshold?.toString() || "",
//           giftProduct: discount.giftProduct || "",
//           giftThreshold: discount.giftThreshold?.toString() || "",
//           buyQuantity: discount.buyQuantity?.toString() || "",
//           getQuantity: discount.getQuantity?.toString() || "",
//           stackable: discount.stackable || false,
//           prepaidOnly: discount.prepaidOnly || false,
//           influencerCode: discount.influencerCode || false,
//           description: discount.description || ""
//       });
//     } else {
//       resetForm();
//     }
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     resetForm();
//   };

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       // Validate required fields
//       if (!formData.code) {
//         throw new Error("Discount code is required");
//       }

//       if (!formData.type) {
//         throw new Error("Discount type is required");
//       }

//       if ((['flat', 'percentage', 'referral', 'first_time'].includes(formData.type)) && !formData.value) {
//         throw new Error("Discount value is required");
//       }

//       const payload = {
//         ...formData,
//         value: formData.value ? parseFloat(formData.value) : null,
//         minCartValue: formData.minCartValue ? parseFloat(formData.minCartValue) : 0,
//         maxDiscountValue: formData.maxDiscountValue ? parseFloat(formData.maxDiscountValue) : null,
//         freeShippingThreshold: formData.freeShippingThreshold ? parseFloat(formData.freeShippingThreshold) : null,
//         giftThreshold: formData.giftThreshold ? parseFloat(formData.giftThreshold) : null,
//         buyQuantity: formData.buyQuantity ? parseInt(formData.buyQuantity) : null,
//         getQuantity: formData.getQuantity ? parseInt(formData.getQuantity) : null,
//         expiryDate: formData.expiryDate ? new Date(formData.expiryDate) : null
//       };

//       const response = editingDiscount
//         ? await fetch(`${API_URL}/api/discounts/${editingDiscount._id}`, {
//             method: 'PUT',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(payload),
//           })
//         : await fetch(`${API_URL}/api/discounts`, {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(payload),
//           });

//       if (!response.ok) {
//         throw new Error('Failed to save discount');
//       }

//       await fetchDiscounts();
//       closeModal();
//     } catch (err) {
//       console.error("Error saving discount", err);
//       alert("Error saving discount. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this discount?")) {
//       try {
//         const response = await fetch(`${API_URL}/api/discounts/${id}`, {
//           method: 'DELETE',
//         });

//         if (!response.ok) {
//           throw new Error('Failed to delete discount');
//         }

//         await fetchDiscounts();
//       } catch (err) {
//         console.error("Error deleting discount", err);
//         alert("Error deleting discount. Please try again.");
//       }
//     }
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return "No expiry";
//     return new Date(dateString).toLocaleDateString();
//   };

//   const isExpired = (dateString) => {
//     if (!dateString) return false;
//     return new Date(dateString) < new Date();
//   };

//   const getDiscountTypeLabel = (type) => {
//     return discountTypes.find(t => t.value === type)?.label || type;
//   };

//   const getDiscountTypeIcon = (type) => {
//     const discountType = discountTypes.find(t => t.value === type);
//     return discountType ? discountType.icon : DollarSign;
//   };

//   const formatDiscountValue = (discount) => {
//     switch (discount.type) {
//       case 'flat':
//         return `₹${discount.value}`;
//       case 'percentage':
//         return `${discount.value}%${discount.maxDiscountValue ? ` (max ₹${discount.maxDiscountValue})` : ''}`;
//       case 'free_shipping':
//         return `Free shipping above ₹${discount.freeShippingThreshold}`;
//       case 'free_gift':
//         return `Free ${discount.giftProduct} above ₹${discount.giftThreshold}`;
//       case 'bogo':
//         return `Buy ${discount.buyQuantity} Get ${discount.getQuantity}`;
//       // case 'bundle':
//       //   return `${discount.value}% off bundle`;
//       case 'referral':
//         return `${discount.value}% off`;
//       case 'first_time':
//         return `${discount.value}% off first purchase`;
//       default:
//         return discount.value;
//     }
//   };

//   const renderFormFields = () => {
//     const { type } = formData;

//     return (
//       <div className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium text-black mb-1">
//             Discount Code
//           </label>
//           <input
//             type="text"
//             name="code"
//             value={formData.code}
//             onChange={handleInputChange}
//             className="w-full px-3 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
//             placeholder="Enter discount code"
//             required
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-black mb-1">
//             Discount Type
//           </label>
//           <select
//             name="type"
//             value={formData.type}
//             onChange={handleInputChange}
//             className="w-full px-3 py-2 border border-gray-300 text-black/90 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
//           >
//             {discountTypes.map(type => (
//               <option key={type.value} value={type.value}>{type.label}</option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-black mb-1">
//             Description
//           </label>
//           <textarea
//             name="description"
//             value={formData.description}
//             onChange={handleInputChange}
//             className="w-full px-3 py-2 border border-gray-300 text-black/90 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
//             placeholder="Enter discount description"
//             rows={2}
//           />
//         </div>

//         {/* Common Fields */}
//         {(type === 'flat' || type === 'percentage' ||
//           // type === 'bundle' || type === 'referral' ||
//           type === 'first_time') && (
//           <div>
//             <label className="block text-sm font-medium text-black mb-1">
//               {type === 'flat' ? 'Amount (₹)' : 'Percentage (%)'}
//             </label>
//             <input
//               type="number"
//               name="value"
//               value={formData.value}
//               onChange={handleInputChange}
//               className="w-full px-3 py-2 border border-gray-300 text-black/90 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
//               placeholder={type === 'flat' ? 'Enter amount' : 'Enter percentage'}
//               min="0"
//               step={type === 'flat' ? "0.01" : "1"}
//               max={type === 'percentage' ? "100" : undefined}
//               required
//             />
//           </div>
//         )}

//         {/* Max Discount Value for Percentage */}
//         {type === 'percentage' && (
//           <div>
//             <label className="block text-sm font-medium text-black mb-1">
//               Maximum Discount Value (₹)
//             </label>
//             <input
//               type="number"
//               name="maxDiscountValue"
//               value={formData.maxDiscountValue}
//               onChange={handleInputChange}
//               className="w-full px-3 py-2 border border-gray-300 text-black/90 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
//               placeholder="Enter maximum discount amount"
//               min="0"
//               step="0.01"
//             />
//           </div>
//         )}

//         {/* Free Shipping Fields */}
//         {type === 'free_shipping' && (
//           <div>
//             <label className="block text-sm font-medium text-black mb-1">
//               Free Shipping Threshold (₹)
//             </label>
//             <input
//               type="number"
//               name="freeShippingThreshold"
//               value={formData.freeShippingThreshold}
//               onChange={handleInputChange}
//               className="w-full px-3 py-2 border border-gray-300 text-black/50 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
//               placeholder="Enter minimum amount for free shipping"
//               min="0"
//               step="0.01"
//               required
//             />
//           </div>
//         )}

//         {/* Free Gift Fields */}
//         {type === 'free_gift' && (
//           <>
//             <div>
//               <label className="block text-sm font-medium text-black mb-1">
//                 Gift Product
//               </label>
//               <input
//                 type="text"
//                 name="giftProduct"
//                 value={formData.giftProduct}
//                 onChange={handleInputChange}
//                 className="w-full px-3 py-2 border border-gray-300 text-black/50 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
//                 placeholder="Enter gift product name"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-black mb-1">
//                 Gift Threshold (₹)
//               </label>
//               <input
//                 type="number"
//                 name="giftThreshold"
//                 value={formData.giftThreshold}
//                 onChange={handleInputChange}
//                 className="w-full px-3 py-2 border border-gray-300 text-black/50 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
//                 placeholder="Enter minimum amount for gift"
//                 min="0"
//                 step="0.01"
//                 required
//               />
//             </div>
//           </>
//         )}

//         {/* Bundle Fields */}
//         {/* {type === DISCOUNT_TYPES.BUNDLE.value && (
//           <div>
//             <label className="block text-sm font-medium text-black mb-1">
//               Bundle Products
//             </label>
//             <ProductSelector
//               selected={formData.bundleProducts}
//               onChange={(products) => handleInputChange({
//                 target: { name: 'bundleProducts', value: products }
//               })}
//               multiple={true}
//             />
//           </div>
//         )} */}

//         {/* BOGO Fields */}
//         {type === DISCOUNT_TYPES.BOGO.value && (
//           <>
//             <div>
//               <label className="block text-sm font-medium text-black mb-1">
//                 Buy Quantity
//               </label>
//               <input
//                 type="number"
//                 name="buyQuantity"
//                 value={formData.buyQuantity}
//                 onChange={handleInputChange}
//                 className="w-full px-3 py-2 border border-gray-300 text-black/50 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
//                 placeholder="Enter buy quantity"
//                 min="1"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-black mb-1">
//                 Get Quantity
//               </label>
//               <input
//                 type="number"
//                 name="getQuantity"
//                 value={formData.getQuantity}
//                 onChange={handleInputChange}
//                 className="w-full px-3 py-2 border border-gray-300 text-black/50 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
//                 placeholder="Enter get quantity"
//                 min="1"
//                 required
//               />
//             </div>
//           </>
//         )}

//         {/* Minimum Cart Value */}
//         {type !== 'free_shipping' && (
//           <div>
//             <label className="block text-sm font-medium text-black mb-1">
//               Minimum Cart Value (₹)
//             </label>
//             <input
//               type="number"
//               name="minCartValue"
//               value={formData.minCartValue}
//               onChange={handleInputChange}
//               className="w-full px-3 py-2 border border-gray-300 text-black/90 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
//               placeholder="Enter minimum cart value"
//               min="0"
//               step="0.01"
//             />
//           </div>
//         )}

//         {/* Expiry Date */}
//         <div>
//           <label className="block text-sm font-medium text-black mb-1">
//             Expiry Date (Optional)
//           </label>
//           <input
//             type="date"
//             name="expiryDate"
//             value={formData.expiryDate}
//             onChange={handleInputChange}
//             className="w-full px-3 py-2 border border-gray-300 text-black/90 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
//           />
//         </div>

//         {/* Additional Options */}
//         <div className="space-y-3">
//           <div className="flex items-center">
//             <input
//               type="checkbox"
//               id="stackable"
//               name="stackable"
//               checked={formData.stackable}
//               onChange={handleInputChange}
//               className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300  rounded"
//             />
//             <label htmlFor="stackable" className="ml-2 block text-sm text-black">
//               Stackable with other discounts
//             </label>
//           </div>

//           <div className="flex items-center">
//             <input
//               type="checkbox"
//               id="prepaidOnly"
//               name="prepaidOnly"
//               checked={formData.prepaidOnly}
//               onChange={handleInputChange}
//               className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
//             />
//             <label htmlFor="prepaidOnly" className="ml-2 block text-sm text-black">
//               Prepaid orders only
//             </label>
//           </div>

//           <div className="flex items-center">
//             <input
//               type="checkbox"
//               id="influencerCode"
//               name="influencerCode"
//               checked={formData.influencerCode}
//               onChange={handleInputChange}
//               className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
//             />
//             <label htmlFor="influencerCode" className="ml-2 block text-sm text-black">
//               Influencer/Referral code
//             </label>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-8xl mx-auto">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900">Manage Discounts</h1>
//             <p className="text-gray-600 mt-1">Create and manage discount codes for your store</p>
//           </div>
//           <button
//             onClick={() => openModal()}
//             className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors duration-200 shadow-md"
//           >
//             <Plus size={20} />
//             <span>Add Discount</span>
//           </button>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//           <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600">Total Discounts</p>
//                 <p className="text-2xl font-bold text-gray-900">{discounts.length}</p>
//               </div>
//               <div className="bg-green-100 p-3 rounded-full">
//                 <Percent className="text-green-600" size={24} />
//               </div>
//             </div>
//           </div>
//           <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600">Active Discounts</p>
//                 <p className="text-2xl font-bold text-gray-900">
//                   {discounts.filter(d => !isExpired(d.expiryDate)).length}
//                 </p>
//               </div>
//               <div className="bg-blue-100 p-3 rounded-full">
//                 <DollarSign className="text-blue-600" size={24} />
//               </div>
//             </div>
//           </div>
//           <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600">Influencer Codes</p>
//                 <p className="text-2xl font-bold text-gray-900">
//                   {discounts.filter(d => d.influencerCode).length}
//                 </p>
//               </div>
//               <div className="bg-purple-100 p-3 rounded-full">
//                 <Users className="text-purple-600" size={24} />
//               </div>
//             </div>
//           </div>
//           <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600">Total Usage</p>
//                 <p className="text-2xl font-bold text-gray-900">
//                   {discounts.reduce((sum, d) => sum + (d.usageCount || 0), 0)}
//                 </p>
//               </div>
//               <div className="bg-orange-100 p-3 rounded-full">
//                 <Calendar className="text-orange-600" size={24} />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Discounts Table */}
//         <div className="bg-white rounded-lg shadow-md overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-green-50">
//                 <tr>
//                   <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Code
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Type
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Value
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Min Cart Value
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Expiry Date
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Features
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Usage
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Status
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {discounts.map((discount) => {
//                   const IconComponent = getDiscountTypeIcon(discount.type);
//                   return (
//                     <tr key={discount._id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center space-x-2">
//                           <div className="text-sm font-medium text-gray-900 bg-gray-100 px-3 py-1 rounded-md">
//                             {discount.code}
//                           </div>
//                           {discount.influencerCode && (
//                             <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
//                               <Users size={10} className="mr-1" />
//                               Influencer
//                             </span>
//                           )}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center space-x-2">
//                           <IconComponent size={16} className="text-gray-600" />
//                           <span className="text-sm text-gray-900">{getDiscountTypeLabel(discount.type)}</span>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
//                         {formatDiscountValue(discount)}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {discount.minCartValue ? `₹${discount.minCartValue}` : '-'}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {formatDate(discount.expiryDate)}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex flex-wrap gap-1">
//                           {discount.stackable && (
//                             <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                               Stackable
//                             </span>
//                           )}
//                           {discount.prepaidOnly && (
//                             <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
//                               Prepaid
//                             </span>
//                           )}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
//                           {discount.usageCount || 0}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                           isExpired(discount.expiryDate)
//                             ? 'bg-red-100 text-red-800'
//                             : 'bg-green-100 text-green-800'
//                         }`}>
//                           {isExpired(discount.expiryDate) ? 'Expired' : 'Active'}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
//                         <button
//                           onClick={() => openModal(discount)}
//                           className="text-green-600 hover:text-green-900 transition-colors duration-200"
//                         >
//                           <Edit size={16} />
//                         </button>
//                         <button
//                           onClick={() => handleDelete(discount._id)}
//                           className="text-red-600 hover:text-red-900 transition-colors duration-200"
//                         >
//                           <Trash2 size={16} />
//                         </button>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>

//           {discounts.length === 0 && (
//             <div className="text-center py-12">
//               <div className="text-gray-500 text-lg">No discounts found</div>
//               <p className="text-gray-400 mt-2">Create your first discount to get started</p>
//             </div>
//           )}
//         </div>

//         {/* Modal */}
//         {isModalOpen && (
//           <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-xl font-bold text-gray-900">
//                   {editingDiscount ? "Edit Discount" : "Add New Discount"}
//                 </h2>
//                 <button
//                   onClick={closeModal}
//                   className="text-gray-500 hover:text-gray-700"
//                 >
//                   <X size={24} />
//                 </button>
//               </div>

//               <div>
//                 {renderFormFields()}

//                 <div className="flex space-x-4 pt-6">
//                   <button
//                     type="button"
//                     onClick={closeModal}
//                     className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="button"
//                     onClick={handleSubmit}
//                     disabled={loading}
//                     className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center justify-center space-x-2 transition-colors duration-200 disabled:opacity-50"
//                   >
//                     {loading ? (
//                       <span>Saving...</span>
//                     ) : (
//                       <>
//                         <Save size={16} />
//                         <span>{editingDiscount ? "Update" : "Create"}</span>
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default DiscountsPage;

"use client";

import React, { useEffect, useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  X,
  Save,
  Calendar,
  Search,
  AlertCircle,
  DollarSign,
  Percent,
  Gift,
  Truck,
  Users,
  ShoppingCart,
  Tag,
  Zap,
  Crown,
} from "lucide-react";
import ProductSelector from "./DiscountComponents/ProductSelector";

// Define the discount types directly in this file for a self-contained example.
// This ensures that the "bundle" type is completely removed.
const DISCOUNT_TYPES = {
  FLAT: { value: "flat", label: "Flat Amount", icon: DollarSign },
  PERCENTAGE: { value: "percentage", label: "Percentage", icon: Percent },
  FREE_SHIPPING: {
    value: "free_shipping",
    label: "Free Shipping",
    icon: Truck,
  },
  FREE_GIFT: { value: "free_gift", label: "Free Gift", icon: Gift },
  BOGO: { value: "bogo", label: "Buy X Get Y", icon: Tag },
  REFERRAL: { value: "referral", label: "Referral", icon: Users },
  FIRST_TIME: { value: "first_time", label: "First Time User", icon: Crown },
};

// Reusable functions to avoid code duplication
const getDiscountTypeLabel = (type) => {
  const discountType = Object.values(DISCOUNT_TYPES).find(
    (t) => t.value === type
  );
  return discountType ? discountType.label : type;
};

const getDiscountTypeIcon = (type) => {
  const discountType = Object.values(DISCOUNT_TYPES).find(
    (t) => t.value === type
  );
  return discountType ? discountType.icon : DollarSign;
};

const formatDiscountValue = (discount) => {
  switch (discount.type) {
    case "flat":
      return `₹${discount.value}`;
    case "percentage":
      return `${discount.value}%${
        discount.maxDiscountValue ? ` (max ₹${discount.maxDiscountValue})` : ""
      }`;
    case "free_shipping":
      return `Free shipping above ₹${discount.freeShippingThreshold}`;
    case "free_gift":
      return `Free ${discount.giftProduct} above ₹${discount.giftThreshold}`;
    case "bogo":
      return `Buy ${discount.buyQuantity} Get ${discount.getQuantity}`;
    case "referral":
      return `${discount.value}% off`;
    case "first_time":
      return `${discount.value}% off first purchase`;
    default:
      return discount.value;
  }
};

const DiscountsPage = () => {
  const [discounts, setDiscounts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    type: "flat",
    value: "",
    minCartValue: "",
    expiryDate: "",
    description: "",
    maxDiscountValue: "",
    freeShippingThreshold: "",
    giftProduct: "",
    giftThreshold: "",
    categories: [],
    applicableProducts: [],
    buyQuantity: "",
    getQuantity: "",
    stackable: false,
    prepaidOnly: false,
    influencerCode: false,
  });

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const discountTypes = Object.values(DISCOUNT_TYPES);

  const fetchDiscounts = async () => {
    try {
      const res = await fetch(`${API_URL}/api/discounts`);
      const data = await res.json();
      setDiscounts(data);
    } catch (err) {
      console.error("Error fetching discounts", err);
    }
  };

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const resetForm = () => {
    setFormData({
      code: "",
      type: "flat",
      value: "",
      minCartValue: "",
      expiryDate: "",
      maxDiscountValue: "",
      freeShippingThreshold: "",
      giftProduct: "",
      giftThreshold: "",
      buyQuantity: "",
      getQuantity: "",
      categories: [],
      applicableProducts: [],
      stackable: false,
      prepaidOnly: false,
      influencerCode: false,
      description: "",
    });
    setEditingDiscount(null);
  };

  const openModal = (discount = null) => {
    if (discount) {
      setEditingDiscount(discount);
      setFormData({
        code: discount.code,
        type: discount.type,
        value: discount.value?.toString() || "",
        minCartValue: discount.minCartValue?.toString() || "",
        expiryDate: discount.expiryDate
          ? new Date(discount.expiryDate).toISOString().split("T")[0]
          : "",
        maxDiscountValue: discount.maxDiscountValue?.toString() || "",
        freeShippingThreshold: discount.freeShippingThreshold?.toString() || "",
        giftProduct: discount.giftProduct || "",
        giftThreshold: discount.giftThreshold?.toString() || "",
        buyQuantity: discount.buyQuantity?.toString() || "",
        getQuantity: discount.getQuantity?.toString() || "",
        stackable: discount.stackable || false,
        prepaidOnly: discount.prepaidOnly || false,
        influencerCode: discount.influencerCode || false,
        description: discount.description || "",
      });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.code) {
        throw new Error("Discount code is required");
      }

      if (!formData.type) {
        throw new Error("Discount type is required");
      }

      if (
        ["flat", "percentage", "referral", "first_time"].includes(
          formData.type
        ) &&
        !formData.value
      ) {
        throw new Error("Discount value is required");
      }

      const payload = {
        ...formData,
        value: formData.value ? parseFloat(formData.value) : null,
        minCartValue: formData.minCartValue
          ? parseFloat(formData.minCartValue)
          : 0,
        maxDiscountValue: formData.maxDiscountValue
          ? parseFloat(formData.maxDiscountValue)
          : null,
        freeShippingThreshold: formData.freeShippingThreshold
          ? parseFloat(formData.freeShippingThreshold)
          : null,
        giftThreshold: formData.giftThreshold
          ? parseFloat(formData.giftThreshold)
          : null,
        buyQuantity: formData.buyQuantity
          ? parseInt(formData.buyQuantity)
          : null,
        getQuantity: formData.getQuantity
          ? parseInt(formData.getQuantity)
          : null,
        expiryDate: formData.expiryDate ? new Date(formData.expiryDate) : null,
      };

      const response = editingDiscount
        ? await fetch(`${API_URL}/api/discounts/${editingDiscount._id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          })
        : await fetch(`${API_URL}/api/discounts`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });

      if (!response.ok) {
        throw new Error("Failed to save discount");
      }

      await fetchDiscounts();
      closeModal();
    } catch (err) {
      console.error("Error saving discount", err);
      alert("Error saving discount. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this discount?")) {
      try {
        const response = await fetch(`${API_URL}/api/discounts/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete discount");
        }

        await fetchDiscounts();
      } catch (err) {
        console.error("Error deleting discount", err);
        alert("Error deleting discount. Please try again.");
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No expiry";
    return new Date(dateString).toLocaleDateString();
  };

  const isExpired = (dateString) => {
    if (!dateString) return false;
    return new Date(dateString) < new Date();
  };

  const renderFormFields = () => {
    const { type } = formData;

    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Discount Code
          </label>
          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Enter discount code"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Discount Type
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 text-black/90 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            {discountTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 text-black/90 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Enter discount description"
            rows={2}
          />
        </div>

        {/* Common Fields */}
        {(type === "flat" ||
          type === "percentage" ||
          type === "referral" ||
          type === "first_time") && (
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              {type === "flat" ? "Amount (₹)" : "Percentage (%)"}
            </label>
            <input
              type="number"
              name="value"
              value={formData.value}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 text-black/90 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder={
                type === "flat" ? "Enter amount" : "Enter percentage"
              }
              min="0"
              step={type === "flat" ? "0.01" : "1"}
              max={type === "percentage" ? "100" : undefined}
              required
            />
          </div>
        )}

        {/* Max Discount Value for Percentage */}
        {type === "percentage" && (
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Maximum Discount Value (₹)
            </label>
            <input
              type="number"
              name="maxDiscountValue"
              value={formData.maxDiscountValue}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 text-black/90 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Enter maximum discount amount"
              min="0"
              step="0.01"
            />
          </div>
        )}

        {/* Free Shipping Fields */}
        {type === "free_shipping" && (
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Free Shipping Threshold (₹)
            </label>
            <input
              type="number"
              name="freeShippingThreshold"
              value={formData.freeShippingThreshold}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 text-black/50 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Enter minimum amount for free shipping"
              min="0"
              step="0.01"
              required
            />
          </div>
        )}

        {/* Free Gift Fields */}
        {type === "free_gift" && (
          <>
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Gift Product
              </label>
              <input
                type="text"
                name="giftProduct"
                value={formData.giftProduct}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 text-black/50 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Enter gift product name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Gift Threshold (₹)
              </label>
              <input
                type="number"
                name="giftThreshold"
                value={formData.giftThreshold}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 text-black/50 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Enter minimum amount for gift"
                min="0"
                step="0.01"
                required
              />
            </div>
          </>
        )}

        {/* BOGO Fields */}
        {type === DISCOUNT_TYPES.BOGO.value && (
          <>
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Buy Quantity
              </label>
              <input
                type="number"
                name="buyQuantity"
                value={formData.buyQuantity}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 text-black/50 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Enter buy quantity"
                min="1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Get Quantity
              </label>
              <input
                type="number"
                name="getQuantity"
                value={formData.getQuantity}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 text-black/50 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Enter get quantity"
                min="1"
                required
              />
            </div>
          </>
        )}

        {/* Minimum Cart Value */}
        {type !== "free_shipping" && (
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Minimum Cart Value (₹)
            </label>
            <input
              type="number"
              name="minCartValue"
              value={formData.minCartValue}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 text-black/90 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Enter minimum cart value"
              min="0"
              step="0.01"
            />
          </div>
        )}

        {/* Expiry Date */}
        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Expiry Date (Optional)
          </label>
          <input
            type="date"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 text-black/90 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>

        {/* Additional Options */}
        <div className="space-y-3">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="stackable"
              name="stackable"
              checked={formData.stackable}
              onChange={handleInputChange}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label
              htmlFor="stackable"
              className="ml-2 block text-sm text-black"
            >
              Stackable with other discounts
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="prepaidOnly"
              name="prepaidOnly"
              checked={formData.prepaidOnly}
              onChange={handleInputChange}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label
              htmlFor="prepaidOnly"
              className="ml-2 block text-sm text-black"
            >
              Prepaid orders only
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="influencerCode"
              name="influencerCode"
              checked={formData.influencerCode}
              onChange={handleInputChange}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label
              htmlFor="influencerCode"
              className="ml-2 block text-sm text-black"
            >
              Influencer/Referral code
            </label>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-8xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Manage Discounts
            </h1>
            <p className="text-gray-600 mt-1">
              Create and manage discount codes for your store
            </p>
          </div>
          <button
            onClick={() => openModal()}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors duration-200 shadow-md"
          >
            <Plus size={20} />
            <span>Add Discount</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Discounts</p>
                <p className="text-2xl font-bold text-gray-900">
                  {discounts.length}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Percent className="text-green-600" size={24} />
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Discounts</p>
                <p className="text-2xl font-bold text-gray-900">
                  {discounts.filter((d) => !isExpired(d.expiryDate)).length}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <DollarSign className="text-blue-600" size={24} />
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Influencer Codes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {discounts.filter((d) => d.influencerCode).length}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Users className="text-purple-600" size={24} />
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Usage</p>
                <p className="text-2xl font-bold text-gray-900">
                  {discounts.reduce((sum, d) => sum + (d.usageCount || 0), 0)}
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <Calendar className="text-orange-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Discounts Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-green-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Code
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Min Cart Value
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expiry Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Features
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usage
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {discounts.map((discount) => {
                  const IconComponent = getDiscountTypeIcon(discount.type);
                  return (
                    <tr key={discount._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <div className="text-sm font-medium text-gray-900 bg-gray-100 px-3 py-1 rounded-md">
                            {discount.code}
                          </div>
                          {discount.influencerCode && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              <Users size={10} className="mr-1" />
                              Influencer
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <IconComponent size={16} className="text-gray-600" />
                          <span className="text-sm text-gray-900">
                            {getDiscountTypeLabel(discount.type)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {formatDiscountValue(discount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {discount.minCartValue
                          ? `₹${discount.minCartValue}`
                          : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(discount.expiryDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {discount.stackable && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Stackable
                            </span>
                          )}
                          {discount.prepaidOnly && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Prepaid
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                          {discount.usageCount || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            isExpired(discount.expiryDate)
                              ? "bg-red-100 text-red-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {isExpired(discount.expiryDate)
                            ? "Expired"
                            : "Active"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => openModal(discount)}
                          className="text-green-600 hover:text-green-900 transition-colors duration-200"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(discount._id)}
                          className="text-red-600 hover:text-red-900 transition-colors duration-200"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {discounts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg">No discounts found</div>
              <p className="text-gray-400 mt-2">
                Create your first discount to get started
              </p>
            </div>
          )}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingDiscount ? "Edit Discount" : "Add New Discount"}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              <div>
                {renderFormFields()}

                <div className="flex space-x-4 pt-6">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center justify-center space-x-2 transition-colors duration-200 disabled:opacity-50"
                  >
                    {loading ? (
                      <span>Saving...</span>
                    ) : (
                      <>
                        <Save size={16} />
                        <span>{editingDiscount ? "Update" : "Create"}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscountsPage;
