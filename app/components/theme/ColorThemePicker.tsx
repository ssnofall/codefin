'use client';

import { useTheme } from './ThemeProvider';

const COLORS = [
  { name: 'green', label: 'Green', light: '#22c55e', dark: '#4ade80' },
  { name: 'orange', label: 'Orange', light: '#f97316', dark: '#fb923c' },
  { name: 'blue', label: 'Blue', light: '#3b82f6', dark: '#60a5fa' },
  { name: 'pink', label: 'Pink', light: '#ec4899', dark: '#f472b6' },
] as const;

export function ColorThemePicker() {
  const { accentColor, setAccentColor, theme } = useTheme();

  return (
    <div className="flex items-center gap-3">
      {COLORS.map((color) => {
        const isSelected = accentColor === color.name;
        const currentColor = theme === 'dark' ? color.dark : color.light;

        return (
          <button
            key={color.name}
            onClick={() => setAccentColor(color.name)}
            className={`relative w-8 h-8 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isSelected
                ? 'ring-2 ring-offset-2 ring-primary scale-110'
                : 'hover:scale-105'
            }`}
            style={{ backgroundColor: currentColor }}
            aria-label={`Set accent color to ${color.label}`}
            title={color.label}
          >
            {isSelected && (
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-white shadow-sm" />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
