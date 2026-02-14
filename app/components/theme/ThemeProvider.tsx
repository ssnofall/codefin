'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark';
type AccentColor = 'green' | 'orange' | 'blue' | 'pink';

interface ThemeContextType {
  theme: Theme;
  accentColor: AccentColor;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  setAccentColor: (color: AccentColor) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'stackd-theme';
const ACCENT_COLOR_STORAGE_KEY = 'stackd-accent-color';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');
  const [accentColor, setAccentColorState] = useState<AccentColor>('green');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
    if (storedTheme && (storedTheme === 'light' || storedTheme === 'dark')) {
      setThemeState(storedTheme);
      document.documentElement.classList.toggle('dark', storedTheme === 'dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = prefersDark ? 'dark' : 'light';
      setThemeState(initialTheme);
      document.documentElement.classList.toggle('dark', prefersDark);
    }

    const storedAccent = localStorage.getItem(ACCENT_COLOR_STORAGE_KEY) as AccentColor | null;
    const accentColor = (storedAccent && ['green', 'orange', 'blue', 'pink'].includes(storedAccent)) 
      ? storedAccent 
      : 'green';
    setAccentColorState(accentColor);
    document.documentElement.setAttribute('data-accent', accentColor);
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  const setAccentColor = (color: AccentColor) => {
    setAccentColorState(color);
    localStorage.setItem(ACCENT_COLOR_STORAGE_KEY, color);
    document.documentElement.setAttribute('data-accent', color);
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ theme, accentColor, toggleTheme, setTheme, setAccentColor }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
