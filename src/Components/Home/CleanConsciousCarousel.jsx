'use client';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

export default function CleanConsciousCarousel() {
  const [currentIndex, setCurrentIndex] = useState(1); // Start at 1 (first real slide)
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragCurrentX, setDragCurrentX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [playingVideo, setPlayingVideo] = useState(null);
  const containerRef = useRef(null);
  const autoSlideRef = useRef(null);
  const isMouseDown = useRef(false);
  
  // Updated carousel data with nature videos and GIFs
  const slides = [
    {
      id: 1,
      type: 'video',
      mediaUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      title: "Clean Ocean Waters",
      description: "Protecting marine ecosystems through conscious choices",
      link: ""
    },
    // {
    //   id: 2,
    //   type: 'gif',
    //   mediaUrl: "https://media.giphy.com/media/26BRuo6sLetdllPAQ/giphy.gif",
    //   title: "Forest Conservation",
    //   description: "Sustainable practices for wildlife protection",
    //   link: ""
    // },
    // {
    //   id: 3,
    //   type: 'video',
    //   mediaUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    //   title: "Cruelty-Free Living",
    //   description: "Ethical beauty without compromising nature",
    //   link: ""
    // },
    // {
    //   id: 4,
    //   type: 'gif',
    //   mediaUrl: "https://media.giphy.com/media/l2JhOVy5NvYhiBnlS/giphy.gif",
    //   title: "Organic Farming",
    //   description: "Natural cultivation supporting biodiversity",
    //   link: ""
    // },
    // {
    //   id: 5,
    //   type: 'video',
    //   mediaUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    //   title: "Renewable Energy",
    //   description: "Clean energy for conscious consumers",
    //   link: ""
    // }
  ];

  // Create extended slides array: [last, 1, 2, 3, 4, 5, first]
  const extendedSlides = [
    slides[slides.length - 1], // Clone of last slide (index 0)
    ...slides,                 // Original slides (index 1-5)
    slides[0]                  // Clone of first slide (index 6)
  ];

  // Get the actual slide index for indicators (0-4)
  const getActualIndex = () => {
    if (currentIndex === 0) return slides.length - 1; // Clone of last -> show last indicator
    if (currentIndex === extendedSlides.length - 1) return 0; // Clone of first -> show first indicator
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
        setCurrentIndex(slides.length);
      } else if (newIndex === extendedSlides.length - 1) {
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
        goToNextSlide();
      }
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
  }, [currentIndex, isTransitioning, isDragging]);

  // Navigation functions
  const goToNextSlide = () => {
    const nextIndex = currentIndex + 1;
    changeSlide(nextIndex);
  };

  const goToPrevSlide = () => {
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

  // Touch/Mouse event handlers
  const handleDragStart = (clientX) => {
    
  

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
    const threshold = 50;

    // Reset drag state
    setIsDragging(false);
    setDragOffset(0);
    setDragStartX(0);
    setDragCurrentX(0);
    isMouseDown.current = false;

    // Handle slide change based on drag direction
    if (Math.abs(totalDrag) > threshold) {
      if (totalDrag > 0) {
        goToPrevSlide();
      } else {
        goToNextSlide();
      }
    }

    // Restart auto-slide
   
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

  const handleVideoPlay = (videoId) => {
    setPlayingVideo(videoId);
  };

  const handleVideoPause = (videoId) => {
    setPlayingVideo(null);
  };

  return (
    <div className="w-full  py-16">
      <div className="max-w-[95%]  mx-auto px-4">
        
      

        {/* Carousel Section */}
        <div className="mb-6">
          <div className="relative w-full h-80 md:h-96 lg:h-[400px] overflow-hidden bg-gradient-to-br from-orange-100 to-orange-200 border-2 border-green-500 rounded-3xl select-none shadow-lg">
            
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
              <div 
                className="flex transition-transform duration-300 ease-out h-full"
               
              >
                {extendedSlides.map((slide, index) => (
                  <div
                    key={`${slide.id}-${index}`}
                    className="w-full flex-shrink-0 h-full relative rounded-3xl overflow-hidden"
                  >
                    {/* Media Content */}
                    {slide.type === 'video' ? (
                      <video
                        className="absolute inset-0 w-full h-full object-cover"
                        autoPlay
                        muted
                        loop
                        playsInline
                        onPlay={() => handleVideoPlay(slide.id)}
                        onPause={() => handleVideoPause(slide.id)}
                      >
                        <source src={slide.mediaUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <img
                        src={slide.mediaUrl}
                        alt={slide.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

                    {/* Content Overlay */}
                    {/* <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                      <div className="max-w-xl">
                        <h3 className="text-2xl md:text-3xl font-bold mb-3 leading-tight">
                          {slide.title}
                        </h3>
                        <p className="text-white/90 text-base md:text-lg leading-relaxed">
                          {slide.description}
                        </p>
                      </div>
                    </div> */}

                    
                  </div>
                ))}
              </div>

             
            </div>
          </div>

         
        </div>

      </div>
    </div>
  );
}