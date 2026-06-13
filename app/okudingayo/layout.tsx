import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Okudingayo Trading Enterprise — Management Hub',
  description: 'All-in-one operational platform for plumbing service workflows, customer relationships, field teams, and finances.',
};

export default function OkudingayoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      {children}
    </div>
  );
}
