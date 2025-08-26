"use client";
import Link from "next/link";
import React, { useState, useEffect, useCallback } from "react";
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
  Eye,
  X,
  MapPin,
  Phone,
  Mail,
  Tag,
  Calendar,
  Download,
  FileText,
  ChevronRight,
  Search,
  RefreshCw,
  Star,
  Heart,
  MoreHorizontal,
  Copy,
  Share2,
  MessageCircle,
} from "lucide-react";

const NEXT_PUBLIC_API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Enhanced Loading Spinner
const LoadingSpinner = ({ size = "md" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`${sizeClasses[size]} border-3 border-gray-200 border-t-green-500 rounded-full animate-spin`}
      ></div>
    </div>
  );
};

// Enhanced Status Badge with animations
const StatusBadge = ({ status, type = "order", size = "md" }) => {
  const getStatusConfig = (status, type) => {
    if (type === "payment") {
      switch (status) {
        case "paid":
          return {
            color:
              "bg-gradient-to-r from-green-100 to-green-50 text-green-800 border border-green-200",
            icon: CheckCircle,
            pulse: false,
          };
        case "pending":
          return {
            color:
              "bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-800 border border-yellow-200",
            icon: Clock,
            pulse: true,
          };
        case "failed":
          return {
            color:
              "bg-gradient-to-r from-red-100 to-red-50 text-red-800 border border-red-200",
            icon: XCircle,
            pulse: false,
          };
        default:
          return {
            color:
              "bg-gradient-to-r from-gray-100 to-gray-50 text-gray-800 border border-gray-200",
            icon: AlertCircle,
            pulse: false,
          };
      }
    } else {
      switch (status) {
        case "delivered":
          return {
            color:
              "bg-gradient-to-r from-green-100 to-green-50 text-green-800 border border-green-200",
            icon: CheckCircle,
            pulse: false,
          };
        case "shipped":
          return {
            color:
              "bg-gradient-to-r from-blue-100 to-blue-50 text-blue-800 border border-blue-200",
            icon: Truck,
            pulse: true,
          };
        case "confirmed":
          return {
            color:
              "bg-gradient-to-r from-purple-100 to-purple-50 text-purple-800 border border-purple-200",
            icon: ShoppingBag,
            pulse: false,
          };
        case "pending":
          return {
            color:
              "bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-800 border border-yellow-200",
            icon: Clock,
            pulse: true,
          };
        case "cancelled":
          return {
            color:
              "bg-gradient-to-r from-red-100 to-red-50 text-red-800 border border-red-200",
            icon: XCircle,
            pulse: false,
          };
        default:
          return {
            color:
              "bg-gradient-to-r from-gray-100 to-gray-50 text-gray-800 border border-gray-200",
            icon: Package,
            pulse: false,
          };
      }
    }
  };

  const config = getStatusConfig(status, type);
  const Icon = config.icon;
  const sizeClasses =
    size === "sm"
      ? "text-xs px-2 py-1"
      : size === "lg"
      ? "text-sm px-4 py-2"
      : "text-xs px-3 py-1.5";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${
        config.color
      } ${sizeClasses} ${config.pulse ? "animate-pulse" : ""}`}
    >
      <Icon size={size === "lg" ? 16 : 12} />
      {status?.charAt(0).toUpperCase() + status?.slice(1)}
    </span>
  );
};

// Enhanced Order Timeline with better visuals
const OrderTimeline = ({ order }) => {
  const timelineSteps = [
    {
      status: "pending",
      label: "Order Placed",
      icon: ShoppingBag,
      description: "Your order has been received and is being processed",
      color: "yellow",
    },
    {
      status: "confirmed",
      label: "Order Confirmed",
      icon: CheckCircle,
      description: "Order confirmed and being prepared for shipment",
      color: "purple",
    },
    {
      status: "shipped",
      label: "Shipped",
      icon: Truck,
      description: "Your order is on its way to you",
      color: "blue",
    },
    {
      status: "delivered",
      label: "Delivered",
      icon: Package,
      description:
        "Order delivered successfully. Enjoy your eco-friendly products!",
      color: "green",
    },
  ];

  const getCurrentStepIndex = () => {
    return timelineSteps.findIndex((step) => step.status === order.orderStatus);
  };

  const currentStepIndex = getCurrentStepIndex();

  return (
    <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
          <Truck className="w-4 h-4 text-green-600" />
        </div>
        <h4 className="font-bold text-gray-900 text-lg">Order Journey</h4>
      </div>

      <div className="space-y-6">
        {timelineSteps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = index <= currentStepIndex;
          const isCurrent = index === currentStepIndex;

          return (
            <div key={step.status} className="flex items-start gap-4">
              <div className="flex-shrink-0 relative">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 transition-all duration-300 ${
                    isCompleted
                      ? `bg-${step.color}-100 text-${step.color}-600 border-${step.color}-300 shadow-lg`
                      : "bg-gray-100 text-gray-400 border-gray-200"
                  } ${isCurrent ? "scale-110 shadow-xl" : ""}`}
                >
                  <Icon size={20} />
                </div>
                {index < timelineSteps.length - 1 && (
                  <div
                    className={`absolute top-12 left-1/2 transform -translate-x-1/2 w-0.5 h-10 transition-colors duration-300 ${
                      isCompleted ? `bg-${step.color}-300` : "bg-gray-200"
                    }`}
                  ></div>
                )}
              </div>
              <div className="flex-1 pb-8">
                <div className="flex items-center gap-3 mb-2">
                  <h5
                    className={`font-bold text-lg ${
                      isCompleted ? "text-gray-900" : "text-gray-500"
                    }`}
                  >
                    {step.label}
                  </h5>
                  {isCurrent && (
                    <span className="text-xs bg-green-500 text-white px-3 py-1 rounded-full font-medium animate-bounce">
                      Current
                    </span>
                  )}
                  {isCompleted && !isCurrent && (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  )}
                </div>
                <p
                  className={`text-sm leading-relaxed ${
                    isCompleted ? "text-gray-600" : "text-gray-400"
                  }`}
                >
                  {step.description}
                </p>
                {isCurrent && (
                  <div className="mt-3 text-xs text-green-600 font-medium">
                    ⏱️ Updated{" "}
                    {new Date(
                      order.updatedAt || order.createdAt
                    ).toLocaleDateString("en-IN", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Enhanced Product Image with hover effects
const ProductImage = ({ item, size = "md" }) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const getImageUrl = () => {
    return (
      item.productImageURL ||
      item.productId?.productImageURL ||
      item.productId?.image ||
      null
    );
  };

  const imageUrl = getImageUrl();

  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-20 h-20",
    lg: "w-32 h-32",
    xl: "w-40 h-40",
  };

  if (!imageUrl || imageError) {
    return (
      <div
        className={`${sizeClasses[size]} bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center group hover:shadow-lg transition-all duration-300`}
      >
        <Package
          className={`${
            size === "sm" ? "w-6 h-6" : size === "lg" ? "w-12 h-12" : "w-8 h-8"
          } text-gray-400 group-hover:text-gray-500 transition-colors`}
        />
      </div>
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} relative rounded-xl overflow-hidden group hover:shadow-xl transition-all duration-300 border border-gray-100`}
    >
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <LoadingSpinner size="sm" />
        </div>
      )}
      <Image
        src={imageUrl}
        alt={item.name || "Product"}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-300"
        onError={() => setImageError(true)}
        onLoad={() => setIsLoading(false)}
      />
      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
    </div>
  );
};

// Order Details Modal with enhanced design
const OrderDetailsModal = ({ order, isOpen, onClose }) => {
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

  const copyOrderId = () => {
    navigator.clipboard.writeText(getOrderId(order));
    // You could add a toast notification here
  };

  //   const generateInvoice = () => {
  //     try {
  //       const doc = new jsPDF();

  //       const orderId = getOrderId(order);
  //       const customerName = order.shippingAddress?.fullName || "Customer";
  //       const customerEmail = order.shippingAddress?.email || "";
  //       const orderDate = new Date(order.createdAt);

  //       doc.setFont("helvetica");

  //       // Company header with green theme
  //       doc.setFontSize(28);
  //       doc.setTextColor(34, 197, 94);
  //       doc.text("🌱 EarthSome", 20, 25);

  //       doc.setFontSize(10);
  //       doc.setTextColor(100, 100, 100);
  //       doc.text("Sustainable Living Made Simple", 20, 32);
  //       doc.text("Email: contact@earthsome.com | Phone: +91 1234567890", 20, 38);

  //       // Invoice details with better styling
  //       doc.setFontSize(20);
  //       doc.setTextColor(0, 0, 0);
  //       doc.text("INVOICE", 150, 25);

  //       doc.setFontSize(10);
  //       doc.setTextColor(100, 100, 100);
  //       doc.text(`Invoice #: ${orderId}`, 150, 35);
  //       doc.text(`Date: ${orderDate.toLocaleDateString("en-IN")}`, 150, 42);
  //       doc.text(`Status: ${order.orderStatus.toUpperCase()}`, 150, 49);

  //       // Enhanced customer details
  //       doc.setFontSize(14);
  //       doc.setTextColor(0, 0, 0);
  //       doc.text("Bill To:", 20, 65);

  //       doc.setFontSize(11);
  //       doc.text(customerName, 20, 75);
  //       doc.text(customerEmail, 20, 82);

  //       if (order.shippingAddress) {
  //         const addr = order.shippingAddress;
  //         doc.text(addr.addressLine1, 20, 89);
  //         if (addr.addressLine2) {
  //           doc.text(addr.addressLine2, 20, 96);
  //         }
  //         doc.text(
  //           `${addr.city}, ${addr.state} - ${addr.pincode}`,
  //           20,
  //           addr.addressLine2 ? 103 : 96
  //         );
  //         doc.text(
  //           `Mobile: ${addr.mobileNumber}`,
  //           20,
  //           addr.addressLine2 ? 110 : 103
  //         );
  //       }

  //       // Prepare table data
  //       const tableData =
  //         order.items?.map((item, index) => [
  //           index + 1,
  //           item.name || item.productId?.productName || "Eco Product",
  //           item.quantity,
  //           `₹${item.price?.toFixed(2)}`,
  //           `₹${(item.price * item.quantity).toFixed(2)}`,
  //         ]) || [];

  //       // Calculate page width and set margins to center the table
  //       const pageWidth = doc.internal.pageSize.getWidth(); // ~210 mm for A4
  //       // Set total desired column width (sum must fit inside page width minus margins)
  //       const totalColumnWidth = 15 + 75 + 20 + 30 + 30; // 170 mm total
  //       const marginLeft = (pageWidth - totalColumnWidth) / 2;
  //       const marginRight = marginLeft;

  //       // Add the table with proper widths and margins to fit inside page
  //       autoTable(doc, {
  //         head: [["#", "Product", "Qty", "Price", "Total"]],
  //         body: tableData,
  //         startY: 130,
  //         theme: "striped",
  //         margin: { left: marginLeft, right: marginRight },
  //         styles: {
  //           fontSize: 10,
  //           cellPadding: 4,
  //           overflow: "linebreak",
  //           valign: "middle",
  //         },
  //         headStyles: {
  //           fillColor: [34, 197, 94],
  //           textColor: 255,
  //           fontSize: 12,
  //           fontStyle: "bold",
  //           halign: "center",
  //         },
  //         bodyStyles: {
  //           textColor: 60,
  //           halign: "center",
  //         },
  //         alternateRowStyles: {
  //           fillColor: [248, 250, 252],
  //         },
  //         columnStyles: {
  //           0: { cellWidth: 15, halign: "center" }, // #
  //           1: { cellWidth: 75, halign: "left" }, // Product name left-aligned
  //           2: { cellWidth: 20, halign: "center" }, // Qty center-aligned
  //           3: { cellWidth: 30, halign: "right" }, // Price right-aligned
  //           4: { cellWidth: 30, halign: "right" }, // Total right-aligned
  //         },
  //       });

  //       // Totals section
  //       const finalY = doc.lastAutoTable.finalY + 20;
  //       const subtotal =
  //         order.items?.reduce(
  //           (sum, item) => sum + item.price * item.quantity,
  //           0
  //         ) || 0;
  //       const discount = order.couponApplied?.discount || 0;
  //       const total = order.totalAmount || subtotal - discount;

  //       const totalsX = marginLeft + 100; // position totals near right side of table
  //       doc.setFontSize(11);

  //       doc.text("Subtotal:", totalsX, finalY);
  //       doc.text(`₹${subtotal.toFixed(2)}`, totalsX + 50, finalY, {
  //         align: "right",
  //       });

  //       if (discount > 0) {
  //         doc.setTextColor(34, 197, 94);
  //         doc.text(
  //           `Discount (${order.couponApplied?.code}):`,
  //           totalsX,
  //           finalY + 8
  //         );
  //         doc.text(`-₹${discount.toFixed(2)}`, totalsX + 50, finalY + 8, {
  //           align: "right",
  //         });
  //         doc.setTextColor(0, 0, 0);
  //       }

  //       // Total amount
  //       doc.setFontSize(14);
  //       doc.setFont("helvetica", "bold");
  //       const totalY = discount > 0 ? finalY + 16 : finalY + 8;
  //       doc.text("Total:", totalsX, totalY);
  //       doc.setTextColor(34, 197, 94);
  //       doc.text(`₹${total.toFixed(2)}`, totalsX + 50, totalY, {
  //         align: "right",
  //       });
  //       doc.setTextColor(0, 0, 0);

  //       // Footer
  //       const pageHeight = doc.internal.pageSize.height;
  //       doc.setFont("helvetica", "normal");
  //       doc.setFontSize(10);
  //       doc.setTextColor(34, 197, 94);
  //       doc.text(
  //         "🌱 Thank you for choosing sustainable products!",
  //         20,
  //         pageHeight - 35
  //       );
  //       doc.setTextColor(100, 100, 100);
  //       doc.text(
  //         "Together we're making the planet greener, one order at a time.",
  //         20,
  //         pageHeight - 28
  //       );
  //       doc.text(
  //         `Generated on: ${new Date().toLocaleString("en-IN")}`,
  //         20,
  //         pageHeight - 18
  //       );

  //       // Green border around page
  //       doc.setDrawColor(34, 197, 94);
  //       doc.setLineWidth(1);
  //       doc.rect(
  //         10,
  //         10,
  //         doc.internal.pageSize.width - 20,
  //         doc.internal.pageSize.height - 20
  //       );

  //       // Save PDF
  //       const fileName = `EarthSome-Invoice-${orderId}-${
  //         orderDate.toISOString().split("T")[0]
  //       }.pdf`;
  //       doc.save(fileName);
  //     } catch (error) {
  //       console.error("Error generating invoice:", error);
  //       alert("Error generating invoice. Please try again.");
  //     }
  //   };

  const generateInvoice = () => {
    try {
      const doc = new jsPDF();

      const orderId = getOrderId(order);
      const customerName = order.shippingAddress?.fullName || "Customer";
      const customerEmail = order.shippingAddress?.email || "";
      const orderDate = new Date(order.createdAt);

      doc.setFont("helvetica");

      // Company header with green theme
      doc.setFontSize(28);
      doc.setTextColor(34, 197, 94);
      doc.text("🌱 EarthSome", 20, 25);

      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text("Sustainable Living Made Simple", 20, 32);
      doc.text("Email: contact@earthsome.com | Phone: +91 1234567890", 20, 38);

      // Invoice details
      doc.setFontSize(20);
      doc.setTextColor(0, 0, 0);
      doc.text("INVOICE", 150, 25);

      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Invoice #: ${orderId}`, 150, 35);
      doc.text(`Date: ${orderDate.toLocaleDateString("en-IN")}`, 150, 42);
      doc.text(`Status: ${order.orderStatus.toUpperCase()}`, 150, 49);

      // Customer details
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text("Bill To:", 20, 65);

      doc.setFontSize(11);
      doc.text(customerName, 20, 75);
      doc.text(customerEmail, 20, 82);

      if (order.shippingAddress) {
        const addr = order.shippingAddress;
        doc.text(addr.addressLine1, 20, 89);
        if (addr.addressLine2) doc.text(addr.addressLine2, 20, 96);
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

      // Prepare table data (without ₹ symbol)
      const tableData =
        order.items?.map((item, index) => [
          index + 1,
          item.name || item.productId?.productName || "Eco Product",
          item.quantity,
          item.price?.toFixed(2), // no ₹ symbol
          (item.price * item.quantity).toFixed(2), // no ₹ symbol
        ]) || [];

      // Log table data for debugging
      console.log("Invoice Table Data:", tableData);

      // Page width & margins for centering table
      const pageWidth = doc.internal.pageSize.getWidth();
      const totalColumnWidth = 15 + 75 + 20 + 30 + 30;
      const marginLeft = (pageWidth - totalColumnWidth) / 2;
      const marginRight = marginLeft;

      // Render table
      autoTable(doc, {
        head: [["#", "Product", "Qty", "Price", "Total"]],
        body: tableData,
        startY: 130,
        theme: "striped",
        margin: { left: marginLeft, right: marginRight },
        styles: {
          fontSize: 10,
          cellPadding: 4,
          overflow: "linebreak",
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
        alternateRowStyles: { fillColor: [248, 250, 252] },
        columnStyles: {
          0: { cellWidth: 15, halign: "center" },
          1: { cellWidth: 75, halign: "left" },
          2: { cellWidth: 20, halign: "center" },
          3: { cellWidth: 30, halign: "right" },
          4: { cellWidth: 30, halign: "right" },
        },
      });

      // Totals
      const finalY = doc.lastAutoTable.finalY + 20;
      const subtotal =
        order.items?.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ) || 0;
      const discount = order.couponApplied?.discount || 0;
      const total = order.totalAmount || subtotal - discount;

      const totalsX = marginLeft + 100;
      doc.setFontSize(11);

      doc.text("Subtotal:", totalsX, finalY);
      doc.text(subtotal.toFixed(2), totalsX + 50, finalY, { align: "right" });

      if (discount > 0) {
        doc.setTextColor(34, 197, 94);
        doc.text(
          `Discount (${order.couponApplied?.code}):`,
          totalsX,
          finalY + 8
        );
        doc.text(`-${discount.toFixed(2)}`, totalsX + 50, finalY + 8, {
          align: "right",
        });
        doc.setTextColor(0, 0, 0);
      }

      // Final total
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      const totalY = discount > 0 ? finalY + 16 : finalY + 8;
      doc.text("Total:", totalsX, totalY);
      doc.setTextColor(34, 197, 94);
      doc.text(total.toFixed(2), totalsX + 50, totalY, { align: "right" });
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
        `Generated on: ${new Date().toLocaleString("en-IN")}`,
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

      // Save file
      const fileName = `EarthSome-Invoice-${orderId}-${
        orderDate.toISOString().split("T")[0]
      }.pdf`;
      doc.save(fileName);
    } catch (error) {
      console.error("Error generating invoice:", error);
      alert("Error generating invoice. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 ">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-screen overflow-y-auto shadow-2xl">
        {/* Enhanced Header */}
        <div className="sticky top-0 z-50 bg-gradient-to-r from-green-500 to-green-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">Order Details</h2>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-green-100">#{getOrderId(order)}</span>
                <button
                  onClick={copyOrderId}
                  className="p-1 hover:bg-green-400 rounded transition-colors"
                  title="Copy Order ID"
                >
                  <Copy size={16} />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={generateInvoice}
                className="flex items-center gap-2 px-4 py-2 bg-white text-green-600 rounded-lg hover:bg-green-50 transition-colors font-medium"
              >
                <Download size={16} />
                Invoice
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-green-400 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Enhanced Order Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Order Information Card */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-blue-600" />
                  </div>
                  Order Information
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order Date:</span>
                      <span className="font-medium text-gray-600">
                        {formatDate(order.createdAt)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment:</span>
                      <span className="font-medium text-gray-600">
                        {order.paymentMethod}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Items:</span>
                      <span className="font-medium text-gray-600">
                        {order.items?.length || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Amount:</span>
                      <span className="font-bold text-green-600 text-lg ">
                        ₹{order.totalAmount?.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <label className="text-sm text-gray-600 block mb-2">
                    Order Status
                  </label>
                  <StatusBadge
                    status={order.orderStatus}
                    type="order"
                    size="lg"
                  />
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <label className="text-sm text-gray-600 block mb-2">
                    Payment Status
                  </label>
                  <StatusBadge
                    status={order.paymentStatus}
                    type="payment"
                    size="lg"
                  />
                </div>
              </div>
            </div>

            {/* Customer & Shipping Info */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
                <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-green-600" />
                  </div>
                  Shipping Address
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-black" />
                    <span className="font-medium text-gray-600">
                      {order.shippingAddress?.fullName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={16} className="text-black" />
                    <span className="text-gray-600">
                      {order.shippingAddress?.mobileNumber}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-black" />
                    <span className="truncate text-gray-600">
                      {order.shippingAddress?.email}
                    </span>
                  </div>
                  <div className="flex items-start gap-2 mt-3 p-3 bg-white rounded-lg">
                    <MapPin
                      size={16}
                      className="text-black mt-0.5 flex-shrink-0"
                    />
                    <div className="text-sm text-gray-600">
                      <p>{order.shippingAddress?.addressLine1}</p>
                      {order.shippingAddress?.addressLine2 && (
                        <p>{order.shippingAddress.addressLine2}</p>
                      )}
                      <p className="font-medium">
                        {order.shippingAddress?.city},{" "}
                        {order.shippingAddress?.state}
                      </p>
                      <p className="text-gray-600">
                        {order.shippingAddress?.pincode}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Timeline */}
          <OrderTimeline order={order} />

          {/* Enhanced Order Items */}
          <div>
            <h3 className="font-bold text-gray-900 text-xl mb-6 flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-purple-600" />
              </div>
              Order Items ({order.items?.length || 0})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {order.items?.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="flex items-start gap-4">
                    <ProductImage item={item} size="lg" />
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-green-600 transition-colors">
                        {item.name ||
                          item.productId?.productName ||
                          "Eco-Friendly Product"}
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Quantity:</span>
                          <span className="font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                            {item.quantity}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Unit Price:</span>
                          <span className="font-medium text-gray-600">
                            ₹{item.price?.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-base border-t pt-3">
                          <span className="font-medium text-gray-700">
                            Total:
                          </span>
                          <span className="font-bold text-green-600 text-xl">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced Coupon Information */}
          {order.couponApplied && (
            <div className="bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200 rounded-2xl p-6">
              <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-green-200 rounded-lg flex items-center justify-center">
                  <Tag className="w-4 h-4 text-green-700" />
                </div>
                Coupon Applied
              </h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-green-500 text-white px-4 py-2 rounded-lg font-bold">
                    {order.couponApplied.code}
                  </div>
                  <span className="text-green-700 font-medium">
                    Congratulations! You saved money! 🎉
                  </span>
                </div>
                <span className="text-green-600 font-bold text-xl">
                  -₹{order.couponApplied.discount?.toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Footer */}
        <div className="bg-gray-50 p-6 rounded-b-2xl">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <p>Need help? Contact our support team</p>
              <p className="text-green-600 font-medium">
                support@earthsome.com
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main My Orders Page Component with enhanced UI
const MyOrdersPage = () => {
  const { data: session, status } = useSession();

  // State Management
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  const fetchMyOrders = useCallback(async () => {
    // We don't need to set loading true here, it's handled by the initial state
    // and the effect's logic.
    try {
      let url;
      if (status === "authenticated" && session?.user?.email) {
        url = `${NEXT_PUBLIC_API_URL}/api/orders/email/${encodeURIComponent(
          session.user.email
        )}`;
        console.log(url);
      } else {
        const guestId = localStorage.getItem("guestId");
        if (!guestId) {
          setOrders([]);
          setLoading(false); // Make sure to stop loading if no guestId
          return;
        }
        url = `${NEXT_PUBLIC_API_URL}/api/orders/guest/${guestId}`;
        console.log(url);
      }

      const response = await fetch(url);
      if (!response.ok) {
        // Handle API errors more gracefully
        throw new Error(`API responded with status: ${response.status}`);
      }
      const data = await response.json();

      console.log("Fetched Orders:", data); // IMPORTANT: Add for debugging

      if (Array.isArray(data)) {
        setOrders(
          data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        );
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]); // Clear orders on error
    } finally {
      setLoading(false); // This is crucial and correctly placed
    }
  }, [status, session?.user?.email]);

  useEffect(() => {
    // Only fetch orders when the session status is determined (not 'loading')
    if (status !== "loading") {
      fetchMyOrders();
    }
  }, [status, fetchMyOrders]);

  // Filter orders based on search term
  const filteredOrders = orders.filter((order) => {
    if (!searchTerm) return true;
    const orderDisplayId =
      order.razorpayOrderId || order._id?.slice(-8).toUpperCase() || "";
    return (
      orderDisplayId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items?.some((item) =>
        (item.name || "").toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  });

  // Utility functions
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays - 1} days ago`;

    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getOrderId = (order) => {
    return order.razorpayOrderId || order._id?.slice(-8).toUpperCase() || "N/A";
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-green-600 font-medium">
            Loading your orders...
          </p>
          <p className="text-sm text-black mt-1">
            Please wait while we fetch your order history
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900">My Orders</h1>
              </div>
              <p className="text-gray-600 text-lg">
                Track your eco-friendly journey and order history
              </p>
              {session?.user && (
                <div className="flex items-center mt-4 p-3 bg-white rounded-lg shadow-sm border border-gray-100">
                  <div className="flex items-center">
                    {session.user.image && (
                      <Image
                        src={session.user.image}
                        alt={session.user.name}
                        width={32}
                        height={32}
                        className="rounded-full mr-3"
                      />
                    )}
                    <div>
                      <span className="text-gray-700 font-medium">
                        Welcome back, {session.user.name}! 👋
                      </span>
                      <p className="text-sm text-gray-500">
                        Thanks for choosing sustainable products
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={fetchMyOrders}
                className="flex items-center gap-2 bg-white text-green-600 px-6 py-5 rounded-xl hover:bg-green-50 transition-all duration-300 font-medium shadow-lg border border-green-200"
              >
                <RefreshCw size={18} />
                Refresh
              </button>
              <div className="bg-white px-6 py-2 rounded-xl shadow-lg border border-gray-200 ">
                <div className="text-sm text-gray-500 h-4 ">Total Orders</div>
                <div className="text-2xl font-bold text-green-600">
                  {filteredOrders.length}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Search */}
        <div className="mb-8">
          <div className="relative max-w-lg">
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search orders by ID or product name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-200 text-black rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white shadow-sm text-lg"
            />
          </div>
        </div>

        {/* Enhanced Quick Stats */}
        {filteredOrders.length > 0 && (
          <div className="mb-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: "Total Orders",
                value: filteredOrders.length,
                color: "from-blue-500 to-blue-600",
                icon: ShoppingBag,
                bgColor: "from-blue-50 to-blue-100",
              },
              {
                label: "Delivered",
                value: filteredOrders.filter(
                  (o) => o.orderStatus === "delivered"
                ).length,
                color: "from-green-500 to-green-600",
                icon: CheckCircle,
                bgColor: "from-green-50 to-green-100",
              },
              {
                label: "In Transit",
                value: filteredOrders.filter((o) => o.orderStatus === "shipped")
                  .length,
                color: "from-purple-500 to-purple-600",
                icon: Truck,
                bgColor: "from-purple-50 to-purple-100",
              },
              {
                label: "Total Spent",
                value: `₹${filteredOrders
                  .reduce((sum, order) => sum + (order.totalAmount || 0), 0)
                  .toLocaleString("en-IN")}`,
                color: "from-green-500 to-emerald-600",
                icon: Tag,
                bgColor: "from-green-50 to-emerald-100",
              },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className={`bg-gradient-to-br ${stat.bgColor} border border-white/50 rounded-2xl p-6 shadow-lg`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}
                    >
                      <Icon size={24} className="text-white" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Enhanced Orders List */}
        {filteredOrders.length > 0 ? (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-2xl border border-gray-200 hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group"
                onClick={() => {
                  setSelectedOrder(order);
                  setShowOrderModal(true);
                }}
              >
                {/* Order Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <h3 className="text-xl font-bold text-gray-900">
                          #{getOrderId(order)}
                        </h3>
                        <StatusBadge
                          status={order.orderStatus}
                          type="order"
                          size="lg"
                        />
                        <StatusBadge
                          status={order.paymentStatus}
                          type="payment"
                        />
                      </div>
                      <div className="flex items-center gap-6 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} />
                          <span>{formatDate(order.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Package size={16} />
                          <span>
                            {order.items?.length || 0} item
                            {(order.items?.length || 0) !== 1 ? "s" : ""}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {order.paymentMethod}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between lg:flex-col lg:items-end gap-4">
                      <div className="text-right">
                        <p className="text-3xl font-bold text-green-600">
                          ₹{order.totalAmount?.toLocaleString("en-IN")}
                        </p>
                        {order.couponApplied && (
                          <div className="flex items-center gap-1 text-sm text-green-600 mt-1">
                            <Tag size={12} />
                            <span>
                              Saved ₹{order.couponApplied.discount?.toFixed(2)}
                            </span>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedOrder(order);
                          setShowOrderModal(true);
                        }}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 font-medium shadow-lg group-hover:shadow-xl"
                      >
                        <Eye size={16} />
                        View Details
                        <ChevronRight
                          size={16}
                          className="group-hover:translate-x-1 transition-transform"
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Enhanced Product Preview */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-900">Order Items</h4>
                    <span className="text-sm text-gray-500">
                      {order.items?.length} items
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                    {order.items?.slice(0, 6).map((item, idx) => (
                      <div key={idx} className="group/item">
                        <div className="relative">
                          <ProductImage item={item} size="lg" />
                          {/* <div className="absolute inset-0 bg-black opacity-0 group-hover/item:opacity-20 transition-opacity duration-200 rounded-xl"></div> */}
                        </div>
                        <div className="mt-2">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {item.name ||
                              item.productId?.productName ||
                              "Eco Product"}
                          </p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-gray-500">
                              Qty: {item.quantity}
                            </span>
                            <span className="text-sm font-bold text-green-600">
                              ₹{item.price?.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                    {order.items?.length > 6 && (
                      <div className="flex items-center justify-center">
                        <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-500">
                          <MoreHorizontal size={24} />
                          <span className="text-sm font-medium mt-2">
                            +{order.items.length - 6} more
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Enhanced Empty State */
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl p-12 max-w-lg mx-auto shadow-xl">
              <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {searchTerm ? "No orders found" : "Start your eco journey!"}
              </h3>
              <p className="text-gray-600 mb-8 text-lg">
                {searchTerm
                  ? "Try adjusting your search terms to find your orders."
                  : "You haven't placed any orders yet. Discover our sustainable products and make your first eco-friendly purchase!"}
              </p>
              {searchTerm ? (
                <button
                  onClick={() => setSearchTerm("")}
                  className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 font-medium shadow-lg"
                >
                  Clear Search
                </button>
              ) : (
                <div className="space-y-4">
                  <Link href='/all-product'>
                  <button className="w-full px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 font-medium shadow-lg">
                    🌱 Start Shopping Now
                  </button>
                  </Link>
                  <p className="text-sm text-gray-500">
                    Join thousands of customers making sustainable choices
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Enhanced Recent Activity */}
        {filteredOrders.length > 0 && (
          <div className="mt-12 bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Recent Activity
                </h3>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {filteredOrders.slice(0, 5).map((order, index) => (
                  <div
                    key={order._id}
                    className="flex items-center justify-between py-3 hover:bg-gray-50 rounded-lg px-3 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          order.orderStatus === "delivered"
                            ? "bg-green-500"
                            : order.orderStatus === "shipped"
                            ? "bg-blue-500"
                            : order.orderStatus === "confirmed"
                            ? "bg-purple-500"
                            : "bg-yellow-500"
                        } shadow-lg`}
                      ></div>
                      <div>
                        <span className="font-medium text-gray-900">
                          Order #{getOrderId(order)}
                        </span>
                        <span className="text-gray-600 ml-2">
                          was {order.orderStatus} • ₹
                          {order.totalAmount?.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500 font-medium">
                      {formatDate(order.updatedAt || order.createdAt)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Order Details Modal */}
      <OrderDetailsModal
        order={selectedOrder}
        isOpen={showOrderModal}
        onClose={() => {
          setShowOrderModal(false);
          setSelectedOrder(null);
        }}
      />
    </div>
  );
};

export default MyOrdersPage;
