"use client";
import React from 'react';
import {signIn, singnIn} from 'next-auth/react';
import Image from 'next/image';

const EarthsomeLogin = () => {
  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: `${window.location.origin}/` });
  };

  return (
    <div className="min-h-screen bg-[#fef6f1] flex items-center justify-center px-4 sm:px-6 lg:px-8 mt-10  mb-[1000px] sm:mb-[550px] md:mb-[599px]  lg:mb-[422px]">
      <div className="max-w-md w-full space-y-8 animate-fade-in">
        {/* Brand Logo/Icon */}
        <div className="text-center">
          <div className="mx-auto mb-6 transform transition-transform duration-300 hover:scale-105 h-40 w-40 relative">
            <Image 
              src="/logo.png" 
              alt="Earthsome Logo" 
              fill
              className="object-contain"
              priority
            />
          </div>
          {/* <h1 className="text-4xl font-bold text-black mb-2 font-sans tracking-tight">
            Earthsome
          </h1> */}
          <p className="text-black/70 text-lg font-light">
            Welcome back to Earthsome
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-2xl px-8 py-10 space-y-8 transform transition-all duration-300 hover:shadow-3xl">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-black mb-2">
              Sign in to your account
            </h2>
            <p className="text-green-500 text-sm">
              Continue your organic journey with us
            </p>
          </div>

          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            className="w-full bg-white border-2 border-gray-200 rounded-2xl px-6 py-4 flex items-center justify-center space-x-3 text-black font-medium text-lg transition-all duration-300 hover:border-[#e67e22] hover:shadow-lg hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-[#e67e22]/20 group"
          >
            <svg className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Additional Text */}
          <div className="text-center pt-4">
            <p className="text-xs text-black/50">
              By signing in, you agree to our terms and privacy policy
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-black text-sm">
            Crafted with 🌱 for a sustainable future
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        
        .shadow-3xl {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </div>
  );
};

export default EarthsomeLogin;