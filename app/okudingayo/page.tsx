import OkuNav          from '@/components/okudingayo/OkuNav';
import OkuHero         from '@/components/okudingayo/OkuHero';
import OkuHowItWorks   from '@/components/okudingayo/OkuHowItWorks';
import OkuAbout        from '@/components/okudingayo/OkuAbout';
import OkuModules      from '@/components/okudingayo/OkuModules';
import OkuFAQ          from '@/components/okudingayo/OkuFAQ';
import OkuTestimonials from '@/components/okudingayo/OkuTestimonials';
import OkuBlog         from '@/components/okudingayo/OkuBlog';
import OkuFooter       from '@/components/okudingayo/OkuFooter';

export default function OkudingayoPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'white', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <OkuNav />
      <main>
        <OkuHero />
        <OkuHowItWorks />
        <OkuAbout />
        <OkuModules />
        <OkuFAQ />
        <OkuTestimonials />
        <OkuBlog />
      </main>
      <OkuFooter />
    </div>
  );
}
