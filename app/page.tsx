import Navbar            from '@/components/navbar/Navbar';
import HeroSection       from '@/components/home/HeroSection';
import StatsTicker       from '@/components/home/StatsTicker';
import AccordionFeatures from '@/components/home/AccordionFeatures';
import StatsRow          from '@/components/home/StatsRow';
import AcademicsSection  from '@/components/home/AcademicsSection';
import BentoGrid         from '@/components/home/BentoGrid';
import NewsSection       from '@/components/home/NewsSection';
import TeachersSection   from '@/components/home/TeachersSection';
import PortalSection     from '@/components/home/PortalSection';
import FAQSection        from '@/components/home/FAQSection';
import Footer            from '@/components/footer/Footer';
import ChatBot           from '@/components/chatbot/ChatBot';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <StatsTicker />
        <AccordionFeatures />
        <StatsRow />
        <AcademicsSection />
        <BentoGrid />
        <NewsSection />
        <TeachersSection />
        <PortalSection />
        <FAQSection />
      </main>
      <Footer />
      <ChatBot context="home" />
    </>
  );
}
