'use client';

import { useState, useEffect } from 'react';
import { Target, TrendingUp, CheckCircle2, AlertTriangle, Save } from 'lucide-react';
import { GOALS, SUBJECTS, Goal } from '@/data/studentData';

const BG = '#0C0C0C'; const SURFACE = '#161616'; const S2 = '#1E1E1E';
const GOLD = '#C9A84C'; const GOLD_DIM = 'rgba(201,168,76,0.08)'; const GOLD_B = 'rgba(201,168,76,0.22)';
const BORDER = 'rgba(255,255,255,0.07)'; const TEXT = '#FFFFFF'; const MUTED = 'rgba(255,255,255,0.50)'; const FAINT = 'rgba(255,255,255,0.22)';
const RED = '#EF4444'; const GREEN = '#10B981'; const AMBER = '#F59E0B';
const F_HEADING = "'Bricolage Grotesque', sans-serif"; const F_BODY = "'Inter', sans-serif";

function predictExamNeeded(currentMark: number, targetMark: number, examWeight = 0.4, termWeight = 0.6): number {
  return Math.max(0, Math.min(100, Math.round((targetMark - currentMark * termWeight) / examWeight)));
}

function GoalCard({ goal, onUpdate }: { goal: Goal & { saved?: boolean }; onUpdate: (id: string, target: number) => void }) {
  const [target, setTarget] = useState(goal.targetMark);
  const [saved, setSaved] = useState(false);

  const examNeeded = predictExamNeeded(goal.currentMark, target);
  const progressPct = Math.min(100, Math.round((goal.currentMark / target) * 100));
  const onTrack = goal.currentMark >= target * 0.85;
  const sub = SUBJECTS.find(s => s.id === goal.subjectId);

  const handleSave = () => {
    onUpdate(goal.id, target);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const riskColor = goal.currentMark < 50 ? RED : goal.currentMark < 60 ? AMBER : goal.currentMark < 70 ? '#F59E0B' : GREEN;

  return (
    <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '20px 22px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: goal.color }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: goal.color, letterSpacing: '0.06em' }}>
              {sub?.short}
            </span>
            {goal.currentMark < 60 && <AlertTriangle size={12} style={{ color: RED }} />}
          </div>
          <div style={{ fontFamily: F_HEADING, fontSize: 16, fontWeight: 700, color: TEXT, letterSpacing: '-0.01em' }}>{goal.subject}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: F_HEADING, fontSize: 26, fontWeight: 800, color: riskColor, letterSpacing: '-0.03em', lineHeight: 1 }}>{goal.currentMark}%</div>
          <div style={{ fontSize: 10, color: MUTED, marginTop: 2 }}>current</div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: MUTED, marginBottom: 6 }}>
          <span>Progress to goal</span>
          <span style={{ color: goal.currentMark >= target ? GREEN : GOLD }}>{goal.currentMark}% / {target}%</span>
        </div>
        <div style={{ height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${Math.min(progressPct, 100)}%`, background: goal.currentMark >= target ? GREEN : goal.color, borderRadius: 4, transition: 'width 1.1s ease' }} />
        </div>
      </div>

      {/* Target input */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 14 }}>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: 11, color: MUTED, marginBottom: 6, display: 'block' }}>Target %</label>
          <input
            type="number"
            min={goal.currentMark}
            max={100}
            value={target}
            onChange={e => setTarget(Math.min(100, Math.max(0, Number(e.target.value))))}
            style={{ width: '100%', padding: '8px 12px', background: S2, border: `1px solid ${BORDER}`, borderRadius: 8, color: TEXT, fontSize: 14, fontWeight: 600, outline: 'none', fontFamily: F_BODY, boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ flexShrink: 0, marginTop: 20 }}>
          <button
            onClick={handleSave}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: saved ? GREEN + '22' : GOLD_DIM, border: `1px solid ${saved ? GREEN + '44' : GOLD_B}`, borderRadius: 8, cursor: 'pointer', color: saved ? GREEN : GOLD, fontSize: 12, fontWeight: 600, transition: 'all .2s' }}
          >
            {saved ? <CheckCircle2 size={13} /> : <Save size={13} />}
            {saved ? 'Saved!' : 'Save'}
          </button>
        </div>
      </div>

      {/* Prediction */}
      <div style={{ background: S2, borderRadius: 10, padding: '12px 14px' }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: MUTED, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Target size={12} />
          Exam Prediction
        </div>
        {goal.currentMark >= target ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <CheckCircle2 size={14} style={{ color: GREEN }} />
            <span style={{ fontSize: 13, color: GREEN, fontWeight: 600 }}>Goal already reached — excellent work!</span>
          </div>
        ) : examNeeded > 100 ? (
          <div style={{ fontSize: 13, color: RED, fontWeight: 500 }}>
            Target of {target}% is unreachable at this stage — lower your target or focus on term work.
          </div>
        ) : (
          <>
            <div style={{ fontSize: 15, fontWeight: 700, color: TEXT }}>
              You need <span style={{ color: examNeeded > 80 ? RED : examNeeded > 60 ? AMBER : GREEN }}>{examNeeded}%</span> in the exam
            </div>
            <div style={{ fontSize: 11, color: MUTED, marginTop: 3 }}>
              to reach {target}% (exam weight: {Math.round(goal.examWeight * 100)}%, term weight: {Math.round(goal.termWeight * 100)}%)
            </div>
          </>
        )}
      </div>

      {/* Motivation */}
      <div style={{ marginTop: 10, fontSize: 12, color: MUTED, fontStyle: 'italic' }}>
        {goal.currentMark >= target ? '🎉 Outstanding! Keep maintaining this standard.'
          : goal.currentMark < 50 ? '⚠️ Critical — attend extra classes and contact your teacher.'
          : goal.currentMark < 60 ? '🔶 You\'re close to passing. A focused study plan will get you there.'
          : goal.currentMark < 70 ? '📈 Good progress. Consistent effort will push you to your goal.'
          : '✅ You\'re on track — keep up the great work!'}
      </div>
    </div>
  );
}

export default function GoalsPage() {
  const [goals, setGoals] = useState(GOALS);

  const handleUpdate = (id: string, target: number) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, targetMark: target } : g));
  };

  const onTrack = goals.filter(g => g.currentMark >= g.targetMark * 0.85).length;

  return (
    <div style={{ padding: 24, fontFamily: F_BODY, background: BG, minHeight: '100%' }}>
      {/* Header */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 24 }}>
        <div style={{ background: GOLD_DIM, border: `1px solid ${GOLD_B}`, borderRadius: 14, padding: 18 }}>
          <div style={{ fontSize: 11, color: 'rgba(201,168,76,0.65)' }}>Goals Set</div>
          <div style={{ fontFamily: F_HEADING, fontSize: 28, fontWeight: 800, color: GOLD, letterSpacing: '-0.03em', marginTop: 4 }}>{goals.length}</div>
        </div>
        <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 18 }}>
          <div style={{ fontSize: 11, color: MUTED }}>On Track</div>
          <div style={{ fontFamily: F_HEADING, fontSize: 28, fontWeight: 800, color: GREEN, letterSpacing: '-0.03em', marginTop: 4 }}>{onTrack}</div>
        </div>
        <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 18 }}>
          <div style={{ fontSize: 11, color: MUTED }}>Need Attention</div>
          <div style={{ fontFamily: F_HEADING, fontSize: 28, fontWeight: 800, color: RED, letterSpacing: '-0.03em', marginTop: 4 }}>{goals.length - onTrack}</div>
        </div>
      </div>

      {/* Goal cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
        {goals.map(g => <GoalCard key={g.id} goal={g} onUpdate={handleUpdate} />)}
      </div>

      {/* Add goal for other subjects */}
      <div style={{ marginTop: 20, padding: '16px 20px', background: SURFACE, border: `1px dashed ${BORDER}`, borderRadius: 14, textAlign: 'center' }}>
        <div style={{ fontSize: 13, color: MUTED }}>
          Set goals for your remaining subjects — English HL, IsiZulu, Life Orientation — to track all your progress.
        </div>
        <div style={{ fontSize: 11, color: FAINT, marginTop: 4 }}>
          Weekly reminders will be sent to keep you on track.
        </div>
      </div>
    </div>
  );
}
