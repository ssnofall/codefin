import Link from 'next/link';
import Image from 'next/image';
import { MessageSquare } from 'lucide-react';
import { Tables } from '../../lib/supabase/types';
import { Card } from '../ui/Card';
import { Tag } from '../ui/Tag';
import { VoteButtons } from '../post/VoteButtons';
import { PostMenu } from '../post/PostMenu';
import { formatDate } from '../../lib/utils/formatters';
import { CODE_PREVIEW_LINES } from '../../lib/utils/constants';
import { CodePreview } from '../post/CodePreview';

interface PostCardProps {
  post: Tables<'posts'> & {
    profiles: {
      username: string;
      avatar_url: string;
    } | null;
  };
  userVote?: 'up' | 'down' | null;
  currentUserId?: string | null;
}

export function PostCard({ post, userVote, currentUserId }: PostCardProps) {
  const score = post.upvotes - post.downvotes;
  const codeLines = post.code.split('\n');
  const shouldTruncate = codeLines.length > CODE_PREVIEW_LINES;
  const previewCode = shouldTruncate
    ? codeLines.slice(0, CODE_PREVIEW_LINES).join('\n')
    : post.code;

  const isOwner = currentUserId === post.author_id;

  return (
    <Card className="group p-3 sm:p-5">
      {/* Desktop Layout: Vertical votes on left */}
      <div className="hidden lg:flex gap-4">
        {/* Vote Buttons - Desktop (Vertical) */}
        <VoteButtons 
          postId={post.id} 
          score={score} 
          orientation="vertical" 
          initialUserVote={userVote}
        />

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Link href={`/profile/${post.profiles?.username}`} className="flex items-center gap-2 group/author">
                <Image
                  src={post.profiles?.avatar_url || '/default-avatar.png'}
                  alt={post.profiles?.username || 'User'}
                  width={24}
                  height={24}
                  className="rounded-full"
                  loading="lazy"
                />
                <span className="text-sm font-medium group-hover/author:text-emerald-600 dark:group-hover/author:text-emerald-400 transition-colors">
                  {post.profiles?.username}
                </span>
              </Link>
              <span className="text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">
                {formatDate(post.created_at)}
              </span>
            </div>
            <PostMenu post={post} isOwner={isOwner} />
          </div>

          {/* Title */}
          <Link href={`/post/${post.id}`}>
            <h3 className="text-lg font-semibold mb-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
              {post.title}
            </h3>
          </Link>

          {/* Code Preview */}
          <Link href={`/post/${post.id}`} className="block mb-4">
            <CodePreview code={previewCode} language={post.language} fileName={post.file_name} />
            {shouldTruncate && (
              <p className="text-sm text-muted-foreground mt-2 text-center">
                Click to see full code
              </p>
            )}
          </Link>

          {/* Footer */}
          <div className="flex items-center gap-4">
            {/* Language Badge */}
            <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              {post.language}
            </span>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                {post.tags.slice(0, 3).map((tag) => (
                  <Tag key={tag} name={tag} />
                ))}
                {post.tags.length > 3 && (
                  <span className="text-xs text-muted-foreground">
                    +{post.tags.length - 3}
                  </span>
                )}
              </div>
            )}

            {/* Comments */}
            <Link
              href={`/post/${post.id}`}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors ml-auto"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Comments</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Layout: Stacked with horizontal votes */}
      <div className="lg:hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <Link href={`/profile/${post.profiles?.username}`} className="flex items-center gap-2 group/author shrink-0">
              <Image
                src={post.profiles?.avatar_url || '/default-avatar.png'}
                alt={post.profiles?.username || 'User'}
                width={24}
                height={24}
                className="rounded-full"
                loading="lazy"
              />
              <span className="text-sm font-medium group-hover/author:text-emerald-600 dark:group-hover/author:text-emerald-400 transition-colors truncate">
                {post.profiles?.username}
              </span>
            </Link>
            <span className="text-muted-foreground shrink-0">•</span>
            <span className="text-xs text-muted-foreground shrink-0">
              {formatDate(post.created_at)}
            </span>
          </div>
          <PostMenu post={post} isOwner={isOwner} />
        </div>

        {/* Title */}
        <Link href={`/post/${post.id}`}>
          <h3 className="text-base font-semibold mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
            {post.title}
          </h3>
        </Link>

        {/* Code Preview */}
        <Link href={`/post/${post.id}`} className="block mb-3">
          <CodePreview code={previewCode} language={post.language} fileName={post.file_name} />
          {shouldTruncate && (
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Tap to see full code →
            </p>
          )}
        </Link>

        {/* Footer Row */}
        <div className="flex items-center justify-between gap-2">
          {/* Left side: Language + Tags */}
          <div className="flex items-center gap-2 min-w-0">
            {/* Language Badge */}
            <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
              {post.language}
            </span>

            {/* Tags - Mobile: Show only first tag */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex items-center gap-1">
                <Tag name={post.tags[0]} />
                {post.tags.length > 1 && (
                  <span className="text-xs text-muted-foreground">
                    +{post.tags.length - 1}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Comments Link */}
          <Link
            href={`/post/${post.id}`}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors shrink-0"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Comments</span>
          </Link>
        </div>

        {/* Vote Buttons - Mobile (Horizontal) */}
        <div className="mt-3 pt-3 border-t border-border/50">
          <VoteButtons 
            postId={post.id} 
            score={score} 
            orientation="horizontal" 
            initialUserVote={userVote}
          />
        </div>
      </div>
    </Card>
  );
}
