"use client";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="text-black py-4 sm:py-5 md:py-6 px-4 sm:px-6 md:px-20 bg-[#cfdbd9] border-t border-green-700 overflow-x-hidden fixed bottom-0 left-0 right-0 -z-20">
      <div className="relative max-w-6xl mx-auto">
        {/* Top Section */}
        <div className="flex flex-col border-b border-green-700 pb-4 md:pb-5">
          <div className="flex flex-row mb-3 md:mb-4">
            <div>
              <Image
                src="/logo.png"
                alt="Eartsome Logo"
                width={160}
                height={100}
                className="w-28 h-auto sm:w-32 md:w-36"
              />
            </div>
          </div>

          {/* Footer Links - Improved Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 mt-2 md:mt-4">
            {/* Reach Us Section */}
            <div className="space-y-2">
              <h3 className="font-semibold text-base md:text-lg text-black border-b border-green-700 pb-1 mb-2 inline-block">
                Reach us
              </h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 group">
                  <span className="text-green-700 group-hover:scale-110 transition-transform duration-200 flex-shrink-0">📞</span>
                  <a href="tel:+919876543210" className="text-black hover:text-green-700 transition-colors duration-200 text-sm md:text-base">
                    +91 9876543210
                  </a>
                </div>
                <div className="flex items-center space-x-1 group">
                  <span className="text-green-700 group-hover:scale-110 transition-transform duration-200 flex-shrink-0">📧</span>
                  <a href="mailto:hello@eartsome.in" className="text-black hover:text-green-700 transition-colors duration-200 text-sm md:text-base break-all">
                  earthsomemarketing@gmail.com
                  </a>
                </div>
                <div className="flex items-start space-x-2 group">
                  <span className="text-green-700 mt-0.5 group-hover:scale-110 transition-transform duration-200 flex-shrink-0">📍</span>
                  <p className="text-black hover:text-green-700 transition-colors duration-200 text-xs md:text-sm leading-relaxed">
                 610-613, 6<sup>th</sup> Floor, Anam 2. S P Ring Road. Ambli. Ahmedabad - 380058
                  </p>
                </div>
              </div>
            </div>

            {/* Company Section */}
            <div className="space-y-2 ml-[5vh]">
              <h3 className="font-semibold text-base md:text-lg text-black border-b border-green-700 pb-1 mb-2 inline-block">
                Company
              </h3>
              <ul className="text-black space-y-2">
                <li>
                  <Link href="/About" className="hover:text-green-700 transition-all duration-200 text-sm md:text-base relative group">
                    <span className="group-hover:translate-x-1 transition-transform duration-200 inline-block">About</span>
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-700 group-hover:w-full transition-all duration-200"></span>
                  </Link>
                </li>
                <li>
                  <Link href="/Contact" className="hover:text-green-700 transition-all duration-200 text-sm md:text-base relative group">
                    <span className="group-hover:translate-x-1 transition-transform duration-200 inline-block">Contact</span>
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-700 group-hover:w-full transition-all duration-200"></span>
                  </Link>
                </li>
                <li>
                  <Link href="/AllProducts" className="hover:text-green-700 transition-all duration-200 text-sm md:text-base relative group">
                    <span className="group-hover:translate-x-1 transition-transform duration-200 inline-block">All Products</span>
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-700 group-hover:w-full transition-all duration-200"></span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal Section */}
            <div className="space-y-2">
              <h3 className="font-semibold text-base md:text-lg text-black border-b border-green-700 pb-1 mb-2 inline-block">
                Legal
              </h3>
              <ul className="text-black space-y-2">
                <li>
                  <Link href="/Privacy-Policies" className="hover:text-green-700 transition-all duration-200 text-sm md:text-base relative group">
                    <span className="group-hover:translate-x-1 transition-transform duration-200 inline-block">Privacy Policy</span>
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-700 group-hover:w-full transition-all duration-200"></span>
                  </Link>
                </li>
                <li>
                  <Link href="/Terms-Conditions" className="hover:text-green-700 transition-all duration-200 text-sm md:text-base relative group">
                    <span className="group-hover:translate-x-1 transition-transform duration-200 inline-block">Terms & Conditions</span>
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-700 group-hover:w-full transition-all duration-200"></span>
                  </Link>
                </li>
                <li>
                  <Link href="/Refund-Cancellation" className="hover:text-green-700 transition-all duration-200 text-sm md:text-base relative group">
                    <span className="group-hover:translate-x-1 transition-transform duration-200 inline-block">Refund & Cancellation</span>
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-700 group-hover:w-full transition-all duration-200"></span>
                  </Link>
                </li>
                <li>
                  <Link href="/Delivery-Policies" className="hover:text-green-700 transition-all duration-200 text-sm md:text-base relative group">
                    <span className="group-hover:translate-x-1 transition-transform duration-200 inline-block">Delivery Policy</span>
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-700 group-hover:w-full transition-all duration-200"></span>
                  </Link>
                </li>
                <li>
                  <Link href="/For-All" className="hover:text-green-700 transition-all duration-200 text-sm md:text-base relative group">
                    <span className="group-hover:translate-x-1 transition-transform duration-200 inline-block">Applicable to All Categories</span>
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-700 group-hover:w-full transition-all duration-200"></span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Follow Us Section */}
            <div className="space-y-3">
              {/* Social Media */}
              <div>
                <h3 className="font-semibold text-base md:text-lg text-black border-b border-green-700 pb-1 mb-2 inline-block">
                  Follow Us
                </h3>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {/* Facebook Links */}
                  <div className="relative group">
                    <div className="cursor-pointer flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-md text-black group-hover:text-white group-hover:bg-green-700 transition-all duration-300 transform group-hover:scale-110 hover:shadow-lg">
                      <FaFacebookF size={16} />
                    </div>
                    <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 absolute top-full left-1/2 -translate-x-1/2 bg-white shadow-lg rounded-md py-2 px-3 mt-2 z-10 min-w-[140px]">
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-white"></div>
                      <div className="flex flex-col gap-2">
                        <a href="https://www.facebook.com/earthsome.wellness" 
                           className="text-sm hover:text-green-700 whitespace-nowrap transition-colors duration-200">
                         earthsome Wellness
                        </a>
                        <a href="https://www.facebook.com/profile.php?id=61575255760417" 
                           className="text-sm hover:text-green-700 whitespace-nowrap transition-colors duration-200">
                          earthsome.care
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Instagram Links */}
                  <div className="relative group">
                    <div className="cursor-pointer flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-md text-black group-hover:text-white group-hover:bg-green-700 transition-all duration-300 transform group-hover:scale-110 hover:shadow-lg">
                      <FaInstagram size={16} />
                    </div>
                    <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 absolute top-full left-1/2 -translate-x-1/2 bg-white shadow-lg rounded-md py-2 px-3 mt-2 z-10 min-w-[140px]">
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-white"></div>
                      <div className="flex flex-col gap-2">
                        <a href="https://www.instagram.com/earthsome.wellness/" 
                           className="text-sm hover:text-green-700 whitespace-nowrap transition-colors duration-200">
                              earthsome Wellness
                        </a>
                        <a href="https://www.instagram.com/earthsome.care/" 
                           className="text-sm hover:text-green-700 whitespace-nowrap transition-colors duration-200">
                               earthsome.care
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* YouTube */}
                  <a href="https://www.youtube.com/@EarthsomeWellness" 
                     className="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-md text-black hover:text-white hover:bg-green-700 transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
                  >
                    <FaYoutube size={16} />
                  </a>
                </div>
              </div>

              {/* Newsletter */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm md:text-base text-black">Stay Updated</h4>
                <form className="flex flex-col gap-1.5">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="w-full p-1.5 text-black border border-green-700 rounded-md outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent transition-all duration-200 text-sm"
                  />
                  <button className="bg-green-700 text-white px-3 py-1.5 rounded-md hover:bg-green-800 transition-all duration-200 transform hover:scale-105 text-sm font-medium">
                    Subscribe
                  </button>
                </form>
                <p className="text-gray-600 text-xs leading-relaxed">
                  * Get weekly tips & updates on green innovation.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-gray-600 text-sm mt-3 md:mt-4 pt-2">
          <p>
            © 2025{" "}
            <span className="text-green-700 font-medium hover:text-green-800 transition-colors duration-200">
              Eartsome
            </span>{" "}
            . All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;