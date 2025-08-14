"use client";
import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const TestimonialCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragCurrentX, setDragCurrentX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const containerRef = useRef(null);
  const autoSlideRef = useRef(null);
  const isMouseDown = useRef(false);

  const testimonials = [
    {
      id: 1,
      name: "Michael Smith",
      role: "Customer",
      avatar: "🍔",
      review: "Great products. Always fresh, eco stuff that i can't find anywhere else in the city. I wouldn't imagine my daily life without them!"
    },
    {
      id: 2,
      name: "Sarah Johnson",
      role: "Regular Customer",
      avatar: "🥗",
      review: "The quality is unmatched! Their organic selection has completely transformed how I shop for groceries. Highly recommended for anyone who cares about sustainability."
    },
    {
      id: 3,
      name: "David Williams",
      role: "Food Enthusiast",
      avatar: "🍎",
      review: "Incredible variety of local and eco-friendly products. The staff is knowledgeable and the freshness is always guaranteed. This place is a game-changer!"
    },
    {
      id: 4,
      name: "Emma Davis",
      role: "Health Conscious Shopper",
      avatar: "🥕",
      review: "I love how they source everything locally and sustainably. The prices are fair and the quality speaks for itself. My go-to place for healthy living!"
    }
  ];

  // Smooth transition function
  const changeSlide = (newIndex) => {
    if (isTransitioning) return;
    
    const validIndex = ((newIndex % testimonials.length) + testimonials.length) % testimonials.length;
    
    setIsTransitioning(true);
    setCurrentIndex(validIndex);
    
    // Reset transition state after animation completes
    setTimeout(() => {
      setIsTransitioning(false);
    }, 350);
  };

  // Auto-slide functionality
  const startAutoSlide = () => {
    if (autoSlideRef.current) clearInterval(autoSlideRef.current);
    autoSlideRef.current = setInterval(() => {
      if (!isTransitioning && !isDragging) {
        const nextIndex = (currentIndex + 1) % testimonials.length;
        changeSlide(nextIndex);
      }
    }, 4000);
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
  }, [currentIndex, isTransitioning, isDragging]);

  // Drag functionality
  const handleDragStart = (clientX) => {
    if (isTransitioning) return;
    
    setIsDragging(true);
    setDragStartX(clientX);
    setDragCurrentX(clientX);
    setDragOffset(0);
    isMouseDown.current = true;
    stopAutoSlide();
  };

  const handleDragMove = (clientX) => {
    if (!isDragging || !isMouseDown.current || isTransitioning) return;
    
    setDragCurrentX(clientX);
    const offset = clientX - dragStartX;
    setDragOffset(offset);
  };

  const handleDragEnd = () => {
    if (!isDragging || !isMouseDown.current || isTransitioning) return;
    
    const totalDrag = dragCurrentX - dragStartX;
    const threshold = 80;
    
    // Reset drag state first
    setIsDragging(false);
    setDragOffset(0);
    setDragStartX(0);
    setDragCurrentX(0);
    isMouseDown.current = false;
    
    // Then handle slide change
    if (Math.abs(totalDrag) > threshold) {
      if (totalDrag > 0) {
        prevTestimonial();
      } else {
        nextTestimonial();
      }
    }
    
    // Restart auto-slide after a delay
    setTimeout(() => {
      if (!isTransitioning) {
        startAutoSlide();
      }
    }, 500);
  };

  // Mouse events
  const handleMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleDragStart(e.clientX);
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      e.preventDefault();
      handleDragMove(e.clientX);
    }
  };

  const handleMouseUp = (e) => {
    if (isDragging) {
      e.preventDefault();
      handleDragEnd();
    }
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
    if (isDragging) {
      e.preventDefault();
      handleDragMove(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = (e) => {
    if (isDragging) {
      e.preventDefault();
      handleDragEnd();
    }
  };

  const nextTestimonial = () => {
    const nextIndex = (currentIndex + 1) % testimonials.length;
    changeSlide(nextIndex);
  };

  const prevTestimonial = () => {
    const prevIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
    changeSlide(prevIndex);
  };

  const goToSlide = (index) => {
    if (index === currentIndex || isTransitioning) return;
    stopAutoSlide();
    changeSlide(index);
    
    // Restart auto-slide after manual navigation
    setTimeout(() => {
      startAutoSlide();
    }, 1000);
  };

  const TestimonialCard = ({ testimonial }) => (
    <div className="w-full flex-shrink-0 text-center px-4">
      {/* Avatar */}
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center text-2xl border-2 border-green-200 transition-all duration-300 ease-in-out transform hover:scale-105">
        {testimonial.avatar}
      </div>
      
      {/* Customer Info */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-1 transition-all duration-300 ease-in-out">
          {testimonial.name}
        </h3>
        <p className="text-sm text-green-600 transition-all duration-300 ease-in-out">
          {testimonial.role}
        </p>
      </div>
      
      {/* Review Text */}
      <blockquote className="text-lg md:text-2xl text-gray-700 italic leading-relaxed max-w-3xl mx-auto transition-all duration-300 ease-in-out">
        "{testimonial.review}"
      </blockquote>
    </div>
  );

  return (
    <div className="w-full max-w-7xl mx-auto bg-white rounded-3xl shadow-lg border border-green-200 p-8 md:p-12">
    
      {/* Testimonial Content */}
      <div 
        ref={containerRef}
        className="mb-8 relative overflow-hidden cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ touchAction: 'pan-y' }}
      >
        <div 
          className="flex"
          style={{
            transform: isDragging ? 
              `translateX(calc(-${currentIndex * 100}% + ${dragOffset}px))` : 
              `translateX(-${currentIndex * 100}%)`,
            transition: isDragging ? 'none' : 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
            willChange: 'transform'
          }}
        >
          {testimonials.map((testimonial, index) => (
            <TestimonialCard 
              key={testimonial.id}
              testimonial={testimonial}
            />
          ))}
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="flex justify-center items-center space-x-2 flex-row">
        <button
          onClick={prevTestimonial}
          disabled={isTransitioning}
          className="p-2 hover:bg-green-50 rounded-full transition-all duration-200 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Previous"
        >
          <ChevronLeft className="w-4 h-4 text-green-600" />
        </button>

        {/* Wrap dots in a flex container */}
        <div className="flex items-center space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              disabled={isTransitioning}
              className={`w-2 h-2 rounded-full transition-all duration-300 ease-in-out transform hover:scale-125 disabled:cursor-not-allowed ${
                index === currentIndex 
                  ? 'bg-green-600 w-6' 
                  : 'bg-green-300 hover:bg-green-400'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

        <button
          onClick={nextTestimonial}
          disabled={isTransitioning}
          className="p-2 hover:bg-green-50 rounded-full transition-all duration-200 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Next"
        >
          <ChevronRight className="w-4 h-4 text-green-600" />
        </button>
      </div>

      {/* Auto-advance indicator */}
      <div className="mt-6 text-center">
        <div className="inline-flex items-center text-xs text-green-500">
          <div className="w-1 h-1 bg-green-300 rounded-full mr-2"></div>
          <span> {currentIndex + 1} of {testimonials.length}</span>
          <div className="w-1 h-1 bg-green-300 rounded-full ml-2"></div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCarousel;