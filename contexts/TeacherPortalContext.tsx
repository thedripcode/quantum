'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Student } from '@/types/teacher';
import {
  STUDENTS as INITIAL_STUDENTS,
  SCHOOL_CLASSES,
  CURRENT_TEACHER_ID,
  NOTIFICATIONS,
  MARKS,
  ATTENDANCE,
  ASSESSMENTS,
} from '@/lib/teacher/mockData';
import {
  calculateWeightedAverage,
  calculateAttendanceRate,
  getRiskLevel,
} from '@/lib/teacher/helpers';

// ─── Context type ─────────────────────────────────────────────────────────────

interface TeacherPortalContextType {
  // Data
  students:     Student[];
  myClasses:    typeof SCHOOL_CLASSES;
  unreadCount:  number;
  pendingMarks: number;
  atRiskCount:  number;
  classAverage: number;
  upcomingCount:number;

  // Actions
  addStudent: (student: Student) => void;
  removeStudent: (studentId: string) => void;
}

const TeacherPortalContext = createContext<TeacherPortalContextType | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function TeacherPortalProvider({ children }: { children: ReactNode }) {
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);

  const myClasses   = SCHOOL_CLASSES.filter(c => c.teacherId === CURRENT_TEACHER_ID);
  const unreadCount = NOTIFICATIONS.filter(n => n.teacherId === CURRENT_TEACHER_ID && !n.isRead).length;
  const pendingMarks= MARKS.filter(m => m.teacherId === CURRENT_TEACHER_ID && m.rawMark === null && !m.isAbsent).length;

  // Compute at-risk count
  const atRiskCount = students.filter(student => {
    const classId          = student.classId;
    const classAssessments = ASSESSMENTS.filter(a => a.classId === classId && a.conductedDate);
    const sMarks           = MARKS.filter(m => m.studentId === student._id && m.classId === classId);
    const att              = ATTENDANCE.filter(r => r.studentId === student._id && r.classId === classId);
    const avg              = calculateWeightedAverage(sMarks, classAssessments);
    const attRate          = calculateAttendanceRate(att);
    const risk             = getRiskLevel(avg, attRate);
    return risk === 'high' || risk === 'critical';
  }).length;

  // Compute overall class average
  const allAvgs = students.map(student => {
    const classId          = student.classId;
    const classAssessments = ASSESSMENTS.filter(a => a.classId === classId && a.conductedDate);
    const sMarks           = MARKS.filter(m => m.studentId === student._id && m.classId === classId);
    return calculateWeightedAverage(sMarks, classAssessments);
  }).filter((v): v is number => v !== null);

  const classAverage = allAvgs.length > 0
    ? Math.round(allAvgs.reduce((a, b) => a + b, 0) / allAvgs.length * 10) / 10
    : 0;

  const upcomingCount = ASSESSMENTS.filter(
    a => a.teacherId === CURRENT_TEACHER_ID && a.conductedDate === null,
  ).length;

  const addStudent = useCallback((student: Student) => {
    setStudents(prev => [...prev, student]);
  }, []);

  const removeStudent = useCallback((studentId: string) => {
    setStudents(prev => prev.filter(s => s._id !== studentId));
  }, []);

  return (
    <TeacherPortalContext.Provider value={{
      students, myClasses, unreadCount, pendingMarks,
      atRiskCount, classAverage, upcomingCount,
      addStudent, removeStudent,
    }}>
      {children}
    </TeacherPortalContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useTeacherPortal() {
  const ctx = useContext(TeacherPortalContext);
  if (!ctx) throw new Error('useTeacherPortal must be used inside TeacherPortalProvider');
  return ctx;
}
