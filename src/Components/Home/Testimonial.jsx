"use client";
import React from 'react';

const TestimonialCarousel = () => {
  const testimonials = [
    {
      id: 2,
      text: "Outstanding service and fresh products that delivery is always on time and quality exceeds expectations every time.",
      author: "Michael R. Davis", 
      rating: "02",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&auto=format"
    },
    {
      id: 3,
      text: "A seamless experience from start to finish. Great value and fast delivery with exceptional customer service support always.",
      author: "Sarah J. Brown",
      rating: "03", 
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=500&fit=crop&auto=format"
    },
    {
      id: 4,
      text: "Amazing selection of organic foods. The website is easy to navigate and checkout process is seamless and very quick.",
      author: "James L. Garcia",
      rating: "04",
      image: "https://i.etsystatic.com/18284891/r/il/9d88d8/6946543661/il_1588xN.6946543661_8sh5.jpg"
    },
    {
      id: 5,
      text: "Fresh ingredients delivered right to my door. The packaging is eco-friendly and products are consistently top-notch quality always.",
      author: "Lisa M. Miller",
      rating: "05",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=500&fit=crop&auto=format"
    },
    {
      id: 6,
      text: "Incredible value for money and time. The subscription service saves me effort and the quality is always excellent every time.",
      author: "David A. Johnson", 
      rating: "06",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop&auto=format"
    }
  ];

  // Duplicate the testimonials for seamless looping
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <div className="py-16 overflow-hidden relative">
      <div className="max-w-full ">
        <div className="relative overflow-hidden ">
          
          {/* Gradient overlays for smooth edges */}
          {/* <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div> */}
          
          <div className="flex animate-scroll pause-on-hover ">
            {duplicatedTestimonials.map((testimonial, index) => (
              <div
                key={`${testimonial.id}-${index}`}
                className="flex-shrink-0 w-72 mx-3 group cursor-pointer"
              >
                <div
                  className="relative rounded-3xl overflow-hidden hover:shadow-lg transition-all duration-500 transform hover:-translate-y-1 h-[350px] bg-gradient-to-t from-white via-white/70 to-transparent backdrop-blur-md pointer-events-none border-1 border-gray-200"
                  style={{ 
                    background: `linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0.9) 25%, rgba(255,255,255,0) 60%), url(${testimonial.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                >
                  <div className='w-full h-[10%] -bottom-1 bg-gradient-to-t from-white via-white to-transparent absolute'></div>
                  
                  <div className="absolute bottom-40 right-3 w-12 h-12 bg-white/95 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-gray-800 font-bold text-sm">
                      {testimonial.rating}
                    </span>
                  </div>

                  <div className="absolute bottom-28 left-6 text-black text-3xl font-bold font-serif leading-none drop-shadow-lg rotate-[180deg]">
                    ,,
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="text-gray-800 text-sm leading-relaxed mb-3 font-medium">
                      {testimonial.text}
                    </p>
                  </div>
                  <p className="text-gray-800 text-sm leading-relaxed bottom-2 right-4 font-medium absolute">
                     {testimonial.author}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

  <style jsx>{`
 @keyframes scroll {
   0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

.animate-scroll {
  display: flex;
  width: max-content;
  animation: scroll 25s linear infinite;
}

  /* This makes the animation stop on hover */
  .pause-on-hover:hover {
    animation-play-state: paused;
  }
`}</style>

    </div>
  );
};

export default TestimonialCarousel;