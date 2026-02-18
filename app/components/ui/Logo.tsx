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
  
  // Dynamic file path based on theme and accent
  // Format: codefin-{text-color}-text-{accent-color}-fin.svg
  const textColor = theme === 'dark' ? 'white' : 'black';
  const logoSrc = `/codefin-${textColor}-text-${accentColor}-fin.svg`;
  
  // Size configurations (4:1 aspect ratio)
  const sizeConfig = {
    sm: { width: 120, height: 30 },
    md: { width: 160, height: 40 },
    lg: { width: 200, height: 50 },
  };

  const { width, height } = sizeConfig[size];
  
  return (
    <div 
      className={`
        relative transition-all duration-300 ease-out
        ${enableGlow ? 'hover:[filter:drop-shadow(0_0_12px_var(--glow-accent))]' : ''}
        ${className}
      `}
    >
      <Image 
        src={logoSrc} 
        alt="Codefin" 
        width={width}
        height={height}
        className="transition-transform duration-200 hover:scale-105"
        priority
      />
    </div>
  );
}
