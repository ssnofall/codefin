'use client';

import Link from 'next/link';

export function SignInButton() {
  return (
    <Link href="/auth/login">
      <button className="relative group px-5 py-2 rounded-xl font-medium transition-all duration-300 btn-press overflow-hidden">
        {/* Animated liquid border */}
        <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-[var(--accent)] via-[var(--primary)] to-[var(--accent)] animate-liquid-border bg-[length:200%_100%]" />
        
        {/* Inner button background - matches theme */}
        <span className="absolute inset-[2px] rounded-[10px] bg-background transition-colors duration-300 group-hover:bg-muted" />
        
        {/* Button text */}
        <span className="relative z-10 text-foreground font-medium">
          Sign In
        </span>
      </button>
    </Link>
  );
}
