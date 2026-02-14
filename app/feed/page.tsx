import { Suspense } from 'react';
import { getPosts, getUserVotesForPosts } from '../lib/actions/posts';
import { createClient } from '../lib/supabase/server';
import { PostList } from '../components/feed/PostList';
import { SortTabs } from '../components/feed/SortTabs';
import { Card } from '../components/ui/Card';
import { Tables } from '../lib/supabase/types';

interface FeedPageProps {
  searchParams: Promise<{ tag?: string; page?: string }>;
}

export default async function FeedPage({ searchParams }: FeedPageProps) {
  const { tag, page: pageParam } = await searchParams;
  const page = pageParam ? parseInt(pageParam, 10) : 1;
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // Fetch posts first
  const { posts, hasMore, currentPage } = await getPosts('hot', tag, page);

  // Fetch votes for the current page's posts only if we have posts
  const postIds = posts.map((p: Tables<'posts'>) => p.id);
  const votes = postIds.length > 0 ? await getUserVotesForPosts(postIds) : {};

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {tag ? (
            <span>
              Posts tagged <span className="text-emerald-600 dark:text-emerald-400">#{tag}</span>
            </span>
          ) : (
            'Feed'
          )}
        </h1>
      </div>

      <SortTabs activeSort="hot" />

      <Suspense fallback={<PostListSkeleton />}>
        <PostList posts={posts} userVotes={votes} currentUserId={user?.id || null} />
      </Suspense>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-4 pt-4">
        {currentPage > 1 && (
          <a
            href={`/feed?page=${currentPage - 1}${tag ? `&tag=${tag}` : ''}`}
            className="px-4 py-2 rounded-lg bg-card border border-border hover:bg-accent transition-colors text-sm font-medium"
          >
            Previous
          </a>
        )}
        <span className="text-sm text-muted-foreground">
          Page {currentPage}
        </span>
        {hasMore && (
          <a
            href={`/feed?page=${currentPage + 1}${tag ? `&tag=${tag}` : ''}`}
            className="px-4 py-2 rounded-lg bg-card border border-border hover:bg-accent transition-colors text-sm font-medium"
          >
            Next
          </a>
        )}
      </div>
    </div>
  );
}

function PostListSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <Card key={i} className="animate-pulse">
          <div className="p-4">
            <div className="flex gap-4">
              <div className="w-12 h-20 bg-muted rounded" />
              <div className="flex-1 space-y-3">
                <div className="h-4 w-1/3 bg-muted rounded" />
                <div className="h-3 w-1/4 bg-muted rounded" />
                <div className="h-32 bg-muted rounded" />
                <div className="flex gap-2">
                  <div className="h-6 w-16 bg-muted rounded" />
                  <div className="h-6 w-16 bg-muted rounded" />
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
