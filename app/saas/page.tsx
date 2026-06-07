import SaasNav          from '@/components/saas/SaasNav';
import SaasHero         from '@/components/saas/SaasHero';
import SaasLogos        from '@/components/saas/SaasLogos';
import SaasFeatures     from '@/components/saas/SaasFeatures';
import SaasTestimonials from '@/components/saas/SaasTestimonials';
import SaasPricing      from '@/components/saas/SaasPricing';
import SaasFooter       from '@/components/saas/SaasFooter';

export default function SaasPage() {
  return (
    <div className="bg-white min-h-screen antialiased text-zinc-900">
      <SaasNav />
      <main>
        <SaasHero />
        <SaasLogos />
        <SaasFeatures />
        <SaasTestimonials />
        <SaasPricing />
      </main>
      <SaasFooter />
    </div>
  );
}
