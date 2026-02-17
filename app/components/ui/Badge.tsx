'use client';

import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'accent' | 'outline' | 'subtle';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}: BadgeProps) {
  const variants = {
    default: 'bg-white/10 dark:bg-white/10 border-white/10 dark:border-white/10 text-foreground',
    accent: 'bg-[var(--accent)]/10 border-[var(--accent)]/20 text-[var(--accent)]',
    outline: 'bg-transparent border-white/20 dark:border-white/20 text-foreground',
    subtle: 'bg-muted/50 border-transparent text-muted-foreground',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-3 py-1 text-xs',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center',
        'rounded-full font-medium',
        'border backdrop-blur-sm',
        'transition-colors duration-200',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
}
