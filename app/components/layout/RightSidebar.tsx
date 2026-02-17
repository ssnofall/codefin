'use client';

import { TrendingUp, Users, FileText, BarChart3, Code } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getPlatformStats, getTrendingTags, getLanguageDistribution } from '../../lib/actions/posts';
import { getProfileByUsername, getUserLanguages } from '../../lib/actions/profiles';
import { GlassCard } from '../ui/GlassCard';
import { LanguageProgressBar } from '../ui/LanguageProgressBar';

interface Language {
  language: string;
  percentage: number;
}

interface PlatformStats {
  posts: number;
  users: number;
}

interface TrendingTag {
  tag: string;
  count: number;
}

export function RightSidebar() {
  const pathname = usePathname();

  const [isProfilePage, setIsProfilePage] = useState(false);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [platformStats, setPlatformStats] = useState<PlatformStats | null>(null);
  const [trendingTags, setTrendingTags] = useState<TrendingTag[]>([]);
  const [platformLanguages, setPlatformLanguages] = useState<Language[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      // Don't fetch data on settings pages
      if (pathname.startsWith('/settings')) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      // Check if we're on a profile page
      const isProfile = pathname.startsWith('/profile/');
      setIsProfilePage(isProfile);

      if (isProfile) {
        // Extract username from pathname
        const username = pathname.split('/')[2];
        
        if (username) {
          // Fetch user-specific languages
          const profile = await getProfileByUsername(username);
          if (profile) {
            const userLanguages = await getUserLanguages(profile.id);
            setLanguages(userLanguages);
          }
        }
      } else {
        // Fetch platform stats for non-profile pages
        const [stats, tags, langStats] = await Promise.all([
          getPlatformStats(),
          getTrendingTags(),
          getLanguageDistribution(),
        ]);
        setPlatformStats(stats);
        setTrendingTags(tags);
        setPlatformLanguages(langStats);
      }
      
      setIsLoading(false);
    }

    fetchData();
  }, [pathname]);

  // Don't render anything on settings pages
  if (pathname.startsWith('/settings')) {
    return null;
  }

  if (isLoading) {
    return <RightSidebarSkeleton />;
  }

  if (isProfilePage) {
    return (
      <div className="flex flex-col h-full py-4 space-y-6">
      <GlassCard hover={false} className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Code className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Most Used Languages
            </h3>
          </div>
          <div className="space-y-3">
            {languages.length > 0 ? (
              languages.map((lang) => (
                <LanguageProgressBar
                  key={lang.language}
                  label={lang.language}
                  percentage={lang.percentage}
                />
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No posts yet</p>
            )}
          </div>
        </GlassCard>
      </div>
    );
  }

  // Default view - show platform stats, trending topics, and platform languages

  return (
    <div className="flex flex-col h-full py-6 space-y-6">
      {/* Platform Stats */}
      <GlassCard hover={false} className="p-6">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          Platform Stats
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <FileText className="w-4 h-4" />
              <span className="text-xs">Posts</span>
            </div>
            <p className="text-2xl font-bold">{platformStats?.posts.toLocaleString() ?? 0}</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="w-4 h-4" />
              <span className="text-xs">Users</span>
            </div>
            <p className="text-2xl font-bold">{platformStats?.users.toLocaleString() ?? 0}</p>
          </div>
        </div>
      </GlassCard>

      {/* Trending Topics */}
      <GlassCard hover={false} className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Trending Topics
          </h3>
        </div>
        <div className="space-y-3">
          {trendingTags.slice(0, 5).map((tag, index) => (
            <a
              key={tag.tag}
              href={`/feed?tag=${tag.tag}`}
              className="flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-muted-foreground w-4">
                  {index + 1}
                </span>
                <span className="text-sm font-medium group-hover:text-primary transition-colors">
                  #{tag.tag}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                {tag.count} posts
              </span>
            </a>
          ))}
          {trendingTags.length === 0 && (
            <p className="text-sm text-muted-foreground">No trending tags yet</p>
          )}
        </div>
      </GlassCard>

      {/* Language Distribution */}
      <GlassCard hover={false} className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Languages
          </h3>
        </div>
        <div className="space-y-3">
          {platformLanguages.length > 0 ? (
            platformLanguages.map((stat) => (
              <LanguageProgressBar
                key={stat.language}
                label={stat.language}
                percentage={stat.percentage}
              />
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No posts yet</p>
          )}
        </div>
      </GlassCard>
    </div>
  );
}

function RightSidebarSkeleton() {
  return (
    <div className="space-y-6 py-4">
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="h-4 w-24 bg-muted rounded animate-pulse mb-4" />
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="h-3 w-12 bg-muted rounded animate-pulse" />
            <div className="h-8 w-16 bg-muted rounded animate-pulse" />
          </div>
          <div className="space-y-2">
            <div className="h-3 w-12 bg-muted rounded animate-pulse" />
            <div className="h-8 w-16 bg-muted rounded animate-pulse" />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="h-4 w-28 bg-muted rounded animate-pulse mb-4" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-3 w-4 bg-muted rounded animate-pulse" />
                <div className="h-4 w-20 bg-muted rounded animate-pulse" />
              </div>
              <div className="h-3 w-12 bg-muted rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="h-4 w-24 bg-muted rounded animate-pulse mb-4" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="h-3 w-20 bg-muted rounded animate-pulse" />
                <div className="h-3 w-8 bg-muted rounded animate-pulse" />
              </div>
              <div className="h-2 w-full bg-muted rounded-full animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
