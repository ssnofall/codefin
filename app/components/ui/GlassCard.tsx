'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  intensity?: 'low' | 'medium' | 'high';
  as?: 'div' | 'article' | 'section';
}

export function GlassCard({
  children,
  className = '',
  hover = true,
  intensity = 'medium',
  as: Component = 'div',
}: GlassCardProps) {
  const intensityStyles = {
    low: 'bg-white/40 dark:bg-white/[0.02]',
    medium: 'bg-white/60 dark:bg-white/[0.03]',
    high: 'bg-white/80 dark:bg-white/[0.05]',
  };

  return (
    <Component
      className={cn(
        'rounded-3xl',
        'border border-[var(--glass-border)]',
        'backdrop-blur-[16px]',
        intensityStyles[intensity],
        hover && 'glass-hover',
        className
      )}
    >
      {children}
    </Component>
  );
}
