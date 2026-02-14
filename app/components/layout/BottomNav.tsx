'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, TrendingUp, Plus, Compass, User } from 'lucide-react';
import { User as UserType } from '@supabase/supabase-js';

interface BottomNavProps {
  user: UserType | null;
}

const navItems = [
  { label: 'Home', href: '/feed', icon: Home },
  { label: 'Trending', href: '/trending', icon: TrendingUp },
  { label: 'Create', href: '/create', icon: Plus, isAction: true },
  { label: 'Discover', href: '/discover', icon: Compass },
];

export function BottomNav({ user }: BottomNavProps) {
  const pathname = usePathname();

  // Get username for profile link
  const username = user?.user_metadata?.user_name || user?.user_metadata?.preferred_username;
  const profileHref = username ? `/profile/${username}` : '/auth/login';

  const allNavItems = [
    ...navItems,
    { label: 'Profile', href: profileHref, icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
      {/* Background blur effect */}
      <div className="absolute inset-0 bg-background/90 backdrop-blur-lg border-t border-border" />
      
      {/* Safe area spacer for notched phones */}
      <div className="relative flex items-center justify-around px-2 pb-safe">
        {allNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const isCreate = item.isAction;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`
                relative flex flex-col items-center justify-center py-2 px-3 min-w-[64px]
                transition-colors duration-200
                ${isCreate 
                  ? '-mt-4' // Lift create button up
                  : ''
                }
              `}
            >
              {/* Icon container */}
              <div
                className={`
                  flex items-center justify-center rounded-xl transition-all duration-200
                  ${isCreate
                    ? 'w-12 h-12 bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                    : isActive
                    ? 'text-primary'
                    : 'text-muted-foreground'
                  }
                  ${!isCreate && isActive ? 'bg-primary/10' : ''}
                  ${!isCreate ? 'w-10 h-10' : ''}
                `}
              >
                <Icon className={`w-5 h-5 ${isCreate ? 'w-6 h-6' : ''}`} />
              </div>
              
              {/* Label */}
              <span
                className={`
                  text-[10px] mt-1 font-medium transition-colors duration-200
                  ${isActive && !isCreate
                    ? 'text-primary'
                    : 'text-muted-foreground'
                  }
                `}
              >
                {item.label}
              </span>

              {/* Active indicator dot */}
              {isActive && !isCreate && (
                <span className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
