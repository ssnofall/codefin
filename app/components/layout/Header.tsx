'use client';

import Link from 'next/link';
import { User } from '@supabase/supabase-js';
import { Settings, LogOut } from 'lucide-react';
import { logout } from '../../lib/actions/auth';
import { Button } from '@/components/ui/button';
import { SignInButton } from '../ui/SignInButton';
import { Logo } from '../ui/Logo';

interface HeaderProps {
  user: User | null;
}

export function Header({ user }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-md border-b border-white/5 dark:border-white/5">
      <div className="px-3 sm:px-4 h-16 flex items-center justify-between max-w-[1400px] mx-auto">
        {/* Logo */}
        <Link href="/feed" className="flex items-center shrink-0">
          <Logo size="md" />
        </Link>

        {/* Desktop Navigation + Auth */}
        <div className="hidden lg:flex items-center gap-3">
          {user ? (
            <>
              <Link
                href="/settings"
                className="p-2.5 rounded-xl hover:bg-white/10 dark:hover:bg-white/10 transition-colors"
                aria-label="Settings"
              >
                <Settings className="w-5 h-5 text-muted-foreground" />
              </Link>
              <form action={logout}>
                <Button
                  type="submit"
                  variant="glass"
                  size="icon"
                  aria-label="Sign Out"
                >
                  <LogOut className="w-5 h-5" />
                </Button>
              </form>
              <Link href="/create">
                <Button className="rounded-xl">
                  Create Post
                </Button>
              </Link>
            </>
          ) : (
            <SignInButton />
          )}
        </div>

        {/* Mobile Settings Link (only when logged in) */}
        <div className="lg:hidden">
          {user ? (
            <Link
              href="/settings"
              className="p-2.5 rounded-xl hover:bg-white/10 dark:hover:bg-white/10 transition-colors touch-target"
              aria-label="Settings"
            >
              <Settings className="w-5 h-5 text-muted-foreground" />
            </Link>
          ) : null}
        </div>
      </div>
    </header>
  );
}
