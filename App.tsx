import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { StatsSection } from './components/StatsSection';
import { AcademicsSection } from './components/AcademicsSection';
import { GallerySection } from './components/GallerySection';
import { ContactSection } from './components/ContactSection';
import { ChatWidget } from './components/ChatWidget';
import { LoginModal } from './components/LoginModal';

function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar onLoginClick={() => setIsLoginOpen(true)} />
      <main>
        <Hero />
        <AboutSection />
        <AcademicsSection />
        <StatsSection />
        <GallerySection />
        <ContactSection />
      </main>
      <ChatWidget />
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </div>
  );
}

export default App;