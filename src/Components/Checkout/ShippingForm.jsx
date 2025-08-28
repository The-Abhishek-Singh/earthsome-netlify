"use client";
import React, { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";

// Function to load Razorpay script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

const saveGuestOrderId = (orderId) => {
  try {
    const guestOrderIds =
      JSON.parse(localStorage.getItem("guestOrderIds")) || [];
    if (!guestOrderIds.includes(orderId)) {
      guestOrderIds.push(orderId);
      localStorage.setItem("guestOrderIds", JSON.stringify(guestOrderIds));
    }
  } catch (storageError) {
    console.error(
      "Could not save guest order ID to localStorage",
      storageError
    );
  }
};

const ShippingForm = () => {
  const router = useRouter();
  const { cartItems, clearCart } = useCart();
  const { data: session } = useSession(); // Add session detection
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);

  // New states for addresses
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  const [showAddressForm, setShowAddressForm] = useState(true); // Control form vs address list

  useEffect(() => {
    loadRazorpayScript().then((loaded) => {
      setIsRazorpayLoaded(loaded);
    });
  }, []);

  // Fetch saved addresses if the user is authenticated
  useEffect(() => {
    const fetchAddresses = async () => {
      if (!session?.user?.id) {
        setIsLoadingAddresses(false);
        setShowAddressForm(true); // Always show form for guests
        return;
      }

      setIsLoadingAddresses(true);
      try {
        const API_URL =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const response = await fetch(
          `${API_URL}/api/addresses?userId=${session.user.id}`
        );
        const data = await response.json();
        if (data.success && data.addresses.length > 0) {
          setSavedAddresses(data.addresses);
          const defaultAddress = data.addresses.find((addr) => addr.isDefault);
          if (defaultAddress) {
            setSelectedAddressId(defaultAddress._id);
            setFormData(defaultAddress);
            setShowAddressForm(false); // Hide the form as a default address is selected
          } else {
            setShowAddressForm(false); // Show saved addresses list
          }
        } else {
          // No saved addresses, show the form
          setShowAddressForm(true);
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
        // On error, just show the form
        setShowAddressForm(true);
      } finally {
        setIsLoadingAddresses(false);
      }
    };

    fetchAddresses();
  }, [session]);

  useEffect(() => {
    const checkoutData = localStorage.getItem("checkoutData");
    if (checkoutData) {
      try {
        const data = JSON.parse(checkoutData);
        if (data.appliedCoupon) {
          if (!session || !session.user) {
            console.warn(
              "Coupon found but user not authenticated - clearing coupon data"
            );
            const updatedData = { ...data };
            delete updatedData.appliedCoupon;
            delete updatedData.couponDiscount;
            delete updatedData.sessionSignature;
            updatedData.total =
              data.originalTotal || data.total + (data.couponDiscount || 0);
            localStorage.setItem("checkoutData", JSON.stringify(updatedData));
            return;
          }
          const currentUserId = session.user.id || session.user._id;
          const currentUserEmail = session.user.email;
          if (data.sessionSignature) {
            if (
              data.sessionSignature.userId !== currentUserId ||
              data.sessionSignature.userEmail !== currentUserEmail
            ) {
              console.warn("Session signature mismatch - clearing coupon data");
              const updatedData = { ...data };
              delete updatedData.appliedCoupon;
              delete updatedData.couponDiscount;
              delete updatedData.sessionSignature;
              updatedData.total =
                data.originalTotal || data.total + (data.couponDiscount || 0);
              localStorage.setItem("checkoutData", JSON.stringify(updatedData));
              return;
            }
          } else if (data.appliedCoupon.userId !== currentUserId) {
            console.warn("Coupon user ID mismatch - clearing coupon data");
            const updatedData = { ...data };
            delete updatedData.appliedCoupon;
            delete updatedData.couponDiscount;
            updatedData.total =
              data.originalTotal || data.total + (data.couponDiscount || 0);
            localStorage.setItem("checkoutData", JSON.stringify(updatedData));
            return;
          }
          setAppliedCoupon(data.appliedCoupon);
          setCouponDiscount(data.couponDiscount || 0);
        }
      } catch (error) {
        console.error("Error loading checkout data:", error);
        localStorage.removeItem("checkoutData");
      }
    }
  }, [session]);

  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: "",
    email: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    isDefault: false, // Add this field for new addresses
  });
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponDiscount, setCouponDiscount] = useState(0);

  const getOrderTotal = () => {
    const checkoutData = localStorage.getItem("checkoutData");
    if (checkoutData) {
      try {
        const data = JSON.parse(checkoutData);
        return (
          data.total ||
          cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0) -
            couponDiscount
        );
      } catch (error) {
        console.error("Error getting checkout total:", error);
      }
    }
    return (
      cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0) -
      couponDiscount
    );
  };

  const verifyCouponAvailability = async (couponCode, userId) => {
    if (!couponCode || !userId) return false;
    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      console.log("Verifying coupon availability:", { couponCode, userId });
      const usedCouponsResponse = await fetch(
        `${API_URL}/api/discounts/used/${userId}`
      );
      if (usedCouponsResponse.ok) {
        const usedCoupons = await usedCouponsResponse.json();
        const hasUsedCoupon = usedCoupons.some(
          (used) => used.code === couponCode
        );
        if (hasUsedCoupon) {
          console.log("Coupon has already been used by this user");
          return false;
        }
        console.log("Coupon is still available for use");
        return true;
      } else {
        console.log("Failed to verify coupon availability");
        return false;
      }
    } catch (error) {
      console.error("Error verifying coupon availability:", error);
      return false;
    }
  };

  const markCouponAsUsed = async (couponCode, userId) => {
    if (!couponCode || !userId) {
      console.log("Missing coupon code or user ID for marking as used:", {
        couponCode,
        userId,
      });
      return;
    }
    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      console.log("Marking coupon as used:", { couponCode, userId });
      const response = await fetch(`${API_URL}/api/discounts/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId,
          couponCode: couponCode,
          orderValue: cartItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          ),
        }),
      });
      if (response.ok) {
        console.log("Coupon marked as used successfully");
        const result = await response.json();
        console.log("Backend response:", result);
      } else {
        console.error(
          "Failed to mark coupon as used, status:",
          response.status
        );
        const errorData = await response.json().catch(() => ({}));
        console.error("Error details:", errorData);
      }
    } catch (error) {
      console.error("Error marking coupon as used:", error);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = "Mobile number is required";
    } else if (!/^[0-9]{10}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = "Please enter a valid 10-digit mobile number";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.addressLine1.trim())
      newErrors.addressLine1 = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.pincode.trim()) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^[0-9]{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Please enter a valid 6-digit pincode";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleAddressSelection = (address) => {
    setSelectedAddressId(address._id);
    setFormData(address);
  };

  const initRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (orderId, amount) => {
    try {
      setIsProcessingPayment(true);
      console.log(
        "Initializing payment for order:",
        orderId,
        "amount:",
        amount
      );
      const res = await initRazorpay();
      if (!res) {
        throw new Error("Razorpay SDK failed to load");
      }
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      if (!API_URL) {
        throw new Error("API URL is not configured");
      }
      const orderData = {
        amount: Math.round(amount * 100),
        currency: "INR",
        receipt: orderId,
      };
      console.log("Creating Razorpay order with data:", orderData);
      const response = await fetch(`${API_URL}/api/payment/create-order`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(orderData),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `Payment creation failed with status ${response.status}`
        );
      }
      const data = await response.json();
      console.log("Razorpay create order response:", data);
      if (!data || !data.id) {
        throw new Error("Invalid response from payment server");
      }
      const razorpayOrderId = data.id;
      return new Promise((resolve, reject) => {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: Math.round(amount * 100),
          currency: "INR",
          name: "Earthsome",
          description:
            "Pay securely by Credit or Debit card or Internet Banking through Razorpay",
          order_id: razorpayOrderId,
          prefill: {
            name: formData.fullName,
            email: formData.email,
            contact: formData.mobileNumber,
          },
          retry: {
            enabled: true,
            max_count: 3,
          },
          notes: {
            orderId: orderId,
            shipping_address: JSON.stringify({
              address: formData.addressLine1,
              city: formData.city,
              state: formData.state,
              pincode: formData.pincode,
            }),
          },
          theme: {
            color: "#27ae60",
          },
          handler: async function (response) {
            try {
              console.log("Payment successful, verifying...");
              const result = await fetch(
                `${API_URL}/api/payment/verify-payment`,
                {
                  method: "POST",
                  credentials: "include",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                    orderId: orderId,
                  }),
                }
              );
              const verification = await result.json();
              if (verification.success) {
                console.log("Payment verified successfully");
                await fetch(`${API_URL}/api/orders/${orderId}/status`, {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    paymentStatus: "paid",
                    paymentId: response.razorpay_payment_id,
                  }),
                });
                if (appliedCoupon && session?.user) {
                  const userId = session.user.id || session.user._id;
                  const isStillAvailable = await verifyCouponAvailability(
                    appliedCoupon.code,
                    userId
                  );
                  if (isStillAvailable) {
                    await markCouponAsUsed(appliedCoupon.code, userId);
                  } else {
                    console.log(
                      "Coupon was already used by another process, skipping marking as used"
                    );
                  }
                }
                const isGuest = !session || !session.user;
                if (isGuest) {
                  saveGuestOrderId(orderId);
                }
                localStorage.removeItem("checkoutData");
                clearCart();
                router.push(`/thank-you?orderId=${orderId}`);
                resolve(true);
              } else {
                throw new Error(
                  verification.message || "Payment verification failed"
                );
              }
            } catch (err) {
              console.error("Payment verification error:", err);
              alert(
                "Payment verification failed. Please contact support if amount is deducted."
              );
              reject(err);
            }
          },
          modal: {
            ondismiss: function () {
              setIsProcessingPayment(false);
              reject(new Error("Payment cancelled"));
            },
          },
        };
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      });
    } catch (error) {
      console.error("Error initiating payment:", error);
      setIsProcessingPayment(false);
      throw error;
    }
  };

  const placeOrder = async (orderData) => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    try {
      console.log("🛒 Placing order with data:", orderData);
      if (!orderData.cartItems || orderData.cartItems.length === 0) {
        throw new Error("Cart items are required");
      }
      if (
        !orderData.addressId &&
        (!orderData.userInfo || !orderData.userInfo.fullName)
      ) {
        throw new Error("Either addressId or user information is required");
      }
      const isGuestOrder = !session || !session.user;
      const sessionUserData = session?.user
        ? {
            id: session.user.id,
            email: session.user.email,
            name: session.user.name,
            image: session.user.image,
          }
        : null;

      let guestId = null;
      if (isGuestOrder) {
        guestId = localStorage.getItem("guestId");
        if (!guestId) {
          guestId = uuidv4();
          localStorage.setItem("guestId", guestId);
        }
      }

      const payload = {
        ...orderData,
        totalAmount: orderData.total,
        isGuestOrder,
        guestId,
        sessionUserData,
      };

      const response = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to create order");
      }
      console.log("✅ Order created successfully:", data);
      return data.order;
    } catch (error) {
      console.error("Error placing order:", error);
      throw new Error(
        error.message || "Failed to create order. Please try again."
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let orderAddress = null;
    const isGuestOrder = !session || !session.user;

    if (!isGuestOrder) {
      if (selectedAddressId) {
        orderAddress = { addressId: selectedAddressId };
      } else if (showAddressForm) {
        if (!validateForm()) return;
        orderAddress = { userInfo: formData };
      }
    } else {
      if (!validateForm()) return;
      orderAddress = { userInfo: formData };
    }

    if (!orderAddress) {
      alert("Please select or enter a delivery address.");
      return;
    }

    if (paymentMethod === "ONLINE" && !isRazorpayLoaded) {
      alert("Payment system is loading. Please try again in a moment.");
      return;
    }

    setIsSubmitting(true);
    try {
      const finalTotal = getOrderTotal();
      const originalTotal = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      const sessionUserData = session?.user
        ? {
            id: session.user.id,
            email: session.user.email,
            name: session.user.name,
            image: session.user.image,
            isAuthenticated: true,
          }
        : null;

      if (appliedCoupon && isGuestOrder) {
        throw new Error(
          "Authentication required to use coupon codes. Please login and try again."
        );
      }

      const orderPayload = {
        cartItems: cartItems.map((item) => ({
          _id: item._id,
          quantity: item.quantity,
          price: item.price,
          name: item.productName,
        })),
        ...orderAddress,
        total: finalTotal,
        originalTotal: originalTotal,
        paymentMethod,
        paymentStatus: "pending",
        isGuestOrder,
        isAuthenticatedUser: !isGuestOrder,
        sessionUserData,
        appliedCoupon: appliedCoupon
          ? {
              code: appliedCoupon.code,
              discount: couponDiscount,
              type: appliedCoupon.type,
              _id: appliedCoupon._id,
            }
          : null,
      };

      const order = await placeOrder(orderPayload);
      if (orderPayload.isGuestOrder) {
        saveGuestOrderId(order._id);
      }

      if (paymentMethod === "ONLINE") {
        try {
          await handlePayment(order._id, finalTotal);
        } catch (error) {
          await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${order._id}/status`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ paymentStatus: "failed" }),
            }
          );
          alert(error.message || "Payment failed. Please try again.");
        }
      } else {
        if (appliedCoupon && session?.user) {
          const userId = session.user.id || session.user._id;
          const isStillAvailable = await verifyCouponAvailability(
            appliedCoupon.code,
            userId
          );
          if (isStillAvailable) {
            await markCouponAsUsed(appliedCoupon.code, userId);
          } else {
            console.log(
              "Coupon was already used by another process, skipping marking as used"
            );
          }
        }
        localStorage.removeItem("checkoutData");
        clearCart();
        router.push(`/thank-you?orderId=${order._id}`);
      }
    } catch (error) {
      console.error("Order processing error:", error);
      alert(error.message || "Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-10">
            <Image
            src="/logo.png"
            alt="Earthsome Logo"
            width={120}
            height={50}
            className="w-50 p-0"
            priority
          />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Shipping Details
          </h1>
          <p className="text-gray-600">
            Please provide your delivery information
          </p>
          <div
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mt-3 ${
              session?.user
                ? "bg-green-100 text-green-800"
                : "bg-orange-100 text-orange-800"
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full mr-2 ${
                session?.user ? "bg-green-500" : "bg-orange-500"
              }`}
            ></div>
            {session?.user
              ? `Authenticated as ${session.user.name}`
              : "Checking out as Guest"}
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-green-600 px-8 py-6">
            <h2 className="text-xl font-semibold text-white flex items-center gap-3">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Delivery Address
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            {/* Saved Addresses Section */}
            {session?.user &&
              !isLoadingAddresses &&
              savedAddresses.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2 mb-4">
                    Select a Saved Address
                  </h3>
                  <div className="space-y-4">
                    {savedAddresses.map((address) => (
                      <div
                        key={address._id}
                        onClick={() => handleAddressSelection(address)}
                        className={`p-4 border rounded-xl cursor-pointer transition-all duration-200 ${
                          selectedAddressId === address._id
                            ? "border-green-500 bg-green-50 shadow-md"
                            : "border-gray-200 hover:border-green-300"
                        }`}
                      >
                        <p className="font-semibold text-gray-800">
                          {address.fullName} ({address.pincode})
                        </p>
                        <p className="text-sm text-gray-600">
                          {address.addressLine1},{" "}
                          {address.addressLine2 && `${address.addressLine2}, `}
                          {address.city}, {address.state}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Mobile: {address.mobileNumber}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-right">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddressForm(true);
                        setSelectedAddressId(null);
                        setFormData({
                          fullName: session.user.name || "",
                          mobileNumber: "",
                          email: session.user.email || "",
                          addressLine1: "",
                          addressLine2: "",
                          city: "",
                          state: "",
                          pincode: "",
                          isDefault: false,
                        });
                      }}
                      className="text-sm font-medium text-green-600 hover:underline"
                    >
                      Or add a new address
                    </button>
                  </div>
                </div>
              )}

            {/* Loading Indicator */}
            {isLoadingAddresses && session?.user && (
              <div className="flex justify-center items-center py-8">
                <p className="text-gray-500">Loading your saved addresses...</p>
              </div>
            )}

            {/* Address Form (visible for guests or when "add new address" is clicked) */}
            {(showAddressForm || !session?.user) && (
              <div className="space-y-6">
                {/* Personal Information Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="group">
                      <label
                        htmlFor="fullName"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Full Name <span className="text-red-500 ">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="fullName"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 pl-11 text-black rounded-xl border ${
                            errors.fullName
                              ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                              : "border-gray-300 focus:border-green-500 focus:ring-green-200"
                          } focus:ring-2 outline-none transition-all duration-200 bg-white group-hover:border-gray-400`}
                          placeholder="Enter your full name"
                        />
                        <svg
                          className="absolute left-3 top-3.5 w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                      {errors.fullName && (
                        <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {errors.fullName}
                        </p>
                      )}
                    </div>
                    <div className="group">
                      <label
                        htmlFor="mobileNumber"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Mobile Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          id="mobileNumber"
                          name="mobileNumber"
                          value={formData.mobileNumber}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 pl-11 rounded-xl text-black border ${
                            errors.mobileNumber
                              ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                              : "border-gray-300 focus:border-green-500 focus:ring-green-200"
                          } focus:ring-2 outline-none transition-all duration-200 bg-white group-hover:border-gray-400`}
                          placeholder="Enter 10-digit mobile number"
                        />
                        <svg
                          className="absolute left-3 top-3.5 w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                      </div>
                      {errors.mobileNumber && (
                        <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {errors.mobileNumber}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="group">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 pl-11 rounded-xl text-black border ${
                          errors.email
                            ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                            : "border-gray-300 focus:border-green-500 focus:ring-green-200"
                        } focus:ring-2 outline-none transition-all duration-200 bg-white group-hover:border-gray-400`}
                        placeholder="Enter your email address"
                      />
                      <svg
                        className="absolute left-3 top-3.5 w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                        />
                      </svg>
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Address Information Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                    Address Information
                  </h3>
                  <div className="group">
                    <label
                      htmlFor="addressLine1"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Street Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="addressLine1"
                        name="addressLine1"
                        value={formData.addressLine1}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 pl-11 text-black rounded-xl border ${
                          errors.addressLine1
                            ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                            : "border-gray-300 focus:border-green-500 focus:ring-green-200"
                        } focus:ring-2 outline-none transition-all duration-200 bg-white group-hover:border-gray-400`}
                        placeholder="Street address"
                      />
                      <svg
                        className="absolute left-3 top-3.5 w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                    </div>
                    {errors.addressLine1 && (
                      <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {errors.addressLine1}
                      </p>
                    )}
                  </div>
                  <div className="group">
                    <label
                      htmlFor="addressLine2"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Apartment, Suite, Unit (Optional)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="addressLine2"
                        name="addressLine2"
                        value={formData.addressLine2}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 pl-11 text-black rounded-xl border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all duration-200 bg-white group-hover:border-gray-400"
                        placeholder="Apartment, suite, unit, etc."
                      />
                      <svg
                        className="absolute left-3 top-3.5 w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="group">
                      <label
                        htmlFor="city"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        City <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 pl-11 text-black rounded-xl border ${
                            errors.city
                              ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                              : "border-gray-300 focus:border-green-500 focus:ring-green-200"
                          } focus:ring-2 outline-none transition-all duration-200 bg-white group-hover:border-gray-400`}
                          placeholder="Enter your city"
                        />
                        <svg
                          className="absolute left-3 top-3.5 w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                      </div>
                      {errors.city && (
                        <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {errors.city}
                        </p>
                      )}
                    </div>
                    <div className="group">
                      <label
                        htmlFor="state"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        State <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 pl-11 text-black rounded-xl border ${
                            errors.state
                              ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                              : "border-gray-300 focus:border-green-500 focus:ring-green-200"
                          } focus:ring-2 outline-none transition-all duration-200 bg-white group-hover:border-gray-400`}
                          placeholder="Enter your state"
                        />
                        <svg
                          className="absolute left-3 top-3.5 w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                      {errors.state && (
                        <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {errors.state}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="group">
                    <label
                      htmlFor="pincode"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Pincode <span className="text-red-500">*</span>
                    </label>
                    <div className="relative max-w-xs">
                      <input
                        type="text"
                        id="pincode"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 pl-11 text-black rounded-xl text-black border ${
                          errors.pincode
                            ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                            : "border-gray-300 focus:border-green-500 focus:ring-green-200"
                        } focus:ring-2 outline-none transition-all duration-200 bg-white group-hover:border-gray-400`}
                        placeholder="Enter 6-digit pincode"
                      />
                      <svg
                        className="absolute left-3 top-3.5 w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                        />
                      </svg>
                    </div>
                    {errors.pincode && (
                      <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {errors.pincode}
                      </p>
                    )}
                  </div>
                  {session?.user && (
                    <div className="flex items-center mt-4">
                      <input
                        id="isDefault"
                        name="isDefault"
                        type="checkbox"
                        checked={formData.isDefault}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      />
                      <label
                        htmlFor="isDefault"
                        className="ml-2 block text-sm text-gray-900"
                      >
                        Save this address for future use
                      </label>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Payment Method Selection */}
            <div className="space-y-4 mt-8">
              <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                Payment Method
              </h3>
              <div className="space-y-4">
                {/* COD Option */}
                <div className="relative">
                  <input
                    type="radio"
                    id="cod"
                    name="paymentMethod"
                    value="COD"
                    checked={paymentMethod === "COD"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="peer hidden"
                  />
                  <label
                    htmlFor="cod"
                    className="flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all duration-200 peer-checked:border-green-500 peer-checked:bg-green-50 hover:border-gray-300"
                  >
                    <div className="w-6 h-6 rounded-full border-2 border-gray-300 peer-checked:border-green-500 flex items-center justify-center relative">
                      <div
                        className={`w-3 h-3 rounded-full bg-green-500 absolute ${
                          paymentMethod === "COD"
                            ? "opacity-100 scale-100"
                            : "opacity-0 scale-0"
                        } transition-all duration-200`}
                      ></div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-base font-medium text-gray-900">
                        Cash on Delivery
                      </h4>
                      <p className="text-sm text-gray-500">
                        Pay when you receive your order
                      </p>
                    </div>
                    <svg
                      className="w-6 h-6 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </label>
                </div>
                {/* Online Payment Option */}
                <div className="relative">
                  <input
                    type="radio"
                    id="online"
                    name="paymentMethod"
                    value="ONLINE"
                    checked={paymentMethod === "ONLINE"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="peer hidden"
                  />
                  <label
                    htmlFor="online"
                    className="flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all duration-200 peer-checked:border-green-500 peer-checked:bg-green-50 hover:border-gray-300"
                  >
                    <div className="w-6 h-6 rounded-full border-2 border-gray-300 peer-checked:border-green-500 flex items-center justify-center relative">
                      <div
                        className={`w-3 h-3 rounded-full bg-green-500 absolute ${
                          paymentMethod === "ONLINE"
                            ? "opacity-100 scale-100"
                            : "opacity-0 scale-0"
                        } transition-all duration-200`}
                      ></div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-base font-medium text-gray-900">
                        Online Payment
                      </h4>
                      <p className="text-sm text-gray-500">
                        Pay securely with Razorpay
                      </p>
                    </div>
                    <svg
                      className="w-6 h-6 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                      />
                    </svg>
                  </label>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            {(cartItems.length > 0 || appliedCoupon) && (
              <div className="space-y-4 mt-8">
                <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                  Order Summary
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Items ({cartItems.length})
                    </span>
                    <span className="font-medium text-gray-600">
                      ₹
                      {cartItems
                        .reduce(
                          (sum, item) => sum + item.price * item.quantity,
                          0
                        )
                        .toFixed(2)}
                    </span>
                  </div>
                  {appliedCoupon && couponDiscount > 0 && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          Coupon ({appliedCoupon.code})
                        </span>
                        <span className="text-green-600 font-medium">
                          -₹{couponDiscount.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 p-2 rounded">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Coupon will be marked as used after successful order
                        completion
                      </div>
                    </>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium text-gray-600">FREE</span>
                  </div>
                  <div className="flex justify-between text-lg text-black font-bold border-t border-gray-200 pt-3">
                    <span>Total</span>
                    <span>₹{getOrderTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="mt-10 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing Order...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      {paymentMethod === "ONLINE" ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                        />
                      ) : (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      )}
                    </svg>
                    {paymentMethod === "ONLINE"
                      ? "Proceed to Pay"
                      : "Place Order"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ShippingForm;