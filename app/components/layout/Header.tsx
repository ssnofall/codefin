'use client';

import Link from 'next/link';
import { User } from '@supabase/supabase-js';
import { Code2, Settings, LogOut } from 'lucide-react';
import { APP_NAME } from '../../lib/utils/constants';
import { logout } from '../../lib/actions/auth';

interface HeaderProps {
  user: User | null;
}

export function Header({ user }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-sm">
      <div className="max-w-[1320px] mx-auto px-3 sm:px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/feed" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
            <Code2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
            {APP_NAME}
          </span>
        </Link>

        {/* Desktop Navigation + Auth */}
        <div className="hidden lg:flex items-center gap-4">
          {user ? (
            <>
              <Link
                href="/settings"
                className="p-2 rounded-lg hover:bg-accent transition-colors"
                aria-label="Settings"
              >
                <Settings className="w-5 h-5" />
              </Link>
              <form action={logout}>
                <button
                  type="submit"
                  className="p-2 rounded-lg border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                  aria-label="Sign Out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </form>
              <Link
                href="/create"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-green-600 text-white font-medium hover:opacity-90 transition-opacity"
              >
                Create Post
              </Link>
            </>
          ) : (
            <Link
              href="/auth/login"
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-green-600 text-white font-medium hover:opacity-90 transition-opacity"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Settings Link (only when logged in) */}
        <div className="lg:hidden">
          {user ? (
            <Link
              href="/settings"
              className="p-2 rounded-lg hover:bg-accent transition-colors touch-target"
              aria-label="Settings"
            >
              <Settings className="w-5 h-5" />
            </Link>
          ) : null}
        </div>
      </div>
    </header>
  );
}
