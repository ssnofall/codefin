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
import { SCORE_LABEL } from '../../lib/utils/constants';
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
    const score = p.upvotes - p.downvotes;

    // Get user's vote for this specific post
    const userVote = user ? await getUserVote(id) : null;

    return (
      <div className="space-y-6">
        {/* Back Button */}
        <Link
          href="/feed"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Feed
        </Link>

        {/* Post */}
        <Card>
          <div className="flex gap-4">
            {/* Vote Buttons */}
            <VoteButtons 
              postId={p.id} 
              score={score} 
              orientation="vertical" 
              initialUserVote={userVote}
            />

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
                    <span className="font-medium group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
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

              {/* Code */}
              <div className="mb-6">
                <CodePreview code={p.code} language={p.language} fileName={p.file_name} />
              </div>

              {/* Footer */}
              <div className="flex items-center gap-4 flex-wrap">
                {/* Language Badge */}
                <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  {p.language}
                </span>

                {/* Tags */}
                {p.tags && p.tags.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap">
                    {p.tags.map((tag) => (
                      <Tag key={tag} name={tag} />
                    ))}
                  </div>
                )}

                {/* Stats */}
                <div className="flex items-center gap-4 ml-auto text-sm text-muted-foreground">
                  <span>
                    {SCORE_LABEL}: {score}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4" />
                    <Suspense fallback={<span>Loading...</span>}>
                      <CommentCount postId={id} />
                    </Suspense>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Comments Section - Streamed separately */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Comments</h2>

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
