'use client';

import React from 'react';

const MarqueeSection = () => {
  return (
    <>
      <div className="w-full py-16 px-4 overflow-hidden">
        <div className="max-w-full mx-auto">
          <div className="flex items-center gap-8">
            {/* Marquee Text */}
            <div className="flex-1 overflow-hidden h-28">
              <div className="relative w-full">
                <div className="flex animate-marquee whitespace-nowrap">
                  {/* 👇 Duplication for seamless loop */}
                  <MarqueeItems />
                  <MarqueeItems />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Global CSS for marquee animation */}
      <style jsx global>{`
        @keyframes marquee {
          0% {
            transform: translateX(-8%);
          }
          100% {
            transform: translateX(-110%);
          }
        }

        .animate-marquee {
          animation: marquee 15s linear infinite;
        }

       
      `}</style>
    </>
  );
};

const MarqueeItems = () => (
  <>
    <span className="text-4xl md:text-6xl lg:text-8xl font-bold text-green-600 mr-16 flex">
     <p className='mr-16'  > • </p>   CRUELTY-FREE 
    </span>
    <span className="text-4xl md:text-6xl lg:text-8xl font-bold text-green-600 mr-16 flex">
      <p className='mr-16'> • </p>   CLEAN 
    </span>
    <span className="text-4xl md:text-6xl lg:text-8xl font-bold text-green-600 mr-16 flex">
      <p className='mr-16'> • </p>   CONSCIOUS 
    </span>
    <span className="text-4xl md:text-6xl lg:text-8xl font-bold text-green-600 mr-16 flex">
      <p className='mr-16'> • </p>   CRUELTY-FREE 
    </span>
  </>
);

export default MarqueeSection;
