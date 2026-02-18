'use client';

import { APP_NAME } from '../../lib/utils/constants';

interface LogoProps {
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Logo({ showText = true, size = 'md', className = '' }: LogoProps) {
  const sizeClasses = {
    sm: { container: 'w-6 h-6', text: 'text-lg', stroke: 2 },
    md: { container: 'w-8 h-8', text: 'text-xl', stroke: 2 },
    lg: { container: 'w-10 h-10', text: 'text-2xl', stroke: 2.5 },
  };

  const { container, text, stroke } = sizeClasses[size];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Triangular Monoline Fin */}
      <svg
        className={`${container} text-primary`}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Monoline triangular fin - curved/flowing design */}
        <path
          d="M4 28 L16 4 L28 28 Z"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Inner accent line for depth */}
        <path
          d="M10 24 L16 12 L22 24"
          stroke="currentColor"
          strokeWidth={stroke * 0.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity="0.6"
        />
      </svg>

      {/* Text */}
      {showText && (
        <span className={`${text} font-bold text-foreground tracking-tight`}>
          {APP_NAME}
        </span>
      )}
    </div>
  );
}
