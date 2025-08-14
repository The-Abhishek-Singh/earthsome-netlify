"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import {
  Package,
  User,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Truck,
  ShoppingBag,
  Edit3,
  LogOut,
  Trash2,
  Search,
  Filter,
  Download,
  FileText,
  Calendar,
  ChevronDown,
  ChevronRight,
  Eye,
  X,
  Plus,
  Minus,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Gift,
  Tag,
  MoreHorizontal,
  RefreshCw,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
} from "lucide-react";

const NEXT_PUBLIC_API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Utility Components
const LoadingSpinner = ({ size = "md" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <div
      className={`${sizeClasses[size]} border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin`}
    ></div>
  );
};

const StatusBadge = ({ status, type = "order" }) => {
  const getStatusConfig = (status, type) => {
    if (type === "payment") {
      switch (status) {
        case "paid":
          return { color: "bg-green-100 text-green-800", icon: CheckCircle };
        case "pending":
          return { color: "bg-yellow-100 text-yellow-800", icon: Clock };
        case "failed":
          return { color: "bg-red-100 text-red-800", icon: XCircle };
        default:
          return { color: "bg-gray-100 text-gray-800", icon: AlertCircle };
      }
    } else {
      switch (status) {
        case "delivered":
          return { color: "bg-green-100 text-green-800", icon: CheckCircle };
        case "shipped":
          return { color: "bg-blue-100 text-blue-800", icon: Truck };
        case "confirmed":
          return { color: "bg-purple-100 text-purple-800", icon: ShoppingBag };
        case "pending":
          return { color: "bg-yellow-100 text-yellow-800", icon: Clock };
        case "cancelled":
          return { color: "bg-red-100 text-red-800", icon: XCircle };
        default:
          return { color: "bg-gray-100 text-gray-800", icon: Package };
      }
    }
  };

  const config = getStatusConfig(status, type);
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
    >
      <Icon size={12} />
      {status?.charAt(0).toUpperCase() + status?.slice(1)}
    </span>
  );
};

// Order Timeline Component
const OrderTimeline = ({ order }) => {
  const timelineSteps = [
    { status: "pending", label: "Order Placed", icon: ShoppingBag },
    { status: "confirmed", label: "Confirmed", icon: CheckCircle },
    { status: "shipped", label: "Shipped", icon: Truck },
    { status: "delivered", label: "Delivered", icon: Package },
  ];

  const getCurrentStepIndex = () => {
    return timelineSteps.findIndex((step) => step.status === order.orderStatus);
  };

  const currentStepIndex = getCurrentStepIndex();

  return (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-900">Order Timeline</h4>
      <div className="space-y-3">
        {timelineSteps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = index <= currentStepIndex;
          const isCurrent = index === currentStepIndex;

          return (
            <div key={step.status} className="flex items-center gap-3">
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  isCompleted
                    ? "bg-green-100 text-green-600"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                <Icon size={16} />
              </div>
              <div className="flex-1">
                <p
                  className={`text-sm font-medium ${
                    isCompleted ? "text-gray-900" : "text-gray-500"
                  }`}
                >
                  {step.label}
                </p>
                {isCurrent && (
                  <p className="text-xs text-green-600">Current Status</p>
                )}
              </div>
              {isCompleted && (
                <CheckCircle size={16} className="text-green-600" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Product Image Component
const ProductImage = ({ item }) => {
  const [imageError, setImageError] = useState(false);

  const getImageUrl = () => {
    return (
      item.productImageURL ||
      item.productId?.productImageURL ||
      item.productId?.image ||
      null
    );
  };

  const imageUrl = getImageUrl();

  if (!imageUrl || imageError) {
    return (
      <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
        <Package className="w-6 h-6 text-gray-500" />
      </div>
    );
  }

  return (
    <div className="relative w-12 h-12 rounded-md overflow-hidden">
      <Image
        src={imageUrl}
        alt={item.name || "Product"}
        fill
        className="object-cover"
        onError={() => setImageError(true)}
      />
    </div>
  );
};

// User Avatar Component
const UserAvatar = ({ user }) => {
  const [imageError, setImageError] = useState(false);

  const getProfilePicture = () => {
    if (user?.profilePicture) return user.profilePicture;
    if (user?.image) return user.image;
    if (user?.picture) return user.picture;
    return null;
  };

  const profilePicture = getProfilePicture();

  // Better authentication detection logic
  const isAuthenticated = () => {
    // Check if user has OAuth profile data (Google/GitHub login)
    if (user?.picture || user?.image) return true;

    // Check if explicitly marked as authenticated
    if (user?.isAuthenticated === true) return true;

    // Check if user has a real database ID (not guest/unknown)
    if (user?._id && user._id !== "guest" && user._id !== "unknown")
      return true;

    // Check if user object indicates it's not a guest order
    if (user?.name && !user.name.includes("Guest")) return true;

    return false;
  };

  const userIsAuthenticated = isAuthenticated();

  const getUserInitials = () => {
    const name = user?.name || user?.fullname || "Guest User";
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("")
      .substring(0, 2);
  };

  const shouldShowFallback = !profilePicture || imageError;

  if (shouldShowFallback) {
    return (
      <div className="relative">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
            userIsAuthenticated
              ? "bg-blue-100 text-blue-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {getUserInitials()}
        </div>
        <div
          className={`absolute -top-1 -right-1 w-3 h-3 border-2 border-white rounded-full ${
            userIsAuthenticated ? "bg-green-500" : "bg-orange-500"
          }`}
        ></div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm bg-white">
        <Image
          src={profilePicture}
          alt={user.name || "User"}
          width={40}
          height={40}
          className="w-full h-full object-cover"
          unoptimized={true}
          onError={() => setImageError(true)}
        />
      </div>
      <div
        className={`absolute -top-1 -right-1 w-3 h-3 border-2 border-white rounded-full ${
          userIsAuthenticated ? "bg-green-500" : "bg-orange-500"
        }`}
      ></div>
    </div>
  );
};

// Order Details Modal
const OrderDetailsModal = ({
  order,
  isOpen,
  onClose,
  onUpdateStatus,
  onDelete,
}) => {
  if (!isOpen || !order) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getOrderId = (order) => {
    return order.razorpayOrderId || order._id?.slice(-8).toUpperCase() || "N/A";
  };

  const generateInvoice = () => {
    try {
      // Create new PDF document
      const doc = new jsPDF();

      // Get order details
      const orderId = getOrderId(order);
      const customerName = order.userId?.name || "Guest User";
      const customerEmail = order.userId?.email || order.shippingAddress?.email;
      const orderDate = new Date(order.createdAt);

      // Set font
      doc.setFont("helvetica");

      // Add company header
      doc.setFontSize(20);
      doc.setTextColor(40, 116, 240); // Blue color
      doc.text("EarthSome", 20, 25);

      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text("Eco-Friendly Products Store", 20, 32);
      doc.text("Email: contact@earthsome.com", 20, 38);
      doc.text("Phone: +91 1234567890", 20, 44);

      // Add invoice title
      doc.setFontSize(24);
      doc.setTextColor(0, 0, 0);
      doc.text("INVOICE", 150, 25);

      // Add invoice details
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Invoice #: ${orderId}`, 150, 35);
      doc.text(`Date: ${orderDate.toLocaleDateString("en-IN")}`, 150, 42);
      doc.text(`Status: ${order.orderStatus.toUpperCase()}`, 150, 49);

      // Add customer details
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text("Bill To:", 20, 65);

      doc.setFontSize(10);
      doc.text(customerName, 20, 75);
      doc.text(customerEmail, 20, 82);

      // Add shipping address
      if (order.shippingAddress) {
        const addr = order.shippingAddress;
        doc.text(addr.addressLine1, 20, 89);
        if (addr.addressLine2) {
          doc.text(addr.addressLine2, 20, 96);
        }
        doc.text(
          `${addr.city}, ${addr.state} - ${addr.pincode}`,
          20,
          addr.addressLine2 ? 103 : 96
        );
        doc.text(
          `Mobile: ${addr.mobileNumber}`,
          20,
          addr.addressLine2 ? 110 : 103
        );
      }

      // Prepare items data for table
      const tableData =
        order.items?.map((item, index) => [
          index + 1,
          item.name || item.productId?.productName || "Unknown Product",
          item.quantity,
          `₹${item.price?.toFixed(2)}`,
          `₹${(item.price * item.quantity).toFixed(2)}`,
        ]) || [];

      // Add items table
      autoTable(doc, {
        head: [["#", "Product", "Qty", "Price", "Total"]],
        body: tableData,
        startY: 130,
        theme: "grid",
        headStyles: {
          fillColor: [40, 116, 240],
          textColor: 255,
          fontSize: 10,
          fontStyle: "bold",
        },
        bodyStyles: {
          fontSize: 9,
          textColor: 50,
        },
        columnStyles: {
          0: { cellWidth: 20, halign: "center" },
          1: { cellWidth: 80 },
          2: { cellWidth: 25, halign: "center" },
          3: { cellWidth: 30, halign: "right" },
          4: { cellWidth: 35, halign: "right" },
        },
        margin: { left: 20, right: 20 },
      });

      // Calculate totals
      const finalY = doc.lastAutoTable.finalY + 20;
      const subtotal =
        order.items?.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ) || 0;
      const discount = order.couponApplied?.discount || 0;
      const total = order.totalAmount || subtotal - discount;

      // Add totals section
      const totalsX = 130;
      doc.setFontSize(10);

      // Subtotal
      doc.text("Subtotal:", totalsX, finalY);
      doc.text(`₹${subtotal.toFixed(2)}`, totalsX + 50, finalY, {
        align: "right",
      });

      // Discount (if any)
      if (discount > 0) {
        doc.text(
          `Discount (${order.couponApplied?.code}):`,
          totalsX,
          finalY + 8
        );
        doc.text(`-₹${discount.toFixed(2)}`, totalsX + 50, finalY + 8, {
          align: "right",
        });
      }

      // Total
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      const totalY = discount > 0 ? finalY + 16 : finalY + 8;
      doc.text("Total:", totalsX, totalY);
      doc.text(`₹${total.toFixed(2)}`, totalsX + 50, totalY, {
        align: "right",
      });

      // Add payment information
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text("Payment Information:", 20, totalY + 20);
      doc.text(
        `Method: ${order.paymentMethod?.toUpperCase()}`,
        20,
        totalY + 28
      );
      doc.text(
        `Status: ${order.paymentStatus?.toUpperCase()}`,
        20,
        totalY + 35
      );
      if (order.paymentId) {
        doc.text(`Payment ID: ${order.paymentId}`, 20, totalY + 42);
      }

      // Add footer
      const pageHeight = doc.internal.pageSize.height;
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text("Thank you for your business!", 20, pageHeight - 30);
      doc.text(
        "For any queries, please contact us at contact@earthsome.com",
        20,
        pageHeight - 24
      );
      doc.text(
        `Generated on: ${new Date().toLocaleString("en-IN")}`,
        20,
        pageHeight - 18
      );

      // Add page border
      doc.setDrawColor(200, 200, 200);
      doc.rect(
        10,
        10,
        doc.internal.pageSize.width - 20,
        doc.internal.pageSize.height - 20
      );

      // Save the PDF
      const fileName = `EarthSome-Invoice-${orderId}-${
        orderDate.toISOString().split("T")[0]
      }.pdf`;
      doc.save(fileName);

      // Show success message
      alert(`Invoice downloaded successfully as ${fileName}`);
    } catch (error) {
      console.error("Error generating invoice:", error);
      alert("Error generating invoice. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
            <p className="text-gray-600">#{getOrderId(order)}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={generateInvoice}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download size={16} />
              Invoice
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X color="black" size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Order Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Order Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-medium text-black">
                    #{getOrderId(order)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="text-black">
                    {formatDate(order.createdAt)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="capitalize text-black">
                    {order.paymentMethod}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-semibold text-black">
                    ₹{order.totalAmount?.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Status</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-black">Order Status</label>
                  <div className="mt-1 text-black">
                    <StatusBadge status={order.orderStatus} type="order" />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-600">
                    Payment Status
                  </label>
                  <div className="mt-1">
                    <StatusBadge status={order.paymentStatus} type="payment" />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Customer</h3>
              <div className="flex items-center gap-3">
                <UserAvatar user={order.userId} />
                <div>
                  <p className="font-medium text-black">
                    {order.userId?.name || "Guest User"}
                  </p>
                  <p className="text-sm text-gray-600">
                    {order.userId?.email || order.shippingAddress?.email}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <OrderTimeline order={order} />
          </div>

          {/* Shipping Address */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">
              Shipping Address
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-gray-500" />
                    <span className="font-medium text-black">
                      {order.shippingAddress?.fullName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={16} className="text-gray-500" />
                    <span className="text-black">
                      {order.shippingAddress?.mobileNumber}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-gray-500" />
                    <span className="text-black">
                      {order.shippingAddress?.email}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <MapPin size={16} className="text-gray-500 mt-0.5" />
                    <div className="text-black">
                      <p>{order.shippingAddress?.addressLine1}</p>
                      {order.shippingAddress?.addressLine2 && (
                        <p>{order.shippingAddress.addressLine2}</p>
                      )}
                      <p>
                        {order.shippingAddress?.city},{" "}
                        {order.shippingAddress?.state}
                      </p>
                      <p>{order.shippingAddress?.pincode}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Order Items</h3>
            <div className="space-y-4">
              {order.items?.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg"
                >
                  <ProductImage item={item} />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">
                      {item.name ||
                        item.productId?.productName ||
                        "Unknown Product"}
                    </h4>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                      <span>Quantity: {item.quantity}</span>
                      <span>Price: ₹{item.price?.toFixed(2)}</span>
                      <span className="font-semibold">
                        Total: ₹{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Coupon Information */}
          {order.couponApplied && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">
                Coupon Applied
              </h3>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <Tag size={16} className="text-green-600" />
                  <span className="font-medium text-green-800">
                    {order.couponApplied.code}
                  </span>
                  <span className="text-green-600">
                    - ₹{order.couponApplied.discount?.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={() => onDelete(order._id, getOrderId(order))}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 size={16} />
            Delete Order
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Admin Orders Page Component
const AdminOrdersPage = () => {
  const { data: session } = useSession();

  // State Management
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({});
  const [deleting, setDeleting] = useState({});

  // Filter and Search State
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [showFilters, setShowFilters] = useState(false);

  // Pagination State (now server-side)
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);

  // Modal State
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  // Fetch orders with server-side pagination and filtering
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);

      // Build query parameters
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
      });

      if (searchTerm) params.append("search", searchTerm);
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (paymentFilter !== "all")
        params.append("paymentStatus", paymentFilter);
      if (dateRange.start) params.append("startDate", dateRange.start);
      if (dateRange.end) params.append("endDate", dateRange.end);

      const response = await fetch(
        `${NEXT_PUBLIC_API_URL}/api/orders?${params}`
      );
      const data = await response.json();

      if (data.orders) {
        setOrders(data.orders);
        setTotalPages(data.totalPages || 1);
        setTotalOrders(data.total || 0);
      } else {
        // Fallback for old API response format
        setOrders(Array.isArray(data) ? data : []);
        setTotalPages(1);
        setTotalOrders(Array.isArray(data) ? data.length : 0);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
      setTotalPages(1);
      setTotalOrders(0);
    } finally {
      setLoading(false);
    }
  }, [
    currentPage,
    itemsPerPage,
    searchTerm,
    statusFilter,
    paymentFilter,
    dateRange,
  ]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Update order status
  const updateOrderStatus = async (
    orderId,
    newStatus,
    statusType = "orderStatus"
  ) => {
    try {
      setUpdating((prev) => ({ ...prev, [orderId]: true }));

      const updateData = {};
      updateData[statusType] = newStatus;

      const response = await fetch(
        `${NEXT_PUBLIC_API_URL}/api/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        }
      );

      if (response.ok) {
        await fetchOrders();
      } else {
        throw new Error("Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status");
    } finally {
      setUpdating((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  // Delete order
  const deleteOrder = async (orderId, orderDisplayId) => {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete order #${orderDisplayId}?\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setDeleting((prev) => ({ ...prev, [orderId]: true }));

      const response = await fetch(
        `${NEXT_PUBLIC_API_URL}/api/orders/${orderId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setOrders((prevOrders) =>
          prevOrders.filter((order) => order._id !== orderId)
        );
        setShowOrderModal(false);
        alert("Order deleted successfully!");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete order");
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      alert(`Failed to delete order: ${error.message}`);
    } finally {
      setDeleting((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  // Helper function to check if a user is authenticated
  const isUserAuthenticated = (user) => {
    // Check if user has OAuth profile data (Google/GitHub login)
    if (user?.picture || user?.image) return true;

    // Check if explicitly marked as authenticated
    if (user?.isAuthenticated === true) return true;

    // Check if user has a real database ID (not guest/unknown)
    if (user?._id && user._id !== "guest" && user._id !== "unknown")
      return true;

    // Check if user object indicates it's not a guest order
    if (user?.name && !user.name.includes("Guest")) return true;

    return false;
  };

  // Utility functions
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getOrderId = (order) => {
    return order.razorpayOrderId || order._id?.slice(-8).toUpperCase() || "N/A";
  };

  // Filter and search logic - now handled server-side
  // Reset to page 1 when filters change
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [
    searchTerm,
    statusFilter,
    paymentFilter,
    dateRange.start,
    dateRange.end,
    currentPage,
  ]);

  // Export to CSV - now exports all filtered results from server
  const exportToCSV = async () => {
    try {
      // Fetch all orders for export (without pagination)
      const params = new URLSearchParams({
        limit: "10000", // Large number to get all orders
      });

      if (searchTerm) params.append("search", searchTerm);
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (paymentFilter !== "all")
        params.append("paymentStatus", paymentFilter);
      if (dateRange.start) params.append("startDate", dateRange.start);
      if (dateRange.end) params.append("endDate", dateRange.end);

      const response = await fetch(
        `${NEXT_PUBLIC_API_URL}/api/orders?${params}`
      );
      const data = await response.json();
      const ordersToExport = data.orders || data;

      const headers = [
        "Order ID",
        "Customer Name",
        "Customer Email",
        "Order Status",
        "Payment Status",
        "Payment Method",
        "Total Amount",
        "Order Date",
      ];

      const csvData = ordersToExport.map((order) => [
        getOrderId(order),
        order.userId?.name || "Guest User",
        order.userId?.email || order.shippingAddress?.email,
        order.orderStatus,
        order.paymentStatus,
        order.paymentMethod,
        order.totalAmount,
        formatDate(order.createdAt),
      ]);

      const csvContent = [headers, ...csvData]
        .map((row) => row.map((field) => `"${field}"`).join(","))
        .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `orders-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting CSV:", error);
      alert("Error exporting data. Please try again.");
    }
  };

  // Status Dropdown Component
  const StatusDropdown = ({ order, statusType = "orderStatus" }) => {
    const currentStatus = order[statusType];
    const options =
      statusType === "orderStatus"
        ? ["pending", "confirmed", "shipped", "delivered", "cancelled"]
        : ["pending", "paid", "failed"];

    return (
      <div className="relative">
        <select
          value={currentStatus}
          onChange={(e) =>
            updateOrderStatus(order._id, e.target.value, statusType)
          }
          disabled={updating[order._id]}
          className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer ${
            statusType === "orderStatus"
              ? currentStatus === "delivered"
                ? "bg-green-100 text-green-800"
                : currentStatus === "shipped"
                ? "bg-blue-100 text-blue-800"
                : currentStatus === "confirmed"
                ? "bg-purple-100 text-purple-800"
                : currentStatus === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
              : currentStatus === "paid"
              ? "bg-green-100 text-green-800"
              : currentStatus === "pending"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          } ${updating[order._id] ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {options.map((status) => (
            <option
              key={status}
              value={status}
              className="bg-white text-gray-900"
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
        {updating[order._id] && (
          <div className="absolute inset-0 flex items-center justify-center">
            <LoadingSpinner size="sm" />
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Orders Management
              </h1>
              <p className="mt-2 text-gray-600">
                Manage and track all customer orders
              </p>
              {session?.user && (
                <div className="flex items-center mt-2 text-sm text-gray-500">
                  <div className="flex items-center">
                    {session.user.image && (
                      <Image
                        src={session.user.image}
                        alt={session.user.name}
                        width={24}
                        height={24}
                        className="rounded-full mr-2"
                      />
                    )}
                    <span>Welcome, {session.user.name}</span>
                    <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      Admin
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download size={16} />
                Export CSV
              </button>
              <button
                onClick={fetchOrders}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCw size={16} />
                Refresh
              </button>
              <div className="text-sm text-gray-500 bg-white px-3 py-2 rounded-lg border">
                Total: {totalOrders} orders
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search by Order ID, Customer name, or Email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center text-black gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter size={16} />
              Filters
              {showFilters ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Order Status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Status
                  </label>
                  <select
                    value={paymentFilter}
                    onChange={(e) => setPaymentFilter(e.target.value)}
                    className="w-full px-3 text-black py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Payments</option>
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    From Date
                  </label>
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) =>
                      setDateRange((prev) => ({
                        ...prev,
                        start: e.target.value,
                      }))
                    }
                    className="w-full px-3 text-black py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    To Date
                  </label>
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) =>
                      setDateRange((prev) => ({ ...prev, end: e.target.value }))
                    }
                    className="w-full px-3 text-black py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                    setPaymentFilter("all");
                    setDateRange({ start: "", end: "" });
                  }}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Quick Stats - Current Page */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[
            {
              label: "Current Page Orders",
              value: orders.length,
              color: "bg-blue-100 text-blue-800",
            },
            {
              label: "Pending (Page)",
              value: orders.filter((o) => o.orderStatus === "pending").length,
              color: "bg-yellow-100 text-yellow-800",
            },
            {
              label: "Shipped (Page)",
              value: orders.filter((o) => o.orderStatus === "shipped").length,
              color: "bg-purple-100 text-purple-800",
            },
            {
              label: "Delivered (Page)",
              value: orders.filter((o) => o.orderStatus === "delivered").length,
              color: "bg-green-100 text-green-800",
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-lg border border-gray-200 p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`px-2 py-1 rounded-full text-xs font-medium ${stat.color}`}
                >
                  {orders.length > 0
                    ? ((stat.value / orders.length) * 100).toFixed(1)
                    : 0}
                  %
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Orders Table */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => {
                      setSelectedOrder(order);
                      setShowOrderModal(true);
                    }}
                  >
                    {/* Order Details */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          #{getOrderId(order)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.shippingAddress?.city},{" "}
                          {order.shippingAddress?.state}
                        </div>
                        <div className="text-xs text-gray-400">
                          {order.paymentMethod}
                        </div>
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <UserAvatar user={order.userId} />
                        <div className="ml-3">
                          <div className="flex items-center">
                            <div className="text-sm font-medium text-gray-900">
                              {order.userId?.name || "Guest User"}
                            </div>
                            {/* {isUserAuthenticated(order.userId) && (
                              <span className="ml-2 text-xs text-green-600 bg-green-100 px-1 rounded">OAuth</span>
                            )} */}
                          </div>
                          <div className="text-sm text-gray-500 max-w-32 truncate">
                            {order.userId?.email ||
                              order.shippingAddress?.email}
                          </div>
                          <div className="flex items-center mt-1">
                            {order.isGuestOrder ? (
                              <span className="text-xs text-orange-600 bg-orange-100 px-1 rounded mr-2">
                                Guest
                              </span>
                            ) : (
                              <span className="text-xs text-blue-600 bg-blue-100 px-1 rounded mr-2">
                                User
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Items */}
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <div className="flex -space-x-2">
                          {order.items?.slice(0, 3).map((item, idx) => (
                            <div key={idx} className="relative">
                              <ProductImage item={item} />
                            </div>
                          ))}
                        </div>
                        <div className="text-sm text-gray-600">
                          {order.items?.length > 3 &&
                            `+${order.items.length - 3} more`}
                          <div className="text-xs text-gray-500">
                            {order.items?.reduce(
                              (sum, item) => sum + item.quantity,
                              0
                            )}{" "}
                            items
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Order Status */}
                    <td
                      className="px-6 py-4 whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <StatusDropdown order={order} statusType="orderStatus" />
                    </td>

                    {/* Payment Status */}
                    <td
                      className="px-6 py-4 whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <StatusDropdown
                        order={order}
                        statusType="paymentStatus"
                      />
                    </td>

                    {/* Total */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ₹{order.totalAmount?.toFixed(2)}
                      </div>
                      {order.couponApplied && (
                        <div className="text-xs text-green-600 flex items-center gap-1">
                          <Tag size={10} />
                          {order.couponApplied.code}
                        </div>
                      )}
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </td>

                    {/* Actions */}
                    <td
                      className="px-6 py-4 whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowOrderModal(true);
                          }}
                          className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            try {
                              const doc = new jsPDF();

                              const orderId =
                                order.razorpayOrderId ||
                                order._id?.slice(-8).toUpperCase() ||
                                "N/A";
                              const customerName =
                                order.userId?.name || "Guest User";
                              const customerEmail =
                                order.userId?.email ||
                                order.shippingAddress?.email ||
                                "";
                              const orderDate = new Date(order.createdAt);

                              doc.setFont("helvetica");

                              // Company Header
                              doc.setFontSize(28);
                              doc.setTextColor(34, 197, 94);
                              doc.text("🌱 EarthSome", 20, 25);

                              doc.setFontSize(10);
                              doc.setTextColor(100, 100, 100);
                              doc.text(
                                "Sustainable Living Made Simple",
                                20,
                                32
                              );
                              doc.text(
                                "Email: contact@earthsome.com | Phone: +91 1234567890",
                                20,
                                38
                              );

                              // Invoice Heading
                              doc.setFontSize(20);
                              doc.setTextColor(0, 0, 0);
                              doc.text("INVOICE", 150, 25);

                              doc.setFontSize(10);
                              doc.setTextColor(100, 100, 100);
                              doc.text(`Invoice #: ${orderId}`, 150, 35);
                              doc.text(
                                `Date: ${orderDate.toLocaleDateString(
                                  "en-IN"
                                )}`,
                                150,
                                42
                              );
                              doc.text(
                                `Status: ${
                                  order.orderStatus?.toUpperCase() || ""
                                }`,
                                150,
                                49
                              );

                              // Customer Details
                              doc.setFontSize(14);
                              doc.setTextColor(0, 0, 0);
                              doc.text("Bill To:", 20, 65);

                              doc.setFontSize(11);
                              doc.text(customerName, 20, 75);
                              doc.text(customerEmail, 20, 82);

                              if (order.shippingAddress) {
                                const addr = order.shippingAddress;
                                doc.text(addr.addressLine1, 20, 89);
                                if (addr.addressLine2)
                                  doc.text(addr.addressLine2, 20, 96);
                                doc.text(
                                  `${addr.city}, ${addr.state} - ${addr.pincode}`,
                                  20,
                                  addr.addressLine2 ? 103 : 96
                                );
                                doc.text(
                                  `Mobile: ${addr.mobileNumber}`,
                                  20,
                                  addr.addressLine2 ? 110 : 103
                                );
                              }

                              // Table Data (No ₹ symbol to avoid ¹ bug)
                              const tableData =
                                order.items?.map((item, index) => [
                                  index + 1,
                                  item.name ||
                                    item.productId?.productName ||
                                    "Unknown Product",
                                  item.quantity,
                                  item.price?.toFixed(2),
                                  (item.price * item.quantity).toFixed(2),
                                ]) || [];

                              // Center table
                              const pageWidth =
                                doc.internal.pageSize.getWidth();
                              const totalColumnWidth = 15 + 75 + 20 + 30 + 30;
                              const marginLeft =
                                (pageWidth - totalColumnWidth) / 2;

                              autoTable(doc, {
                                head: [
                                  ["#", "Product", "Qty", "Price", "Total"],
                                ],
                                body: tableData,
                                startY: 130,
                                theme: "striped",
                                margin: { left: marginLeft, right: marginLeft },
                                styles: {
                                  fontSize: 10,
                                  cellPadding: 4,
                                  valign: "middle",
                                },
                                headStyles: {
                                  fillColor: [34, 197, 94],
                                  textColor: 255,
                                  fontSize: 12,
                                  fontStyle: "bold",
                                  halign: "center",
                                },
                                bodyStyles: { textColor: 60, halign: "center" },
                                alternateRowStyles: {
                                  fillColor: [248, 250, 252],
                                },
                                columnStyles: {
                                  0: { cellWidth: 15, halign: "center" },
                                  1: { cellWidth: 75, halign: "left" },
                                  2: { cellWidth: 20, halign: "center" },
                                  3: { cellWidth: 30, halign: "right" },
                                  4: { cellWidth: 30, halign: "right" },
                                },
                              });

                              // Totals Section
                              const finalY = doc.lastAutoTable.finalY + 20;
                              const subtotal =
                                order.items?.reduce(
                                  (sum, item) =>
                                    sum + item.price * item.quantity,
                                  0
                                ) || 0;
                              const discount =
                                order.couponApplied?.discount || 0;
                              const total =
                                order.totalAmount || subtotal - discount;

                              const totalsX = marginLeft + 100;
                              doc.setFontSize(11);

                              doc.text("Subtotal:", totalsX, finalY);
                              doc.text(
                                subtotal.toFixed(2),
                                totalsX + 50,
                                finalY,
                                { align: "left" }
                              );

                              if (discount > 0) {
                                doc.setTextColor(34, 197, 94);
                                doc.text(
                                  `Discount (${order.couponApplied?.code})`,
                                  totalsX,
                                  finalY + 8
                                );
                                doc.text(
                                  `-${discount.toFixed(2)}`,
                                  totalsX + 50,
                                  finalY + 8,
                                  { align: "left" }
                                );
                                doc.setTextColor(0, 0, 0);
                              }

                              doc.setFontSize(14);
                              doc.setFont("helvetica", "bold");
                              const totalY =
                                discount > 0 ? finalY + 16 : finalY + 8;
                              doc.text("Total:", totalsX, totalY);
                              doc.setTextColor(34, 197, 94);
                              doc.text(total.toFixed(2), totalsX + 50, totalY, {
                                align: "left",
                              });
                              doc.setTextColor(0, 0, 0);

                              // Footer
                              const pageHeight = doc.internal.pageSize.height;
                              doc.setFont("helvetica", "normal");
                              doc.setFontSize(10);
                              doc.setTextColor(34, 197, 94);
                              doc.text(
                                "🌱 Thank you for choosing sustainable products!",
                                20,
                                pageHeight - 35
                              );
                              doc.setTextColor(100, 100, 100);
                              doc.text(
                                "Together we're making the planet greener, one order at a time.",
                                20,
                                pageHeight - 28
                              );
                              doc.text(
                                `Generated on: ${new Date().toLocaleString(
                                  "en-IN"
                                )}`,
                                20,
                                pageHeight - 18
                              );

                              // Border
                              doc.setDrawColor(34, 197, 94);
                              doc.setLineWidth(1);
                              doc.rect(
                                10,
                                10,
                                doc.internal.pageSize.width - 20,
                                doc.internal.pageSize.height - 20
                              );

                              // Save File
                              const fileName = `EarthSome-Invoice-${orderId}-${
                                orderDate.toISOString().split("T")[0]
                              }.pdf`;
                              doc.save(fileName);
                            } catch (error) {
                              console.error("Error generating invoice:", error);
                              alert(
                                "Error generating invoice. Please try again."
                              );
                            }
                          }}
                          className="p-1 text-green-600 hover:bg-green-100 rounded transition-colors"
                          title="Download Invoice"
                        >
                          <FileText size={16} />
                        </button>

                        <button
                          onClick={() =>
                            deleteOrder(order._id, getOrderId(order))
                          }
                          disabled={deleting[order._id]}
                          className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors disabled:opacity-50"
                          title="Delete Order"
                        >
                          {deleting[order._id] ? (
                            <LoadingSpinner size="sm" />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{" "}
                    <span className="font-medium">
                      {(currentPage - 1) * itemsPerPage + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(currentPage * itemsPerPage, totalOrders)}
                    </span>{" "}
                    of <span className="font-medium">{totalOrders}</span>{" "}
                    results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft size={16} />
                    </button>

                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNumber;
                      if (totalPages <= 5) {
                        pageNumber = i + 1;
                      } else if (currentPage <= 3) {
                        pageNumber = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNumber = totalPages - 4 + i;
                      } else {
                        pageNumber = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNumber}
                          onClick={() => setCurrentPage(pageNumber)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === pageNumber
                              ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                              : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}

                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRightIcon size={16} />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Empty State */}
        {orders.length === 0 && !loading && (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No orders found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ||
              statusFilter !== "all" ||
              paymentFilter !== "all" ||
              dateRange.start ||
              dateRange.end
                ? "Try adjusting your search criteria or filters."
                : "No orders have been placed yet."}
            </p>
            {(searchTerm ||
              statusFilter !== "all" ||
              paymentFilter !== "all" ||
              dateRange.start ||
              dateRange.end) && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setPaymentFilter("all");
                  setDateRange({ start: "", end: "" });
                }}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear All Filters
              </button>
            )}
          </div>
        )}

        {/* Mobile View */}
        <div className="lg:hidden mt-8">
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-lg shadow p-4 border border-gray-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-medium text-gray-900">
                    #{getOrderId(order)}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <StatusBadge status={order.orderStatus} type="order" />
                    <button
                      onClick={() => {
                        // Generate invoice for mobile view
                        try {
                          const doc = new jsPDF();
                          const orderId = getOrderId(order);
                          const customerName =
                            order.userId?.name || "Guest User";
                          const customerEmail =
                            order.userId?.email || order.shippingAddress?.email;
                          const orderDate = new Date(order.createdAt);

                          // Add company header
                          doc.setFont("helvetica");
                          doc.setFontSize(20);
                          doc.setTextColor(40, 116, 240);
                          doc.text("EarthSome", 20, 25);

                          doc.setFontSize(10);
                          doc.setTextColor(100, 100, 100);
                          doc.text("Eco-Friendly Products Store", 20, 32);

                          // Add invoice title and details
                          doc.setFontSize(24);
                          doc.setTextColor(0, 0, 0);
                          doc.text("INVOICE", 150, 25);

                          doc.setFontSize(10);
                          doc.setTextColor(100, 100, 100);
                          doc.text(`Invoice #: ${orderId}`, 150, 35);
                          doc.text(
                            `Date: ${orderDate.toLocaleDateString("en-IN")}`,
                            150,
                            42
                          );

                          // Add customer details
                          doc.setFontSize(12);
                          doc.setTextColor(0, 0, 0);
                          doc.text("Bill To:", 20, 65);
                          doc.setFontSize(10);
                          doc.text(customerName, 20, 75);
                          doc.text(customerEmail, 20, 82);

                          // Add items table
                          const tableData =
                            order.items?.map((item, index) => [
                              index + 1,
                              item.name || "Unknown Product",
                              item.quantity,
                              `₹${item.price?.toFixed(2)}`,
                              `₹${(item.price * item.quantity).toFixed(2)}`,
                            ]) || [];

                          autoTable(doc, {
                            head: [["#", "Product", "Qty", "Price", "Total"]],
                            body: tableData,
                            startY: 100,
                            theme: "grid",
                            headStyles: { fillColor: [40, 116, 240] },
                          });

                          // Add total
                          const finalY = doc.lastAutoTable.finalY + 20;
                          doc.setFontSize(12);
                          doc.setFont("helvetica", "bold");
                          doc.text("Total:", 130, finalY);
                          doc.text(
                            `₹${order.totalAmount?.toFixed(2)}`,
                            180,
                            finalY,
                            { align: "right" }
                          );

                          const fileName = `EarthSome-Invoice-${orderId}.pdf`;
                          doc.save(fileName);
                        } catch (error) {
                          console.error("Error generating invoice:", error);
                          alert("Error generating invoice. Please try again.");
                        }
                      }}
                      className="p-1 text-green-600 hover:bg-green-100 rounded transition-colors"
                      title="Download Invoice"
                    >
                      <FileText size={16} />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowOrderModal(true);
                      }}
                      className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                    >
                      <Eye size={16} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center mb-3">
                  <UserAvatar user={order.userId} />
                  <div className="ml-3">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900">
                        {order.userId?.name || "Guest User"}
                      </div>
                      {isUserAuthenticated(order.userId) && (
                        <span className="ml-2 text-xs text-green-600 bg-green-100 px-1 rounded">
                          OAuth
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      {order.userId?.email || order.shippingAddress?.email}
                    </div>
                    <div className="flex items-center mt-1">
                      {order.isGuestOrder ? (
                        <span className="text-xs text-orange-600 bg-orange-100 px-1 rounded mr-2">
                          Guest
                        </span>
                      ) : (
                        <span className="text-xs text-blue-600 bg-blue-100 px-1 rounded mr-2">
                          User
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm mb-3">
                  <div className="flex items-center space-x-4">
                    <StatusBadge status={order.paymentStatus} type="payment" />
                    <span className="text-gray-600">
                      {order.items?.length} items
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900">
                      ₹{order.totalAmount?.toFixed(2)}
                    </div>
                    <div className="text-gray-500 text-xs">
                      {formatDate(order.createdAt)}
                    </div>
                  </div>
                </div>

                {order.couponApplied && (
                  <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                    <Tag size={10} />
                    Coupon: {order.couponApplied.code}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      <OrderDetailsModal
        order={selectedOrder}
        isOpen={showOrderModal}
        onClose={() => {
          setShowOrderModal(false);
          setSelectedOrder(null);
        }}
        onUpdateStatus={updateOrderStatus}
        onDelete={deleteOrder}
      />
    </div>
  );
};

export default AdminOrdersPage;
