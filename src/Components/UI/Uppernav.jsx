"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, LogIn } from "lucide-react";
import SearchModal from "./SearchModal";

const Uppernav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollTop = useRef(0); // using ref for better performance

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      if (scrollTop > lastScrollTop.current + 5) {
        setIsVisible(false); // scroll down → hide
      } else if (scrollTop < lastScrollTop.current - 5) {
        setIsVisible(true); // scroll up → show
      }

      lastScrollTop.current = scrollTop <= 0 ? 0 : scrollTop;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const handleLinkClick = () => isMenuOpen && setIsMenuOpen(false);

  return (
    <div
      className={`fixed top-0 left-0 w-full z-50 transition-transform duration-300 ease-in-out ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
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
  );
};

export default Uppernav;
