"use client";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, LogOut, User } from "lucide-react";
import SearchModal from "../UI/SearchModal";
import { useCart } from "@/context/CartContext";

// NavItems component that handles smooth hover effects like the reference
const NavItems = ({ items }) => {
  const pathname = usePathname();

  const isActiveLink = (link) => {
    if (link === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(link);
  };

  return (
    <div className="hidden md:flex items-center justify-center flex-1">
      <div className="flex items-center space-x-1">
        {items.map((item, index) => (
          <Link
            key={index}
            href={item.link}
            className={`
              relative px-4 py-2 text-sm font-medium transition-all duration-200 ease-out rounded-lg
              group hover:text-white
              ${isActiveLink(item.link) 
                ? "text-white" 
                : "text-white/80"
              }
            `}
          >
            <span className="relative z-10">
              {item.title}
            </span>
            
            {/* Hover underline effect - exactly like reference */}
            <span 
              className={`
                absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-white 
                transition-all duration-300 ease-out
                ${isActiveLink(item.link) 
                  ? "w-6" 
                  : "w-0 group-hover:w-6"
                }
              `} 
            />
            
            {/* Subtle hover background */}
            <span 
              className="absolute inset-0 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200" 
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

const Navbar = () => {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      setIsVisible(scrollTop < lastScrollTop || scrollTop < 50);
      setLastScrollTop(scrollTop <= 0 ? 0 : scrollTop);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollTop]);

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
  const handleLinkClick = () => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

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
    { title: "Home", link: "/" },
    { title: "All Products", link: "/all-product" },
    { title: "Gummies", link: "/category/Gummies" },
    { title: "Wellness", link: "/category/Wellness" },
    { title: "Baby Care", link: "/category/Baby%20Care" },
    { title: "Personal Care", link: "/category/Personal%20Care" },
  ];

  const { cartItems } = useCart();

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Function to check if a link is active
  const isActiveLink = (link) => {
    if (link === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(link);
  };

  const AuthButton = () => {
    if (status === "loading") {
      return (
        <div className="flex items-center gap-2 min-w-[54px] justify-center">
          <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse flex-shrink-0"></div>
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
          className="flex items-center gap-2 text-black hover:text-green-600 transition-colors duration-200 min-w-[44px] justify-center lg:justify-start"
        >
          <div className="p-2 hover:bg-gray-100 rounded-full flex-shrink-0 transition-colors duration-200">
            <User className="w-[22px] h-[22px]" />
          </div>
          <span className="text-md font-medium hidden lg:block">Login</span>
        </Link>
      );
    }

    return (
      <div className="profile-dropdown-container relative min-w-[44px]">
        <button
          onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
          className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition-colors duration-200 min-w-[44px] justify-center lg:justify-start w-full"
        >
          <div className="relative flex-shrink-0">
            {session.user.image ? (
              <Image
                src={session.user.image}
                alt="Profile"
                width={32}
                height={32}
                className="w-10 h-10 rounded-full border-2 border-gray-200 hover:border-green-400 transition-colors duration-200"
                priority
              />
            ) : (
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-200">
                <User className="w-4 h-4 text-gray-600" />
              </div>
            )}
          </div>
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
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-green-600 transition-colors duration-200"
              onClick={() => setProfileDropdownOpen(false)}
            >
              <User className="w-4 h-4" />
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
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
      {/* Main Navbar */}
      <nav
        className={`w-full bg-white/60 backdrop-blur-md h-20 fixed top-0 left-0 transition-all duration-300 ease-in-out z-40 border-b-1 border-green-500 ${
          isVisible
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none delay-200"
        }`}
      >
        <div className="w-full px-4 md:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center h-full md:ml-5">
              <Link href="/" className="flex items-center h-full">
                <Image
                  src="/esicon.png"
                  alt="Careertronics"
                  width={140}
                  height={80}
                  className="h-12 w-auto"
                  priority
                />
              </Link>
            </div>

            {/* Centered Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              <SearchModal />
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">
              {/* Orders Link */}
              <Link
                href="/orders"
                className={`hidden md:inline-block px-4 py-2 rounded-lg font-semibold transition-colors duration-200
                  ${
                    isActiveLink("/orders")
                      ? "bg-green-900 text-white"
                      : "bg-green-900 text-white hover:bg-green-700"
                  }`}
              >
                Orders
              </Link>

              {/* Auth Button */}
              <AuthButton />

              {/* Mobile Search */}
              <div className="md:hidden">
                <SearchModal />
              </div>

              {/* Hamburger Menu */}
              <button
                onClick={toggleMenu}
                className="p-2 rounded-lg text-gray-700 md:hidden hover:bg-gray-100 transition-colors duration-200"
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Secondary Navigation Bar - Desktop with Reference-Style Smooth Hover */}
      <nav
        className={`bg-green-900/95 backdrop-blur-md fixed top-20 left-0 hidden md:block w-full transition-all duration-300 ease-in-out z-30 ${
          isVisible
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none delay-200"
        }`}
      >
        <div className="w-full px-4 md:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-center">
            {/* Use the NavItems component for smooth hover effects */}
            <NavItems items={productDropdownItems} />
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div
        className={`fixed inset-x-0 top-16 bg-white border-b border-gray-200 md:hidden transition-all duration-300 ease-in-out z-30 ${
          isMenuOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none"
        }`}
        style={{
          maxHeight: isMenuOpen ? "calc(100vh - 4rem)" : "0",
          overflowY: "auto",
        }}
      >
        <div className="px-4 py-4 space-y-2">
          {/* Main Navigation Items */}
          {items
            .filter((item) => item.title !== "Orders")
            .map((item) => (
              <Link
                key={item.title}
                href={item.link}
                onClick={handleLinkClick}
                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  isActiveLink(item.link)
                    ? "text-green-600 bg-green-50"
                    : "text-gray-700 hover:text-green-600 hover:bg-gray-50"
                }`}
              >
                {item.title}
              </Link>
            ))}

          {/* Product Categories */}
          <div className="pt-4 border-t border-gray-200">
            <p className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Categories
            </p>
            {productDropdownItems.map((item) => (
              <Link
                key={item.title}
                href={item.link}
                onClick={handleLinkClick}
                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  isActiveLink(item.link)
                    ? "text-green-600 bg-green-50"
                    : "text-gray-700 hover:text-green-600 hover:bg-gray-50"
                }`}
              >
                {item.title}
              </Link>
            ))}
          </div>

          {/* Orders Link for Mobile */}
          <div className="pt-4 border-t border-gray-200">
            <Link
              href="/orders"
              onClick={handleLinkClick}
              className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                isActiveLink("/orders")
                  ? "text-green-600 bg-green-50"
                  : "text-gray-700 hover:text-green-600 hover:bg-gray-50"
              }`}
            >
              Orders
            </Link>
          </div>

          {/* Mobile Auth Section */}
          {session?.user && (
            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                <div className="relative flex-shrink-0">
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt="Profile"
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full border-2 border-gray-200"
                      priority
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-600" />
                    </div>
                  )}
                </div>
                <div className="flex-grow min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {session.user.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {session.user.email}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 flex-shrink-0"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Spacer to prevent content from hiding behind fixed navbar */}
      <div className="h-16 md:h-28"></div>
    </>
  );
};

export default Navbar;