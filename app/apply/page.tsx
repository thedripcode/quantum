import type { Metadata } from 'next';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/footer/Footer';
import ApplicationForm from '@/components/forms/ApplicationForm';
import ApplyHero from '@/components/apply/ApplyHero';
import ApplySidebar from '@/components/apply/ApplySidebar';

export const metadata: Metadata = {
  title: 'Apply for Admission | Sidelile High School',
  description: 'Apply online for admission to Sidelile High School. Applications are open for the 2026 academic year.',
};

export default function ApplyPage() {
  return (
    <>
      <Navbar />
      <ApplyHero />

      {/* ── Form section ── */}
      <section style={{ background: 'var(--bg)', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '80px clamp(24px, 8vw, 120px)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 40, alignItems: 'start' }}>

            {/* ── Sidebar (client component) ── */}
            <ApplySidebar />

            {/* ── Form ── */}
            <div style={{
              borderRadius: 24,
              padding: '40px',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
            }}>
              <ApplicationForm />
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
