'use client'
import { useState, useEffect, useRef } from 'react'
import Lottie from 'lottie-react'

const AboutHeroSection = () => {
  const [loaded, setLoaded] = useState(false);
  const [videoLoaded] = useState(false);
  const [scrollY] = useState(0);
  const [mousePosition] = useState({ x: 0, y: 0 });
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const heroContentRef = useRef(null);
  
  // Handle initial loading animation sequence
  useEffect(() => {
    // Staggered loading animation
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 100);
    
    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Random high-quality placeholder images
  const [animations, setAnimations] = useState({});

  useEffect(() => {
    // Load all animations asynchronously
    const loadAnimations = async () => {
      try {
        const [flameAnim, seedlingAnim, windAnim, dropwaterAnim] = await Promise.all([
          fetch('/Flameanimation.json').then(res => res.json()),
          fetch('/Seedling.json').then(res => res.json()),
          fetch('/WindEnergy.json').then(res => res.json()),
          fetch('/Dropwater.json').then(res => res.json()),
        ]);

        setAnimations({
          mainOffice: flameAnim,
          meet: seedlingAnim,
          funding: windAnim,
          startupTeam: dropwaterAnim,
          design: windAnim,
        });
      } catch (error) {
        console.error('Error loading animations:', error);
      }
    };

    loadAnimations();
  }, []);

  const images = {
    mainOffice: animations.mainOffice || null,
    meet: animations.meet || null,
    funding: animations.funding || null,
    startupTeam: animations.startupTeam || null,
    design: animations.design || null,
  };
  
  // Calculate dynamic styles based on scroll position for parallax effect
  const getParallaxStyles = (factor = 0.2) => {
    return {
      transform: `translateY(${scrollY * factor}px)`
    };
  };

  return (
    <section 
      ref={containerRef}
      className="relative w-full h-screen overflow-visible "
    >
      {/* Enhanced Background with Parallax and Particles */}
      <div className="absolute inset-0 z-0">
        {/* Background image with parallax effect */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
            style={{
              backgroundImage: 'url("/Aboutbg.png")',
              filter: 'brightness(0.9)'
            }}
          ></div>
          {/* Subtle overlay to ensure text readability */}
          <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px] z-0"></div>
        </div>
        
        {/* Animated floating particles */}
        <div className="particles-container">
          {Array.from({ length: 20 }).map((_, index) => (
            <div 
              key={index} 
              className={`particle particle-${index % 4}`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 10}s`,
                opacity: Math.random() * 0.5 + 0.1
              }}
            ></div>
          ))}
        </div>
      </div>
      
      {/* Main content container with enhanced animations */}
      <div ref={heroContentRef} className="relative z-10 flex flex-col h-full">
        {/* Hero content with staggered and dynamic animations */}
        <div className="flex-1 flex items-center">
          <div className="container mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Left column - Content with enhanced animations */}
              <div className="lg:col-span-6 relative z-10 overflow-visible">
                
                {/* Badge with entrance animation */}
                <div 
                  className={`inline-flex items-center mb-6 rounded-full px-4 py-1.5 bg-white/5 border border-green-500/30 backdrop-blur-sm transition-all duration-1000 ${loaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
                  style={{ boxShadow: '0 0 20px rgba(74, 222, 128, 0.05)' }}
                >
                  <div className="mr-2 w-2 h-2 rounded-full bg-green-500 animate-ping-slow"></div>
                  <span className="text-green-400 font-medium text-xs uppercase tracking-wider">Our Story</span>
                </div>
                
                {/* Headline with character-by-character animation */}
                <div className={`overflow-hidden mb-6 transition-all duration-1000 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black leading-tight transform transition-transform duration-1000" style={{ transform: loaded ? 'translateY(0)' : 'translateY(40px)' }}>
                   <span>
Where <span className='text-green-500'>Startups Start</span> With Stories That Matter</span>
                  </h1>
                </div>
                
                {/* Description with fade and slide animation */}
                <p className={`text-black text-lg max-w-xl mb-8 transition-all duration-1000 delay-300 transform ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                  At <span className="text-green-400 font-medium">Earthsome</span>, we transform ambitious ideas into 
                  <span className="relative inline-block mx-1">
                    industry leaders
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-green-500/50"></span>
                  </span> 
                  through strategic funding, premium workspaces, and expert mentorship—creating the optimal environment for your startup's success.
                </p>
                
               
                
                {/* CTA Buttons with enhanced hover animations */}
                <div className={`flex flex-wrap gap-4 transition-all duration-1000 delay-400 transform ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                  <a 
                    href="#approach" 
                    className="bg-gradient-to-r from-green-500 to-green-400 px-6 py-3 rounded-md text-black font-medium transition-all hover:shadow-lg hover:shadow-green-500/20 hover:scale-105 hover:translate-y-px group button-shine"
                  >
                    <span className="flex items-center">
                      Our Approach
                      <svg className="w-5 h-5 ml-2 transform transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </span>
                  </a>
                  
                  <a 
                    href="#portfolio" 
                    className="px-6 py-3 border border-green-400 rounded-md text-black font-medium hover:bg-green-500/10 transition-all hover:shadow-lg hover:shadow-green-500/10 hover:border-green-500/80 hover:scale-105 hover:translate-y-px group"
                  >
                    <span className="flex items-center">
                      View Portfolio
                      <span className="w-0 overflow-hidden transition-all duration-300 group-hover:w-5 ml-0 group-hover:ml-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </span>
                  </a>
                </div>
              </div>
              
              {/* Right column - Visual content with 3D effect */}
              <div className={`lg:col-span-6 transition-all duration-1000 ${loaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'} hidden lg:block`}>
                <div className="relative">
                  {/* Enhanced 3D image gallery */}
                  <div className="relative h-[500px] w-full">
                    
                    {/* Supporting image cards with advanced 3D effects */}
                   {[
  { 
    img: images.mainOffice, 
    // title: 'Premium Workspaces', 
    // desc: 'Environments designed for innovation',
    position: { left: '20%', top: '60%' }, 
    size: { w: 48, h: 64 },
    zIndex: 10,
    depth: -70,
    rotationFactor: 7,
    delay: 0.2,
  },
  { 
    img: images.meet, 
    // title: 'Strategic Guidance', 
    // desc: 'Expert mentorship for growth',
    position: { left: '25%', top: '0%' }, 
    size: { w: 48, h: 64 },
    zIndex: 10,
    depth: -70,
    rotationFactor: 7,
    delay: 0.2,
  },
  { 
    img: images.startupTeam, 
    // title: 'Team Building', 
    // desc: 'Creating successful teams',
    position: { left: '60%', top: '12%' }, 
    size: { w: 48, h: 64 },
    zIndex: 12,
    depth: -70,
    rotationFactor: 7,
    delay: 0.2
  },
  { 
    img: images.design, 
    // title: 'Product Design', 
    // desc: 'Innovative solutions',
    position: { left: '55%', top: '72%' }, 
    size: { w: 48, h: 64 },
    zIndex: 12,
    depth: -60,
    rotationFactor: 6,
    delay: 0.8
  }
].map((card, index) => (
  <div 
    key={index}
    className={`absolute rounded-xl shadow-lg overflow-hidden transform transition-all duration-700 card-reflection card-hover hover:z-40 float-animation hover:scale-110 z-50 opacity-100`}
    style={{ 
      left: card.position.left, 
      top: card.position.top,
      width: `${card.size.w * 4}px`,
      height: `${card.size.h * 4}px`,
      zIndex: card.zIndex,
      opacity: loaded ? 1 : 0,
      transform: `perspective(1000px) 
                 rotateY(${mousePosition.x * card.rotationFactor}deg)
                 rotateX(${mousePosition.y * -card.rotationFactor}deg)
                 translateZ(${card.depth}px)
                 scale(${loaded ? 1 : 0.8})`,
      transitionDelay: `${card.delay}s`,
      boxShadow: `0 10px 30px rgba(0, 0, 0, 0.2),
                 ${mousePosition.x * 10}px ${mousePosition.y * 10}px 20px rgba(74, 222, 128, 0.05)`,
    }}
  >
    <div className="absolute inset-0 border-2 border-green-500 rounded-xl z-30 pointer-events-none glow-border overflow-hidden">
      <div className="w-full h-full overflow-hidden">
        {card.img && typeof card.img === 'object' ? (
          <Lottie
            animationData={card.img}
            loop={true}
            autoplay={true}
            style={{ width: '100%', height: '100%' }}
          />
        ) : (
          <img 
            src={card.img}
            alt={card.title} 
            className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-700" 
            style={{ animation: "float 6s infinite ease-in-out" }}
          />
        )}
        {/* <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div> */}

        <div className="absolute bottom-0 left-0 right-0 p-3 transform transition-transform duration-500">
          <div className="w-1 h-6 bg-green-500 rounded-full"></div>
          <h3 className="text-white font-semibold">{card.title}</h3>
          <p className="text-white/70 text-xs">{card.desc}</p>
        </div>
      </div>
    </div>
  </div>
))}

                    {/* Enhanced decorative elements - FIXED CIRCLES */}
                    <div className="absolute inset-0 pointer-events-none">
                      {/* Dynamic circular accents with fixed sizes */}
                      {/* <div 
                        className="absolute left-1/2 top-1/2 rounded-full border border-black transform transition-transform duration-700 accent-circle-1"
                        style={{ 
                          width: '260px',
                          height: '260px',
                          transform: `translate(-50%, -50%) scale(${loaded ? 1 : 0.5})`,
                          opacity: loaded ? 10 : 0,
                          transitionDelay: '0.8s'
                        }}
                      /> */}
                      {/* <div 
                        className="absolute left-1/2 top-1/2 rounded-full border border-black transform transition-transform duration-700 accent-circle-2"
                        style={{ 
                          width: '186px',
                          height: '186px',
                          transform: `translate(-50%, -50%) scale(${loaded ? 1 : 0.5})`,
                          opacity: loaded ? 1 : 0,
                          transitionDelay: '1.0s'
                        }}
                      /> */}
                     
                     
                      
                      {/* Animated connecting dots */}
                      <div className={`absolute transition-opacity duration-1000 delay-1000 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
                        {/* Animated dots */}
                        {/* <div className="absolute w-3 h-3 rounded-full bg-green-500 animate-pulse-slow" style={{ left: '20%', top: '30%', animationDelay: '0s' }} /> */}
                        {/* <div className="absolute w-3 h-3 rounded-full bg-green-500 animate-pulse-slow" style={{ left: '80%', top: '70%', animationDelay: '0.5s' }} /> */}
                        {/* <div className="absolute w-3 h-3 rounded-full bg-green-500 animate-pulse-slow" style={{ left: '80%', top: '24%', animationDelay: '1s' }} /> */}
                        {/* <div className="absolute w-3 h-3 rounded-full bg-green-500 animate-pulse-slow" style={{ left: '20%', top: '70%', animationDelay: '1.5s' }} /> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Advanced CSS animations */}
      <style jsx>{`
        /* Animated gradient background shift */
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 8s ease infinite;
        }
        
        /* Improved pulse animations */
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.1); }
        }
        
        @keyframes pulse-slow-delay {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.1); }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        
        .animate-pulse-slow-delay {
          animation: pulse-slow 4s ease-in-out 2s infinite;
        }
        
        /* Logo pulse effect */
        @keyframes logo-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0); }
          50% { box-shadow: 0 0 0 4px rgba(74, 222, 128, 0.3); }
        }
        
        .animate-logo-pulse {
          animation: logo-pulse 3s infinite;
        }
        
        /* Line reveal animation */
        @keyframes line-grow {
          0% { width: 0; opacity: 0; }
          100% { width: 100%; opacity: 1; }
        }
        
        .animate-line-grow {
          animation: line-grow 1.5s ease-out forwards;
        }
        
        /* Fade-in animation */
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          opacity: 0;
          animation: fade-in 0.5s ease-out forwards;
        }
        
        /* Typing animation for nav "About Us" */
        @keyframes typing {
          from { width: 0; }
          to { width: 100%; }
        }
        
        .typing-animation::after {
          content: '';
          position: absolute;
          right: -2px;
          top: 0;
          height: 100%;
          width: 2px;
          background-color: #4ADE80;
          animation: typing-cursor 1.2s step-end infinite;
        }
        
        @keyframes typing-cursor {
          from, to { opacity: 0; }
          50% { opacity: 1; }
        }
        
        /* Headline word-by-word animation */
        @keyframes reveal-text {
          0% { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        .headline-word {
          opacity: 0;
          animation: reveal-text 0.8s ease-out forwards;
        }
        
        /* Card hover effects */
        .card-hover-effect:hover {
          box-shadow: 0 25px 50px -12px rgba(74, 222, 128, 0.15);
        }
        
        /* Card reflection and glow effects */
        .card-reflection::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 100%;
          background: linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0.1) 0%,
            rgba(255, 255, 255, 0.05) 5%,
            rgba(255, 255, 255, 0) 20%
          );
          transform: translateY(-100%);
          transition: transform 0.7s ease;
        }
        
        .card-reflection:hover::before {
          transform: translateY(100%);
        }
        
        .card-glow:hover {
          box-shadow: 0 0 25px rgba(74, 222, 128, 0.2);
        }
        
        .glow-border {
          box-shadow: inset 0 0 0 1px rgba(74, 222, 128, 0.3);
        }
        
        .glow-border-thin {
          box-shadow: inset 0 0 0 1px rgba(74, 222, 128, 0.15);
        }
        
        /* Button shine effect */
        .button-shine {
          position: relative;
          overflow: hidden;
        }
        
        .button-shine::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            to right,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.3) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          transform: rotate(30deg);
          opacity: 0;
          transition: opacity 0.6s;
        }
        
        .button-shine:hover::after {
          opacity: 1;
          transform: rotate(30deg) translate(100%, -100%);
          transition: transform 0.8s ease-out, opacity 0.1s;
        }
        
        /* Button glow effect */
        .button-glow:hover {
          box-shadow: 0 0 15px rgba(74, 222, 128, 0.4);
        }
        
        /* Navigation link hover effect */
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -3px;
          left: 0;
          width: 0;
          height: 1px;
          background-color: #4ADE80;
          transition: width 0.3s ease;
        }
        
        .nav-link:hover::after {
          width: 100%;
        }
        
        /* Stat number animation */
        @keyframes count-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .stat-number {
          opacity: 0;
          animation: count-up 0.5s ease-out forwards;
        }
        
        /* Floating particles */
        .particles-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: 5;
        }
        
        .particle {
          position: absolute;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(74, 222, 128, 0.3);
          pointer-events: none;
        }
        
        @keyframes float-up {
          0% { transform: translateY(0) rotate(0deg); }
          100% { transform: translateY(-100vh) rotate(360deg); }
        }
        
        .particle {
          animation: float-up 15s linear infinite;
        }
        
        .particle-0 { width: 3px; height: 3px; }
        .particle-1 { width: 5px; height: 5px; }
        .particle-2 { width: 7px; height: 7px; }
        .particle-3 { width: 4px; height: 4px; }
        
        /* Accent circles animation */
        @keyframes circle-pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
          50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.8; }
        }
        
        .accent-circle-1 {
          animation: circle-pulse 8s ease-in-out infinite;
        }
        
        .accent-circle-2 {
          animation: circle-pulse 8s ease-in-out 2s infinite;
        }
        
        .accent-circle-3 {
          animation: circle-pulse 8s ease-in-out 4s infinite;
        }
        
        .accent-circle-4 {
          animation: circle-pulse 8s ease-in-out 6s infinite;
        }
        
        /* Scroll dot animation */
        @keyframes scroll-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(6px); }
        }
        
        .scroll-dot {
          animation: scroll-bounce 1.5s ease-in-out infinite;
        }
        
        /* Float animation for images */
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </section>
  );
};

export default AboutHeroSection;