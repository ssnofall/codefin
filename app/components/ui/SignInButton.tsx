'use client';

import Link from 'next/link';

export function SignInButton() {
  return (
    <Link href="/auth/login">
      <button className="relative group px-5 py-2 rounded-xl font-medium transition-all duration-300 btn-press overflow-hidden">
        {/* Animated liquid glass border */}
        <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-[var(--accent)] via-[var(--primary)] via-[var(--accent)] to-[var(--primary)] animate-liquid-border-glass bg-[length:300%_100%] opacity-90" />
        
        {/* Glass effect overlay for border */}
        <span className="absolute inset-0 rounded-xl backdrop-blur-[2px] bg-gradient-to-r from-[var(--accent)] via-[var(--primary)] via-[var(--accent)] to-[var(--primary)] animate-liquid-border-glass bg-[length:300%_100%] opacity-70 mix-blend-screen" />
        
        {/* Inner button background - matches theme */}
        <span className="absolute inset-[3px] rounded-[9px] bg-background transition-colors duration-300 group-hover:bg-muted" />
        
        {/* Button text */}
        <span className="relative z-10 text-foreground font-medium">
          Sign In
        </span>
      </button>
    </Link>
  );
}
