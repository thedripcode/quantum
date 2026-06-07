import React from 'react';
import { SCHOOL_STATS } from '../constants';
import { FadeIn } from './FadeIn';

export const StatsSection: React.FC = () => {
  return (
    <section id="stats" className="py-24 bg-sidelile-dark text-white overflow-hidden relative">
      {/* Background ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center md:text-left">
          {SCHOOL_STATS.map((stat, index) => (
            <FadeIn key={stat.label} delay={index * 150} className="group">
              <div className="relative p-6 rounded-2xl transition-all duration-300 hover:bg-white/5">
                <div className="text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 mb-4 tracking-tighter group-hover:scale-105 transition-transform origin-left">
                  {stat.value}
                </div>
                <div className="h-px w-12 bg-blue-500 mb-4 md:mx-0 mx-auto"></div>
                <h3 className="text-xl font-semibold text-white mb-2">{stat.label}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{stat.description}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};
