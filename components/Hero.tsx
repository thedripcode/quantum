import React, { useState, useEffect } from 'react';
import { FadeIn } from './FadeIn';
import { HERO_SLIDES } from '../constants';

export const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000); // Change slide every 6 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-screen min-h-[700px] w-full overflow-hidden flex items-center justify-center bg-black">
      {/* Slideshow Background */}
      {HERO_SLIDES.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Ken Burns Effect Container - "Video-like" movement */}
          <div 
            className={`w-full h-full bg-cover bg-center transition-transform duration-[8000ms] ease-linear ${
               index === currentSlide ? 'scale-110' : 'scale-100'
            }`}
            style={{ backgroundImage: `url("${slide}")` }}
          />
          {/* Overlay gradient for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/60"></div>
          <div className="absolute inset-0 bg-sidelile-blue/10 mix-blend-overlay"></div>
        </div>
      ))}

      {/* Slide Indicators */}
      <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
        {HERO_SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              index === currentSlide ? 'bg-white w-8' : 'bg-white/40 w-2 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto text-white">
        <FadeIn delay={100}>
          <div className="inline-block px-4 py-1.5 rounded-full border border-white/30 bg-white/10 backdrop-blur-md mb-8 shadow-lg">
             <span className="text-xs md:text-sm font-semibold tracking-wider uppercase text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                Est. 2004 — Kwazulu-Natal
             </span>
          </div>
        </FadeIn>
        
        <FadeIn delay={300}>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-6 leading-[1.1] drop-shadow-2xl">
            Excellence <br /> in Motion.
          </h1>
        </FadeIn>

        <FadeIn delay={500}>
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto mb-10 font-light leading-relaxed drop-shadow-md">
            Welcome to Sidelile High School.
            <span className="block mt-2 font-semibold text-white text-3xl">Celebrating a 98% Pass Rate.</span>
          </p>
        </FadeIn>

        <FadeIn delay={700}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a 
              href="#about"
              className="px-8 py-4 rounded-full bg-white text-sidelile-blue font-bold text-lg hover:bg-blue-50 transition-all duration-300 w-full sm:w-auto shadow-xl shadow-black/20"
            >
              Discover Sidelile
            </a>
            <a 
              href="#gallery"
              className="px-8 py-4 rounded-full bg-black/30 border border-white/40 text-white font-semibold hover:bg-white/10 transition-all duration-300 w-full sm:w-auto backdrop-blur-md"
            >
              View School Life
            </a>
          </div>
        </FadeIn>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-pulse-slow text-white/70">
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] uppercase tracking-widest">Scroll</span>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
};