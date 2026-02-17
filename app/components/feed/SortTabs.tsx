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
    <div className="glass rounded-2xl p-1.5 flex items-center gap-1">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeSort === tab.value;
        
        return (
          <Link
            key={tab.value}
            href={tab.href}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 min-w-[80px] touch-target ${
              isActive
                ? 'bg-[var(--primary)] text-primary-foreground shadow-lg'
                : 'text-muted-foreground hover:text-foreground hover:bg-white/5 dark:hover:bg-white/5'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
