// "use client";
// import { useState, useEffect } from "react";
// import { useSession, signOut } from "next-auth/react";
// import Link from "next/link";
// import Image from "next/image";
// import { Menu, X, ChevronDown, LogOut, User } from "lucide-react";
// import SearchModal from "../UI/SearchModal";
// import { useCart } from "@/context/CartContext";

// const Navbar = () => {
//   const { data: session, status } = useSession();
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [lastScrollTop, setLastScrollTop] = useState(0);
//   const [isVisible, setIsVisible] = useState(true);
//   const [productDropdownOpen, setProductDropdownOpen] = useState(false);
//   const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => {
//       const scrollTop =
//         window.pageYOffset || document.documentElement.scrollTop;
//       setIsVisible(scrollTop < lastScrollTop || scrollTop < 50); // Show navbar at top
//       setLastScrollTop(scrollTop <= 0 ? 0 : scrollTop);
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, [lastScrollTop]);

//   // Close dropdowns when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (!event.target.closest(".profile-dropdown-container")) {
//         setProfileDropdownOpen(false);
//       }
//     };
//     document.addEventListener("click", handleClickOutside);
//     return () => document.removeEventListener("click", handleClickOutside);
//   }, []);

//   const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
//   const handleLinkClick = () => isMenuOpen && setIsMenuOpen(false);

//   const handleLogout = () => {
//     signOut({ callbackUrl: "/" });
//     setProfileDropdownOpen(false);
//   };

//   const items = [
//     { title: "Home", link: "/" },
//     { title: "About Us", link: "/About" },
//     { title: "Products", link: "/all-product" },
//     { title: "Contact Us", link: "/Contact" },
//     { title: "Orders", link: "/orders" },
//   ];

//   const productDropdownItems = [
//     { title: "Gummies", link: "/category/Gummies" },
//     { title: "Protein & Energy", link: "/category/Protein%20%26%20Energy" },
//     { title: "Wellness", link: "/category/Wellness" },
//     { title: "Baby Care", link: "/category/Baby%20Care" },
//     { title: "Personal Care", link: "/category/Personal%20Care" },
//     { title: "All Products", link: "/all-featured" }, // Changed link for clarity
//   ];

//   const { cartItems } = useCart();

//   const totalPrice = cartItems.reduce(
//     (acc, item) => acc + item.price * item.quantity,
//     0
//   );
//   const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

//   // Auth button component based on session state (No changes needed here)
//   const AuthButton = () => {
//     if (status === "loading") {
//       return (
//         <div className="flex items-center gap-2">
//           <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
//           <span className="text-sm font-medium hidden lg:block text-gray-400">
//             Loading...
//           </span>
//         </div>
//       );
//     }

//     if (!session?.user) {
//       return (
//         <Link
//           href="/Login"
//           className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition-colors"
//         >
//           <div className="p-2 hover:bg-gray-100 rounded-full">
//             <User className="w-[22px] h-[22px]" />
//           </div>
//           <span className="text-sm font-medium hidden lg:block">Login</span>
//         </Link>
//       );
//     }

//     return (
//       <div className="profile-dropdown-container relative">
//         <button
//           onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
//           className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition-colors"
//         >
//           <div className="relative">
//             {session.user.image ? (
//               <Image
//                 src={session.user.image}
//                 alt="Profile"
//                 width={32}
//                 height={32}
//                 className="w-8 h-8 rounded-full border-2 border-gray-200 hover:border-green-400 transition-colors"
//                 priority
//               />
//             ) : (
//               <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
//                 <User className="w-4 h-4 text-gray-600" />
//               </div>
//             )}
//           </div>
//           <span className="text-sm font-medium hidden lg:block max-w-[100px] truncate">
//             {session.user.name || session.user.email}
//           </span>
//           <ChevronDown className="w-4 h-4 hidden lg:block" />
//         </button>

//         {profileDropdownOpen && (
//           <div className="absolute top-full right-0 mt-2 w-48 bg-white shadow-lg rounded-lg border border-gray-200 py-2 z-50">
//             <div className="px-4 py-2 border-b border-gray-100">
//               <p className="text-sm font-medium text-gray-900 truncate">
//                 {session.user.name}
//               </p>
//               <p className="text-xs text-gray-500 truncate">
//                 {session.user.email}
//               </p>
//             </div>
//             <Link
//               href="/Profile"
//               className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-green-600"
//               onClick={() => setProfileDropdownOpen(false)}
//             >
//               <User className="w-4 h-4" />
//               Profile
//             </Link>
//             <button
//               onClick={handleLogout}
//               className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
//             >
//               <LogOut className="w-4 h-4" />
//               Logout
//             </button>
//           </div>
//         )}
//       </div>
//     );
//   };

//   return (
//     <nav
//       className={`w-full bg-white/60 backdrop-blur-md fixed top-0 left-0 transition-all duration-300 ease-in-out z-40 ${
//         isVisible
//           ? "opacity-100 pointer-events-auto"
//           : "opacity-0 pointer-events-none delay-200"
//       }`}
//     >
//       <div className="w-full px-2 md:px-4">
//         <div className="flex h-24 items-center justify-between lg:justify-around">
//           {/* Logo */}
//           <div className="flex items-center h-full w-[200px] xl:w-[250px]">
//             <Link href="/" className="flex items-center gap-2 h-full xl:p-3">
//               <Image
//                 src="/logo.png"
//                 alt="Careertronics"
//                 width={120}
//                 height={50}
//                 className="w-full p-0"
//                 priority
//               />
//             </Link>
//           </div>

//           {/* Center Navigation */}
//           <div className="hidden lg:flex items-center justify-center gap-6">
//             {items.map((item) =>
//               item.title === "Products" ? (
//                 // ===== DESKTOP CHANGE START =====
//                 <div key={item.title} className="relative group">
//                   {/* Container for the link and chevron */}
//                   <div className="flex items-center gap-1 text-sm font-medium text-black group-hover:text-green-600 cursor-pointer">
//                     <Link href={item.link} className="py-1">
//                       {item.title}
//                     </Link>
//                     <ChevronDown className="w-4 h-4" />
//                   </div>
//                   {/* Dropdown remains the same, triggered by group-hover */}
//                   <div className="absolute top-full left-0 mt-2 w-48 bg-white shadow-md rounded-lg opacity-0 group-hover:opacity-100 group-hover:visible invisible transition-all duration-300 z-50 py-1">
//                     {productDropdownItems.map((subItem) => (
//                       <Link
//                         key={subItem.title}
//                         href={subItem.link}
//                         className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-green-600"
//                       >
//                         {subItem.title}
//                       </Link>
//                     ))}
//                   </div>
//                 </div>
//               ) : (
//                 // ===== DESKTOP CHANGE END =====
//                 <Link
//                   key={item.title}
//                   href={item.link}
//                   className="relative py-1 text-sm font-medium text-black hover:text-green-600 group"
//                 >
//                   <span>{item.title}</span>
//                   <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-green-500 group-hover:w-full transition-all duration-300"></span>
//                 </Link>
//               )
//             )}
//           </div>

//           {/* Right side */}
//           <div className="flex items-center gap-2 md:gap-8">
//             <AuthButton />
//             <SearchModal />
//             <Link href="/cart" className="group">
//               <div className="relative flex items-center md:gap-2.5 bg-black hover:bg-gray-800 rounded-full transition-all duration-200 shadow-sm hover:shadow-md justify-center">
//                 {/* Mobile Cart */}
//                 <div className="flex md:hidden items-center px-3.5 py-2.5">
//                   <div className="relative">
//                     <Image
//                       src="/Cart_Icon.svg"
//                       alt="Cart"
//                       width={22}
//                       height={22}
//                       className="filter brightness-0 invert"
//                       priority
//                     />
//                     {totalItems > 0 && (
//                       <div className="absolute -top-2 -right-2 min-w-[20px] h-[20px] bg-green-400 text-black text-[11px] font-bold rounded-full flex items-center justify-center px-1.5 border border-black">
//                         {totalItems > 99 ? "99+" : totalItems}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//                 {/* Desktop Cart */}
//                 <div className="hidden md:flex items-center gap-2.5 px-4 py-2.5 min-h-[44px] min-w-[100px]">
//                   <div className="relative">
//                     <Image
//                       src="/Cart_Icon.svg"
//                       alt="Cart"
//                       width={22}
//                       height={22}
//                       className="filter brightness-0 invert"
//                       priority
//                     />
//                     {totalItems > 0 && (
//                       <div className="absolute -top-2 -right-2 min-w-[20px] h-5 bg-green-400 text-black text-xs font-bold rounded-full flex items-center justify-center px-1 border border-black">
//                         {totalItems > 99 ? "99+" : totalItems}
//                       </div>
//                     )}
//                   </div>
//                   <span className="text-white text-sm font-semibold">
//                     ₹{totalPrice.toFixed(0)}
//                   </span>
//                 </div>
//               </div>
//             </Link>

//             {/* Hamburger */}
//             <button
//               onClick={toggleMenu}
//               className="p-1 md:p-2 rounded-lg text-green-700 lg:hidden border border-green-500 hover:bg-green-100 transition-colors"
//             >
//               {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
//             </button>
//           </div>
//         </div>

//         {/* Mobile Menu */}
//         <div
//           className={`fixed inset-x-0 top-24 bg-white/95 backdrop-blur-sm border-b border-gray-200 lg:hidden transition-all duration-300 ease-in-out ${
//             isMenuOpen
//               ? "opacity-100 visible"
//               : "opacity-0 invisible pointer-events-none"
//           }`}
//           style={{
//             maxHeight: isMenuOpen ? "calc(100vh - 6rem)" : "0",
//             overflowY: "auto",
//           }}
//         >
//           <div className="px-4 py-2 space-y-1 mt-2 mb-4">
//             {items.map((item) =>
//               item.title === "Products" ? (
//                 // ===== MOBILE CHANGE START =====
//                 <div key={item.title} className="flex flex-col gap-1">
//                   <div className="flex justify-between items-center w-full px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
//                     <Link
//                       href={item.link}
//                       onClick={handleLinkClick}
//                       className="text-sm font-medium text-black hover:text-green-600 flex-grow"
//                     >
//                       {item.title}
//                     </Link>
//                     <button
//                       onClick={() =>
//                         setProductDropdownOpen(!productDropdownOpen)
//                       }
//                       className="p-1 -mr-1" // Add padding for easier tapping
//                     >
//                       <ChevronDown
//                         className={`w-5 h-5 transition-transform ${
//                           productDropdownOpen ? "rotate-180" : "rotate-0"
//                         }`}
//                       />
//                     </button>
//                   </div>
//                   {productDropdownOpen && (
//                     <div className="ml-4 mt-1 flex flex-col gap-1 border-l-2 border-gray-200 pl-3">
//                       {productDropdownItems.map((subItem) => (
//                         <Link
//                           key={subItem.title}
//                           href={subItem.link}
//                           onClick={handleLinkClick}
//                           className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-gray-100"
//                         >
//                           {subItem.title}
//                         </Link>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               ) : (
//                 // ===== MOBILE CHANGE END =====
//                 <Link
//                   key={item.title}
//                   href={item.link}
//                   onClick={handleLinkClick}
//                   className="block px-3 py-2 rounded-lg text-sm font-medium text-black hover:text-green-600 hover:bg-gray-100 transition-colors"
//                 >
//                   {item.title}
//                 </Link>
//               )
//             )}

//             {/* Mobile Auth Section */}
//             {session?.user && (
//               <div className="border-t border-gray-200 pt-2 mt-2">
//                 <div className="flex items-center gap-3 px-3 py-2">
//                   {/* ... (rest of the mobile auth section is fine) ... */}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

"use client";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronDown, LogOut, User, Search } from "lucide-react";
import SearchModal from "../UI/SearchModal";
import { useCart } from "@/context/CartContext";

const Navbar = () => {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [productDropdownOpen, setProductDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      setIsVisible(scrollTop < lastScrollTop || scrollTop < 50); // Show navbar at top
      setLastScrollTop(scrollTop <= 0 ? 0 : scrollTop);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollTop]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".profile-dropdown-container")) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const handleLinkClick = () => isMenuOpen && setIsMenuOpen(false);

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
    setProfileDropdownOpen(false);
  };

  const items = [
    { title: "Home", link: "/" },
    { title: "About Us", link: "/About" },
    { title: "Products", link: "/all-product" },
    { title: "Contact Us", link: "/Contact" },
    { title: "Orders", link: "/orders" },
  ];

  const productDropdownItems = [
    { title: "Gummies", link: "/category/Gummies" },
    { title: "Protein & Energy", link: "/category/Protein%20%26%20Energy" },
    { title: "Wellness", link: "/category/Wellness" },
    { title: "Baby Care", link: "/category/Baby%20Care" },
    { title: "Personal Care", link: "/category/Personal%20Care" },
    { title: "All Products", link: "/all-product" },
  ];

  const { cartItems } = useCart();

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const AuthButton = () => {
    if (status === "loading") {
      return (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium hidden lg:block text-gray-400">
            Loading...
          </span>
        </div>
      );
    }

    if (!session?.user) {
      return (
        <Link
          href="/Login"
          className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition-colors"
        >
          <div className="p-2 hover:bg-gray-100 rounded-full">
            <User className="w-[22px] h-[22px]" />
          </div>
          <span className="text-sm font-medium hidden lg:block">Login</span>
        </Link>
      );
    }

    return (
      <div className="profile-dropdown-container relative">
        <button
          onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
          className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition-colors"
        >
          <div className="relative">
            {session.user.image ? (
              <Image
                src={session.user.image}
                alt="Profile"
                width={32}
                height={32}
                className="w-8 h-8 rounded-full border-2 border-gray-200 hover:border-green-400 transition-colors"
                priority
              />
            ) : (
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-gray-600" />
              </div>
            )}
          </div>
          <span className="text-sm font-medium hidden lg:block max-w-[100px] truncate">
            {session.user.name || session.user.email}
          </span>
          <ChevronDown className="w-4 h-4 hidden lg:block" />
        </button>

        {profileDropdownOpen && (
          <div className="absolute top-full right-0 mt-2 w-48 bg-white shadow-lg rounded-lg border border-gray-200 py-2 z-50">
            <div className="px-4 py-2 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-900 truncate">
                {session.user.name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {session.user.email}
              </p>
            </div>
            <Link
              href="/Profile"
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-green-600"
              onClick={() => setProfileDropdownOpen(false)}
            >
              <User className="w-4 h-4" />
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <nav
        className={`w-full bg-white/60 backdrop-blur-md fixed top-0 left-0 transition-all duration-300 ease-in-out z-40 ${
          isVisible
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none delay-200"
        }`}
      >
        <div className="w-full px-2 md:px-4">
          <div className="flex h-16 lg:h-24 items-center justify-between lg:justify-around">
            {/* Logo - Mobile */}
            <div className="flex items-center h-full w-[120px] lg:w-[200px] xl:w-[250px]">
              <Link href="/" className="flex items-center gap-2 h-full xl:p-3">
                <Image
                  src="/logo.png"
                  alt="Careertronics"
                  width={120}
                  height={50}
                  className="w-full p-0"
                  priority
                />
              </Link>
            </div>

            {/* Mobile Icons */}
            <div className="flex lg:hidden items-center gap-4">
              <button
                onClick={() => setSearchModalOpen(true)}
                className="p-1 text-gray-700 hover:text-green-600"
              >
                <Search className="w-5 h-5" />
              </button>

              <Link href="/cart" className="relative">
                <Image
                  src="/Cart_Icon.svg"
                  alt="Cart"
                  width={22}
                  height={22}
                  className="filter brightness-0"
                  priority
                />
                {totalItems > 0 && (
                  <div className="absolute -top-2 -right-2 min-w-[20px] h-[20px] bg-green-400 text-black text-[11px] font-bold rounded-full flex items-center justify-center px-1.5 border border-black">
                    {totalItems > 99 ? "99+" : totalItems}
                  </div>
                )}
              </Link>

              <button
                onClick={toggleMenu}
                className="p-1 text-gray-700 hover:text-green-600"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* Center Navigation - Desktop */}
            <div className="hidden lg:flex items-center justify-center gap-6">
              {items.map((item) =>
                item.title === "Products" ? (
                  <div key={item.title} className="relative group">
                    <div className="flex items-center gap-1 text-sm font-medium text-black group-hover:text-green-600 cursor-pointer">
                      <Link href={item.link} className="py-1">
                        {item.title}
                      </Link>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white shadow-md rounded-lg opacity-0 group-hover:opacity-100 group-hover:visible invisible transition-all duration-300 z-50 py-1">
                      {productDropdownItems.map((subItem) => (
                        <Link
                          key={subItem.title}
                          href={subItem.link}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-green-600"
                        >
                          {subItem.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    key={item.title}
                    href={item.link}
                    className="relative py-1 text-sm font-medium text-black hover:text-green-600 group"
                  >
                    <span>{item.title}</span>
                    <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-green-500 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                )
              )}
            </div>

            {/* Right side - Desktop */}
            <div className="hidden lg:flex items-center gap-2 md:gap-8">
              <AuthButton />
              <SearchModal />
              <Link href="/cart" className="group">
                <div className="relative flex items-center md:gap-2.5 bg-black hover:bg-gray-800 rounded-full transition-all duration-200 shadow-sm hover:shadow-md justify-center">
                  <div className="hidden md:flex items-center gap-2.5 px-4 py-2.5 min-h-[44px] min-w-[100px]">
                    <div className="relative">
                      <Image
                        src="/Cart_Icon.svg"
                        alt="Cart"
                        width={22}
                        height={22}
                        className="filter brightness-0 invert"
                        priority
                      />
                      {totalItems > 0 && (
                        <div className="absolute -top-2 -right-2 min-w-[20px] h-5 bg-green-400 text-black text-xs font-bold rounded-full flex items-center justify-center px-1 border border-black">
                          {totalItems > 99 ? "99+" : totalItems}
                        </div>
                      )}
                    </div>
                    <span className="text-white text-sm font-semibold">
                      ₹{totalPrice.toFixed(0)}
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Mobile Menu */}
          <div
            className={`fixed inset-x-0 top-16 bg-white/95 backdrop-blur-sm border-b border-gray-200 lg:hidden transition-all duration-300 ease-in-out ${
              isMenuOpen
                ? "opacity-100 visible"
                : "opacity-0 invisible pointer-events-none"
            }`}
            style={{
              maxHeight: isMenuOpen ? "calc(100vh - 4rem)" : "0",
              overflowY: "auto",
            }}
          >
            <div className="px-4 py-2 space-y-1 mt-2 mb-4">
              {items.map((item) =>
                item.title === "Products" ? (
                  <div key={item.title} className="flex flex-col gap-1">
                    <div className="flex justify-between items-center w-full px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                      <Link
                        href={item.link}
                        onClick={handleLinkClick}
                        className="text-sm font-medium text-black hover:text-green-600 flex-grow"
                      >
                        {item.title}
                      </Link>
                      <button
                        onClick={() =>
                          setProductDropdownOpen(!productDropdownOpen)
                        }
                        className="p-1 -mr-1"
                      >
                        <ChevronDown
                          className={`w-5 h-5 transition-transform ${
                            productDropdownOpen ? "rotate-180" : "rotate-0"
                          }`}
                        />
                      </button>
                    </div>
                    {productDropdownOpen && (
                      <div className="ml-4 mt-1 flex flex-col gap-1 border-l-2 border-gray-200 pl-3">
                        {productDropdownItems.map((subItem) => (
                          <Link
                            key={subItem.title}
                            href={subItem.link}
                            onClick={handleLinkClick}
                            className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-gray-100"
                          >
                            {subItem.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={item.title}
                    href={item.link}
                    onClick={handleLinkClick}
                    className="block px-3 py-2 rounded-lg text-sm font-medium text-black hover:text-green-600 hover:bg-gray-100 transition-colors"
                  >
                    {item.title}
                  </Link>
                )
              )}

              {/* Mobile Auth Section */}
              <div className="border-t border-gray-200 pt-2 mt-2">
                {status === "loading" ? (
                  <div className="px-3 py-2 text-sm text-gray-500">
                    Loading...
                  </div>
                ) : session?.user ? (
                  <>
                    <div className="px-3 py-2 text-sm font-medium text-gray-900">
                      {session.user.name || session.user.email}
                    </div>
                    <Link
                      href="/Profile"
                      onClick={handleLinkClick}
                      className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        handleLinkClick();
                      }}
                      className="w-full text-left block px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    href="/Login"
                    onClick={handleLinkClick}
                    className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-gray-100"
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Search Modal for Mobile */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />
    </>
  );
};

export default Navbar;
