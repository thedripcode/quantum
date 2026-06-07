import type {
  Mark, Assessment, AttendanceRecord, Student,
  RiskLevel, ClassSummary, SchoolClass, GradebookRow,
} from '@/types/teacher';

// ─── Mark colour coding ───────────────────────────────────────────────────────
// red <40%, orange 40-49%, yellow 50-59%, green 60%+
export function getMarkColor(percentage: number | null): string {
  if (percentage === null) return 'text-slate-400';
  if (percentage < 40)  return 'text-red-600 dark:text-red-400';
  if (percentage < 50)  return 'text-orange-500 dark:text-orange-400';
  if (percentage < 60)  return 'text-yellow-600 dark:text-yellow-400';
  return 'text-green-600 dark:text-green-400';
}

export function getMarkBg(percentage: number | null): string {
  if (percentage === null) return 'bg-slate-50 dark:bg-slate-800';
  if (percentage < 40)  return 'bg-red-50 dark:bg-red-950';
  if (percentage < 50)  return 'bg-orange-50 dark:bg-orange-950';
  if (percentage < 60)  return 'bg-yellow-50 dark:bg-yellow-950';
  return 'bg-green-50 dark:bg-green-950';
}

export function getMarkBadge(percentage: number | null): string {
  if (percentage === null) return '—';
  if (percentage < 40)  return 'F';
  if (percentage < 50)  return 'E';
  if (percentage < 60)  return 'D';
  if (percentage < 70)  return 'C';
  if (percentage < 80)  return 'B';
  return 'A';
}

// ─── Weighted average calculation ─────────────────────────────────────────────
// Returns null if no marks have been captured yet
export function calculateWeightedAverage(
  marks: Mark[],
  assessments: Assessment[],
): number | null {
  let totalWeight = 0;
  let weightedSum = 0;
  let hasAny = false;

  marks.forEach(mark => {
    if (mark.percentage === null || mark.isAbsent) return;
    const assessment = assessments.find(a => a._id === mark.assessmentId);
    if (!assessment) return;
    hasAny = true;
    weightedSum += mark.percentage * (assessment.weight / 100);
    totalWeight  += assessment.weight / 100;
  });

  if (!hasAny || totalWeight === 0) return null;
  return Math.round((weightedSum / totalWeight) * 10) / 10;
}

// ─── Risk level ───────────────────────────────────────────────────────────────
export function getRiskLevel(average: number | null, attendanceRate: number): RiskLevel {
  if (average === null) return 'medium';

  if (average < 30 || attendanceRate < 60)  return 'critical';
  if (average < 40 || attendanceRate < 75)  return 'high';
  if (average < 55 || attendanceRate < 85)  return 'medium';
  return 'low';
}

export function getRiskBadgeStyle(risk: RiskLevel): string {
  switch (risk) {
    case 'critical':  return 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400';
    case 'high':      return 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400';
    case 'medium':
    case 'moderate':  return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400';
    case 'on-track':
    case 'low':       return 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400';
    case 'excelling': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400';
  }
}

// ─── Attendance rate ───────────────────────────────────────────────────────────
export function calculateAttendanceRate(records: AttendanceRecord[]): number {
  if (records.length === 0) return 100;
  const present = records.filter(r => r.status === 'present' || r.status === 'late').length;
  return Math.round((present / records.length) * 100);
}

// ─── Class summary ────────────────────────────────────────────────────────────
export function getClassSummary(
  schoolClass: SchoolClass,
  students: Student[],
  marks: Mark[],
  assessments: Assessment[],
  attendance: AttendanceRecord[],
  passMark = 30,
): ClassSummary {
  const classAssessments = assessments.filter(a => a.classId === schoolClass._id && a.conductedDate !== null);
  const classStudents    = students.filter(s => s.classId === schoolClass._id);

  let totalAvg = 0;
  let passCount = 0;
  let pendingMarks = 0;
  let highRiskCount = 0;
  let hasAverages = 0;

  classStudents.forEach(student => {
    const studentMarks = marks.filter(m => m.studentId === student._id && m.classId === schoolClass._id);
    const attRecords   = attendance.filter(r => r.studentId === student._id && r.classId === schoolClass._id);
    const avg          = calculateWeightedAverage(studentMarks, classAssessments);
    const attRate      = calculateAttendanceRate(attRecords);
    const risk         = getRiskLevel(avg, attRate);

    if (avg !== null) {
      totalAvg += avg;
      hasAverages++;
      if (avg >= passMark) passCount++;
    }

    studentMarks.forEach(m => { if (m.rawMark === null && !m.isAbsent) pendingMarks++; });
    if (risk === 'high' || risk === 'critical') highRiskCount++;
  });

  const classAverage = hasAverages > 0 ? Math.round((totalAvg / hasAverages) * 10) / 10 : null;
  const passRate     = hasAverages > 0 ? Math.round((passCount / hasAverages) * 100) : null;

  return {
    schoolClass,
    studentCount: classStudents.length,
    classAverage,
    passRate,
    pendingMarks,
    highRiskCount,
  };
}

// ─── Gradebook rows ───────────────────────────────────────────────────────────
export function buildGradebookRows(
  students: Student[],
  marks: Mark[],
  assessments: Assessment[],
  classId: string,
): GradebookRow[] {
  const classAssessments = assessments.filter(a => a.classId === classId && a.conductedDate !== null);

  return students.map(student => {
    const studentMarks = marks.filter(m => m.studentId === student._id && m.classId === classId);
    const markMap: { [assessmentId: string]: Mark } = {};
    studentMarks.forEach(m => { markMap[m.assessmentId] = m; });
    const weightedAverage = calculateWeightedAverage(studentMarks, classAssessments);

    return { student, marks: markMap, weightedAverage };
  }).sort((a, b) => {
    if (a.weightedAverage === null) return 1;
    if (b.weightedAverage === null) return -1;
    return b.weightedAverage - a.weightedAverage;
  }).map((row, i) => ({ ...row, rank: i + 1 }));
}

// ─── Formatting ───────────────────────────────────────────────────────────────
export function formatMark(mark: Mark | undefined, totalMarks: number): string {
  if (!mark) return '—';
  if (mark.isAbsent) return 'ABS';
  if (mark.rawMark === null) return '—';
  return `${mark.rawMark}/${totalMarks}`;
}

export function formatPercentage(value: number | null): string {
  if (value === null) return '—';
  return `${value}%`;
}
