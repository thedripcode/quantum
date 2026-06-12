'use client';

import { useEffect, useState } from 'react';

// Shapes match what the dashboard pages previously imported from @/data/studentData
export interface RealSubjectMark {
  task: string; type: string; mark: number; score: number; total: number;
  percentage: number; weight: number; term: number; date: string;
}
export interface RealSubject {
  id: string; name: string; short: string;
  teacher: string; teacherEmail: string; teacherInitials: string;
  room: string; color: string;
  currentMark: number; targetMark: number; isAtRisk: boolean;
  termAverages: { term: number; average: number }[];
  marks: RealSubjectMark[];
  classAverage: number; highestInClass: number; lowestInClass: number;
  attendance: number;
  nextAssessment: { task: string; date: string; weight: number } | null;
}
export interface RealAssignment {
  id: string; subjectId: string; subject: string; subjectColor: string;
  title: string; description: string; type: string;
  dueDate: string; submittedDate: string | null;
  status: 'submitted' | 'pending' | 'overdue' | 'graded';
  mark: number | null; total: number; feedback: string | null;
  priority: 'high' | 'medium' | 'low';
}
export interface StudentData {
  subjects: RealSubject[];
  assignments: RealAssignment[];
  overallAverage: number;
  atRiskSubjects: RealSubject[];
  currentStreak: number;
  timetable: { day: string; period: number; time: string; endTime: string; subject: string; subjectId: string; teacher: string; room: string; color: string; type: string }[];
  attendanceRecords: { date: string; status: 'present' | 'absent' | 'late' | 'excused'; note: string }[];
  overallAttendance: { attended: number; total: number; percentage: number };
  monthlyAttendance: { month: string; days: number; attended: number; percentage: number }[];
  notices: { id: string; title: string; body: string; date: string }[];
}

const EMPTY: StudentData = {
  subjects: [], assignments: [], overallAverage: 0, atRiskSubjects: [],
  currentStreak: 0, timetable: [], attendanceRecords: [],
  overallAttendance: { attended: 0, total: 0, percentage: 0 },
  monthlyAttendance: [], notices: [],
};

// Module-level cache so the sidebar + page don't double-fetch
let cache: StudentData | null = null;
let inflight: Promise<StudentData> | null = null;

async function load(): Promise<StudentData> {
  if (cache) return cache;
  inflight ??= fetch('/api/student/data')
    .then(r => (r.ok ? r.json() : Promise.reject(new Error('failed'))))
    .then((d: StudentData) => { cache = d; return d; })
    .finally(() => { inflight = null; });
  return inflight;
}

export function invalidateStudentData() { cache = null; }

export function useStudentData(): { data: StudentData; loading: boolean; error: boolean } {
  const [data, setData]       = useState<StudentData>(cache ?? EMPTY);
  const [loading, setLoading] = useState(!cache);
  const [error, setError]     = useState(false);

  useEffect(() => {
    let alive = true;
    load()
      .then(d => { if (alive) { setData(d); setLoading(false); } })
      .catch(() => { if (alive) { setError(true); setLoading(false); } });
    return () => { alive = false; };
  }, []);

  return { data, loading, error };
}
