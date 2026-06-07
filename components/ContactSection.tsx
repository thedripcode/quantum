import React from 'react';
import { FadeIn } from './FadeIn';

export const ContactSection: React.FC = () => {
  return (
    <section id="contact" className="py-24 bg-sidelile-gray">
      <div className="max-w-4xl mx-auto px-6">
        <FadeIn>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Admissions & Inquiries</h2>
            <p className="text-slate-500">
              Join the Sidelile family. Applications for the next academic year are now open.
            </p>
          </div>
        </FadeIn>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden p-8 md:p-12">
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Student Name</label>
                <input type="text" className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-sidelile-blue focus:ring-2 focus:ring-blue-100 outline-none transition-all" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Grade Applying For</label>
                <select className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-sidelile-blue focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-white">
                  <option>Grade 8</option>
                  <option>Grade 9</option>
                  <option>Grade 10</option>
                  <option>Grade 11</option>
                  <option>Grade 12</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Parent Email</label>
              <input type="email" className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-sidelile-blue focus:ring-2 focus:ring-blue-100 outline-none transition-all" placeholder="parent@example.com" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Message</label>
              <textarea rows={4} className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-sidelile-blue focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none" placeholder="How can we help you?"></textarea>
            </div>

            <div className="text-center pt-4">
              <button className="px-10 py-4 bg-sidelile-blue text-white font-bold rounded-full hover:bg-blue-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg shadow-blue-500/30">
                Submit Inquiry
              </button>
            </div>
          </form>
        </div>

        <div className="mt-16 border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center text-slate-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Sidelile High School.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-sidelile-blue transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-sidelile-blue transition-colors">Terms of Use</a>
          </div>
        </div>
      </div>
    </section>
  );
};
