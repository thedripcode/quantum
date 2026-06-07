import React from 'react';
import { FadeIn } from './FadeIn';
import { ASSETS } from '../constants';

export const GallerySection: React.FC = () => {
  return (
    <section id="gallery" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <FadeIn>
           <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-2">School Life</h2>
              <p className="text-slate-500 text-lg">Where passion finds its voice.</p>
            </div>
            <a href="#" className="hidden md:block text-sidelile-blue hover:text-blue-800 transition-colors">View All Activities &rarr;</a>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-[800px] md:h-[600px]">
          {/* Item 1 - Big - Choir/Assembly */}
          <div className="md:col-span-2 md:row-span-2 relative rounded-3xl overflow-hidden group shadow-lg">
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: `url("${ASSETS.choir}")` }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-90"></div>
            <div className="absolute bottom-0 left-0 p-8">
               <h3 className="text-white text-2xl font-bold">The Stage</h3>
               <p className="text-white/80 mt-1">Award-winning choir and drama society.</p>
            </div>
          </div>

          {/* Item 2 - Sports */}
          <div className="md:col-span-1 md:row-span-1 relative rounded-3xl overflow-hidden group shadow-lg">
             <div 
               className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
               style={{ backgroundImage: `url("${ASSETS.sports}")` }}
             ></div>
             <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
             <div className="absolute bottom-4 left-4">
                <span className="bg-white/90 backdrop-blur text-xs font-bold px-3 py-1 rounded-full text-slate-900">Sports</span>
             </div>
          </div>

          {/* Item 3 - Study/Classroom */}
          <div className="md:col-span-1 md:row-span-1 relative rounded-3xl overflow-hidden group shadow-lg">
             <div 
               className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
               style={{ backgroundImage: `url("${ASSETS.group_study}")` }}
             ></div>
             <div className="absolute bottom-4 left-4">
                <span className="bg-white/90 backdrop-blur text-xs font-bold px-3 py-1 rounded-full text-slate-900">Academics</span>
             </div>
          </div>

          {/* Item 4 - Wide - Community */}
          <div className="md:col-span-2 md:row-span-1 relative rounded-3xl overflow-hidden group shadow-lg">
             <div 
               className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
               style={{ backgroundImage: `url("${ASSETS.hero_group}")` }}
             ></div>
             <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6">
               <h3 className="text-white text-xl font-bold">Community Spirit</h3>
               <p className="text-white/80 mt-1 text-sm">Growing together in Kwazulu-Natal.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};