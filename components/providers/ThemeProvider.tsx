'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Mode = 'dark' | 'light';

interface ThemeCtx { mode: Mode; toggle: () => void; }

const Ctx = createContext<ThemeCtx>({ mode: 'dark', toggle: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode]       = useState<Mode>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('sidelile-mode') as Mode | null;
    const initial: Mode = stored ?? 'dark';
    setMode(initial);
    document.documentElement.classList.toggle('light', initial === 'light');
  }, []);

  const toggle = () => {
    const next: Mode = mode === 'dark' ? 'light' : 'dark';
    setMode(next);
    localStorage.setItem('sidelile-mode', next);
    document.documentElement.classList.toggle('light', next === 'light');
  };

  if (!mounted) return <>{children}</>;

  return <Ctx.Provider value={{ mode, toggle }}>{children}</Ctx.Provider>;
}

export const useThemeMode = () => useContext(Ctx);
