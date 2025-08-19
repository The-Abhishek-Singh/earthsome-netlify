// // // 1️⃣ BASE LAYOUT FILE
// // // File: /components/AdminLayout.jsx

// // "use client";
// // import React from "react";
// // import Link from "next/link";
// // import { usePathname } from "next/navigation";
// // import { Package, Home, ShoppingCart, Users, BarChart2, Settings } from "lucide-react";

// // const navLinks = [
// //   { label: "Dashboard", icon: <Home size={18} />, path: "/admin/dashboard" },
// //   { label: "Products", icon: <Package size={18} />, path: "/admin/products" },
// //   { label: "Orders", icon: <ShoppingCart size={18} />, path: "/admin/orders" },
// //   // { label: "Customers", icon: <Users size={18} />, path: "/admin/customers" },
// //   { label: "Discounts", icon: <BarChart2 size={18} />, path: "/admin/discount" },
// //   // { label: "Settings", icon: <Settings size={18} />, path: "/admin/settings" },
// // ];

// // const AdminLayout = ({ children }) => {
// //   const pathname = usePathname();

// //   return (
// //     <div className="flex min-h-screen bg-gray-100">
// //       {/* Sidebar */}
// //       <aside className="w-64 bg-white border-r border-gray-200 p-4">
// //         <h2 className="text-2xl font-bold text-green-600 mb-8">Admin Panel</h2>
// //         <nav className="space-y-2">
// //           {navLinks.map((link) => (
// //             <Link
// //               key={link.path}
// //               href={link.path}
// //               className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
// //                 pathname === link.path
// //                   ? "bg-blue-100 text-blue-700"
// //                   : "text-gray-700 hover:bg-gray-50"
// //               }`}
// //             >
// //               {link.icon}
// //               {link.label}
// //             </Link>
// //           ))}
// //         </nav>
// //       </aside>

// //       {/* Main content */}
// //       <main className="flex-1 p-6 overflow-y-auto">{children}</main>
// //     </div>
// //   );
// // };

// // export default AdminLayout;

// "use client";
// import React, { useState } from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { Package, Home, ShoppingCart, BarChart2 } from "lucide-react";

// const navLinks = [
//   { label: "Dashboard", icon: Home, path: "/admin/dashboard" },
//   { label: "Products", icon: Package, path: "/admin/products" },
//   { label: "Orders", icon: ShoppingCart, path: "/admin/orders" },
//   { label: "Discounts", icon: BarChart2, path: "/admin/discount" },

// ];

// const AdminLayout = ({ children }) => {
//   const pathname = usePathname();
//   const [isOpen, setIsOpen] = useState(true); // default open, can be false if you want

//   return (
//     <div className="flex h-screen bg-gray-100 overflow-hidden">
//       {/* Sidebar */}
//       <aside
//         className={`bg-white border-r border-gray-200 p-4 flex-shrink-0 fixed left-0 top-0 h-screen transition-all duration-300
//           ${isOpen ? "w-64" : "w-20"}`}
//       >
//         {/* Toggle Button */}
//         <div
//           className="flex items-center justify-center mb-8 cursor-pointer"
//           onClick={() => setIsOpen(!isOpen)}
//         >
//           <h2 className="text-2xl font-bold text-green-600">
//             {isOpen ? "Admin Panel" : "AP"}
//           </h2>
//         </div>

//         {/* Navigation */}
//         <nav className="space-y-2">
//           {navLinks.map((link) => {
//             const Icon = link.icon;
//             const isActive = pathname === link.path;
//             return (
//               <Link
//                 key={link.path}
//                 href={link.path}
//                 className={`flex items-center rounded-md font-medium transition-colors
//                   ${
//                     isActive
//                       ? "bg-blue-100 text-blue-700"
//                       : "text-gray-700 hover:bg-gray-50"
//                   }
//                   ${isOpen ? "px-4 py-2 gap-3" : "justify-center p-3"}
//                 `}
//               >
//                 <Icon size={20} />
//                 {isOpen && <span>{link.label}</span>}
//               </Link>
//             );
//           })}
//         </nav>
//       </aside>

//       {/* Main Content */}
//       <main
//         className={`flex-1 p-6 overflow-y-auto transition-all duration-300 ${
//           isOpen ? "ml-64" : "ml-20"
//         }`}
//       >
//         {children}
//       </main>
//     </div>
//   );
// };

// export default AdminLayout;

"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Package,
  Home,
  ShoppingCart,
  BarChart2,
  Combine,
  Copy,
  Tag,
} from "lucide-react";

const navLinks = [
  { label: "Dashboard", icon: Home, path: "/admin/dashboard" },
  { label: "Products", icon: Package, path: "/admin/products" },
  { label: "Orders", icon: ShoppingCart, path: "/admin/orders" },
  { label: "Discounts", icon: BarChart2, path: "/admin/discount" },
  { label: "Offers", icon: Copy, path: "/admin/bogo" },
];

const AdminLayout = ({ children }) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true); // default open, can be false if you want

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`bg-white border-r border-gray-200 p-4 flex-shrink-0 fixed left-0 top-0 h-screen transition-all duration-300
          ${isOpen ? "w-64" : "w-20"}`}
      >
        {/* Toggle Button */}
        <div
          className="flex items-center justify-center mb-8 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <h2 className="text-2xl font-bold text-green-600">
            {isOpen ? "Admin Panel" : "AP"}
          </h2>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.path;
            return (
              <Link
                key={link.path}
                href={link.path}
                className={`flex items-center rounded-md font-medium transition-colors 
                  ${
                    isActive
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }
                  ${isOpen ? "px-4 py-2 gap-3" : "justify-center p-3"}
                `}
              >
                <Icon size={20} />
                {isOpen && <span>{link.label}</span>}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 p-6 overflow-y-auto transition-all duration-300 ${
          isOpen ? "ml-64" : "ml-20"
        }`}
      >
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
