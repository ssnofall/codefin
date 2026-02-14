'use client';

import { Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeProvider';

interface ThemeToggleProps {
  variant?: 'default' | 'small' | 'switch';
}

export function ThemeToggle({ variant = 'default' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  if (variant === 'switch') {
    return (
      <button
        onClick={toggleTheme}
        className="relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 bg-muted"
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-background shadow-lg transition-transform duration-300 ${
            theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
          }`}
        >
          {theme === 'light' ? (
            <Sun className="h-3 w-3 text-amber-500 m-1" />
          ) : (
            <Moon className="h-3 w-3 text-indigo-400 m-1" />
          )}
        </span>
      </button>
    );
  }

  if (variant === 'small') {
    return (
      <button
        onClick={toggleTheme}
        className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? (
          <Sun className="h-4 w-4" />
        ) : (
          <Moon className="h-4 w-4" />
        )}
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <>
          <Sun className="h-5 w-5 text-amber-500" />
          <span>Light</span>
        </>
      ) : (
        <>
          <Moon className="h-5 w-5 text-indigo-400" />
          <span>Dark</span>
        </>
      )}
    </button>
  );
}
