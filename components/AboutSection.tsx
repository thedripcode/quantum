import React from 'react';
import { FadeIn } from './FadeIn';
import { ASSETS } from '../constants';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-6">
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">A Foundation for the Future</h2>
            <p className="text-lg md:text-xl text-slate-500 max-w-3xl mx-auto leading-relaxed font-light">
              We believe in holistic education that nurtures the mind, body, and spirit. 
              Situated in the heart of our community, <span className="text-sidelile-blue font-semibold">Sidelile High School</span> stands as a beacon of hope and excellence.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:h-[600px]">
          {/* Main Large Image - Classroom Environment */}
          <div className="md:col-span-2 relative group overflow-hidden rounded-[2.5rem] h-[400px] md:h-full shadow-2xl transition-all duration-500 hover:shadow-3xl">
             <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: `url("${ASSETS.classroom}")` }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
            <div className="absolute bottom-0 left-0 p-10 flex flex-col justify-end">
              <span className="inline-block px-3 py-1 bg-sidelile-blue text-white text-xs font-bold rounded-full w-fit mb-3 shadow-lg">Academic Excellence</span>
              <h3 className="text-white text-3xl font-bold mb-2">Modern Learning Spaces</h3>
              <p className="text-white/80 text-lg max-w-md">Our classrooms are designed to foster collaboration, focus, and innovation, mirroring the real-world environments our students will enter.</p>
            </div>
          </div>

          <div className="flex flex-col gap-8 h-full">
            {/* Top Right Card - Stats/Info */}
            <div className="flex-1 relative group overflow-hidden rounded-[2.5rem] bg-sidelile-gray p-10 shadow-lg flex flex-col justify-center items-start transition-colors hover:bg-blue-50/50">
              <div className="w-12 h-12 bg-sidelile-blue rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg shadow-blue-500/30">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              </div>
              <h3 className="text-2xl font-bold text-sidelile-dark mb-4">Dedicated Educators</h3>
              <p className="text-slate-600 leading-relaxed">Our faculty goes beyond the curriculum to mentor and inspire every student, ensuring no one is left behind.</p>
            </div>

            {/* Bottom Right Image - Detail Shot */}
             <div className="flex-1 relative group overflow-hidden rounded-[2.5rem] h-[300px] md:h-auto shadow-lg">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url("https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2600&auto=format&fit=crop")` }}
                ></div>
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                <div className="absolute top-6 right-6 bg-white/20 backdrop-blur-md rounded-full px-4 py-1 text-xs font-bold text-white border border-white/20">
                  Focus
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};