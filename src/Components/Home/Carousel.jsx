// "use client";
// import Link from "next/link";
// import { useState, useEffect, useRef } from "react";

// export default function Home() {
//   const [currentIndex, setCurrentIndex] = useState(1); // Start at 1 (first real slide)
//   const [isTransitioning, setIsTransitioning] = useState(false);
//   const [isDragging, setIsDragging] = useState(false);
//   const [dragStartX, setDragStartX] = useState(0);
//   const [dragCurrentX, setDragCurrentX] = useState(0);
//   const [dragOffset, setDragOffset] = useState(0);
//   const containerRef = useRef(null);
//   const autoSlideRef = useRef(null);
//   const isMouseDown = useRef(false);

//   // Sample carousel data
//   const slides = [
//     {
//       id: 1,
//       imageUrl: "/Banner1.png",
//       link: "",
//     },
//     {
//       id: 2,
//       imageUrl: "/Banner2.png",
//       link: "",
//     },
//     {
//       id: 3,
//       imageUrl: "/Banner3.png",
//       link: "",
//     },
//   ];

//   // Create extended slides array: [last, 1, 2, 3, first]
//   const extendedSlides = [
//     slides[slides.length - 1], // Clone of last slide (index 0)
//     ...slides, // Original slides (index 1-3)
//     slides[0], // Clone of first slide (index 4)
//   ];

//   // Get the actual slide index for indicators (0-2)
//   const getActualIndex = () => {
//     if (currentIndex === 0) return slides.length - 1; // Clone of last -> show last indicator
//     if (currentIndex === extendedSlides.length - 1) return 0; // Clone of first -> show first indicator
//     return currentIndex - 1; // Regular slides (subtract 1 because array starts with clone)
//   };

//   // Handle smooth transitions with instant repositioning for infinite effect
//   const changeSlide = (newIndex) => {
//     if (isTransitioning) return;

//     setIsTransitioning(true);
//     setCurrentIndex(newIndex);

//     // After transition completes, handle infinite loop repositioning
//     setTimeout(() => {
//       setIsTransitioning(false);

//       // Instant repositioning without animation
//       if (newIndex === 0) {
//         // We're at the clone of last slide, jump to real last slide
//         setCurrentIndex(slides.length);
//       } else if (newIndex === extendedSlides.length - 1) {
//         // We're at the clone of first slide, jump to real first slide
//         setCurrentIndex(1);
//       }
//     }, 300);
//   };

//   // Auto-slide functionality
//   const startAutoSlide = () => {
//     if (autoSlideRef.current) clearInterval(autoSlideRef.current);
//     autoSlideRef.current = setInterval(() => {
//       if (!isTransitioning && !isDragging) {
//         goToNextSlide();
//       }
//     }, 6000);
//   };

//   const stopAutoSlide = () => {
//     if (autoSlideRef.current) {
//       clearInterval(autoSlideRef.current);
//       autoSlideRef.current = null;
//     }
//   };

//   useEffect(() => {
//     startAutoSlide();
//     return () => stopAutoSlide();
//   }, [currentIndex, isTransitioning, isDragging]);

//   // Navigation functions
//   const goToNextSlide = () => {
//     const nextIndex = currentIndex + 1;
//     changeSlide(nextIndex);
//   };

//   const goToPrevSlide = () => {
//     const prevIndex = currentIndex - 1;
//     changeSlide(prevIndex);
//   };

//   const goToSlide = (index) => {
//     const targetIndex = index + 1; // Add 1 because we have a clone at index 0
//     if (targetIndex === currentIndex || isTransitioning) return;

//     stopAutoSlide();
//     changeSlide(targetIndex);

//     // Restart auto-slide after manual navigation
//     setTimeout(() => {
//       startAutoSlide();
//     }, 1000);
//   };

//   // Touch/Mouse event handlers
//   const handleDragStart = (clientX) => {
//     if (isTransitioning) return;
//     setIsDragging(true);
//     setDragStartX(clientX);
//     setDragCurrentX(clientX);
//     setDragOffset(0);
//     isMouseDown.current = true;
//     stopAutoSlide();
//   };

//   const handleDragMove = (clientX) => {
//     if (!isDragging || !isMouseDown.current || isTransitioning) return;
//     setDragCurrentX(clientX);
//     const offset = clientX - dragStartX;
//     setDragOffset(offset);
//   };

//   const handleDragEnd = () => {
//     if (!isDragging || !isMouseDown.current || isTransitioning) return;

//     const totalDrag = dragCurrentX - dragStartX;
//     const threshold = 50;

//     // Reset drag state
//     setIsDragging(false);
//     setDragOffset(0);
//     setDragStartX(0);
//     setDragCurrentX(0);
//     isMouseDown.current = false;

//     // Handle slide change based on drag direction
//     if (Math.abs(totalDrag) > threshold) {
//       if (totalDrag > 0) {
//         goToPrevSlide();
//       } else {
//         goToNextSlide();
//       }
//     }

//     // Restart auto-slide
//     setTimeout(() => {
//       startAutoSlide();
//     }, 1000);
//   };

//   // Mouse events
//   const handleMouseDown = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     handleDragStart(e.clientX);
//   };

//   const handleMouseMove = (e) => {
//     if (isDragging) {
//       e.preventDefault();
//       handleDragMove(e.clientX);
//     }
//   };

//   const handleMouseUp = (e) => {
//     if (isDragging) {
//       e.preventDefault();
//       handleDragEnd();
//     }
//   };

//   const handleMouseLeave = () => {
//     if (isDragging && isMouseDown.current) {
//       handleDragEnd();
//     }
//   };

//   // Touch events
//   const handleTouchStart = (e) => {
//     e.preventDefault();
//     handleDragStart(e.touches[0].clientX);
//   };

//   const handleTouchMove = (e) => {
//     if (isDragging) {
//       e.preventDefault();
//       handleDragMove(e.touches[0].clientX);
//     }
//   };

//   const handleTouchEnd = (e) => {
//     if (isDragging) {
//       e.preventDefault();
//       handleDragEnd();
//     }
//   };

//   return (
//     <div className="w-full max-w-[95%] mx-auto px-4 py-8 mt-10">
//       {/* Carousel Section */}
//       <div className="mb-6">
//         <Link href={slides[getActualIndex()].link}>
//           <div className="relative w-full h-64 md:h-80 lg:h-[65vh] overflow-hidden bg-orange-100 border-2 border-green-300 rounded-2xl select-none">
//             {/* Carousel container */}
//             <div
//               ref={containerRef}
//               className="relative h-full w-full cursor-grab active:cursor-grabbing select-none"
//               onMouseDown={handleMouseDown}
//               onMouseMove={handleMouseMove}
//               onMouseUp={handleMouseUp}
//               onMouseLeave={handleMouseLeave}
//               onTouchStart={handleTouchStart}
//               onTouchMove={handleTouchMove}
//               onTouchEnd={handleTouchEnd}
//               style={{ touchAction: "pan-y" }}
//             >
//               {/* Slides Container */}
//               <div
//                 className="flex transition-transform duration-300 ease-out h-full"
//                 style={{
//                   transform: isDragging
//                     ? `translateX(calc(-${
//                         currentIndex * 100
//                       }% + ${dragOffset}px))`
//                     : `translateX(-${currentIndex * 100}%)`,
//                   transitionDuration: isTransitioning ? "300ms" : "0ms",
//                 }}
//               >
//                 {extendedSlides.map((slide, index) => (
//                   <div
//                     key={`${slide.id}-${index}`}
//                     className="w-full flex-shrink-0 h-full relative"
//                   >
//                     {/* Background image */}
//                     <div
//                       className="absolute inset-0 bg-cover bg-center rounded-2xl"
//                       style={{
//                         backgroundImage: `url(${slide.imageUrl})`,
//                         backgroundPosition: "center",
//                       }}
//                     >
//                       {/* Subtle overlay */}
//                       <div className="absolute inset-0 bg-black/5 rounded-2xl"></div>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* Navigation arrows - clean and minimal */}
//               <button
//                 onClick={(e) => {
//                   e.preventDefault();
//                   goToPrevSlide();
//                 }}
//                 disabled={isTransitioning}
//                 className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/90 hover:bg-white text-gray-600 p-2.5 rounded-full transition-all duration-200 shadow-sm hover:shadow-md opacity-80 hover:opacity-100 disabled:opacity-50 disabled:cursor-not-allowed"
//                 aria-label="Previous slide"
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   strokeWidth={1.5}
//                   stroke="currentColor"
//                   className="w-4 h-4"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     d="M15.75 19.5L8.25 12l7.5-7.5"
//                   />
//                 </svg>
//               </button>

//               <button
//                 onClick={(e) => {
//                   e.preventDefault();
//                   goToNextSlide();
//                 }}
//                 disabled={isTransitioning}
//                 className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/90 hover:bg-white text-gray-600 p-2.5 rounded-full transition-all duration-200 shadow-sm hover:shadow-md opacity-80 hover:opacity-100 disabled:opacity-50 disabled:cursor-not-allowed"
//                 aria-label="Next slide"
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   strokeWidth={1.5}
//                   stroke="currentColor"
//                   className="w-4 h-4"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     d="M8.25 4.5l7.5 7.5-7.5 7.5"
//                   />
//                 </svg>
//               </button>
//             </div>
//           </div>
//         </Link>

//         {/* Slide indicators - clean and minimal */}
//         <div className="flex justify-center mt-6">
//           <div className="flex space-x-1.5">
//             {slides.map((_, index) => (
//               <button
//                 key={index}
//                 onClick={() => goToSlide(index)}
//                 disabled={isTransitioning}
//                 className={`transition-all duration-300 rounded-full disabled:cursor-not-allowed ${
//                   index === getActualIndex()
//                     ? isDragging
//                       ? "bg-green-400 w-8 h-3"
//                       : "bg-green-400 w-6 h-2"
//                     : isDragging
//                     ? "bg-green-200 hover:bg-green-300 w-3 h-3"
//                     : "bg-green-200 hover:bg-green-300 w-2 h-2"
//                 }`}
//                 aria-label={`Go to slide ${index + 1}`}
//               ></button>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(1); // Start at 1 (first real slide)
  const [isTransitioning, setIsTransitioning] = useState(false);
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
      link: "",
    },
    {
      id: 2,
      imageUrl: "/Banner2.png",
      link: "",
    },
    {
      id: 3,
      imageUrl: "/Banner3.png",
      link: "",
    },
  ];

  // Create extended slides array: [last, 1, 2, 3, first]
  const extendedSlides = [
    slides[slides.length - 1], // Clone of last slide (index 0)
    ...slides, // Original slides (index 1-3)
    slides[0], // Clone of first slide (index 4)
  ];

  // Get the actual slide index for indicators (0-2)
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
    // Don't prevent default for navigation buttons
    if (e.target.closest(".nav-button")) {
      return;
    }
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

  // Navigation button handlers with touch support
  const handleNavButtonClick = (direction, e) => {
    e.preventDefault();
    e.stopPropagation();

    if (direction === "prev") {
      goToPrevSlide();
    } else {
      goToNextSlide();
    }
  };

  return (
    <div className="w-full max-w-[95%] mx-auto px-4 py-8 mt-10">
      {/* Carousel Section */}
      <div className="mb-6">
        <Link href={slides[getActualIndex()].link}>
          <div className="relative w-full h-64 md:h-80 lg:h-[65vh] overflow-hidden bg-orange-100 border-2 border-green-300 rounded-2xl select-none">
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
              style={{ touchAction: "pan-y" }}
            >
              {/* Slides Container */}
              <div
                className="flex transition-transform duration-300 ease-out h-full"
                style={{
                  transform: isDragging
                    ? `translateX(calc(-${
                        currentIndex * 100
                      }% + ${dragOffset}px))`
                    : `translateX(-${currentIndex * 100}%)`,
                  transitionDuration: isTransitioning ? "300ms" : "0ms",
                }}
              >
                {extendedSlides.map((slide, index) => (
                  <div
                    key={`${slide.id}-${index}`}
                    className="w-full flex-shrink-0 h-full relative"
                  >
                    {/* Background image */}
                    <div
                      className="absolute inset-0 bg-cover bg-center rounded-2xl"
                      style={{
                        backgroundImage: `url(${slide.imageUrl})`,
                        backgroundPosition: "center",
                      }}
                    >
                      {/* Subtle overlay */}
                      <div className="absolute inset-0 bg-black/5 rounded-2xl"></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation arrows - clean and minimal with improved touch support */}
              <button
                onClick={(e) => handleNavButtonClick("prev", e)}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (!isDragging) {
                    handleNavButtonClick("prev", e);
                  }
                }}
                disabled={isTransitioning}
                className="nav-button absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-gray-600 p-2.5 rounded-full transition-all duration-200 shadow-sm hover:shadow-md opacity-80 hover:opacity-100 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
                aria-label="Previous slide"
                style={{ touchAction: "manipulation" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4 pointer-events-none"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 19.5L8.25 12l7.5-7.5"
                  />
                </svg>
              </button>

              <button
                onClick={(e) => handleNavButtonClick("next", e)}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (!isDragging) {
                    handleNavButtonClick("next", e);
                  }
                }}
                disabled={isTransitioning}
                className="nav-button absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-gray-600 p-2.5 rounded-full transition-all duration-200 shadow-sm hover:shadow-md opacity-80 hover:opacity-100 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
                aria-label="Next slide"
                style={{ touchAction: "manipulation" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4 pointer-events-none"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  />
                </svg>
              </button>
            </div>
          </div>
        </Link>

        {/* Slide indicators - clean and minimal */}
        <div className="flex justify-center mt-6">
          <div className="flex space-x-1.5">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                disabled={isTransitioning}
                className={`transition-all duration-300 rounded-full disabled:cursor-not-allowed touch-manipulation ${
                  index === getActualIndex()
                    ? isDragging
                      ? "bg-green-400 w-8 h-3"
                      : "bg-green-400 w-6 h-2"
                    : isDragging
                    ? "bg-green-200 hover:bg-green-300 w-3 h-3"
                    : "bg-green-200 hover:bg-green-300 w-2 h-2"
                }`}
                aria-label={`Go to slide ${index + 1}`}
                style={{ touchAction: "manipulation" }}
              ></button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
