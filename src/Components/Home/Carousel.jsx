'use client';
import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragCurrentX, setDragCurrentX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const containerRef = useRef(null);
  const autoSlideRef = useRef(null);
  const isMouseDown = useRef(false);
  
  // Sample carousel data
  const slides = [
    {
      id: 1,
      imageUrl: "/Banner1.png",
    },
    {
      id: 2,
      imageUrl: "/Banner2.png",
    },
    {
      id: 3,
      imageUrl: "/Banner3.png",
    },
  ];

  // Auto-slide functionality
  const startAutoSlide = () => {
    if (autoSlideRef.current) clearInterval(autoSlideRef.current);
    autoSlideRef.current = setInterval(() => {
      setCurrentSlide(prevSlide => (prevSlide + 1) % slides.length);
    }, 6000);
  };

  const stopAutoSlide = () => {
    if (autoSlideRef.current) {
      clearInterval(autoSlideRef.current);
      autoSlideRef.current = null;
    }
  };

  useEffect(() => {
    startAutoSlide();
    return () => stopAutoSlide();
  }, []);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 700);
    
    return () => clearTimeout(timer);
  }, [currentSlide]);

  // Touch/Mouse event handlers
  const handleDragStart = (clientX) => {
    setIsDragging(true);
    setDragStartX(clientX);
    setDragCurrentX(clientX);
    setDragOffset(0);
    isMouseDown.current = true;
    stopAutoSlide();
  };

  const handleDragMove = (clientX) => {
    if (!isDragging || !isMouseDown.current) return;
    
    setDragCurrentX(clientX);
    const offset = clientX - dragStartX;
    setDragOffset(offset);
  };

  const handleDragEnd = () => {
    if (!isDragging || !isMouseDown.current) return;
    
    const totalDrag = dragCurrentX - dragStartX;
    const threshold = 50;
    
    if (Math.abs(totalDrag) > threshold) {
      if (totalDrag > 0) {
        // Dragged right - go to previous slide
        goToPrevSlide();
      } else {
        // Dragged left - go to next slide
        goToNextSlide();
      }
    }
    
    // Reset all drag states
    setIsDragging(false);
    setDragOffset(0);
    setDragStartX(0);
    setDragCurrentX(0);
    isMouseDown.current = false;
    
    // Restart auto-slide after interaction
    setTimeout(() => {
      startAutoSlide();
    }, 1000);
  };

  // Mouse events
  const handleMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleDragStart(e.clientX);
  };

  const handleMouseMove = (e) => {
    e.preventDefault();
    handleDragMove(e.clientX);
  };

  const handleMouseUp = (e) => {
    e.preventDefault();
    handleDragEnd();
  };

  const handleMouseLeave = () => {
    if (isDragging && isMouseDown.current) {
      handleDragEnd();
    }
  };

  // Touch events
  const handleTouchStart = (e) => {
    e.preventDefault();
    handleDragStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    handleDragMove(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    e.preventDefault();
    handleDragEnd();
  };

  const goToSlide = (index) => {
    if (isAnimating) return;
    setCurrentSlide(index);
    stopAutoSlide();
    setTimeout(() => {
      startAutoSlide();
    }, 1000);
  };

  const goToNextSlide = () => {
    if (isAnimating) return;
    setCurrentSlide((currentSlide + 1) % slides.length);
  };

  const goToPrevSlide = () => {
    if (isAnimating) return;
    setCurrentSlide((currentSlide - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black -mt-2 select-none">
      
      {/* Carousel container */}
      <div 
        ref={containerRef}
        className="relative h-full w-full cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ touchAction: 'pan-y' }}
      >
        {/* Slides */}
        <div className="relative h-full w-full">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 h-full w-full transition-all duration-700 ease-in-out ${
                currentSlide === index ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
              style={{
                transform: isDragging && currentSlide === index ? `translateX(${dragOffset}px)` : 'translateX(0px)',
                transition: isDragging ? 'none' : 'all 0.7s ease-in-out',
              }}
            >
              {/* Background image */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out"
                style={{ 
                  backgroundImage: `url(${slide.imageUrl})`,
                  backgroundPosition: 'center',
                  transform: currentSlide === index ? 'scale(1)' : 'scale(1.02)',
                }}
              ></div>
              
              {/* Subtle overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/15 z-10"></div>
            </div>
          ))}
        </div>

        {/* Navigation arrows */}
        <button 
          onClick={goToPrevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/15 hover:bg-white/25 text-white xl:ml-44 p-3 rounded-full transition-all duration-300 backdrop-blur-md border border-white/20 hover:border-white/30 hover:scale-110 active:scale-95 shadow-lg"
          aria-label="Previous slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        
        <button 
          onClick={goToNextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 xl:mr-44 bg-white/15 hover:bg-white/25 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-md border border-white/20 hover:border-white/30 hover:scale-110 active:scale-95 shadow-lg"
          aria-label="Next slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>

        {/* Slide indicators */}
        <div className="absolute bottom-8 left-0 right-0 z-30 flex justify-center">
          <div className="flex space-x-3 bg-black/20 backdrop-blur-md rounded-full px-4 py-2 border border-white/20">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  currentSlide === index 
                    ? 'bg-white w-8 h-3 shadow-lg' 
                    : 'bg-white/50 hover:bg-white/70 w-3 h-3 hover:scale-110'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              ></button>
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 z-30 h-1 bg-white/20">
          <div 
            className="h-full bg-gradient-to-r from-green-400 to-blue-400 transition-all duration-300"
            // style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}