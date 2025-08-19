// "use client";
// import { useState, useEffect } from "react";
// import { useSession, signOut } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import Image from "next/image";
// import {
//   User,
//   MapPin,
//   Phone,
//   Mail,
//   Package,
//   Heart,
//   Gift,
//   LogOut,
//   Edit3,
//   Save,
//   X,
//   ShoppingBag,
//   Users,
//   Settings,
//   BarChart3,
//   Plus,
//   Calendar,
//   Star,
//   Shield,
//   Crown,
//   Truck,
//   CheckCircle,
//   Clock,
//   AlertCircle,
//   Eye,
//   Trash2,
//   Edit,
//   Copy,
//   Check,
// } from "lucide-react";
// import Link from "next/link";

// // Utility functions for discount formatting
// function formatDiscountValue(discount) {
//   if (!discount) return "Special Offer";

//   switch (discount.type) {
//     case "flat":
//       return `₹${discount.value || 0}`;
//     case "percentage":
//       return `${discount.value || 0}%`;
//     case "free_shipping":
//       return "Free Shipping";
//     case "free_gift":
//       return "Free Gift";
//     case "bogo":
//       return `Buy ${discount.buyQuantity || 1} Get ${
//         discount.getQuantity || 1
//       }`;
//     case "bundle":
//       return `${discount.value || 0}% off`;
//     case "referral":
//       return `₹${discount.value || 0}`;
//     case "first_time":
//       return discount.type === "flat"
//         ? `₹${discount.value || 0}`
//         : `${discount.value || 0}%`;
//     default:
//       return "Special Offer";
//   }
// }

// function getDiscountTypeIcon(type) {
//   switch (type) {
//     case "flat":
//       return Gift;
//     case "percentage":
//       return Gift;
//     case "free_shipping":
//       return Truck;
//     case "bundle":
//       return ShoppingBag;
//     case "bogo":
//       return Gift;
//     default:
//       return Gift;
//   }
// }

// function getDiscountDescription(discount) {
//   if (!discount) return "Special discount";

//   const typeDescriptions = {
//     flat: "Fixed amount off",
//     percentage: "Percentage off total",
//     bundle: "Buy multiple items together",
//     bogo: "Buy X get Y free",
//     free_gift: "Free gift with purchase",
//     free_shipping: "Free delivery",
//     referral: "Referral reward",
//     first_time: "First purchase discount",
//   };

//   const baseDesc = typeDescriptions[discount.type] || "Special discount";

//   if (discount.minCartValue && discount.minCartValue > 0) {
//     return `${baseDesc} • Min order ₹${discount.minCartValue}`;
//   }

//   return baseDesc;
// }

// const ProfilePage = () => {
//   const { data: session, status } = useSession();
//   const router = useRouter();
//   const [activeTab, setActiveTab] = useState("profile");
//   const [isEditing, setIsEditing] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [coupons, setCoupons] = useState([]);
//   const [loadingCoupons, setLoadingCoupons] = useState(false);
//   const [copiedCode, setCopiedCode] = useState(null);
//   const [isMounted, setIsMounted] = useState(false);

//   // User profile state
//   const [userProfile, setUserProfile] = useState({
//     name: "",
//     email: "",
//     phone: "+91 9876543210",
//     address: "123 Green Street, Eco Colony, Mumbai, Maharashtra 400001",
//     joinDate: "2024-01-15",
//   });

//   const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

//   // Mount check for client-side only rendering
//   useEffect(() => {
//     setIsMounted(true);
//   }, []);

//   // Loading effect
//   useEffect(() => {
//     // Fetch user's available and used coupons
//     const fetchUserCoupons = async (userId) => {
//       setLoadingCoupons(true);
//       try {
//         // Fetch both available and used coupons
//         const [availableRes, usedRes] = await Promise.all([
//           fetch(`${API_URL}/api/discounts/available/${userId}`),
//           fetch(`${API_URL}/api/discounts/used/${userId}`),
//         ]);

//         const availableCoupons = availableRes.ok
//           ? await availableRes.json()
//           : [];
//         const usedCoupons = usedRes.ok ? await usedRes.json() : [];

//         // Combine and sort coupons
//         const allCoupons = [
//           ...availableCoupons.map((coupon) => ({ ...coupon, used: false })),
//           ...usedCoupons.map((coupon) => ({ ...coupon, used: true })),
//         ].sort((a, b) => {
//           // Sort unused coupons first, then by expiry date
//           if (a.used !== b.used) return a.used - b.used;

//           if (a.expiryDate && b.expiryDate) {
//             return new Date(a.expiryDate) - new Date(b.expiryDate);
//           }
//           return 0;
//         });

//         setCoupons(allCoupons);
//       } catch (error) {
//         console.error("Error fetching coupons:", error);
//         // Fallback: try to fetch just the available discounts directly
//         try {
//           const fallbackRes = await fetch(`${API_URL}/api/discounts`);
//           if (fallbackRes.ok) {
//             const allDiscounts = await fallbackRes.json();
//             const fallbackCoupons = allDiscounts.map((coupon) => ({
//               ...coupon,
//               used: false,
//               canUse: true,
//             }));
//             setCoupons(fallbackCoupons);
//           } else {
//             setCoupons([]);
//           }
//         } catch (fallbackError) {
//           console.error("Fallback fetch also failed:", fallbackError);
//           setCoupons([]);
//         }
//       } finally {
//         setLoadingCoupons(false);
//       }
//     };

//     if (status !== "loading") {
//       setLoading(false);
//       if (session?.user) {
//         setUserProfile((prev) => ({
//           ...prev,
//           name: session.user.name || "",
//           email: session.user.email || "",
//         }));
//         // Fetch user's coupons when session is available
//         const userId = session.user.id || session.user._id || "guest";
//         if (userId && userId !== "guest") {
//           fetchUserCoupons(userId);
//         } else {
//           // For guest users or users without ID, fetch all available coupons
//           fetchUserCoupons("guest");
//         }
//       }
//     }
//   }, [session, status, API_URL]);

//   // Redirect if not authenticated
//   useEffect(() => {
//     if (status !== "loading" && !session) {
//       router.push("/Login");
//     }
//   }, [session, status, router]);

//   // Client-side only rendering check
//   if (!isMounted) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="flex flex-col items-center space-y-4">
//           <div className="relative">
//             <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
//             <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-green-400 rounded-full animate-ping"></div>
//           </div>
//           <div className="text-center">
//             <p className="text-gray-600 font-medium">Loading your profile...</p>
//             <div className="flex space-x-1 mt-2">
//               <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
//               <div
//                 className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
//                 style={{ animationDelay: "0.1s" }}
//               ></div>
//               <div
//                 className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
//                 style={{ animationDelay: "0.2s" }}
//               ></div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const dummyWishlist = [
//     {
//       id: 1,
//       name: "Organic Face Mask",
//       price: 599,
//       image: "/api/placeholder/100/100",
//     },
//     {
//       id: 2,
//       name: "Herbal Shampoo",
//       price: 799,
//       image: "/api/placeholder/100/100",
//     },
//     {
//       id: 3,
//       name: "Immunity Booster",
//       price: 1299,
//       image: "/api/placeholder/100/100",
//     },
//   ];

//   const dummyAddresses = [
//     {
//       id: 1,
//       type: "Home",
//       address: "123 Green Street, Eco Colony, Mumbai, Maharashtra 400001",
//       isDefault: true,
//     },
//     {
//       id: 2,
//       type: "Office",
//       address: "456 Business Park, Tech City, Bangalore, Karnataka 560001",
//       isDefault: false,
//     },
//   ];

//   const dummyCoupons = [
//     {
//       id: 1,
//       code: "WELLNESS20",
//       discount: "20%",
//       expiry: "2024-08-31",
//       used: false,
//     },
//     {
//       id: 2,
//       code: "FIRSTBUY",
//       discount: "₹100",
//       expiry: "2024-09-15",
//       used: true,
//     },
//     {
//       id: 3,
//       code: "ORGANIC15",
//       discount: "15%",
//       expiry: "2024-08-15",
//       used: false,
//     },
//   ];

//   // Admin dummy data
//   const adminStats = {
//     totalOrders: 1245,
//     totalUsers: 856,
//     totalProducts: 234,
//     monthlyRevenue: 125000,
//   };

//   const allOrders = [
//     {
//       id: "ORD001",
//       customer: "John Doe",
//       email: "john@example.com",
//       date: "2024-07-25",
//       total: 1299,
//       status: "delivered",
//       items: 2,
//     },
//     {
//       id: "ORD002",
//       customer: "Jane Smith",
//       email: "jane@example.com",
//       date: "2024-07-24",
//       total: 2450,
//       status: "processing",
//       items: 3,
//     },
//     {
//       id: "ORD003",
//       customer: "Mike Johnson",
//       email: "mike@example.com",
//       date: "2024-07-23",
//       total: 850,
//       status: "shipped",
//       items: 1,
//     },
//   ];

//   const handleLogout = () => {
//     signOut({ callbackUrl: "/" });
//   };

//   const handleSaveProfile = () => {
//     setIsEditing(false);
//     // Here you would typically save to backend
//   };

//   const handleCopyCode = async (code) => {
//     try {
//       await navigator.clipboard.writeText(code);
//       setCopiedCode(code);
//       setTimeout(() => setCopiedCode(null), 2000);
//     } catch (err) {
//       console.error("Failed to copy code:", err);
//       // Fallback for older browsers
//       const textArea = document.createElement("textarea");
//       textArea.value = code;
//       document.body.appendChild(textArea);
//       textArea.select();
//       document.execCommand("copy");
//       document.body.removeChild(textArea);
//       setCopiedCode(code);
//       setTimeout(() => setCopiedCode(null), 2000);
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "delivered":
//         return "text-green-600 bg-green-100";
//       case "shipped":
//         return "text-blue-600 bg-blue-100";
//       case "processing":
//         return "text-yellow-600 bg-yellow-100";
//       default:
//         return "text-gray-600 bg-gray-100";
//     }
//   };

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case "delivered":
//         return <CheckCircle className="w-4 h-4" />;
//       case "shipped":
//         return <Truck className="w-4 h-4" />;
//       case "processing":
//         return <Clock className="w-4 h-4" />;
//       default:
//         return <AlertCircle className="w-4 h-4" />;
//     }
//   };

//   if (loading || status === "loading") {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="flex flex-col items-center space-y-4">
//           <div className="relative">
//             <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
//             <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-green-400 rounded-full animate-ping"></div>
//           </div>
//           <div className="text-center">
//             <p className="text-gray-600 font-medium">
//               Setting up your profile...
//             </p>
//             <div className="flex space-x-1 mt-2">
//               <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
//               <div
//                 className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
//                 style={{ animationDelay: "0.1s" }}
//               ></div>
//               <div
//                 className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
//                 style={{ animationDelay: "0.2s" }}
//               ></div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!session) {
//     return null;
//   }

//   const isAdmin = session?.user?.isAdmin;

//   // Tab configuration based on user role
//   const userTabs = [
//     { id: "profile", label: "Profile", icon: User },
//     { id: "orders", label: "My Orders", icon: Package },
//     { id: "addresses", label: "Addresses", icon: MapPin },
//     // { id: "wishlist", label: "Wishlist", icon: Heart },
//     { id: "coupons", label: "Coupons", icon: Gift },
//   ];

//   const adminTabs = [{ id: "profile", label: "Admin Profile", icon: Shield }];

//   const tabs = isAdmin ? adminTabs : userTabs;

//   return (
//     <div className="min-h-screen bg-gray-50 pt-24">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Header */}
//         <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <div className="relative">
//                 {session.user.image ? (
//                   <Image
//                     src={session.user.image}
//                     alt="Profile"
//                     width={80}
//                     height={80}
//                     className="w-20 h-20 rounded-full border-4 border-green-100"
//                     priority
//                   />
//                 ) : (
//                   <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
//                     <User className="w-8 h-8 text-green-600" />
//                   </div>
//                 )}
//                 {isAdmin && (
//                   <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1">
//                     <Crown className="w-4 h-4 text-yellow-800" />
//                   </div>
//                 )}
//               </div>
//               <div>
//                 <h1 className="text-2xl font-bold text-black flex items-center gap-2">
//                   {session.user.name}
//                   {isAdmin && (
//                     <span className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-medium">
//                       Admin
//                     </span>
//                   )}
//                 </h1>
//                 <p className="text-black">{session.user.email}</p>
//                 <p className="text-sm text-black">
//                   {isAdmin
//                     ? "Administrator Account"
//                     : `Member since ${userProfile.joinDate}`}
//                 </p>
//               </div>
//             </div>
//             <button
//               onClick={handleLogout}
//               className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
//             >
//               <LogOut className="w-4 h-4" />
//               Logout
//             </button>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
//           {/* Sidebar */}
//           <div className="lg:col-span-1">
//             <div className="bg-white rounded-xl shadow-sm p-4">
//               <nav className="space-y-2">
//                 {tabs.map((tab) => {
//                   const Icon = tab.icon;

//                   // If it's the orders tab and user is not admin, render as Link
//                   if (tab.id === "orders" && !isAdmin) {
//                     return (
//                       <Link
//                         key={tab.id}
//                         href="/orders"
//                         className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
//                           activeTab === tab.id
//                             ? "bg-green-50 text-green-600 border-r-2 border-green-600"
//                             : "text-black hover:bg-gray-50"
//                         }`}
//                         onClick={() => setActiveTab(tab.id)}
//                       >
//                         <Icon className="w-5 h-5" />
//                         {tab.label}
//                       </Link>
//                     );
//                   }

//                   return (
//                     <button
//                       key={tab.id}
//                       onClick={() => setActiveTab(tab.id)}
//                       className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
//                         activeTab === tab.id
//                           ? "bg-green-50 text-green-600 border-r-2 border-green-600"
//                           : "text-black hover:bg-gray-50"
//                       }`}
//                     >
//                       <Icon className="w-5 h-5" />
//                       {tab.label}
//                     </button>
//                   );
//                 })}
//               </nav>
//             </div>
//           </div>

//           {/* Main Content */}
//           <div className="lg:col-span-3">
//             <div className="bg-white rounded-xl shadow-sm p-6">
//               {/* Profile Tab */}
//               {activeTab === "profile" && (
//                 <div className="space-y-6">
//                   <div className="flex items-center justify-between">
//                     <h2 className="text-xl font-semibold text-black">
//                       {isAdmin ? "Admin Profile" : "Personal Information"}
//                     </h2>
//                     {!isAdmin && (
//                       <button
//                         onClick={() => setIsEditing(!isEditing)}
//                         className="flex items-center gap-2 px-4 py-2 text-green-600 border border-green-600 rounded-lg hover:bg-green-50 transition-colors"
//                       >
//                         {isEditing ? (
//                           <X className="w-4 h-4" />
//                         ) : (
//                           <Edit3 className="w-4 h-4" />
//                         )}
//                         {isEditing ? "Cancel" : "Edit"}
//                       </button>
//                     )}
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div className="space-y-4">
//                       <div>
//                         <label className="block text-sm font-medium text-black mb-2">
//                           Full Name
//                         </label>
//                         {isEditing ? (
//                           <input
//                             type="text"
//                             value={userProfile.name}
//                             onChange={(e) =>
//                               setUserProfile({
//                                 ...userProfile,
//                                 name: e.target.value,
//                               })
//                             }
//                             className="w-full px-4 py-2 border text-gray-400   border-gray-300 rounded-lg  focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                           />
//                         ) : (
//                           <p className="px-4 py-2 text-black bg-gray-50 rounded-lg">
//                             {userProfile.name}
//                           </p>
//                         )}
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-black mb-2">
//                           Email Address
//                         </label>
//                         <p className="px-4 py-2 bg-gray-50 rounded-lg text-black">
//                           {userProfile.email}
//                         </p>
//                       </div>
//                     </div>

//                     <div className="space-y-4">
//                       <div>
//                         <label className="block text-sm font-medium text-black mb-2">
//                           Phone Number
//                         </label>
//                         {isEditing ? (
//                           <input
//                             type="tel"
//                             value={userProfile.phone}
//                             onChange={(e) =>
//                               setUserProfile({
//                                 ...userProfile,
//                                 phone: e.target.value,
//                               })
//                             }
//                             className="w-full px-4 py-2 border border-gray-300 text-gray-400 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                           />
//                         ) : (
//                           <p className="px-4 py-2 text-black bg-gray-50 rounded-lg">
//                             {userProfile.phone}
//                           </p>
//                         )}
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-black mb-2">
//                           Address
//                         </label>
//                         {isEditing ? (
//                           <textarea
//                             value={userProfile.address}
//                             onChange={(e) =>
//                               setUserProfile({
//                                 ...userProfile,
//                                 address: e.target.value,
//                               })
//                             }
//                             rows={3}
//                             className="w-full px-4 py-2 border text-gray-400 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                           />
//                         ) : (
//                           <p className="px-4 py-2 bg-gray-50 text-black rounded-lg">
//                             {userProfile.address}
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                   </div>

//                   {isEditing && (
//                     <div className="flex justify-end">
//                       <button
//                         onClick={handleSaveProfile}
//                         className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
//                       >
//                         <Save className="w-4 h-4" />
//                         Save Changes
//                       </button>
//                     </div>
//                   )}

//                   {isAdmin && (
//                     <div className="mt-8 pt-6 border-t border-gray-200">
//                       <h3 className="text-lg font-semibold text-black mb-4">
//                         Quick Actions
//                       </h3>
//                       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                         <Link
//                           href="/admin/products"
//                           className="p-4 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-center"
//                         >
//                           <ShoppingBag className="w-6 h-6 mx-auto mb-2" />
//                           <span className="text-sm font-medium">
//                             Manage Products
//                           </span>
//                         </Link>

//                         <Link
//                           href="/admin/orders"
//                           className="p-4 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors text-center"
//                         >
//                           <Users className="w-6 h-6 mx-auto mb-2" />
//                           <span className="text-sm font-medium">
//                             Manage Users
//                           </span>
//                         </Link>
//                         <Link
//                           href="/admin/dashboard"
//                           className="p-4 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors text-center"
//                         >
//                           <BarChart3 className="w-6 h-6 mx-auto mb-2" />
//                           <span className="text-sm font-medium">Analytics</span>
//                         </Link>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               )}
//               {/* Addresses Tab */}
//               {activeTab === "addresses" && !isAdmin && (
//                 <div className="space-y-6">
//                   <div className="flex items-center justify-between">
//                     <h2 className="text-xl font-semibold text-black">
//                       Saved Addresses
//                     </h2>
//                     <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
//                       <Plus className="w-4 h-4" />
//                       Add New Address
//                     </button>
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     {dummyAddresses.map((address) => (
//                       <div
//                         key={address.id}
//                         className="border border-gray-200 rounded-lg p-4"
//                       >
//                         <div className="flex items-center justify-between mb-2">
//                           <h3 className="font-semibold text-black">
//                             {address.type}
//                           </h3>
//                           <div className="flex items-center gap-2">
//                             {address.isDefault && (
//                               <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
//                                 Default
//                               </span>
//                             )}
//                             <button className="p-1 text-gray-400 hover:text-gray-600">
//                               <Edit className="w-4 h-4" />
//                             </button>
//                           </div>
//                         </div>
//                         <p className="text-black text-sm">{address.address}</p>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//               {/* Coupons Tab */}
//               {activeTab === "coupons" && !isAdmin && (
//                 <div className="space-y-6">
//                   <div className="flex items-center justify-between">
//                     <h2 className="text-xl font-semibold text-black">
//                       My Coupons & Rewards
//                     </h2>
//                     {loadingCoupons && (
//                       <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
//                     )}
//                   </div>

//                   {loadingCoupons ? (
//                     <div className="space-y-4">
//                       {[...Array(3)].map((_, i) => (
//                         <div
//                           key={i}
//                           className="border rounded-lg p-4 animate-pulse"
//                         >
//                           <div className="flex items-center justify-between">
//                             <div className="flex items-center gap-4">
//                               <div className="bg-gray-200 p-3 rounded-lg w-12 h-12"></div>
//                               <div>
//                                 <div className="h-5 bg-gray-200 rounded w-24 mb-2"></div>
//                                 <div className="h-4 bg-gray-200 rounded w-48"></div>
//                               </div>
//                             </div>
//                             <div className="h-8 bg-gray-200 rounded w-20"></div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   ) : coupons.length === 0 ? (
//                     <div className="text-center py-12">
//                       <Gift className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//                       <h3 className="text-lg font-medium text-gray-900 mb-2">
//                         No Coupons Available
//                       </h3>
//                       <p className="text-gray-500">
//                         Check back later for exciting offers and discounts!
//                       </p>
//                     </div>
//                   ) : (
//                     <div className="space-y-4">
//                       {coupons.map((coupon) => {
//                         const IconComponent = getDiscountTypeIcon(coupon.type);
//                         const isExpired =
//                           coupon.expiryDate &&
//                           new Date(coupon.expiryDate) < new Date();
//                         const canUse = !coupon.used && !isExpired;

//                         return (
//                           <div
//                             key={coupon._id}
//                             className={`border rounded-lg p-4 transition-all ${
//                               coupon.used || isExpired
//                                 ? "bg-gray-50 border-gray-200 opacity-75"
//                                 : "border-green-200 bg-green-50 hover:bg-green-100"
//                             }`}
//                           >
//                             <div className="flex items-center justify-between">
//                               <div className="flex items-center gap-4">
//                                 <div
//                                   className={`p-3 rounded-lg ${
//                                     coupon.used || isExpired
//                                       ? "bg-gray-200"
//                                       : "bg-white"
//                                   }`}
//                                 >
//                                   <IconComponent
//                                     className={`w-6 h-6 ${
//                                       coupon.used || isExpired
//                                         ? "text-gray-400"
//                                         : "text-green-600"
//                                     }`}
//                                   />
//                                 </div>
//                                 <div>
//                                   <h3
//                                     className={`font-semibold flex items-center gap-2 ${
//                                       coupon.used || isExpired
//                                         ? "text-gray-500"
//                                         : "text-gray-900"
//                                     }`}
//                                   >
//                                     {coupon.code}
//                                     {isExpired && (
//                                       <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
//                                         Expired
//                                       </span>
//                                     )}
//                                     {coupon.used && (
//                                       <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
//                                         Used
//                                       </span>
//                                     )}
//                                   </h3>
//                                   <p
//                                     className={`text-sm ${
//                                       coupon.used || isExpired
//                                         ? "text-gray-400"
//                                         : "text-gray-600"
//                                     }`}
//                                   >
//                                     {getDiscountDescription(coupon)} • Get{" "}
//                                     {formatDiscountValue(coupon)} off
//                                     {coupon.expiryDate && (
//                                       <>
//                                         {" "}
//                                         • Expires{" "}
//                                         {new Date(
//                                           coupon.expiryDate
//                                         ).toLocaleDateString()}
//                                       </>
//                                     )}
//                                   </p>
//                                   {coupon.used && coupon.usedAt && (
//                                     <p className="text-xs text-gray-400 mt-1">
//                                       Used on{" "}
//                                       {new Date(
//                                         coupon.usedAt
//                                       ).toLocaleDateString()}
//                                     </p>
//                                   )}
//                                 </div>
//                               </div>
//                               <div className="flex items-center gap-2">
//                                 {coupon.used ? (
//                                   <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium">
//                                     <CheckCircle className="w-4 h-4" />
//                                     Used
//                                   </div>
//                                 ) : isExpired ? (
//                                   <span className="text-xs bg-red-100 text-red-600 px-3 py-1 rounded-full">
//                                     Expired
//                                   </span>
//                                 ) : (
//                                   <button
//                                     onClick={() => handleCopyCode(coupon.code)}
//                                     disabled={!canUse}
//                                     className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
//                                       copiedCode === coupon.code
//                                         ? "bg-green-600 text-white"
//                                         : canUse
//                                         ? "bg-white text-green-600 border border-green-600 hover:bg-green-50"
//                                         : "bg-gray-300 text-gray-500 cursor-not-allowed"
//                                     }`}
//                                   >
//                                     {copiedCode === coupon.code ? (
//                                       <>
//                                         <Check className="w-4 h-4" />
//                                         Copied!
//                                       </>
//                                     ) : (
//                                       <>
//                                         <Copy className="w-4 h-4" />
//                                         Copy Code
//                                       </>
//                                     )}
//                                   </button>
//                                 )}
//                               </div>
//                             </div>

//                             {/* Additional coupon details */}
//                             {canUse && coupon.minCartValue > 0 && (
//                               <div className="mt-3 pt-3 border-t border-green-200">
//                                 <p className="text-sm text-green-700">
//                                   <ShoppingBag className="w-4 h-4 inline mr-1" />
//                                   Minimum order value: ₹{coupon.minCartValue}
//                                 </p>
//                               </div>
//                             )}

//                             {canUse &&
//                               coupon.maxDiscountValue &&
//                               coupon.type === "percentage" && (
//                                 <div className="mt-3 pt-3 border-t border-green-200">
//                                   <p className="text-sm text-green-700">
//                                     Maximum discount: ₹{coupon.maxDiscountValue}
//                                   </p>
//                                 </div>
//                               )}

//                             {coupon.description && (
//                               <div className="mt-3 pt-3 border-t border-gray-200">
//                                 <p className="text-sm text-gray-600">
//                                   {coupon.description}
//                                 </p>
//                               </div>
//                             )}
//                           </div>
//                         );
//                       })}
//                     </div>
//                   )}

//                   {/* Usage Instructions */}
//                   {!loadingCoupons && coupons.length > 0 && (
//                     <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//                       <div className="flex items-start gap-3">
//                         <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
//                         <div>
//                           <h4 className="font-medium text-blue-900 mb-2">
//                             How to use your coupons:
//                           </h4>
//                           <ul className="text-sm text-blue-800 space-y-1">
//                             <li>
//                               • Copy the coupon code and apply it during
//                               checkout
//                             </li>
//                             <li>
//                               • Each coupon can only be used once per account
//                             </li>
//                             <li>
//                               • Check minimum order requirements before applying
//                             </li>
//                             <li>
//                               • Coupons cannot be combined with other offers
//                             </li>
//                             <li>
//                               • Used coupons will be marked and cannot be reused
//                             </li>
//                           </ul>
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Loading Skeleton Component */}
//       {loading && (
//         <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
//           <div className="flex flex-col items-center space-y-6">
//             <div className="relative">
//               <div className="w-20 h-20 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
//               <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-r-green-400 rounded-full animate-ping"></div>
//             </div>
//             <div className="text-center">
//               <p className="text-gray-700 font-semibold text-lg">
//                 Loading Profile Data...
//               </p>
//               <div className="flex space-x-1 mt-3">
//                 <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
//                 <div
//                   className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
//                   style={{ animationDelay: "0.1s" }}
//                 ></div>
//                 <div
//                   className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
//                   style={{ animationDelay: "0.2s" }}
//                 ></div>
//               </div>
//             </div>

//             {/* Skeleton preview */}
//             <div className="max-w-4xl mx-auto px-4 w-full">
//               <div className="bg-white rounded-xl shadow-sm p-6 mb-6 opacity-50">
//                 <div className="flex items-center gap-4">
//                   <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse"></div>
//                   <div className="space-y-2">
//                     <div className="h-5 bg-gray-200 rounded animate-pulse w-40"></div>
//                     <div className="h-4 bg-gray-200 rounded animate-pulse w-56"></div>
//                   </div>
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 opacity-30">
//                 <div className="lg:col-span-1">
//                   <div className="bg-white rounded-xl shadow-sm p-4">
//                     <div className="space-y-2">
//                       {[...Array(4)].map((_, i) => (
//                         <div
//                           key={i}
//                           className="h-10 bg-gray-200 rounded animate-pulse"
//                         ></div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>

//                 <div className="lg:col-span-3">
//                   <div className="bg-white rounded-xl shadow-sm p-6">
//                     <div className="space-y-4">
//                       <div className="h-6 bg-gray-200 rounded animate-pulse w-48"></div>
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         {[...Array(4)].map((_, i) => (
//                           <div key={i} className="space-y-2">
//                             <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
//                             <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Success/Error Toast Notifications */}
//       <div className="fixed bottom-4 right-4 z-50">
//         {/* These would be conditionally rendered based on actions */}
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;




"use client";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  User,
  MapPin,
  Phone,
  Mail,
  Package,
  Gift,
  LogOut,
  Edit3,
  Save,
  X,
  ShoppingBag,
  Users,
  BarChart3,
  Plus,
  CheckCircle,
  Clock,
  AlertCircle,
  Trash2,
  Edit,
  Copy,
  Check,
  Crown,
  Shield,
} from "lucide-react";
import Link from "next/link";

// Utility functions for discount formatting
function formatDiscountValue(discount) {
  if (!discount) return "Special Offer";
  switch (discount.type) {
    case "flat":
      return `₹${discount.value || 0}`;
    case "percentage":
      return `${discount.value || 0}%`;
    case "free_shipping":
      return "Free Shipping";
    case "free_gift":
      return "Free Gift";
    case "bogo":
      return `Buy ${discount.buyQuantity || 1} Get ${
        discount.getQuantity || 1
      }`;
    case "bundle":
      return `${discount.value || 0}% off`;
    case "referral":
      return `₹${discount.value || 0}`;
    case "first_time":
      return discount.type === "flat"
        ? `₹${discount.value || 0}`
        : `${discount.value || 0}%`;
    default:
      return "Special Offer";
  }
}

function getDiscountTypeIcon(type) {
  switch (type) {
    case "flat":
    case "percentage":
    case "bogo":
    case "free_gift":
    case "referral":
    case "first_time":
      return Gift;
    case "free_shipping":
      return Truck;
    case "bundle":
      return ShoppingBag;
    default:
      return Gift;
  }
}

function getDiscountDescription(discount) {
  if (!discount) return "Special discount";
  const typeDescriptions = {
    flat: "Fixed amount off",
    percentage: "Percentage off total",
    bundle: "Buy multiple items together",
    bogo: "Buy X get Y free",
    free_gift: "Free gift with purchase",
    free_shipping: "Free delivery",
    referral: "Referral reward",
    first_time: "First purchase discount",
  };
  const baseDesc = typeDescriptions[discount.type] || "Special discount";
  if (discount.minCartValue && discount.minCartValue > 0) {
    return `${baseDesc} • Min order ₹${discount.minCartValue}`;
  }
  return baseDesc;
}

const ProfilePage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [coupons, setCoupons] = useState([]);
  const [loadingCoupons, setLoadingCoupons] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  // User profile state
  const [userProfile, setUserProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    joinDate: "",
  });

  // Address management states
  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null); // ID of the address being edited, null for viewing, "" for adding new
  const [newAddressFormData, setNewAddressFormData] = useState({
    fullName: "",
    mobileNumber: "",
    email: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    isDefault: false,
  });
  const [addressErrors, setAddressErrors] = useState({});

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const fetchUserCoupons = async (userId) => {
      setLoadingCoupons(true);
      try {
        const [availableRes, usedRes] = await Promise.all([
          fetch(`${API_URL}/api/discounts/available/${userId}`),
          fetch(`${API_URL}/api/discounts/used/${userId}`),
        ]);
        const availableCoupons = availableRes.ok
          ? await availableRes.json()
          : [];
        const usedCoupons = usedRes.ok ? await usedRes.json() : [];
        const allCoupons = [
          ...availableCoupons.map((coupon) => ({ ...coupon, used: false })),
          ...usedCoupons.map((coupon) => ({ ...coupon, used: true })),
        ].sort((a, b) => {
          if (a.used !== b.used) return a.used - b.used;
          if (a.expiryDate && b.expiryDate) {
            return new Date(a.expiryDate) - new Date(b.expiryDate);
          }
          return 0;
        });
        setCoupons(allCoupons);
      } catch (error) {
        console.error("Error fetching coupons:", error);
        try {
          const fallbackRes = await fetch(`${API_URL}/api/discounts`);
          if (fallbackRes.ok) {
            const allDiscounts = await fallbackRes.json();
            const fallbackCoupons = allDiscounts.map((coupon) => ({
              ...coupon,
              used: false,
              canUse: true,
            }));
            setCoupons(fallbackCoupons);
          } else {
            setCoupons([]);
          }
        } catch (fallbackError) {
          console.error("Fallback fetch also failed:", fallbackError);
          setCoupons([]);
        }
      } finally {
        setLoadingCoupons(false);
      }
    };

    if (status !== "loading") {
      setLoading(false);
      if (session?.user) {
        setUserProfile((prev) => ({
          ...prev,
          name: session.user.name || "",
          email: session.user.email || "",
        }));
        const userId = session.user.id || session.user._id || "guest";
        if (userId && userId !== "guest") {
          fetchUserCoupons(userId);
        } else {
          fetchUserCoupons("guest");
        }
      }
    }
  }, [session, status, API_URL]);

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!session?.user?.id) return;
      setLoadingAddresses(true);
      try {
        const response = await fetch(
          `${API_URL}/api/addresses?userId=${session.user.id}`
        );
        const data = await response.json();
        if (data.success) {
          setAddresses(data.addresses);
        } else {
          console.error("Failed to fetch addresses:", data.message);
          setAddresses([]);
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
        setAddresses([]);
      } finally {
        setLoadingAddresses(false);
      }
    };
    if (activeTab === "addresses" && session?.user?.id) {
      fetchAddresses();
    }
  }, [activeTab, session, API_URL]);

  useEffect(() => {
    if (status !== "loading" && !session) {
      router.push("/Login");
    }
  }, [session, status, router]);

  // Functions for address management
  const handleAddressInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewAddressFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (addressErrors[name]) {
      setAddressErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateAddressForm = () => {
    const errors = {};
    if (!newAddressFormData.fullName)
      errors.fullName = "Full name is required.";
    if (
      !newAddressFormData.mobileNumber ||
      !/^[0-9]{10}$/.test(newAddressFormData.mobileNumber)
    ) {
      errors.mobileNumber = "Valid 10-digit mobile number is required.";
    }
    if (!newAddressFormData.addressLine1)
      errors.addressLine1 = "Street address is required.";
    if (!newAddressFormData.city) errors.city = "City is required.";
    if (!newAddressFormData.state) errors.state = "State is required.";
    if (
      !newAddressFormData.pincode ||
      !/^[0-9]{6}$/.test(newAddressFormData.pincode)
    ) {
      errors.pincode = "Valid 6-digit pincode is required.";
    }
    setAddressErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const saveAddress = async () => {
    if (!validateAddressForm()) return;
    const method = editingAddress === "" ? "POST" : "PUT";
    const url =
      editingAddress === ""
        ? `${API_URL}/api/addresses`
        : `${API_URL}/api/addresses/${editingAddress}`;
    const payload = {
      ...newAddressFormData,
      userId: session.user.id,
    };
    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (data.success) {
        if (editingAddress) {
          setAddresses(
            addresses.map((addr) =>
              addr._id === editingAddress ? data.address : addr
            )
          );
        } else {
          setAddresses([...addresses, data.address]);
        }
        setEditingAddress(null);
        setNewAddressFormData({
          fullName: "",
          mobileNumber: "",
          email: "",
          addressLine1: "",
          addressLine2: "",
          city: "",
          state: "",
          pincode: "",
          isDefault: false,
        });
      } else {
        console.error("Failed to save address:", data.message);
        alert("Failed to save address. Please try again.");
      }
    } catch (error) {
      console.error("Error saving address:", error);
      alert("Error saving address. Please try again.");
    }
  };

  const deleteAddress = async (addressId) => {
    if (!window.confirm("Are you sure you want to delete this address?"))
      return;
    try {
      const response = await fetch(`${API_URL}/api/addresses/${addressId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        setAddresses(addresses.filter((addr) => addr._id !== addressId));
      } else {
        console.error("Failed to delete address:", data.message);
        alert("Failed to delete address. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting address:", error);
      alert("Error deleting address. Please try again.");
    }
  };

  const handleAddAddressClick = () => {
    setEditingAddress(""); // Use an empty string to indicate adding a new address
    setNewAddressFormData({
      fullName: "",
      mobileNumber: "",
      email: session?.user?.email || "", // Pre-fill email
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      pincode: "",
      isDefault: false,
    });
  };

  const handleEditAddressClick = (address) => {
    setEditingAddress(address._id);
    setNewAddressFormData(address);
  };

  const handleCancelAddressEdit = () => {
    setEditingAddress(null);
    setNewAddressFormData({
      fullName: "",
      mobileNumber: "",
      email: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      pincode: "",
      isDefault: false,
    });
  };

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
  };

  const handleCopyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
      const textArea = document.createElement("textarea");
      textArea.value = code;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "text-green-600 bg-green-100";
      case "shipped":
        return "text-blue-600 bg-blue-100";
      case "processing":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="w-4 h-4" />;
      case "shipped":
        return <Truck className="w-4 h-4" />;
      case "processing":
        return <Clock className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-green-400 rounded-full animate-ping"></div>
          </div>
          <div className="text-center">
            <p className="text-gray-600 font-medium">Loading your profile...</p>
            <div className="flex space-x-1 mt-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading || status === "loading") {
    return (
      <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-6">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-r-green-400 rounded-full animate-ping"></div>
          </div>
          <div className="text-center">
            <p className="text-gray-700 font-semibold text-lg">
              Loading Profile Data...
            </p>
            <div className="flex space-x-1 mt-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const isAdmin = session?.user?.isAdmin;

  const userTabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "orders", label: "My Orders", icon: Package },
    { id: "addresses", label: "Addresses", icon: MapPin },
    { id: "coupons", label: "Coupons", icon: Gift },
  ];

  const adminTabs = [{ id: "profile", label: "Admin Profile", icon: Shield }];

  const tabs = isAdmin ? adminTabs : userTabs;

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt="Profile"
                    width={80}
                    height={80}
                    className="w-20 h-20 rounded-full border-4 border-green-100"
                    priority
                  />
                ) : (
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-green-600" />
                  </div>
                )}
                {isAdmin && (
                  <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1">
                    <Crown className="w-4 h-4 text-yellow-800" />
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-black flex items-center gap-2">
                  {session.user.name}
                  {isAdmin && (
                    <span className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-medium">
                      Admin
                    </span>
                  )}
                </h1>
                <p className="text-black">{session.user.email}</p>
                <p className="text-sm text-black">
                  {isAdmin
                    ? "Administrator Account"
                    : `Member since ${userProfile.joinDate}`}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout  
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  if (tab.id === "orders" && !isAdmin) {
                    return (
                      <Link
                        key={tab.id}
                        href="/orders"
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                          activeTab === tab.id
                            ? "bg-green-50 text-green-600 border-r-2 border-green-600"
                            : "text-black hover:bg-gray-50"
                        }`}
                        onClick={() => setActiveTab(tab.id)}
                      >
                        <Icon className="w-5 h-5" />
                        {tab.label}
                      </Link>
                    );
                  }
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? "bg-green-50 text-green-600 border-r-2 border-green-600"
                          : "text-black hover:bg-gray-50"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm p-6">
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-black">
                      {isAdmin ? "Admin Profile" : "Personal Information"}
                    </h2>
                    {!isAdmin && (
                      <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="flex items-center gap-2 px-4 py-2 text-green-600 border border-green-600 rounded-lg hover:bg-green-50 transition-colors"
                      >
                        {isEditing ? (
                          <X className="w-4 h-4" />
                        ) : (
                          <Edit3 className="w-4 h-4" />
                        )}
                        {isEditing ? "Cancel" : "Edit"}
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">
                          Full Name
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={userProfile.name}
                            onChange={(e) =>
                              setUserProfile({
                                ...userProfile,
                                name: e.target.value,
                              })
                            }
                            className="w-full text-gray-400 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          />
                        ) : (
                          <p className="px-4 py-2 text-black bg-gray-50 rounded-lg">
                            {userProfile.name}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">
                          Email Address
                        </label>
                        <p className="px-4 py-2 bg-gray-50 rounded-lg text-black">
                          {userProfile.email}
                        </p>
                      </div>
                    </div>
                    {/* <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">
                          Phone Number
                        </label>
                        {isEditing ? (
                          <input
                            type="tel"
                            value={userProfile.phone}
                            onChange={(e) =>
                              setUserProfile({
                                ...userProfile,
                                phone: e.target.value,
                              })
                            }
                            className="w-full px-4 py-2 border border-gray-300 text-gray-400 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          />
                        ) : (
                          <p className="px-4 py-2 text-black bg-gray-50 rounded-lg">
                            {userProfile.phone}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">
                          Address
                        </label>
                        {isEditing ? (
                          <textarea
                            value={userProfile.address}
                            onChange={(e) =>
                              setUserProfile({
                                ...userProfile,
                                address: e.target.value,
                              })
                            }
                            rows={3}
                            className="w-full px-4 py-2 border text-gray-400 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          />
                        ) : (
                          <p className="px-4 py-2 bg-gray-50 text-black rounded-lg">
                            {userProfile.address}
                          </p>
                        )}
                      </div>
                    </div> */}
                  </div>
                  {isEditing && (
                    <div className="flex justify-end">
                      <button
                        onClick={handleSaveProfile}
                        className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Save className="w-4 h-4" />
                        Save Changes
                      </button>
                    </div>
                  )}
                  {isAdmin && (
                    <div className="mt-8 pt-6 border-t border-gray-200">
                      <h3 className="text-lg font-semibold text-black mb-4">
                        Quick Actions
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Link
                          href="/admin/products"
                          className="p-4 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-center"
                        >
                          <ShoppingBag className="w-6 h-6 mx-auto mb-2" />
                          <span className="text-sm font-medium">
                            Manage Products
                          </span>
                        </Link>
                        <Link
                          href="/admin/orders"
                          className="p-4 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors text-center"
                        >
                          <Users className="w-6 h-6 mx-auto mb-2" />
                          <span className="text-sm font-medium">
                            Manage Users
                          </span>
                        </Link>
                        <Link
                          href="/admin/dashboard"
                          className="p-4 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors text-center"
                        >
                          <BarChart3 className="w-6 h-6 mx-auto mb-2" />
                          <span className="text-sm font-medium">Analytics</span>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Addresses Tab */}
              {activeTab === "addresses" && !isAdmin && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-black">
                      Saved Addresses
                    </h2>
                    <button
                      onClick={handleAddAddressClick}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add New Address
                    </button>
                  </div>

                  {loadingAddresses ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500">Loading addresses...</p>
                    </div>
                  ) : addresses.length === 0 && editingAddress === null ? (
                    <div className="text-center py-12">
                      <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No Addresses Found
                      </h3>
                      <p className="text-gray-500">
                        Add your first address to save it for future orders.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {addresses.map((address) => (
                        <div
                          key={address._id}
                          className="border border-gray-200 rounded-lg p-4"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-black">
                              {address.fullName}
                            </h3>
                            <div className="flex items-center gap-2">
                              {address.isDefault && (
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                  Default
                                </span>
                              )}
                              <button
                                onClick={() => handleEditAddressClick(address)}
                                className="p-1 text-gray-400 hover:text-gray-600"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deleteAddress(address._id)}
                                className="p-1 text-gray-400 hover:text-red-600"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <p className="text-black text-sm">
                            {address.addressLine1},{" "}
                            {address.addressLine2 &&
                              `${address.addressLine2}, `}
                            {address.city}, {address.state} - {address.pincode}
                          </p>
                          <p className="text-black text-sm mt-1">
                            <Phone className="inline w-3 h-3 mr-1" />
                            {address.mobileNumber}
                          </p>
                          <p className="text-black text-sm">
                            <Mail className="inline w-3 h-3 mr-1" />
                            {address.email}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* New/Edit Address Form Modal/Section */}
                  {editingAddress !== null && (
                    <div className="bg-gray-50 p-6 mt-6 rounded-lg border border-gray-200">
                      <h3 className="text-lg font-semibold text-black mb-4">
                        {editingAddress === ""
                          ? "Add New Address"
                          : "Edit Address"}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Full Name */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Full Name
                          </label>
                          <input
                            type="text"
                            name="fullName"
                            value={newAddressFormData.fullName}
                            onChange={handleAddressInputChange}
                            className={`text-black w-full px-3 py-2 mt-1 border rounded-md ${
                              addressErrors.fullName
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                          />
                          {addressErrors.fullName && (
                            <p className="text-red-500 text-xs mt-1">
                              {addressErrors.fullName}
                            </p>
                          )}
                        </div>
                        {/* Mobile Number */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Mobile Number
                          </label>
                          <input
                            type="tel"
                            name="mobileNumber"
                            value={newAddressFormData.mobileNumber}
                            onChange={handleAddressInputChange}
                            className={`w-full px-3 py-2 mt-1 border rounded-md text-black ${
                              addressErrors.mobileNumber
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                          />
                          {addressErrors.mobileNumber && (
                            <p className="text-red-500 text-xs mt-1">
                              {addressErrors.mobileNumber}
                            </p>
                          )}
                        </div>
                        {/* Email (Disabled) */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Email
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={newAddressFormData.email}
                            disabled={true}
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md bg-gray-200 text-gray-500 cursor-not-allowed"
                          />
                        </div>
                        {/* Address Line 1 */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Address Line 1
                          </label>
                          <input
                            type="text"
                            name="addressLine1"
                            value={newAddressFormData.addressLine1}
                            onChange={handleAddressInputChange}
                            className={`text-black w-full px-3 py-2 mt-1 border rounded-md ${
                              addressErrors.addressLine1
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                          />
                          {addressErrors.addressLine1 && (
                            <p className="text-red-500 text-xs mt-1">
                              {addressErrors.addressLine1}
                            </p>
                          )}
                        </div>
                        {/* Address Line 2 */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Address Line 2 (Optional)
                          </label>
                          <input
                            type="text"
                            name="addressLine2"
                            value={newAddressFormData.addressLine2}
                            onChange={handleAddressInputChange}
                            className="text-black w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
                          />
                        </div>
                        {/* City */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            City
                          </label>
                          <input
                            type="text"
                            name="city"
                            value={newAddressFormData.city}
                            onChange={handleAddressInputChange}
                            className={`w-full px-3 py-2 mt-1 border rounded-md text-black ${
                              addressErrors.city
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                          />
                          {addressErrors.city && (
                            <p className="text-red-500 text-xs mt-1">
                              {addressErrors.city}
                            </p>
                          )}
                        </div>
                        {/* State */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            State
                          </label>
                          <input
                            type="text"
                            name="state"
                            value={newAddressFormData.state}
                            onChange={handleAddressInputChange}
                            className={`w-full px-3 py-2 mt-1 border rounded-md text-black ${
                              addressErrors.state
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                          />
                          {addressErrors.state && (
                            <p className="text-red-500 text-xs mt-1">
                              {addressErrors.state}
                            </p>
                          )}
                        </div>
                        {/* Pincode */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Pincode
                          </label>
                          <input
                            type="text"
                            name="pincode"
                            value={newAddressFormData.pincode}
                            onChange={handleAddressInputChange}
                            className={`w-full px-3 py-2 mt-1 border rounded-md text-black${
                              addressErrors.pincode
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                          />
                          {addressErrors.pincode && (
                            <p className="text-red-500 text-xs mt-1">
                              {addressErrors.pincode}
                            </p>
                          )}
                        </div>
                        {/* Is Default Checkbox */}
                        <div className="md:col-span-2">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              name="isDefault"
                              id="isDefault"
                              checked={newAddressFormData.isDefault}
                              onChange={handleAddressInputChange}
                              className="h-4 w-4 text-green-600 border-gray-300 rounded"
                            />
                            <label
                              htmlFor="isDefault"
                              className="ml-2 block text-sm text-gray-900"
                            >
                              Set as default address
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 mt-4">
                        <button
                          onClick={handleCancelAddressEdit}
                          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={saveAddress}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                          <Save className="w-4 h-4 inline-block mr-2" />
                          Save Address
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Coupons Tab */}
              {activeTab === "coupons" && !isAdmin && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-black">
                      My Coupons & Rewards
                    </h2>
                    {loadingCoupons && (
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                    )}
                  </div>
                  {loadingCoupons ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="border rounded-lg p-4 animate-pulse"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="bg-gray-200 p-3 rounded-lg w-12 h-12"></div>
                              <div>
                                <div className="h-5 bg-gray-200 rounded w-24 mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-48"></div>
                              </div>
                            </div>
                            <div className="h-8 bg-gray-200 rounded w-20"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : coupons.length === 0 ? (
                    <div className="text-center py-12">
                      <Gift className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No Coupons Available
                      </h3>
                      <p className="text-gray-500">
                        Check back later for exciting offers and discounts!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {coupons.map((coupon) => {
                        const IconComponent = getDiscountTypeIcon(coupon.type);
                        const isExpired =
                          coupon.expiryDate &&
                          new Date(coupon.expiryDate) < new Date();
                        const canUse = !coupon.used && !isExpired;
                        return (
                          <div
                            key={coupon._id}
                            className={`border rounded-lg p-4 transition-all ${
                              coupon.used || isExpired
                                ? "bg-gray-50 border-gray-200 opacity-75"
                                : "border-green-200 bg-green-50 hover:bg-green-100"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div
                                  className={`p-3 rounded-lg ${
                                    coupon.used || isExpired
                                      ? "bg-gray-200"
                                      : "bg-white"
                                  }`}
                                >
                                  <IconComponent
                                    className={`w-6 h-6 ${
                                      coupon.used || isExpired
                                        ? "text-gray-400"
                                        : "text-green-600"
                                    }`}
                                  />
                                </div>
                                <div>
                                  <h3
                                    className={`font-semibold flex items-center gap-2 ${
                                      coupon.used || isExpired
                                        ? "text-gray-500"
                                        : "text-gray-900"
                                    }`}
                                  >
                                    {coupon.code}
                                    {isExpired && (
                                      <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                                        Expired
                                      </span>
                                    )}
                                    {coupon.used && (
                                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                        Used
                                      </span>
                                    )}
                                  </h3>
                                  <p
                                    className={`text-sm ${
                                      coupon.used || isExpired
                                        ? "text-gray-400"
                                        : "text-gray-600"
                                    }`}
                                  >
                                    {getDiscountDescription(coupon)} • Get{" "}
                                    {formatDiscountValue(coupon)} off
                                    {coupon.expiryDate && (
                                      <>
                                        {" "}
                                        • Expires{" "}
                                        {new Date(
                                          coupon.expiryDate
                                        ).toLocaleDateString()}
                                      </>
                                    )}
                                  </p>
                                  {coupon.used && coupon.usedAt && (
                                    <p className="text-xs text-gray-400 mt-1">
                                      Used on{" "}
                                      {new Date(
                                        coupon.usedAt
                                      ).toLocaleDateString()}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {coupon.used ? (
                                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium">
                                    <CheckCircle className="w-4 h-4" />
                                    Used
                                  </div>
                                ) : isExpired ? (
                                  <span className="text-xs bg-red-100 text-red-600 px-3 py-1 rounded-full">
                                    Expired
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => handleCopyCode(coupon.code)}
                                    disabled={!canUse}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                      copiedCode === coupon.code
                                        ? "bg-green-600 text-white"
                                        : canUse
                                        ? "bg-white text-green-600 border border-green-600 hover:bg-green-50"
                                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    }`}
                                  >
                                    {copiedCode === coupon.code ? (
                                      <>
                                        <Check className="w-4 h-4" />
                                        Copied!
                                      </>
                                    ) : (
                                      <>
                                        <Copy className="w-4 h-4" />
                                        Copy Code
                                      </>
                                    )}
                                  </button>
                                )}
                              </div>
                            </div>
                            {canUse && coupon.minCartValue > 0 && (
                              <div className="mt-3 pt-3 border-t border-green-200">
                                <p className="text-sm text-green-700">
                                  <ShoppingBag className="w-4 h-4 inline mr-1" />
                                  Minimum order value: ₹{coupon.minCartValue}
                                </p>
                              </div>
                            )}
                            {canUse &&
                              coupon.maxDiscountValue &&
                              coupon.type === "percentage" && (
                                <div className="mt-3 pt-3 border-t border-green-200">
                                  <p className="text-sm text-green-700">
                                    Maximum discount: ₹{coupon.maxDiscountValue}
                                  </p>
                                </div>
                              )}
                            {coupon.description && (
                              <div className="mt-3 pt-3 border-t border-gray-200">
                                <p className="text-sm text-gray-600">
                                  {coupon.description}
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {!loadingCoupons && coupons.length > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-blue-900 mb-2">
                            How to use your coupons:
                          </h4>
                          <ul className="text-sm text-blue-800 space-y-1">
                            <li>
                              • Copy the coupon code and apply it during
                              checkout
                            </li>
                            <li>
                              • Each coupon can only be used once per account
                            </li>
                            <li>
                              • Check minimum order requirements before applying
                            </li>
                            <li>
                              • Coupons cannot be combined with other offers
                            </li>
                            <li>
                              • Used coupons will be marked and cannot be reused
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {loading && (
        <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-6">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-r-green-400 rounded-full animate-ping"></div>
            </div>
            <div className="text-center">
              <p className="text-gray-700 font-semibold text-lg">
                Loading Profile Data...
              </p>
              <div className="flex space-x-1 mt-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
            <div className="max-w-4xl mx-auto px-4 w-full">
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6 opacity-50">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-5 bg-gray-200 rounded animate-pulse w-40"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-56"></div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 opacity-30">
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-xl shadow-sm p-4">
                    <div className="space-y-2">
                      {[...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          className="h-10 bg-gray-200 rounded animate-pulse"
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-3">
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="space-y-4">
                      <div className="h-6 bg-gray-200 rounded animate-pulse w-48"></div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[...Array(4)].map((_, i) => (
                          <div key={i} className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="fixed bottom-4 right-4 z-50"></div>
    </div>
  );
};

export default ProfilePage;
