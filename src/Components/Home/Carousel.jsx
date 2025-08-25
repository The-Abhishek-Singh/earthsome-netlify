'use client';
import Link from 'next/link';
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
      link: "/Contact"
    },
    {
      id: 2,
      imageUrl: "/Banner2.png",
      link: "/About"
    },
    {
      id: 3,
      imageUrl: "/Banner3.png",
      link: "/all-product"
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
    }, 1000);
    
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

  // Helper function to get slide position with smooth scaling effect
  const getSlideTransform = (index) => {
    const diff = index - currentSlide;
    let translateX = diff * 100;
    
    // Handle wrap around for infinite loop
    if (diff > slides.length / 2) {
      translateX = (diff - slides.length) * 100;
    } else if (diff < -slides.length / 2) {
      translateX = (diff + slides.length) * 100;
    }
    
    // Apply drag offset to all visible slides for smooth dragging
    if (isDragging) {
      const dragPercentage = (dragOffset / window.innerWidth) * 100;
      translateX += dragPercentage;
    }
    
    return translateX;
  };

  // Fixed slide scale - current slide gets slightly bigger, others stay normal
  const getSlideScale = (index) => {
    const diff = Math.abs(index - currentSlide);
    const distance = Math.min(diff, slides.length - diff);
    
    if (distance === 0) {
      // Current slide - slightly bigger for emphasis
      return isDragging ? 1.02 : 1.05;
    } else {
      // All other slides - normal size
      return 1.0;
    }
  };

  // Enhanced opacity with smoother transitions
  const getSlideOpacity = (index) => {
    const diff = Math.abs(index - currentSlide);
    const distance = Math.min(diff, slides.length - diff);
    
    if (distance === 0) {
      return 1; // Current slide - fully visible
    } else if (distance === 1) {
      return 0.1; // Adjacent slides - visible for smooth transition
    } else {
      return 0; // Other slides - hidden
    }
  };

  // Get slide z-index for proper layering
  const getSlideZIndex = (index) => {
    const diff = Math.abs(index - currentSlide);
    const distance = Math.min(diff, slides.length - diff);
    
    if (distance === 0) {
      return 20; // Current slide on top
    } else if (distance === 1) {
      return 15; // Adjacent slides
    } else {
      return 10; // Other slides
    }
  };

  return (
    <>
    <Link href={slides[currentSlide].link}>
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
        {/* Slides Container */}
        <div className="relative h-full w-full">
          {slides.map((slide, index) => {
            const translateX = getSlideTransform(index);
            const scale = getSlideScale(index);
            const opacity = getSlideOpacity(index);
            const zIndex = getSlideZIndex(index);
            const isCurrentSlide = index === currentSlide;
            
            return (
              <div
                key={slide.id}
                className="absolute inset-0 h-full w-full"
                style={{
                  transform: `translateX(${translateX}%) scale(${scale})`,
                  opacity: opacity,
                  zIndex: zIndex,
                  transition: isDragging 
                    ? 'opacity 0.3s ease, z-index 0s' 
                    : 'all 1s cubic-bezier(0.23, 1, 0.32, 1)',
                  transformOrigin: 'center center',
                }}
              >
                {/* Background image with PROPERLY FIXED zoom effect */}
                
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ 
                    backgroundImage: `url(${slide.imageUrl})`,
                    backgroundPosition: 'center',
                    // REVERSED LOGIC: Non-active slides zoom out slightly, active slide stays normal
                    transform: isCurrentSlide && !isDragging ? 'scale(0.95)' : 'scale(1.1)',
                    transition: 'transform 1.2s cubic-bezier(0.23, 1, 0.32, 1)',
                  }}
                ></div>
                
                {/* Overlay gradient with subtle animation */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 z-10"
                     style={{
                       opacity: isCurrentSlide ? 1 : 0.8,
                       transition: 'opacity 0.8s ease',
                     }}>
                </div>
                
                {/* Content overlay for better visibility of controls */}
                <div className="absolute inset-0 bg-black/5 z-5"></div>
              </div>
            );
          })}
        </div>

        {/* Navigation arrows with enhanced styling */}
        <button 
          onClick={goToPrevSlide}
          className="absolute left-1 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 text-white xl:ml-16 p-3 rounded-full transition-all duration-300 backdrop-blur-md border border-white/30 hover:border-white/40 hover:scale-110 active:scale-95 shadow-xl"
          aria-label="Previous slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        
        <button 
          onClick={goToNextSlide}
          className="absolute right-1 top-1/2 -translate-y-1/2 z-30 xl:mr-16 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-md border border-white/30 hover:border-white/40 hover:scale-110 active:scale-95 shadow-xl"
          aria-label="Next slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>

        {/* Enhanced slide indicators */}
        <div className="absolute bottom-8 left-0 right-0 z-30 flex justify-center">
          <div className="flex space-x-3 bg-black/25 backdrop-blur-lg rounded-full px-5 py-3 border border-white/25">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-500 rounded-full ${
                  currentSlide === index 
                    ? 'bg-white w-8 h-3 shadow-lg transform scale-110' 
                    : 'bg-white/50 hover:bg-white/70 w-3 h-3 hover:scale-110'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              ></button>
            ))}
          </div>
        </div>

        {/* Enhanced progress bar */}
        <div className="absolute bottom-0 left-0 right-0 z-30 h-1 bg-white/20">
          <div 
            className="h-full bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 transition-all duration-1000 ease-out"
            // style={{ 
            //   width: `${((currentSlide + 1) / slides.length) * 100}%`,
            //   boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)',
            // }}
          ></div>
        </div>
      </div>
    </div>
    </Link>
    </>
  );
}