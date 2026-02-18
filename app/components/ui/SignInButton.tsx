'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

export function SignInButton() {
  const [isPending, setIsPending] = useState(false);

  const handleClick = () => {
    setIsPending(true);
  };

  return (
    <Link href="/auth/login" onClick={handleClick}>
      <button 
        disabled={isPending}
        className="relative group px-5 py-2 rounded-xl font-medium transition-all duration-300 btn-press overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {/* Animated liquid glass border */}
        <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-[var(--accent)] via-[var(--primary)] via-[var(--accent)] to-[var(--primary)] animate-liquid-border-glass bg-[length:300%_100%] opacity-90" />
        
        {/* Glass effect overlay for border */}
        <span className="absolute inset-0 rounded-xl backdrop-blur-[2px] bg-gradient-to-r from-[var(--accent)] via-[var(--primary)] via-[var(--accent)] to-[var(--primary)] animate-liquid-border-glass bg-[length:300%_100%] opacity-70 mix-blend-screen" />
        
        {/* Inner button background - matches theme */}
        <span className="absolute inset-[3px] rounded-[9px] bg-background transition-colors duration-300 group-hover:bg-muted" />
        
        {/* Button text */}
        <span className="relative z-10 text-foreground font-medium flex items-center gap-2">
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading...
            </>
          ) : (
            'Sign In'
          )}
        </span>
      </button>
    </Link>
  );
}
