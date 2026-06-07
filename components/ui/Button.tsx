'use client';

import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'gold' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  fullWidth?: boolean;
}

const variants = {
  primary:   'bg-school-blue-900 hover:bg-school-blue-800 text-white shadow-md hover:shadow-lg active:scale-95',
  secondary: 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white active:scale-95',
  ghost:     'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 active:scale-95',
  outline:   'border-2 border-school-blue-900 dark:border-school-blue-400 text-school-blue-900 dark:text-school-blue-400 hover:bg-school-blue-50 dark:hover:bg-school-blue-950 active:scale-95',
  gold:      'bg-school-gold-500 hover:bg-school-gold-600 text-white shadow-md hover:shadow-lg active:scale-95',
  danger:    'bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg active:scale-95',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-5 py-2.5 text-sm rounded-xl',
  lg: 'px-7 py-3 text-base rounded-xl',
  xl: 'px-9 py-4 text-lg rounded-2xl',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, fullWidth, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 cursor-pointer',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
          'focus:outline-none focus:ring-2 focus:ring-school-blue-500 focus:ring-offset-2',
          'hover:scale-[1.02]',
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className,
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
