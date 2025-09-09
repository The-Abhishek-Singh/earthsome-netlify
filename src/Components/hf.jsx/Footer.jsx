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
    <footer className="text-black py-6 px-4 sm:px-6 md:px-20 bg-[#cfdbd9] border-t border-green-700 overflow-x-hidden fixed bottom-0 left-0 right-0 -z-20">
      <div className="relative max-w-6xl mx-auto">
        {/* Main Content Section */}
        <div className="flex flex-col lg:flex-row items-start justify-between gap-6 lg:gap-8 border-b border-green-700 pb-4">
          {/* Logo & Brief */}
          <div className="flex-shrink-0 lg:max-w-xs">
            <Image
              src="/logo.png"
              alt="Eartsome Logo"
              width={140}
              height={85}
              className="w-24 h-auto sm:w-28 md:w-32 mb-3"
            />
            <p className="text-sm text-gray-700 leading-relaxed">
              Your trusted partner for sustainable wellness and eco-friendly products.
            </p>
          </div>

          {/* Footer Links Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 flex-1">
            
            {/* Contact Info */}
            <div className="space-y-3">
              <h3 className="font-semibold text-base text-black border-b border-green-700 pb-1 mb-3 inline-block">
                Reach Us
              </h3>
              <div className="space-y-2.5">
                <div className="flex items-center space-x-2 group">
                  <span className="text-green-700 group-hover:scale-110 transition-transform duration-200 flex-shrink-0">📞</span>
                  <a href="tel:+919876543210" className="text-black hover:text-green-700 transition-colors duration-200 text-sm">
                    +91 9876543210
                  </a>
                </div>
                <div className="flex items-center space-x-2 group">
                  <span className="text-green-700 group-hover:scale-110 transition-transform duration-200 flex-shrink-0">📧</span>
                  <a href="mailto:earthsomemarketing@gmail.com" className="text-black hover:text-green-700 transition-colors duration-200 text-sm break-all">
                    earthsomemarketing@gmail.com
                  </a>
                </div>
                <div className="flex items-start space-x-2 group">
                  <span className="text-green-700 mt-0.5 group-hover:scale-110 transition-transform duration-200 flex-shrink-0">📍</span>
                  <p className="text-black hover:text-green-700 transition-colors duration-200 text-sm leading-relaxed">
                    610-613, 6<sup>th</sup> Floor, Anam 2. S P Ring Road. Ambli. Ahmedabad - 380058
                  </p>
                </div>
              </div>
            </div>

            {/* Company Links */}
            <div className="space-y-3 ml-10">
              <h3 className="font-semibold text-base text-black border-b border-green-700 pb-1 mb-3 inline-block">
                Company
              </h3>
              <ul className="text-black space-y-2.5">
                <li>
                  <Link href="/About" className="hover:text-green-700 transition-all duration-200 text-sm relative group">
                    <span className="group-hover:translate-x-1 transition-transform duration-200 inline-block">About Us</span>
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-700 group-hover:w-full transition-all duration-200"></span>
                  </Link>
                </li>
                <li>
                  <Link href="/Contact" className="hover:text-green-700 transition-all duration-200 text-sm relative group">
                    <span className="group-hover:translate-x-1 transition-transform duration-200 inline-block">Contact Us</span>
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-700 group-hover:w-full transition-all duration-200"></span>
                  </Link>
                </li>
                <li>
                  <Link href="/AllProducts" className="hover:text-green-700 transition-all duration-200 text-sm relative group">
                    <span className="group-hover:translate-x-1 transition-transform duration-200 inline-block">All Products</span>
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-700 group-hover:w-full transition-all duration-200"></span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Social Media & Newsletter */}
            <div className="space-y-4 mr-5">
              {/* Social Media */}
              <div>
                <h3 className="font-semibold text-base text-black border-b border-green-700 pb-1 mb-3 inline-block">
                  Follow Us
                </h3>
                
                <div className="flex gap-3 mb-4">
                  {/* Facebook */}
                  <div className="relative group">
                    <div className="cursor-pointer flex items-center justify-center w-9 h-9 bg-white rounded-full shadow-md text-black group-hover:text-white group-hover:bg-green-700 transition-all duration-300 transform group-hover:scale-110 hover:shadow-lg">
                      <FaFacebookF size={14} />
                    </div>
                    <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 absolute bottom-full left-1/2 -translate-x-1/2 bg-white shadow-lg rounded-md py-2 px-3 mb-2 z-10 min-w-[140px]">
                      <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-white"></div>
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

                  {/* Instagram */}
                  <div className="relative group">
                    <div className="cursor-pointer flex items-center justify-center w-9 h-9 bg-white rounded-full shadow-md text-black group-hover:text-white group-hover:bg-green-700 transition-all duration-300 transform group-hover:scale-110 hover:shadow-lg">
                      <FaInstagram size={14} />
                    </div>
                    <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 absolute bottom-full left-1/2 -translate-x-1/2 bg-white shadow-lg rounded-md py-2 px-3 mb-2 z-10 min-w-[140px]">
                      <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-white"></div>
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
                     className="flex items-center justify-center w-9 h-9 bg-white rounded-full shadow-md text-black hover:text-white hover:bg-green-700 transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
                  >
                    <FaYoutube size={14} />
                  </a>
                </div>
              </div>

              {/* Newsletter */}
              {/* <div>
                <h4 className="font-medium text-sm text-black mb-2">Stay Updated</h4>
                <form className="space-y-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full p-2.5 text-black border border-green-700 rounded-md outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent transition-all duration-200 text-sm"
                  />
                  <button className="w-full bg-green-700 text-white px-4 py-2.5 rounded-md hover:bg-green-800 transition-all duration-200 transform hover:scale-105 text-sm font-medium">
                    Subscribe
                  </button>
                </form>
                <p className="text-gray-600 text-xs mt-2 leading-relaxed">
                  Get weekly tips & updates on green innovation.
                </p>
              </div> */}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-center text-gray-600 text-sm pt-2 gap-2">
          <p>
            © 2025{" "}
            <span className="text-green-700 font-medium hover:text-green-800 transition-colors duration-200">
              Eartsome  <Link href="/Privacy-Policies" className="text-green-700 font-medium hover:text-green-800 transition-colors duration-200">
            Privacy Policy
          </Link>
            </span>{" "}  
            . All rights reserved
          </p>
         
        </div>
      </div>
    </footer>
  );
};

export default Footer;