'use client';

import { useEffect, useState } from 'react';
import { Lock, Star } from 'lucide-react';
import { ACHIEVEMENTS, Achievement } from '@/data/studentData';

const BG = '#0C0C0C'; const SURFACE = '#161616'; const S2 = '#1E1E1E';
const GOLD = '#C9A84C'; const GOLD_DIM = 'rgba(201,168,76,0.10)'; const GOLD_B = 'rgba(201,168,76,0.25)';
const BORDER = 'rgba(255,255,255,0.07)'; const TEXT = '#FFFFFF'; const MUTED = 'rgba(255,255,255,0.50)'; const FAINT = 'rgba(255,255,255,0.22)';
const F_HEADING = "'Bricolage Grotesque', sans-serif"; const F_BODY = "'Inter', sans-serif";

const RARITY_CONFIG = {
  common:    { label: 'Common',    color: '#9CA3AF', glow: 'rgba(156,163,175,0.15)' },
  rare:      { label: 'Rare',      color: '#3B82F6', glow: 'rgba(59,130,246,0.20)' },
  epic:      { label: 'Epic',      color: '#8B5CF6', glow: 'rgba(139,92,246,0.22)' },
  legendary: { label: 'Legendary', color: GOLD,       glow: 'rgba(201,168,76,0.25)' },
};

const CAT_COLORS: Record<string, string> = {
  Academic: '#3B82F6', Attendance: '#10B981', Sport: '#F59E0B',
  Leadership: '#8B5CF6', Community: '#EC4899',
};

function BadgeCard({ badge }: { badge: Achievement }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setTimeout(() => setMounted(true), 100); }, []);

  const rarity = RARITY_CONFIG[badge.rarity];
  const catColor = CAT_COLORS[badge.category] || GOLD;

  return (
    <div style={{
      background: badge.earned ? SURFACE : S2,
      border: `1px solid ${badge.earned ? (badge.rarity === 'legendary' ? GOLD_B : rarity.color + '44') : BORDER}`,
      borderRadius: 16,
      padding: '20px',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
      opacity: badge.earned ? 1 : 0.55,
      boxShadow: badge.earned && mounted ? `0 0 20px ${rarity.glow}` : 'none',
      transition: 'box-shadow 1s ease, opacity .3s',
    }}>
      {/* Rarity indicator */}
      <div style={{ position: 'absolute', top: 10, right: 10 }}>
        <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: rarity.color + '22', color: rarity.color, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          {rarity.label}
        </span>
      </div>

      {badge.earned && mounted && badge.rarity === 'legendary' && (
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at center, ${GOLD}08 0%, transparent 70%)`, pointerEvents: 'none' }} />
      )}

      {/* Icon */}
      <div style={{ fontSize: 40, marginBottom: 12, filter: badge.earned ? 'none' : 'grayscale(100%)', transition: 'filter .3s' }}>
        {badge.earned ? badge.icon : <Lock size={32} style={{ color: FAINT, margin: '0 auto' }} />}
      </div>

      <div style={{ fontFamily: F_HEADING, fontSize: 14, fontWeight: 700, color: badge.earned ? TEXT : MUTED, marginBottom: 6, letterSpacing: '-0.01em' }}>{badge.title}</div>
      <div style={{ fontSize: 11, color: MUTED, lineHeight: 1.5, marginBottom: 10 }}>{badge.description}</div>

      {/* Category + points */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 4, background: catColor + '18', color: catColor }}>{badge.category}</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, color: badge.earned ? GOLD : FAINT, fontWeight: 600 }}>
          <Star size={10} /> {badge.points} pts
        </span>
      </div>

      {badge.earned && badge.earnedDate && (
        <div style={{ marginTop: 8, fontSize: 10, color: FAINT }}>Earned {badge.earnedDate}</div>
      )}
    </div>
  );
}

export default function AchievementsPage() {
  const earned = ACHIEVEMENTS.filter(a => a.earned);
  const locked = ACHIEVEMENTS.filter(a => !a.earned);
  const totalPoints = earned.reduce((s, a) => s + a.points, 0);
  const nextMilestone = 500;
  const progress = (totalPoints / nextMilestone) * 100;

  return (
    <div style={{ padding: 24, fontFamily: F_BODY, background: BG, minHeight: '100%' }}>
      {/* Stats header */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 24 }}>
        <div style={{ background: GOLD_DIM, border: `1px solid ${GOLD_B}`, borderRadius: 14, padding: 18 }}>
          <div style={{ fontSize: 11, color: 'rgba(201,168,76,0.65)', fontWeight: 500 }}>Badges Earned</div>
          <div style={{ fontFamily: F_HEADING, fontSize: 32, fontWeight: 800, color: GOLD, letterSpacing: '-0.03em', marginTop: 4 }}>{earned.length}</div>
          <div style={{ fontSize: 11, color: 'rgba(201,168,76,0.50)', marginTop: 2 }}>of {ACHIEVEMENTS.length} total</div>
        </div>
        <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 18 }}>
          <div style={{ fontSize: 11, color: MUTED, fontWeight: 500 }}>Total Points</div>
          <div style={{ fontFamily: F_HEADING, fontSize: 32, fontWeight: 800, color: TEXT, letterSpacing: '-0.03em', marginTop: 4 }}>{totalPoints}</div>
          <div style={{ fontSize: 11, color: FAINT, marginTop: 2 }}>{nextMilestone - totalPoints} to next milestone</div>
        </div>
        <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 18 }}>
          <div style={{ fontSize: 11, color: MUTED, fontWeight: 500, marginBottom: 8 }}>Next Milestone</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: TEXT }}>{nextMilestone} Points</div>
          <div style={{ marginTop: 8, height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${Math.min(progress, 100)}%`, background: GOLD, borderRadius: 3, transition: 'width 1.2s ease' }} />
          </div>
          <div style={{ fontSize: 11, color: FAINT, marginTop: 5 }}>{totalPoints} / {nextMilestone}</div>
        </div>
      </div>

      {/* Earned badges */}
      <div style={{ marginBottom: 28 }}>
        <h3 style={{ fontFamily: F_HEADING, fontSize: 16, fontWeight: 700, color: GOLD, margin: '0 0 14px', letterSpacing: '-0.01em', display: 'flex', alignItems: 'center', gap: 8 }}>
          🏅 Earned Badges ({earned.length})
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {earned.map(a => <BadgeCard key={a.id} badge={a} />)}
        </div>
      </div>

      {/* Locked badges */}
      <div>
        <h3 style={{ fontFamily: F_HEADING, fontSize: 16, fontWeight: 700, color: MUTED, margin: '0 0 14px', letterSpacing: '-0.01em', display: 'flex', alignItems: 'center', gap: 8 }}>
          🔒 Locked Badges ({locked.length})
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {locked.map(a => <BadgeCard key={a.id} badge={a} />)}
        </div>
      </div>
    </div>
  );
}
