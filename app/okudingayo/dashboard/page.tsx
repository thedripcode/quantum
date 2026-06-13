'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  SketchFilterDef,
  HomeIcon, BuildingIcon, UsersIcon, FolderIcon, CameraIcon,
  KeyIcon, CoinIcon, ScaffoldIcon, HardHatIcon, BellIcon, ChartIcon, GearIcon,
  LightningIcon, AlertIcon,
} from '@/components/okudingayo/OkuIcons';
import OverviewTab from '@/components/okudingayo/tabs/OverviewTab';
import ProjectsTab from '@/components/okudingayo/tabs/ProjectsTab';
import EmployeesTab from '@/components/okudingayo/tabs/EmployeesTab';
import DocumentsTab from '@/components/okudingayo/tabs/DocumentsTab';
import PhotosTab from '@/components/okudingayo/tabs/PhotosTab';
import ClientsTab from '@/components/okudingayo/tabs/ClientsTab';
import FinanceTab from '@/components/okudingayo/tabs/FinanceTab';
import EquipmentTab from '@/components/okudingayo/tabs/EquipmentTab';
import SafetyTab from '@/components/okudingayo/tabs/SafetyTab';
import NotificationsTab from '@/components/okudingayo/tabs/NotificationsTab';
import ReportsTab from '@/components/okudingayo/tabs/ReportsTab';
import AdminTab from '@/components/okudingayo/tabs/AdminTab';

const NAV = [
  { Icon: HomeIcon,      label: 'Overview',       id: 'overview',       badge: null },
  { Icon: BuildingIcon,  label: 'Projects',        id: 'projects',       badge: '8' },
  { Icon: UsersIcon,     label: 'Employees',       id: 'employees',      badge: null },
  { Icon: FolderIcon,    label: 'Documents',       id: 'documents',      badge: null },
  { Icon: CameraIcon,    label: 'Site Photos',     id: 'photos',         badge: null },
  { Icon: KeyIcon,       label: 'Clients',         id: 'clients',        badge: null },
  { Icon: CoinIcon,      label: 'Finance',         id: 'finance',        badge: '3' },
  { Icon: ScaffoldIcon,  label: 'Equipment',       id: 'equipment',      badge: '2' },
  { Icon: HardHatIcon,   label: 'Health & Safety', id: 'safety',         badge: '!' },
  { Icon: BellIcon,      label: 'Notifications',   id: 'notifications',  badge: '3' },
  { Icon: ChartIcon,     label: 'Reports',         id: 'reports',        badge: null },
  { Icon: GearIcon,      label: 'Admin',           id: 'admin',          badge: null },
];

const NOISE_BG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`;

export default function Dashboard() {
  const [tab, setTab] = useState('overview');
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState<{ name: string; role: string; email: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem('oku_user');
    if (!stored) { router.replace('/okudingayo/login'); return; }
    setUser(JSON.parse(stored));
  }, [router]);

  if (!user) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f4f8' }}>
      <div style={{ fontSize: 14, color: '#64748b' }}>Loading...</div>
    </div>
  );

  const activeNav = NAV.find(n => n.id === tab);

  return (
    <>
      <SketchFilterDef />
      <div style={{ display: 'flex', height: '100vh', background: '#f0f4f8', fontFamily: "'Inter', -apple-system, sans-serif", overflow: 'hidden' }}>

        {/* SIDEBAR */}
        <aside style={{
          width: collapsed ? 72 : 240,
          background: '#1e4db3',
          backgroundImage: NOISE_BG,
          backgroundSize: '200px',
          display: 'flex', flexDirection: 'column',
          transition: 'width 0.25s cubic-bezier(.4,0,.2,1)',
          overflow: 'hidden', flexShrink: 0,
          position: 'relative', zIndex: 10,
        }}>
          {/* Brand */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '20px 16px',
            borderBottom: '1px solid rgba(255,255,255,0.12)',
            overflow: 'hidden', whiteSpace: 'nowrap',
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10, background: '#f5e85e',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <BuildingIcon size={20} color="#1e4db3" strokeWidth={2} />
            </div>
            {!collapsed && (
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, color: 'white', letterSpacing: '-0.01em', lineHeight: 1.2 }}>Okudingayo</div>
                <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.07em', textTransform: 'uppercase' }}>Construction Hub</div>
              </div>
            )}
          </div>

          {/* Alerts banner */}
          {!collapsed && (
            <div style={{
              margin: '10px 10px 2px',
              background: 'rgba(239,68,68,0.15)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 10, padding: '8px 12px',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <LightningIcon size={14} color="#fca5a5" strokeWidth={2} />
              <span style={{ fontSize: 11, color: '#fca5a5', fontWeight: 700 }}>3 alerts need action</span>
            </div>
          )}

          {/* Nav */}
          <nav style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '6px 0' }}>
            {NAV.map(({ Icon, label, id, badge }) => {
              const active = tab === id;
              return (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  title={collapsed ? label : undefined}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center',
                    gap: collapsed ? 0 : 10,
                    padding: collapsed ? '12px 0' : '11px 12px',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    background: active ? 'rgba(255,255,255,0.15)' : 'transparent',
                    border: 'none',
                    borderLeft: active ? '3px solid #f5e85e' : '3px solid transparent',
                    cursor: 'pointer',
                    transition: 'background 0.15s',
                    position: 'relative',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <Icon
                    size={18}
                    color={active ? '#f5e85e' : 'rgba(255,255,255,0.65)'}
                    strokeWidth={active ? 2.1 : 1.6}
                  />
                  {!collapsed && (
                    <span style={{
                      fontSize: 12, fontWeight: active ? 700 : 500,
                      color: active ? '#f5e85e' : 'rgba(255,255,255,0.75)',
                      flex: 1, textAlign: 'left',
                    }}>{label}</span>
                  )}
                  {!collapsed && badge && (
                    <span style={{
                      fontSize: 9, fontWeight: 800,
                      background: badge === '!' ? '#ef4444' : 'rgba(255,255,255,0.18)',
                      color: 'white', padding: '1px 6px', borderRadius: 100,
                    }}>{badge}</span>
                  )}
                  {collapsed && badge && (
                    <div style={{
                      position: 'absolute', top: 6, right: 6,
                      width: 8, height: 8, borderRadius: '50%',
                      background: badge === '!' ? '#ef4444' : '#f5e85e',
                    }} />
                  )}
                </button>
              );
            })}
          </nav>

          {/* User panel */}
          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.12)',
            padding: collapsed ? '14px 0' : '14px 14px',
            display: 'flex', alignItems: 'center',
            gap: collapsed ? 0 : 10,
            justifyContent: collapsed ? 'center' : 'flex-start',
          }}>
            <div style={{
              width: 34, height: 34, borderRadius: '50%',
              background: 'rgba(245,232,94,0.18)',
              border: '2px solid rgba(245,232,94,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#f5e85e', fontWeight: 800, fontSize: 12, flexShrink: 0,
            }}>{user.name.split(' ').map((n: string) => n[0]).join('').slice(0,2)}</div>
            {!collapsed && (
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', textTransform: 'capitalize' }}>{user.role}</div>
              </div>
            )}
          </div>

          {/* Collapse toggle */}
          <button onClick={() => setCollapsed(c => !c)} style={{
            position: 'absolute', right: -12, top: '50%', transform: 'translateY(-50%)',
            width: 24, height: 24, borderRadius: '50%',
            background: 'white', border: '2px solid #e2e8f0',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', fontSize: 11, color: '#1e4db3', fontWeight: 800,
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)', zIndex: 20,
          }}>{collapsed ? '›' : '‹'}</button>
        </aside>

        {/* MAIN */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>

          {/* Topbar */}
          <header style={{
            background: 'white', borderBottom: '1px solid #e2e8f0',
            padding: '0 24px', height: 62,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexShrink: 0, gap: 12,
          }}>
            <div style={{ minWidth: 0 }}>
              <h1 style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {activeNav?.label || 'Dashboard'}
              </h1>
              <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 1 }}>
                Okudingayo Trading Enterprise
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
              <button onClick={() => setTab('safety')} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: '#fff5f5', border: '1px solid #fecaca',
                padding: '7px 14px', borderRadius: 100, cursor: 'pointer',
              }}>
                <AlertIcon size={13} color="#ef4444" strokeWidth={2} />
                <span style={{ fontSize: 11, fontWeight: 700, color: '#dc2626' }}>Safety Alert</span>
              </button>

              <button onClick={() => setTab('notifications')} style={{
                position: 'relative', background: '#f0f5ff', border: '1.5px solid #dbeafe',
                borderRadius: '50%', width: 38, height: 38,
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              }}>
                <BellIcon size={17} color="#1e4db3" strokeWidth={1.8} />
                <div style={{
                  position: 'absolute', top: 5, right: 5,
                  width: 8, height: 8, borderRadius: '50%',
                  background: '#ef4444', border: '2px solid white',
                }} />
              </button>

              <Link href="/okudingayo" style={{
                border: '1.5px solid #e2e8f0', background: 'white',
                padding: '8px 16px', borderRadius: 100,
                fontSize: 12, fontWeight: 600, color: '#334155', textDecoration: 'none',
              }}>{'<'} Site</Link>

              <button
                onClick={() => { localStorage.removeItem('oku_user'); router.replace('/okudingayo/login'); }}
                style={{
                  background: '#1e4db3', color: 'white', border: 'none',
                  padding: '8px 18px', borderRadius: 100,
                  fontWeight: 700, fontSize: 12, cursor: 'pointer',
                }}>Sign Out</button>
            </div>
          </header>

          {/* Tab content */}
          <main style={{ flex: 1, overflowY: 'auto', padding: '22px 24px' }}>
            {tab === 'overview'      && <OverviewTab />}
            {tab === 'projects'      && <ProjectsTab />}
            {tab === 'employees'     && <EmployeesTab />}
            {tab === 'documents'     && <DocumentsTab />}
            {tab === 'photos'        && <PhotosTab />}
            {tab === 'clients'       && <ClientsTab />}
            {tab === 'finance'       && <FinanceTab />}
            {tab === 'equipment'     && <EquipmentTab />}
            {tab === 'safety'        && <SafetyTab />}
            {tab === 'notifications' && <NotificationsTab />}
            {tab === 'reports'       && <ReportsTab />}
            {tab === 'admin'         && <AdminTab />}
          </main>
        </div>
      </div>
    </>
  );
}
