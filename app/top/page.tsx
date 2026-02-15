import { getPosts, getUserVotesForPosts } from '../lib/actions/posts';
import { createClient } from '../lib/supabase/server';
import { PostList } from '../components/feed/PostList';
import { SortTabs } from '../components/feed/SortTabs';

interface TopPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function TopPage({ searchParams }: TopPageProps) {
  const { page: pageParam } = await searchParams;
  const page = pageParam ? parseInt(pageParam, 10) : 1;
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // Fetch posts and user votes in parallel
  const { posts, hasMore, currentPage } = await getPosts('top', undefined, page);
  
  // Fetch votes for the current page's posts
  const postIds = posts.map((p: any) => p.id);
  const votes = postIds.length > 0 ? await getUserVotesForPosts(postIds) : {};

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Top Posts</h1>
      </div>

      <SortTabs activeSort="top" />

      <PostList posts={posts} userVotes={votes} currentUserId={user?.id || null} />

      {/* Pagination */}
      <div className="flex items-center justify-center gap-4 pt-4">
        {currentPage > 1 && (
          <a
            href={`/top?page=${currentPage - 1}`}
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
            href={`/top?page=${currentPage + 1}`}
            className="px-4 py-2 rounded-lg bg-card border border-border hover:bg-accent transition-colors text-sm font-medium"
          >
            Next
          </a>
        )}
      </div>
    </div>
  );
}
