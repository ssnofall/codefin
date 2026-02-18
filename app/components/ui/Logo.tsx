'use client';

import { useTheme } from '../theme/ThemeProvider';
import Image from 'next/image';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  enableGlow?: boolean;
}

export function Logo({ size = 'md', className = '', enableGlow = true }: LogoProps) {
  const { theme, accentColor } = useTheme();
  
  // Dynamic file paths based on theme and accent
  const finSrc = `/fin-element-${accentColor}.svg`;
  const textSrc = theme === 'dark' ? '/codefin-white-text.svg' : '/codefin-black-text.svg';
  
  // Size configurations
  const sizeConfig = {
    sm: { finSize: 24, textWidth: 84, textHeight: 18 },
    md: { finSize: 32, textWidth: 112, textHeight: 24 },
    lg: { finSize: 40, textWidth: 140, textHeight: 30 },
  };

  const { finSize, textWidth, textHeight } = sizeConfig[size];
  
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {/* Fin element with hover glow */}
      <div 
        className={`
          relative transition-all duration-300 ease-out cursor-pointer
          ${enableGlow ? 'hover:[filter:drop-shadow(0_0_8px_var(--glow-accent))]' : ''}
        `}
      >
        <Image 
          src={finSrc} 
          alt="" 
          width={finSize} 
          height={finSize}
          className="transition-transform duration-200 hover:scale-105"
          priority
        />
      </div>
      
      {/* Text element */}
      <Image 
        src={textSrc} 
        alt="Codefin" 
        width={textWidth}
        height={textHeight}
        className="transition-opacity duration-200"
        priority
      />
    </div>
  );
}
