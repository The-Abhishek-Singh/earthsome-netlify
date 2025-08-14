"use client";
import { useState, useEffect } from 'react';

export default function Unauthorized() {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 8; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 15 + 8,
          duration: Math.random() * 20 + 15,
          delay: Math.random() * 5
        });
      }
      setParticles(newParticles);
    };
    generateParticles();
  }, []);

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center relative overflow-hidden">
      
      {/* Subtle background elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 right-20 w-72 h-72 bg-green-200 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-emerald-200 rounded-full blur-3xl animate-pulse-slower"></div>
      </div>

      {/* Floating particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute pointer-events-none opacity-40"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animation: `gentleFloat ${particle.duration}s ease-in-out infinite`,
            animationDelay: `${particle.delay}s`
          }}
        >
          <svg width={particle.size} height={particle.size} viewBox="0 0 24 24" fill="currentColor" className="text-green-400">
            <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" />
          </svg>
        </div>
      ))}

      {/* Main content - centered and compact */}
      <div className="text-center px-6 max-w-lg">
        
        {/* Icon - smaller but impactful */}
        <div className="mb-8">
          <div className="relative inline-block">
            <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center shadow-2xl animate-bounce-subtle">
              <svg width="40" height="40" viewBox="0 0 24 24" className="text-red-500">
                <path fill="currentColor" d="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z" />
              </svg>
            </div>
            {/* Animated ring around icon */}
            <div className="absolute inset-0 w-24 h-24 border-2 border-red-300 rounded-full animate-ping opacity-75"></div>
          </div>
        </div>

        {/* Title - punchy and concise */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 animate-slideUp">
          Access Denied
        </h1>

        {/* Subtitle with emoji */}
        <p className="text-xl text-gray-600 mb-6 animate-slideUp" style={{ animationDelay: '0.2s' }}>
          Oops! You&apos;re not allowed here 🌱
        </p>

        {/* Description - brief and friendly */}
        <p className="text-gray-500 mb-8 leading-relaxed animate-slideUp" style={{ animationDelay: '0.4s' }}>
          This page is off-limits. Try logging in again or head back home to explore our eco-friendly collection.
        </p>

        {/* Single prominent CTA */}
        <button
          onClick={handleGoHome}
          className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 animate-slideUp"
          style={{ animationDelay: '0.6s' }}
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLineJoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Take Me Home
        </button>

        {/* Brand - minimal footer */}
        <div className="mt-12 animate-fadeIn" style={{ animationDelay: '0.8s' }}>
          <p className="text-green-600 text-sm font-light tracking-widest">EARTHSOME</p>
        </div>
      </div>

      {/* CSS Animations - clean and smooth */}
      <style jsx>{`
        @keyframes gentleFloat {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.4;
          }
          50% {
            transform: translateY(-15px) rotate(180deg);
            opacity: 0.6;
          }
        }

        @keyframes bounce-subtle {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.5; }
        }

        @keyframes pulse-slower {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.4; }
        }

        .animate-gentleFloat { animation: gentleFloat 20s ease-in-out infinite; }
        .animate-bounce-subtle { animation: bounce-subtle 3s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
        .animate-pulse-slower { animation: pulse-slower 6s ease-in-out infinite; }
        
        .animate-slideUp {
          animation: slideUp 0.8s ease-out forwards;
          opacity: 0;
        }
        
        .animate-fadeIn {
          animation: fadeIn 1s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}