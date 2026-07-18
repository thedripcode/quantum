'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Mode = 'dark' | 'light';

interface ThemeCtx { mode: Mode; toggle: () => void; }

const Ctx = createContext<ThemeCtx>({ mode: 'light', toggle: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode]       = useState<Mode>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('sidelile-mode') as Mode | null;
    const initial: Mode = stored ?? 'light';
    setMode(initial);
    document.documentElement.classList.toggle('dark', initial === 'dark');
  }, []);

  const toggle = () => {
    const next: Mode = mode === 'dark' ? 'light' : 'dark';
    setMode(next);
    localStorage.setItem('sidelile-mode', next);
    document.documentElement.classList.toggle('dark', next === 'dark');
  };

  if (!mounted) return <>{children}</>;

  return <Ctx.Provider value={{ mode, toggle }}>{children}</Ctx.Provider>;
}

export const useThemeMode = () => useContext(Ctx);
