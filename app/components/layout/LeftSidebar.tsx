'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import { Home, TrendingUp, Clock, User as UserIcon, Settings } from 'lucide-react';

interface LeftSidebarProps {
  user: User | null;
}

const navItems = [
  { label: 'Feed', href: '/feed', icon: Home },
  { label: 'Trending', href: '/trending', icon: TrendingUp },
  { label: 'New', href: '/new', icon: Clock },
];

export function LeftSidebar({ user }: LeftSidebarProps) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full py-6 space-y-6">
      {/* Main Navigation */}
      <nav className="space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20'
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/5 dark:hover:bg-white/5'
              }`}
            >
              <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-[var(--accent)]' : ''}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      {user && (
        <>
          <div className="border-t border-[var(--glass-border)] pt-6">
            <nav className="space-y-1.5">
              <Link
                href={`/profile/${user.user_metadata?.user_name || 'me'}`}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 ${
                  pathname.startsWith('/profile')
                    ? 'bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/5 dark:hover:bg-white/5'
                }`}
              >
                <UserIcon className={`w-5 h-5 transition-colors ${pathname.startsWith('/profile') ? 'text-[var(--accent)]' : ''}`} />
                Profile
              </Link>
              <Link
                href="/settings"
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 ${
                  pathname === '/settings'
                    ? 'bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/5 dark:hover:bg-white/5'
                }`}
              >
                <Settings className={`w-5 h-5 transition-colors ${pathname === '/settings' ? 'text-[var(--accent)]' : ''}`} />
                Settings
              </Link>
            </nav>
          </div>
        </>
      )}

    </div>
  );
}
