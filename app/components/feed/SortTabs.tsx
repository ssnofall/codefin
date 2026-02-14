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
    <div className="flex items-center gap-2 p-1 rounded-xl bg-card border border-border">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeSort === tab.value;
        
        return (
          <Link
            key={tab.value}
            href={tab.href}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              isActive
                ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/25'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
            }`}
          >
            <Icon className="w-4 h-4" />
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
