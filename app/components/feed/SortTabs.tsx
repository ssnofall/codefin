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
            className={`relative flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 min-w-[80px] touch-target overflow-hidden ${
              isActive
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-white/5 dark:hover:bg-white/5'
            }`}
          >
            {isActive && (
              <>
                <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-[var(--accent)] via-[var(--primary)] via-[var(--accent)] to-[var(--primary)] animate-liquid-border-glass bg-[length:300%_100%] opacity-90" />
                <span className="absolute inset-0 rounded-xl backdrop-blur-[2px] bg-gradient-to-r from-[var(--accent)] via-[var(--primary)] via-[var(--accent)] to-[var(--primary)] animate-liquid-border-glass bg-[length:300%_100%] opacity-70 mix-blend-screen" />
                <span className="absolute inset-[3px] rounded-[9px] bg-background" />
              </>
            )}
            <Icon className="relative z-10 w-4 h-4" />
            <span className="relative z-10">{tab.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
