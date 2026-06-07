'use client';

import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminTopBar from '@/components/admin/AdminTopBar';
import SidiChatbot from '@/components/admin/SidiChatbot';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0C0C0C' }}>
      <AdminSidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        <AdminTopBar />
        <main style={{ flex: 1, overflowY: 'auto' }}>
          {children}
        </main>
      </div>
      <SidiChatbot />
    </div>
  );
}
