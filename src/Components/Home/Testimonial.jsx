"use client";
import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const TestimonialCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(1); // Start at 1 (first real slide)
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

  // Create extended slides array: [last, 1, 2, 3, 4, first]
  const extendedTestimonials = [
    testimonials[testimonials.length - 1], // Clone of last slide (index 0)
    ...testimonials,                        // Original slides (index 1-4)
    testimonials[0]                         // Clone of first slide (index 5)
  ];

  // Get the actual testimonial index for indicators (0-3)
  const getActualIndex = () => {
    if (currentIndex === 0) return testimonials.length - 1; // Clone of last -> show last indicator
    if (currentIndex === extendedTestimonials.length - 1) return 0; // Clone of first -> show first indicator
    return currentIndex - 1; // Regular slides (subtract 1 because array starts with clone)
  };

  // Handle smooth transitions with instant repositioning for infinite effect
  const changeSlide = (newIndex) => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setCurrentIndex(newIndex);

    // After transition completes, handle infinite loop repositioning
    setTimeout(() => {
      setIsTransitioning(false);
      
      // Instant repositioning without animation
      if (newIndex === 0) {
        // We're at the clone of last slide, jump to real last slide
        setCurrentIndex(testimonials.length);
      } else if (newIndex === extendedTestimonials.length - 1) {
        // We're at the clone of first slide, jump to real first slide
        setCurrentIndex(1);
      }
    }, 300);
  };

  // Auto-slide functionality
  const startAutoSlide = () => {
    if (autoSlideRef.current) clearInterval(autoSlideRef.current);
    autoSlideRef.current = setInterval(() => {
      if (!isTransitioning && !isDragging) {
        nextTestimonial();
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

  // Navigation functions
  const nextTestimonial = () => {
    const nextIndex = currentIndex + 1;
    changeSlide(nextIndex);
  };

  const prevTestimonial = () => {
    const prevIndex = currentIndex - 1;
    changeSlide(prevIndex);
  };

  const goToSlide = (index) => {
    const targetIndex = index + 1; // Add 1 because we have a clone at index 0
    if (targetIndex === currentIndex || isTransitioning) return;
    
    stopAutoSlide();
    changeSlide(targetIndex);

    // Restart auto-slide after manual navigation
    setTimeout(() => {
      startAutoSlide();
    }, 1000);
  };

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

    // Reset drag state
    setIsDragging(false);
    setDragOffset(0);
    setDragStartX(0);
    setDragCurrentX(0);
    isMouseDown.current = false;

    // Handle slide change based on drag direction
    if (Math.abs(totalDrag) > threshold) {
      if (totalDrag > 0) {
        prevTestimonial();
      } else {
        nextTestimonial();
      }
    }

    // Restart auto-slide
    setTimeout(() => {
      startAutoSlide();
    }, 500);
  };

  // Mouse events
  const handleMouseDown = (e) => {
    e.preventDefault();
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
          className="flex transition-transform duration-300 ease-out"
          style={{
            transform: isDragging ?
              `translateX(calc(-${currentIndex * 100}% + ${dragOffset}px))` :
              `translateX(-${currentIndex * 100}%)`,
            transitionDuration: isTransitioning ? '300ms' : '0ms'
          }}
        >
          {extendedTestimonials.map((testimonial, index) => (
            <TestimonialCard
              key={`${testimonial.id}-${index}`}
              testimonial={testimonial}
            />
          ))}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex justify-center items-center space-x-2">
        <button
          onClick={prevTestimonial}
          disabled={isTransitioning}
          className="p-2 hover:bg-green-50 rounded-full transition-all duration-200 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="w-4 h-4 text-green-600" />
        </button>

        {/* Dots indicator */}
        <div className="flex items-center space-x-2 mx-4">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              disabled={isTransitioning}
              className={`h-2 rounded-full transition-all duration-300 ease-in-out transform hover:scale-125 disabled:cursor-not-allowed ${
                index === getActualIndex()
                  ? 'bg-green-600 w-6'
                  : 'bg-green-300 hover:bg-green-400 w-2'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

        <button
          onClick={nextTestimonial}
          disabled={isTransitioning}
          className="p-2 hover:bg-green-50 rounded-full transition-all duration-200 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Next testimonial"
        >
          <ChevronRight className="w-4 h-4 text-green-600" />
        </button>
      </div>

      {/* Progress indicator */}
      <div className="mt-6 text-center">
        <div className="inline-flex items-center text-xs text-green-500">
          <div className="w-1 h-1 bg-green-300 rounded-full mr-2"></div>
          <span>{getActualIndex() + 1} of {testimonials.length}</span>
          <div className="w-1 h-1 bg-green-300 rounded-full ml-2"></div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCarousel;