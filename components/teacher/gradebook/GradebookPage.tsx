'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Save, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  STUDENTS, SCHOOL_CLASSES, ASSESSMENTS, MARKS,
  CURRENT_TEACHER_ID,
} from '@/lib/teacher/mockData';
import {
  buildGradebookRows, getMarkColor, getMarkBg,
} from '@/lib/teacher/helpers';
import type { Mark } from '@/types/teacher';

const PURPLE = '#7C3AED';

type EditKey = string; // `${studentId}::${assessmentId}`

const MARK_LEGEND = [
  { label: '≥60% Pass',     color: '#22c55e' },
  { label: '50–59%',        color: '#eab308' },
  { label: '40–49% At risk',color: '#f97316' },
  { label: '<40% Failing',  color: '#ef4444' },
];

export default function GradebookPage() {
  const myClasses = SCHOOL_CLASSES.filter(c => c.teacherId === CURRENT_TEACHER_ID);

  const [selectedClassId, setSelectedClassId] = useState(myClasses[0]?._id ?? '');
  const [edits,  setEdits]  = useState<Record<EditKey, string>>({});
  const [saved,  setSaved]  = useState(false);

  const selectedClass    = myClasses.find(c => c._id === selectedClassId)!;
  const classAssessments = ASSESSMENTS.filter(
    a => a.classId === selectedClassId && a.conductedDate !== null,
  );
  const classStudents = STUDENTS.filter(s => s.classId === selectedClassId);

  const mergedMarks: Mark[] = MARKS.map(m => {
    const key: EditKey = `${m.studentId}::${m.assessmentId}`;
    if (key in edits) {
      const raw = parseInt(edits[key], 10);
      const assessment = classAssessments.find(a => a._id === m.assessmentId);
      if (!isNaN(raw) && assessment) {
        return {
          ...m,
          rawMark:    raw,
          percentage: Math.round((raw / assessment.totalMarks) * 100),
          isAbsent:   false,
        };
      }
    }
    return m;
  });

  const rows     = buildGradebookRows(classStudents, mergedMarks, classAssessments, selectedClassId);
  const hasEdits = Object.keys(edits).length > 0;

  function handleCellEdit(studentId: string, assessmentId: string, value: string) {
    setEdits(prev => ({ ...prev, [`${studentId}::${assessmentId}`]: value }));
    setSaved(false);
  }

  function handleSave()  { setSaved(true); }
  function handleReset() { setEdits({}); setSaved(false); }

  function handleExport() {
    const headers = ['Rank', 'Student', 'Number', ...classAssessments.map(a => `${a.title} (${a.totalMarks})`), 'Avg %'];
    const csvRows = rows.map(row => [
      row.rank ?? '',
      `${row.student.lastName}, ${row.student.firstName}`,
      row.student.studentNumber,
      ...classAssessments.map(a => {
        const m = row.marks[a._id];
        return m?.rawMark ?? (m?.isAbsent ? 'ABS' : '—');
      }),
      row.weightedAverage ?? '—',
    ]);
    const csv  = [headers, ...csvRows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `gradebook-grade${selectedClass.grade}${selectedClass.section}-term3.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // Column averages helper
  const classAvg = (() => {
    const valid = rows.filter(r => r.weightedAverage !== null);
    if (!valid.length) return null;
    return Math.round(valid.reduce((a, r) => a + (r.weightedAverage ?? 0), 0) / valid.length);
  })();

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-5 max-w-full">

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white">Gradebook</h2>
          <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.40)' }}>
            Click any mark cell to edit. Changes are highlighted until saved.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {hasEdits && (
            <>
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-xl transition-colors"
                style={{ color: 'rgba(255,255,255,0.55)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl transition-colors"
                style={saved
                  ? { background: 'rgba(34,197,94,0.15)', color: '#4ade80' }
                  : { background: PURPLE, color: '#fff' }
                }
              >
                <Save className="w-4 h-4" />
                {saved ? 'Saved ✓' : 'Save Changes'}
              </button>
            </>
          )}
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white rounded-xl transition-colors"
            style={{ background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.12)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.15)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.10)'; }}
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Class selector */}
      <div className="flex gap-2 flex-wrap">
        {myClasses.map(cls => {
          const active = selectedClassId === cls._id;
          return (
            <button
              key={cls._id}
              onClick={() => { setSelectedClassId(cls._id); setEdits({}); setSaved(false); }}
              className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
              style={active
                ? { background: PURPLE, color: '#fff', border: `1px solid ${PURPLE}`, boxShadow: `0 0 12px rgba(124,58,237,0.35)` }
                : { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.65)', border: '1px solid rgba(255,255,255,0.10)' }
              }
            >
              Grade {cls.grade}{cls.section}
            </button>
          );
        })}
      </div>

      {/* Assessment legend */}
      <div
        className="p-4 rounded-2xl"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: 'rgba(255,255,255,0.35)' }}>
          Assessments — Term 3
        </p>
        <div className="flex flex-wrap gap-2">
          {classAssessments.map((a, i) => (
            <div
              key={a._id}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <span className="text-xs font-bold" style={{ color: '#a78bfa' }}>{String.fromCharCode(65 + i)}</span>
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.65)' }}>{a.title}</span>
              <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.30)' }}>/{a.totalMarks} · {a.weight}%</span>
            </div>
          ))}
        </div>
        <div
          className="flex gap-4 mt-3 pt-3"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          {MARK_LEGEND.map(({ label, color }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
              <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.45)' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Gradebook table */}
      <motion.div
        key={selectedClassId}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'rgba(124,58,237,0.18)', borderBottom: '1px solid rgba(124,58,237,0.30)' }}>
                <th
                  className="text-left px-4 py-3 font-semibold text-xs sticky left-0 z-10 min-w-[180px]"
                  style={{ background: 'rgba(124,58,237,0.22)', color: 'rgba(255,255,255,0.90)' }}
                >
                  Student
                </th>
                <th className="px-3 py-3 font-semibold text-xs text-center w-10" style={{ color: 'rgba(255,255,255,0.55)' }}>#</th>
                {classAssessments.map((a, i) => (
                  <th key={a._id} className="px-3 py-3 font-semibold text-xs text-center min-w-[90px]">
                    <span style={{ color: '#a78bfa' }}>{String.fromCharCode(65 + i)}</span>
                    <span className="text-[10px] ml-1" style={{ color: 'rgba(255,255,255,0.35)' }}>/{a.totalMarks}</span>
                  </th>
                ))}
                <th
                  className="px-4 py-3 font-semibold text-xs text-center min-w-[80px]"
                  style={{ background: 'rgba(124,58,237,0.30)', color: 'rgba(255,255,255,0.90)' }}
                >
                  Avg %
                </th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row, rowIdx) => {
                const isEven = rowIdx % 2 === 0;
                const rowBg  = isEven ? 'rgba(255,255,255,0.02)' : 'transparent';
                return (
                  <tr
                    key={row.student._id}
                    style={{ background: rowBg, borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(124,58,237,0.06)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = rowBg; }}
                  >
                    {/* Student name — sticky */}
                    <td
                      className="px-4 py-2.5 sticky left-0 z-10"
                      style={{ background: isEven ? 'rgba(6,15,26,0.95)' : 'rgba(6,15,26,0.90)' }}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                          style={{ background: 'rgba(124,58,237,0.25)' }}
                        >
                          {row.student.avatarInitials}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-white text-xs leading-tight truncate">
                            {row.student.lastName}, {row.student.firstName}
                          </p>
                          <p className="text-[10px] truncate" style={{ color: 'rgba(255,255,255,0.35)' }}>
                            {row.student.studentNumber}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Rank */}
                    <td className="px-3 py-2.5 text-center text-xs font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>
                      {row.rank}
                    </td>

                    {/* Mark cells */}
                    {classAssessments.map(assessment => {
                      const mark      = row.marks[assessment._id];
                      const editKey   = `${row.student._id}::${assessment._id}` as EditKey;
                      const editValue = edits[editKey];
                      const isEdited  = editKey in edits;
                      const pct       = isEdited
                        ? (parseInt(editValue, 10) / assessment.totalMarks * 100)
                        : mark?.percentage ?? null;
                      return (
                        <td key={assessment._id} className="px-2 py-1.5 text-center">
                          <EditableMarkCell
                            value={editValue ?? (mark?.rawMark !== null && mark?.rawMark !== undefined ? String(mark.rawMark) : '')}
                            placeholder={mark?.isAbsent ? 'ABS' : '—'}
                            percentage={pct}
                            totalMarks={assessment.totalMarks}
                            isEdited={isEdited}
                            onChange={val => handleCellEdit(row.student._id, assessment._id, val)}
                          />
                        </td>
                      );
                    })}

                    {/* Weighted average */}
                    <td
                      className="px-4 py-2.5 text-center"
                      style={{ background: 'rgba(124,58,237,0.08)' }}
                    >
                      <span className={cn('text-sm font-bold', getMarkColor(row.weightedAverage))}>
                        {row.weightedAverage !== null ? `${row.weightedAverage}%` : '—'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>

            {/* Footer — column averages */}
            <tfoot>
              <tr style={{ background: 'rgba(255,255,255,0.05)', borderTop: '2px solid rgba(255,255,255,0.10)' }}>
                <td
                  className="px-4 py-2.5 font-bold text-xs sticky left-0"
                  style={{ background: 'rgba(6,15,26,0.98)', color: 'rgba(255,255,255,0.65)' }}
                >
                  Class Average
                </td>
                <td />
                {classAssessments.map(assessment => {
                  const colMarks = rows
                    .map(r => r.marks[assessment._id]?.percentage)
                    .filter((p): p is number => p !== null && p !== undefined);
                  const avg = colMarks.length > 0
                    ? Math.round(colMarks.reduce((a, b) => a + b, 0) / colMarks.length)
                    : null;
                  return (
                    <td key={assessment._id} className="px-2 py-2.5 text-center">
                      <span className={cn('text-xs font-bold', getMarkColor(avg))}>
                        {avg !== null ? `${avg}%` : '—'}
                      </span>
                    </td>
                  );
                })}
                <td className="px-4 py-2.5 text-center" style={{ background: 'rgba(124,58,237,0.15)' }}>
                  <span className={cn('text-sm font-bold', getMarkColor(classAvg))}>
                    {classAvg !== null ? `${classAvg}%` : '—'}
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Editable cell ─────────────────────────────────────────────────────────────

interface EditableCellProps {
  value:      string;
  placeholder:string;
  percentage: number | null;
  totalMarks: number;
  isEdited:   boolean;
  onChange:   (val: string) => void;
}

function EditableMarkCell({ value, placeholder, percentage, totalMarks, isEdited, onChange }: EditableCellProps) {
  const [editing,  setEditing]  = useState(false);
  const [inputVal, setInputVal] = useState(value);

  function commit() {
    setEditing(false);
    const num = parseInt(inputVal, 10);
    if (!isNaN(num) && num >= 0 && num <= totalMarks) {
      onChange(String(num));
    } else if (inputVal === '') {
      // allow clearing
    } else {
      setInputVal(value); // revert
    }
  }

  if (editing) {
    return (
      <input
        type="number"
        min={0}
        max={totalMarks}
        value={inputVal}
        autoFocus
        onChange={e => setInputVal(e.target.value)}
        onBlur={commit}
        onKeyDown={e => {
          if (e.key === 'Enter')  commit();
          if (e.key === 'Escape') { setInputVal(value); setEditing(false); }
        }}
        className="w-16 text-center text-xs font-semibold rounded-lg focus:outline-none py-1 px-1 text-white"
        style={{
          border:     '2px solid rgba(124,58,237,0.70)',
          background: 'rgba(124,58,237,0.15)',
        }}
      />
    );
  }

  return (
    <button
      onClick={() => { setInputVal(value); setEditing(true); }}
      className={cn('w-16 h-8 rounded-lg text-xs font-semibold transition-all cursor-text', value ? getMarkBg(percentage) : '')}
      style={!value
        ? { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }
        : isEdited
          ? { outline: '2px solid rgba(124,58,237,0.70)' }
          : {}
      }
      title={`Click to edit — out of ${totalMarks}`}
    >
      <span className={value ? getMarkColor(percentage) : ''} style={!value ? { color: 'rgba(255,255,255,0.25)' } : {}}>
        {value || placeholder}
      </span>
    </button>
  );
}
