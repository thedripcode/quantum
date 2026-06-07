import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-ZA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function getGradeColor(grade: string): string {
  const map: Record<string, string> = {
    A: 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-950',
    'A-': 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-950',
    'B+': 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950',
    B: 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950',
    'B-': 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950',
    'C+': 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950',
    C: 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950',
  };
  return map[grade] ?? 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950';
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    pending:   'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950',
    submitted: 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950',
    graded:    'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-950',
    excellent: 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-950',
    good:      'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950',
    'needs-attention': 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950',
  };
  return map[status] ?? 'text-slate-600 bg-slate-50';
}
