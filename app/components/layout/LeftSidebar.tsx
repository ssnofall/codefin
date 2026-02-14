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
    <div className="flex flex-col h-full py-4 space-y-6">
      {/* Main Navigation */}
      <nav className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-primary/10 text-primary border border-primary/20'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
            >
              <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-primary' : ''}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      {user && (
        <>
          <div className="border-t border-border/50 pt-4">
            <nav className="space-y-1">
              <Link
                href={`/profile/${user.user_metadata?.user_name || 'me'}`}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  pathname.startsWith('/profile')
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}
              >
                <UserIcon className={`w-5 h-5 transition-colors ${pathname.startsWith('/profile') ? 'text-primary' : ''}`} />
                Profile
              </Link>
              <Link
                href="/settings"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  pathname === '/settings'
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}
              >
                <Settings className={`w-5 h-5 transition-colors ${pathname === '/settings' ? 'text-primary' : ''}`} />
                Settings
              </Link>
            </nav>
          </div>
        </>
      )}

    </div>
  );
}
