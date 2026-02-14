import Link from 'next/link';
import { Flame, Clock, TrendingUp } from 'lucide-react';

interface SortTabsProps {
  activeSort: 'hot' | 'new' | 'top';
}

const tabs = [
  { label: 'Hot', value: 'hot' as const, icon: Flame, href: '/feed' },
  { label: 'New', value: 'new' as const, icon: Clock, href: '/new' },
  { label: 'Top', value: 'top' as const, icon: TrendingUp, href: '/top' },
];

export function SortTabs({ activeSort }: SortTabsProps) {
  return (
    <div className="flex items-center gap-1 sm:gap-2 p-1 rounded-xl bg-card border border-border">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeSort === tab.value;
        
        return (
          <Link
            key={tab.value}
            href={tab.href}
            className={`flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all min-w-[60px] sm:min-w-[80px] touch-target ${
              isActive
                ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/25'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
            }`}
          >
            <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="sm:hidden">{tab.label.slice(0, 3)}</span>
          </Link>
        );
      })}
    </div>
  );
}
