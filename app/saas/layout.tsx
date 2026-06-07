import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kairos — The project workspace teams actually love',
  description:
    'Ship fast and stay aligned. Kairos connects your issues, pull requests, and roadmap into one workspace your whole team will actually use.',
};

export default function SaasLayout({ children }: { children: React.ReactNode }) {
  // Override parent layout — render only the SaaS page, no school nav/footer
  return (
    <div style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      {children}
    </div>
  );
}
