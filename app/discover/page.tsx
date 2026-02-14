import { Suspense } from 'react';
import { TrendingUp, Users, FileText, BarChart3, ArrowRight } from 'lucide-react';
import { getPlatformStats, getTrendingTags, getLanguageDistribution } from '../lib/actions/posts';
import { Card } from '../components/ui/Card';
import { LanguageProgressBar } from '../components/ui/LanguageProgressBar';
import Link from 'next/link';

export const metadata = {
  title: 'Discover - Stackd',
  description: 'Explore trending topics, platform stats, and popular programming languages',
};

export const revalidate = 60;

export default async function DiscoverPage() {
  const [platformStats, trendingTags, platformLanguages] = await Promise.all([
    getPlatformStats(),
    getTrendingTags(),
    getLanguageDistribution(),
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Discover</h1>
        <p className="text-muted-foreground">
          Explore trending topics and platform insights
        </p>
      </div>

      {/* Platform Stats */}
      <Card>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-emerald-400" />
          Platform Stats
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <FileText className="w-4 h-4" />
              <span className="text-xs">Total Posts</span>
            </div>
            <p className="text-2xl font-bold">{platformStats?.posts.toLocaleString() ?? 0}</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="w-4 h-4" />
              <span className="text-xs">Active Users</span>
            </div>
            <p className="text-2xl font-bold">{platformStats?.users.toLocaleString() ?? 0}</p>
          </div>
        </div>
      </Card>

      {/* Trending Topics */}
      <Card>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          Trending Topics
        </h2>
        <div className="space-y-3">
          {trendingTags.slice(0, 8).map((tag, index) => (
            <Link
              key={tag.tag}
              href={`/feed?tag=${tag.tag}`}
              className="flex items-center justify-between group py-2 -mx-2 px-2 rounded-lg hover:bg-accent transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-muted-foreground w-6">
                  {index + 1}
                </span>
                <span className="text-sm font-medium group-hover:text-emerald-400 transition-colors">
                  #{tag.tag}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {tag.count} posts
                </span>
                <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Link>
          ))}
          {trendingTags.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No trending tags yet
            </p>
          )}
        </div>
      </Card>

      {/* Language Distribution */}
      <Card>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-emerald-400" />
          Popular Languages
        </h2>
        <div className="space-y-4">
          {platformLanguages.length > 0 ? (
            platformLanguages.slice(0, 6).map((stat) => (
              <LanguageProgressBar
                key={stat.language}
                label={stat.language}
                percentage={stat.percentage}
              />
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No posts yet
            </p>
          )}
        </div>
      </Card>

      {/* Quick Links */}
      <Card>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          Quick Links
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/feed"
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-accent hover:bg-accent/80 transition-colors text-sm font-medium"
          >
            <FileText className="w-4 h-4" />
            Browse Feed
          </Link>
          <Link
            href="/trending"
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-accent hover:bg-accent/80 transition-colors text-sm font-medium"
          >
            <TrendingUp className="w-4 h-4" />
            Trending
          </Link>
          <Link
            href="/new"
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-accent hover:bg-accent/80 transition-colors text-sm font-medium"
          >
            <FileText className="w-4 h-4" />
            New Posts
          </Link>
          <Link
            href="/top"
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-accent hover:bg-accent/80 transition-colors text-sm font-medium"
          >
            <BarChart3 className="w-4 h-4" />
            Top Rated
          </Link>
        </div>
      </Card>
    </div>
  );
}
