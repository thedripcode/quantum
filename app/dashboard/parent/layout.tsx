'use client';

import { useState } from 'react';
import ParentSidebar from '@/components/parent/ParentSidebar';
import ParentTopBar from '@/components/parent/ParentTopBar';

export default function ParentDashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#081420' }}>
      <ParentSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 45, background: 'rgba(0,0,0,0.65)' }}
          className="lg:hidden"
        />
      )}

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        <ParentTopBar onMenuClick={() => setMobileOpen(true)} />
        <main className="portal-main-content" style={{ flex: 1, overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
