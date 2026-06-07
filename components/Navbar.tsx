import React, { useState, useEffect } from 'react';
import { NAV_ITEMS, ASSETS } from '../constants';

interface NavbarProps {
  onLoginClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onLoginClick }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
        scrolled
          ? 'bg-white/90 backdrop-blur-xl shadow-sm py-3'
          : 'bg-gradient-to-b from-black/60 to-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-3 group cursor-pointer">
          {/* Logo Image */}
          <div className={`relative overflow-hidden transition-transform duration-300 group-hover:scale-105 ${scrolled ? 'w-10 h-10' : 'w-12 h-12'}`}>
            <img 
              src={ASSETS.logo}
              alt="Sidelile High School Logo"
              className="w-full h-full object-contain drop-shadow-md"
            />
          </div>
          <div className="flex flex-col">
            <span className={`font-bold tracking-tight leading-none transition-colors duration-300 ${scrolled ? 'text-slate-900 text-lg' : 'text-white text-xl'}`}>
              Sidelile High
            </span>
            <span className={`text-[10px] uppercase tracking-widest font-medium transition-colors duration-300 ${scrolled ? 'text-slate-500' : 'text-white/80'}`}>
              Excellence in Motion
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-1">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:bg-white/10 ${
                scrolled ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' : 'text-white/90 hover:text-white'
              }`}
            >
              {item.label}
            </a>
          ))}
          
          <div className="flex items-center gap-2 pl-4 ml-2 border-l border-white/20">
             <button
              onClick={onLoginClick}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                scrolled 
                  ? 'text-sidelile-blue hover:bg-blue-50' 
                  : 'text-white hover:bg-white/10'
              }`}
            >
              Portal Login
            </button>

            <a
              href="#contact"
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 shadow-lg ${
                scrolled
                  ? 'bg-sidelile-blue text-white hover:bg-blue-700 hover:shadow-blue-500/25'
                  : 'bg-white text-sidelile-blue hover:bg-white/90 hover:shadow-white/20'
              }`}
            >
              Apply Now
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};