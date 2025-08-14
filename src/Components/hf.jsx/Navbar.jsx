"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, LogIn, ChevronDown } from "lucide-react";
import SearchModal from "../UI/SearchModal";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [productDropdownOpen, setProductDropdownOpen] = useState(false); // mobile dropdown toggle

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setIsVisible(scrollTop < lastScrollTop);
      setLastScrollTop(scrollTop);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollTop]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const handleLinkClick = () => isMenuOpen && setIsMenuOpen(false);

  const items = [
    { title: "Home", link: "/" },
    { title: "About Us", link: "/about" },
    { title: "Products", link: "/products" },
    { title: "Contact Us", link: "/contact" },
  ];

  const productDropdownItems = [
    { title: "Product A", link: "/products/a" },
    { title: "Product B", link: "/products/b" },
    { title: "Product C", link: "/products/c" },
    { title: "Product D", link: "/products/d" },
    { title: "Product E", link: "/products/e" },
  ];

  return (
    <div   className={`w-full bg-white mb-4 mt-24 bg-opacity-90 fixed top-0 left-0 transition-all duration-300 ease-in-out z-40 ${
        isVisible
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none delay-200"
      }`}>

{/* Upper Navigation Bar */}

  <div
      className= "fixed top-0 left-0 w-full z-50 transition-transform duration-300 ease-in-out" 
      
      
    >
      <div className="bg-white h-24 w-full border border-b-gray-400">
        <div className="w-full px-2 md:px-4">
          <div className="flex h-24 items-center justify-between lg:justify-around">
            {/* Left section */}
            <div className="flex items-center h-full w-[200px] xl:w-[250px] ">
              <Link href="/" className="flex items-center gap-2 h-full xl:p-3">
                <Image
                  src="/logo.png"
                  alt="Earthsome Logo"
                  width={120}
                  height={50}
                  className="w-full p-0"
                  priority
                />
              </Link>
            </div>

            {/* center section */}
            <div className="flex items-center gap-2 md:gap-4 w-[50%] -ml-16">
              <SearchModal />
              <button
                onClick={toggleMenu}
                className="p-1 md:p-2 rounded-lg text-gray-100 lg:hidden bg-transparent border border-green-700 hover:bg-green-700 transition-colors"
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>



            {/* Right section */}

             <div className="flex items-center justify-end align-middle w-[20%] h-20">



<div className="flex items-center">


             <div>
              <Link href="/" className="flex items-center gap-2 h-full xl:p-3">
                <Image
                  src="/store.png"
                  alt="store "
                  width={28}
                  height={18}
                  className="w-full p-0"
                  priority
                />
              </Link>
            </div>

<div className="flex flex-col -space-y-1">
                <h1 className="text-black text-[12px]">Picking up?</h1>
                <h1 className="text-black ">Select Store </h1>

                </div>
           
               </div>


            </div>



          </div>

          {/* Mobile Menu */}
          <div
            className={`fixed inset-x-0 top-20 bg-black border-b border-gray-200 lg:hidden transition-all duration-300 ease-in-out ${
              isMenuOpen
                ? "opacity-100 visible"
                : "opacity-0 invisible pointer-events-none"
            }`}
            style={{
              maxHeight: isMenuOpen ? "calc(100vh - 5rem)" : "0",
              overflow: "hidden",
            }}
          >
            {/* Future mobile nav items go here */}
          </div>
        </div>
      </div>
    </div>




 {/* LOWER Navigation Bar */}

    <nav
      className= "w-full bg-white mb-4 mt-24 bg-opacity-90 fixed top-0 left-0 transition-all duration-300 ease-in-out z-40 border-2 border-b-green-400"
    >
      <div className="w-full px-2 md:px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Desktop Nav */}
          <div className="hidden lg:flex items-start gap-10 ml-16">
            {items.map((item) =>
              item.title === "Products" ? (
                <div key={item.title} className="relative group">
                  <button className="relative py-1 text-xs xl:text-sm font-medium text-black group-hover:text-black flex items-center gap-1">
                    {item.title}
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <div className="absolute left-0 top-full mt-1 bg-white shadow-lg rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 invisible group-hover:visible z-50">
                    <div className="py-2 w-48">
                      {productDropdownItems.map((subItem) => (
                        <Link
                          key={subItem.title}
                          href={subItem.link}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {subItem.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.title}
                  href={item.link}
                  className="relative py-1 text-xs xl:text-sm font-medium text-black hover:text-black group"
                >
                  <span>{item.title}</span>
                  <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-green-400 group-hover:w-full transition-all duration-300"></span>
                </Link>
              )
            )}
          </div>

<div className="flex items-center justify-end w-full lg:w-auto gap-4 ml-4">


  <button className="h-11 rounded-full w-32 border-2 border-black">

<div className="flex items-center justify-between ">

    <div>
              <Link href="/" className="flex items-center  h-full xl:p-3">
                <Image
                  src="/user.png"
                  alt="user "
                  width={9}
                  height={12}
                  className="w-full p-0"
                  priority
                />
              </Link>
            </div>


             <h1 className="text-black text-[15px] mr-6 font-bold">Account</h1>

             </div>

  </button>






{/* SECOND BUTTON */}





<Link
  href="/cart"
  className="h-11 rounded-full w-32 border-2 border-black bg-black flex items-center justify-center gap-2 px-3 "
>
  <Image
    src="/Cart_Icon.svg"
    alt="Cart"
    width={18}
    height={18}
    className="w-5 h-5"
    priority
  />
  <h1 className="text-white text-[16px] font-bold">$0.00</h1>
</Link>


</div>



        </div>

        {/* Mobile Menu */}
        <div
          className={`fixed inset-x-0 top-20 bg-black border-b border-gray-200  lg:hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
          }`}
          style={{
            maxHeight: isMenuOpen ? "calc(100vh - 5rem)" : "0",
            overflow: "hidden",
          }}
        >
          <div className="px-4 py-2 space-y-1 mt-2 mb-4">
            {items.map((item) =>
              item.title === "Products" ? (
                <div key={item.title} className="flex flex-col gap-1">
                  <button
                    onClick={() => setProductDropdownOpen(!productDropdownOpen)}
                    className="flex justify-between items-center px-3 py-2 rounded-lg text-sm font-medium text-gray-100 hover:text-red-400 hover:bg-gray-900 transition-colors w-full"
                  >
                    {item.title}
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        productDropdownOpen ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  </button>
                  {productDropdownOpen && (
                    <div className="ml-4 mt-1 flex flex-col gap-1">
                      {productDropdownItems.map((subItem) => (
                        <Link
                          key={subItem.title}
                          href={subItem.link}
                          onClick={handleLinkClick}
                          className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-red-400 hover:bg-gray-800"
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
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-100 hover:text-red-400 hover:bg-gray-900 transition-colors"
                >
                  {item.title}
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </nav>
    </div>
  );
};

export default Navbar;
