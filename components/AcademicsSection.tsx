import React from 'react';
import { FadeIn } from './FadeIn';
import { ASSETS } from '../constants';

const PROGRAMS = [
  {
    title: "STEM Excellence",
    description: "Rigorous training in Mathematics, Physical Sciences, and Life Sciences, preparing students for engineering and medical fields.",
    img: ASSETS.science
  },
  {
    title: "Commerce & Management",
    description: "Preparing future entrepreneurs with Accounting, Economics, and Business Studies, with a focus on real-world application.",
    img: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2600&auto=format&fit=crop"
  },
  {
    title: "Humanities & Arts",
    description: "Fostering critical thinking and cultural appreciation through History, Geography, and multiple Languages.",
    img: ASSETS.arts
  }
];

export const AcademicsSection: React.FC = () => {
  return (
    <section id="academics" className="py-24 bg-sidelile-gray relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <FadeIn>
          <div className="flex flex-col md:flex-row justify-between items-end mb-16">
            <div className="max-w-2xl">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">Academic Pathways</h2>
              <p className="text-slate-500 text-lg">
                We offer a diverse curriculum tailored to unlock the unique potential of every learner.
              </p>
            </div>
            <div className="hidden md:block">
              <a href="#" className="text-sidelile-blue font-semibold hover:text-blue-700 transition-colors flex items-center">
                Download Prospectus
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </a>
            </div>
          </div>
        </FadeIn>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PROGRAMS.map((prog, idx) => (
            <FadeIn key={idx} delay={idx * 200}>
              <div className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-500 group h-full flex flex-col border border-slate-100">
                <div className="h-64 overflow-hidden relative">
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url(${prog.img})` }}
                  ></div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="text-2xl font-bold mb-3 text-slate-900">{prog.title}</h3>
                  <p className="text-slate-500 leading-relaxed mb-8 flex-1">{prog.description}</p>
                  <a href="#" className="mt-auto text-sidelile-blue font-bold tracking-wide text-sm uppercase hover:underline inline-flex items-center group-hover:translate-x-1 transition-transform">
                    View Subjects 
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </a>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};