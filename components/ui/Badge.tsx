import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'blue' | 'gold' | 'green' | 'red' | 'purple' | 'cyan' | 'orange' | 'slate';
  size?: 'sm' | 'md';
  className?: string;
}

const variants = {
  blue:   'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
  gold:   'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
  green:  'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300',
  red:    'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300',
  purple: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300',
  cyan:   'bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300',
  orange: 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300',
  slate:  'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
};

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
};

export function Badge({ children, variant = 'blue', size = 'sm', className }: BadgeProps) {
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full font-semibold', variants[variant], sizes[size], className)}>
      {children}
    </span>
  );
}
