'use client';

import Link from 'next/link';
import { User } from '@supabase/supabase-js';
import { Code2, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { APP_NAME } from '../../lib/utils/constants';

interface HeaderProps {
  user: User | null;
}

export function Header({ user }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-sm">
      <div className="max-w-[1320px] mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/feed" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
            <Code2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
            {APP_NAME}
          </span>
        </Link>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg hover:bg-accent"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Desktop Auth */}
        <div className="hidden lg:flex items-center gap-4">
          {user ? (
            <Link
              href="/create"
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-green-600 text-white font-medium hover:opacity-90 transition-opacity"
            >
              Create Post
            </Link>
          ) : (
            <Link
              href="/auth/login"
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-green-600 text-white font-medium hover:opacity-90 transition-opacity"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border/50 bg-background/95 backdrop-blur-sm">
          <nav className="px-4 py-4 space-y-2">
            <Link
              href="/feed"
              className="block px-4 py-3 rounded-lg hover:bg-accent"
              onClick={() => setMobileMenuOpen(false)}
            >
              Feed
            </Link>
            <Link
              href="/trending"
              className="block px-4 py-3 rounded-lg hover:bg-accent"
              onClick={() => setMobileMenuOpen(false)}
            >
              Trending
            </Link>
            <Link
              href="/new"
              className="block px-4 py-3 rounded-lg hover:bg-accent"
              onClick={() => setMobileMenuOpen(false)}
            >
              New
            </Link>
            <Link
              href="/top"
              className="block px-4 py-3 rounded-lg hover:bg-accent"
              onClick={() => setMobileMenuOpen(false)}
            >
              Top
            </Link>
            {user ? (
              <>
                <Link
                  href="/create"
                  className="block px-4 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-green-600 text-white font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Create Post
                </Link>
                <Link
                  href="/auth/logout"
                  className="block px-4 py-3 rounded-lg hover:bg-accent"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Out
                </Link>
              </>
            ) : (
              <Link
                href="/auth/login"
                className="block px-4 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-green-600 text-white font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
