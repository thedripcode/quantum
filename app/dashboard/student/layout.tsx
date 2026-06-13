'use client';

import { useState } from 'react';
import StudentPortalSidebar from '@/components/student/StudentPortalSidebar';
import StudentPortalTopBar  from '@/components/student/StudentPortalTopBar';

export default function StudentDashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0C0C0C' }}>
      <StudentPortalSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 45, background: 'rgba(0,0,0,0.65)' }}
          className="lg:hidden"
        />
      )}

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        <StudentPortalTopBar onMenuClick={() => setMobileOpen(true)} />
        <main style={{ flex: 1, overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
