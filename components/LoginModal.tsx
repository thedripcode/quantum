import React, { useState } from 'react';
import { ASSETS } from '../constants';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'student' | 'parent' | 'teacher'>('student');

  if (!isOpen) return null;

  const getPlaceholder = () => {
    switch(activeTab) {
      case 'student': return 'ST-2024-001';
      case 'teacher': return 'STAFF-9921';
      default: return 'parent@example.com';
    }
  };

  const getLabel = () => {
    switch(activeTab) {
      case 'student': return 'Student ID';
      case 'teacher': return 'Staff ID / Email';
      default: return 'Email Address';
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
        {/* Header */}
        <div className="bg-sidelile-gray px-8 py-6 border-b border-slate-100 flex flex-col items-center">
          <img src={ASSETS.logo} alt="Logo" className="w-12 h-12 mb-3 object-contain drop-shadow-sm" />
          <h2 className="text-xl font-bold text-slate-900">Sidelile Portal</h2>
          <p className="text-sm text-slate-500">Secure access for the school community</p>
        </div>

        {/* Tabs */}
        <div className="flex p-1.5 bg-slate-100 m-6 rounded-xl border border-slate-200">
          <button 
            onClick={() => setActiveTab('student')}
            className={`flex-1 py-2 text-xs md:text-sm font-semibold rounded-lg transition-all duration-300 ${
              activeTab === 'student' 
                ? 'bg-white text-sidelile-blue shadow-sm' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
            }`}
          >
            Student
          </button>
          <button 
            onClick={() => setActiveTab('parent')}
            className={`flex-1 py-2 text-xs md:text-sm font-semibold rounded-lg transition-all duration-300 ${
              activeTab === 'parent' 
                ? 'bg-white text-sidelile-blue shadow-sm' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
            }`}
          >
            Parent
          </button>
           <button 
            onClick={() => setActiveTab('teacher')}
            className={`flex-1 py-2 text-xs md:text-sm font-semibold rounded-lg transition-all duration-300 ${
              activeTab === 'teacher' 
                ? 'bg-white text-sidelile-blue shadow-sm' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
            }`}
          >
            Teacher
          </button>
        </div>

        {/* Form */}
        <div className="px-8 pb-8">
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                {getLabel()}
              </label>
              <input 
                type={activeTab === 'parent' ? 'email' : 'text'} 
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-sidelile-blue focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-900 placeholder-slate-400"
                placeholder={getPlaceholder()}
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Password
              </label>
              <input 
                type="password" 
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-sidelile-blue focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-900 placeholder-slate-400"
                placeholder="••••••••"
              />
            </div>

            <button className="w-full py-4 bg-sidelile-blue text-white font-bold rounded-xl hover:bg-blue-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg shadow-blue-500/20 mt-4">
              Sign In
            </button>

            <div className="flex justify-center mt-4">
              <a href="#" className="text-xs text-slate-400 hover:text-sidelile-blue transition-colors">
                Forgot your credentials?
              </a>
            </div>
          </form>
        </div>

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
    </div>
  );
};