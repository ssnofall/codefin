import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { MessageSquare, ArrowLeft } from 'lucide-react';
import { Suspense } from 'react';
import { getPostById } from '../../lib/actions/posts';
import { getUserVote } from '../../lib/actions/votes';
import { getComments } from '../../lib/actions/comments';
import { createClient, createStaticClient } from '../../lib/supabase/server';
import { Card } from '../../components/ui/Card';
import { Tag } from '../../components/ui/Tag';
import { VoteButtons } from '../../components/post/VoteButtons';
import { PostMenu } from '../../components/post/PostMenu';
import { CodePreview } from '../../components/post/CodePreview';
import { CommentSection } from '../../components/post/CommentSection';
import { CommentItem } from '../../components/post/CommentItem';
import { formatDate } from '../../lib/utils/formatters';
import { getLanguageColor } from '../../lib/utils/constants';
import { Tables } from '../../lib/supabase/types';

interface PostPageProps {
  params: Promise<{ id: string }>;
}

// Pre-render top 100 posts at build time for fast navigation
export async function generateStaticParams() {
  const supabase = createStaticClient();
  const { data: posts } = await supabase
    .from('posts')
    .select('id')
    .order('upvotes', { ascending: false })
    .limit(100);
  
  return posts?.map((post: Tables<'posts'>) => ({
    id: post.id,
  })) || [];
}

// Revalidate every 60 seconds for ISR
export const revalidate = 60;

// Force dynamic rendering to allow cookie access
export const dynamic = 'force-dynamic';

export default async function PostPage({ params }: PostPageProps) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { id } = await params;

  try {
    // Fetch post first (critical content)
    const post = await getPostById(id);
    if (!post) {
      notFound();
    }
    const p = post as Tables<'posts'> & {
      profiles: { username: string; avatar_url: string } | null;
    };

    // Get user's vote for this specific post
    const userVote = user ? await getUserVote(id) : null;

    return (
      <div className="space-y-4 sm:space-y-6">
        {/* Back Button */}
        <Link
          href="/feed"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Feed
        </Link>

        {/* Post */}
        <Card className="p-3 sm:p-5">
          {/* Desktop Layout */}
          <div className="hidden lg:block">
            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Link
                    href={`/profile/${p.profiles?.username}`}
                    className="flex items-center gap-2 group"
                  >
                    <Image
                      src={p.profiles?.avatar_url || '/default-avatar.png'}
                      alt={p.profiles?.username || 'User'}
                      width={32}
                      height={32}
                      className="rounded-full"
                      loading="lazy"
                    />
                    <span className="font-medium group-hover:text-primary transition-colors">
                      {p.profiles?.username}
                    </span>
                  </Link>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-muted-foreground">
                    {formatDate(p.created_at)}
                  </span>
                </div>
                <PostMenu post={p} isOwner={user?.id === p.author_id} />
              </div>

              {/* Title */}
              <h1 className="text-2xl font-bold mb-4">{p.title}</h1>

              {/* Tags - below title, above code */}
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                {/* Tags */}
                {p.tags && p.tags.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap flex-1">
                    {p.tags.map((tag) => (
                      <Tag key={tag} name={tag} />
                    ))}
                  </div>
                )}

                {/* Language Badge - far right */}
                <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${getLanguageColor(p.language)}`}>
                  {p.language}
                </span>
              </div>

              {/* Code */}
              <div className="mb-4">
                <CodePreview code={p.code} language={p.language} fileName={p.file_name} />
              </div>

              {/* Footer: Vote Buttons & Comments - bottom left */}
              <div className="flex items-center gap-1">
                <VoteButtons
                  postId={p.id}
                  upvotes={p.upvotes}
                  downvotes={p.downvotes}
                  initialUserVote={userVote}
                />

                {/* Comments */}
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-muted text-muted-foreground">
                  <MessageSquare className="w-3 h-3" />
                  <Suspense fallback={<span>...</span>}>
                    <CommentCount postId={id} />
                  </Suspense>
                </span>
              </div>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="lg:hidden">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 min-w-0">
                <Link
                  href={`/profile/${p.profiles?.username}`}
                  className="flex items-center gap-2 group shrink-0"
                >
                  <Image
                    src={p.profiles?.avatar_url || '/default-avatar.png'}
                    alt={p.profiles?.username || 'User'}
                    width={28}
                    height={28}
                    className="rounded-full"
                    loading="lazy"
                  />
                  <span className="text-sm font-medium group-hover:text-primary transition-colors truncate">
                    {p.profiles?.username}
                  </span>
                </Link>
                <span className="text-muted-foreground shrink-0">•</span>
                <span className="text-xs text-muted-foreground shrink-0">
                  {formatDate(p.created_at)}
                </span>
              </div>
              <PostMenu post={p} isOwner={user?.id === p.author_id} />
            </div>

            {/* Title */}
            <h1 className="text-lg sm:text-xl font-bold mb-3">{p.title}</h1>

            {/* Tags - below title, above code */}
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              {/* Tags - Show first 2 on mobile */}
              {p.tags && p.tags.length > 0 && (
                <div className="flex items-center gap-1 flex-1">
                  {p.tags.slice(0, 2).map((tag) => (
                    <Tag key={tag} name={tag} />
                  ))}
                  {p.tags.length > 2 && (
                    <span className="text-xs text-muted-foreground">
                      +{p.tags.length - 2}
                    </span>
                  )}
                </div>
              )}

              {/* Language Badge - far right */}
              <span className={`px-2 py-0.5 rounded-md text-xs font-medium border ${getLanguageColor(p.language)}`}>
                {p.language}
              </span>
            </div>

            {/* Code */}
            <div className="mb-4">
              <CodePreview code={p.code} language={p.language} fileName={p.file_name} />
            </div>

            {/* Footer: Vote Buttons & Comments - bottom left */}
            <div className="flex items-center gap-1">
              <VoteButtons
                postId={p.id}
                upvotes={p.upvotes}
                downvotes={p.downvotes}
                initialUserVote={userVote}
              />

              {/* Comments */}
              <span className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium bg-muted text-muted-foreground">
                <MessageSquare className="w-3 h-3" />
                <Suspense fallback={<span>...</span>}>
                  <CommentCount postId={id} />
                </Suspense>
              </span>
            </div>
          </div>
        </Card>

        {/* Comments Section - Streamed separately */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold px-1">Comments</h2>

          {/* Comment Form */}
          {user && <CommentSection postId={p.id} />}

          {/* Comments List - Streamed with Suspense */}
          <Suspense fallback={<CommentsSkeleton />}>
            <CommentsList postId={id} userId={user?.id} />
          </Suspense>
        </div>
      </div>
    );
  } catch (error) {
    notFound();
  }
}

// Async component to fetch and display comment count
async function CommentCount({ postId }: { postId: string }) {
  const { totalCount } = await getComments(postId);
  return <span>{totalCount} comments</span>;
}

// Async component to fetch and display comments
async function CommentsList({ postId, userId }: { postId: string; userId?: string }) {
  const { comments } = await getComments(postId);

  if (comments.length === 0) {
    return (
      <Card>
        <p className="text-center text-muted-foreground py-8">
          No comments yet. Be the first to share your thoughts!
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          currentUserId={userId}
        />
      ))}
    </div>
  );
}

function CommentsSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="animate-pulse">
          <div className="p-4 flex gap-3">
            <div className="w-8 h-8 bg-muted rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-24 bg-muted rounded" />
              <div className="h-4 w-full bg-muted rounded" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
