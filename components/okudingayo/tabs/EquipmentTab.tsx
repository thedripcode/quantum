'use client';
import { useState } from 'react';
import { ScaffoldIcon, WrenchIcon, AlertIcon, CheckIcon, ClockIcon, TruckIcon } from '@/components/okudingayo/OkuIcons';

const EQUIPMENT = [
  { id: 'EQ-001', name: 'Kwikstage Scaffolding Frames 1.8m',   category: 'Scaffolding', qty: 240, min: 80,  unit: 'frames', condition: 'Good',  allocated: 'Umhlanga, Harbour', nextService: 'Aug 2026' },
  { id: 'EQ-002', name: 'Scaffolding Couplers (Right Angle)',   category: 'Scaffolding', qty: 12,  min: 50,  unit: 'units',  condition: 'Good',  allocated: 'Various',           nextService: 'N/A' },
  { id: 'EQ-003', name: 'Scaffold Boards 2.4m Timber',         category: 'Scaffolding', qty: 180, min: 60,  unit: 'boards', condition: 'Fair',  allocated: 'Harbour Phase 2',    nextService: 'N/A' },
  { id: 'EQ-004', name: 'Mobile Elevated Work Platform (MEWP)', category: 'Heavy Equipment', qty: 2, min: 1, unit: 'units', condition: 'Good',  allocated: 'Gateway Theatre',    nextService: 'Jun 22, 2026' },
  { id: 'EQ-005', name: 'Telehandler (Manitou MT625)',          category: 'Heavy Equipment', qty: 1, min: 1, unit: 'units', condition: 'Service Due', allocated: 'KwaMashu', nextService: 'Overdue' },
  { id: 'EQ-006', name: 'Delivery/Transport Truck (5-ton)',     category: 'Vehicles', qty: 2,   min: 1,  unit: 'units',  condition: 'Good',  allocated: 'Depot',             nextService: 'Jul 2026' },
  { id: 'EQ-007', name: 'Safety Harness Full-Body',            category: 'Safety PPE',  qty: 28,  min: 35,  unit: 'units',  condition: 'Good',  allocated: 'Various',           nextService: 'N/A' },
  { id: 'EQ-008', name: 'Hard Hats (EN397 Certified)',         category: 'Safety PPE',  qty: 45,  min: 40,  unit: 'units',  condition: 'Good',  allocated: 'Various',           nextService: 'N/A' },
  { id: 'EQ-009', name: 'Scaffolding Base Plates 150x150mm',   category: 'Scaffolding', qty: 320, min: 100, unit: 'plates', condition: 'Good',  allocated: 'Various',           nextService: 'N/A' },
  { id: 'EQ-010', name: 'Scaffolding Standards (Verticals) 4m',category: 'Scaffolding', qty: 310, min: 120, unit: 'units',  condition: 'Good',  allocated: 'Umhlanga, PMB',     nextService: 'N/A' },
];

const MAINTENANCE = [
  { asset: 'MEWP — JLG 450AJ', task: 'Hydraulic fluid change & annual cert', due: 'Jun 22, 2026', status: 'Due Soon', tech: 'Bongani N.' },
  { asset: 'Telehandler Manitou MT625', task: 'Engine service 500hr interval', due: 'Overdue', status: 'Overdue', tech: 'Unassigned' },
  { asset: 'Delivery Truck (CA 456 789)', task: 'Roadworthy inspection', due: 'Jul 15, 2026', status: 'Scheduled', tech: 'External' },
  { asset: 'Delivery Truck (CA 123 456)', task: '10,000km service', due: 'Aug 1, 2026', status: 'Scheduled', tech: 'External' },
];

const COND_COLORS: Record<string, { bg: string; color: string }> = {
  'Good':        { bg: '#dcfce7', color: '#15803d' },
  'Fair':        { bg: '#fef3c7', color: '#b45309' },
  'Service Due': { bg: '#fee2e2', color: '#dc2626' },
};

const MAINT_COLORS: Record<string, { bg: string; color: string }> = {
  'Due Soon':  { bg: '#fef3c7', color: '#b45309' },
  'Overdue':   { bg: '#fee2e2', color: '#dc2626' },
  'Scheduled': { bg: '#dbeafe', color: '#1d4ed8' },
  'Completed': { bg: '#dcfce7', color: '#15803d' },
};

export default function EquipmentTab() {
  const [catFilter, setCatFilter] = useState('All');

  const CATS = ['All', 'Scaffolding', 'Heavy Equipment', 'Vehicles', 'Safety PPE'];
  const lowStock = EQUIPMENT.filter(e => e.qty < e.min);
  const filtered = EQUIPMENT.filter(e => catFilter === 'All' || e.category === catFilter);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Low stock banner */}
      {lowStock.length > 0 && (
        <div style={{
          background: 'linear-gradient(90deg,#fee2e2,#fff5f5)', border: '1px solid #fca5a5',
          borderRadius: 12, padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <AlertIcon size={20} color="#dc2626" strokeWidth={2} />
          <div>
            <span style={{ fontWeight: 700, fontSize: 13, color: '#991b1b' }}>Low Stock Alert: </span>
            <span style={{ fontSize: 13, color: '#7f1d1d' }}>
              {lowStock.map(e => `${e.name} (${e.qty} ${e.unit} — min ${e.min})`).join(' | ')}
            </span>
          </div>
          <button style={{
            marginLeft: 'auto', background: '#dc2626', color: 'white', border: 'none',
            padding: '6px 16px', borderRadius: 100, fontSize: 12, fontWeight: 700, cursor: 'pointer',
          }}>Order Now</button>
        </div>
      )}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {[
          { label: 'Total Asset Types', value: '38', Icon: ScaffoldIcon, color: '#3b82f6' },
          { label: 'Equipment On Site',  value: '24', Icon: TruckIcon,   color: '#10b981' },
          { label: 'Maintenance Due',    value: '2',  Icon: WrenchIcon,  color: '#f59e0b' },
          { label: 'Low Stock Items',    value: `${lowStock.length}`, Icon: AlertIcon, color: '#ef4444' },
        ].map(s => (
          <div key={s.label} style={{
            background: 'white', borderRadius: 14, border: '1.5px solid #f1f5f9',
            padding: '16px 18px', borderLeft: `4px solid ${s.color}`, display: 'flex', gap: 12,
            boxShadow: '0 2px 10px rgba(30,77,179,0.05)',
          }}>
            <s.Icon size={22} color={s.color} strokeWidth={1.8} />
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#0f172a' }}>{s.value}</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>

        {/* Inventory table */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            {CATS.map(c => (
              <button key={c} onClick={() => setCatFilter(c)} style={{
                padding: '7px 16px', borderRadius: 100, border: '1.5px solid',
                borderColor: catFilter === c ? '#1e4db3' : '#e2e8f0',
                background: catFilter === c ? '#1e4db3' : 'white',
                color: catFilter === c ? 'white' : '#64748b',
                fontSize: 12, fontWeight: 600, cursor: 'pointer',
              }}>{c}</button>
            ))}
            <button style={{
              marginLeft: 'auto', background: 'linear-gradient(135deg,#1e4db3,#3b72d9)',
              color: 'white', border: 'none', padding: '8px 18px', borderRadius: 100,
              fontWeight: 700, fontSize: 12, cursor: 'pointer',
            }}>+ Add Item</button>
          </div>

          <div style={{ background: 'white', borderRadius: 16, border: '1.5px solid #f1f5f9', boxShadow: '0 2px 16px rgba(30,77,179,0.06)', overflow: 'hidden' }}>
            <div style={{ padding: '15px 22px', borderBottom: '1px solid #f1f5f9' }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>Inventory Register</span>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: '#f8fafc' }}>
                    {['Item', 'Category', 'Stock', 'Min Level', 'Allocated To', 'Condition', ''].map(h => (
                      <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item, i) => {
                    const isLow = item.qty < item.min;
                    return (
                      <tr key={item.id} style={{ borderTop: '1px solid #f1f5f9', background: isLow ? '#fff5f5' : i % 2 === 0 ? 'white' : '#fafcff' }}>
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ fontWeight: 600, color: '#0f172a', fontSize: 13 }}>{item.name}</div>
                          <div style={{ fontSize: 10, color: '#94a3b8' }}>{item.id}</div>
                        </td>
                        <td style={{ padding: '12px 14px', fontSize: 12, color: '#64748b' }}>{item.category}</td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{ fontSize: 14, fontWeight: 800, color: isLow ? '#dc2626' : '#0f172a' }}>{item.qty}</span>
                          <span style={{ fontSize: 11, color: '#94a3b8', marginLeft: 4 }}>{item.unit}</span>
                        </td>
                        <td style={{ padding: '12px 14px', fontSize: 12, color: '#64748b' }}>{item.min} {item.unit}</td>
                        <td style={{ padding: '12px 14px', fontSize: 12, color: '#64748b', maxWidth: 160 }}>{item.allocated}</td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 100, ...COND_COLORS[item.condition] }}>{item.condition}</span>
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <button style={{ padding: '5px 12px', borderRadius: 100, border: '1.5px solid #e2e8f0', background: 'white', color: '#334155', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>Edit</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Maintenance schedule */}
        <div>
          <div style={{ background: 'white', borderRadius: 16, border: '1.5px solid #f1f5f9', boxShadow: '0 2px 16px rgba(30,77,179,0.06)', overflow: 'hidden' }}>
            <div style={{ padding: '16px 18px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>Maintenance Schedule</span>
              <button style={{ fontSize: 11, fontWeight: 700, color: '#1e4db3', background: '#f0f5ff', border: 'none', padding: '5px 12px', borderRadius: 100, cursor: 'pointer' }}>+ Log Service</button>
            </div>
            {MAINTENANCE.map((m, i) => (
              <div key={i} style={{ padding: '14px 18px', borderBottom: '1px solid #f8fafc' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{m.asset}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 100, ...MAINT_COLORS[m.status] }}>{m.status}</span>
                </div>
                <div style={{ fontSize: 12, color: '#64748b', marginBottom: 6 }}>{m.task}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <ClockIcon size={12} color="#94a3b8" strokeWidth={1.8} />
                    <span style={{ fontSize: 11, color: '#94a3b8' }}>{m.due}</span>
                  </div>
                  <span style={{ fontSize: 11, color: '#64748b' }}>Tech: {m.tech}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
