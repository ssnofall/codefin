'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Trash2 } from 'lucide-react';
import { Tables } from '../../lib/supabase/types';
import { Card } from '../ui/Card';
import { formatDate } from '../../lib/utils/formatters';
import { deleteComment } from '../../lib/actions/comments';

interface CommentItemProps {
  comment: Tables<'comments'> & {
    profiles: {
      username: string;
      avatar_url: string;
    } | null;
  };
  currentUserId?: string;
}

export function CommentItem({ comment, currentUserId }: CommentItemProps) {
  const isAuthor = currentUserId === comment.user_id;

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this comment?')) return;
    
    try {
      await deleteComment(comment.id, comment.post_id);
    } catch (error) {
      alert('Failed to delete comment');
    }
  };

  return (
    <Card>
      <div className="flex gap-3">
        {/* Avatar */}
        <Link href={`/profile/${comment.profiles?.username}`}>
          <Image
            src={comment.profiles?.avatar_url || '/default-avatar.png'}
            alt={comment.profiles?.username || 'User'}
            width={32}
            height={32}
            className="rounded-full flex-shrink-0"
            loading="lazy"
          />
        </Link>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-2">
            <Link
              href={`/profile/${comment.profiles?.username}`}
              className="font-medium text-sm hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              {comment.profiles?.username}
            </Link>
            <span className="text-muted-foreground text-xs">
              {formatDate(comment.created_at)}
            </span>
            {isAuthor && (
              <button
                onClick={handleDelete}
                className="ml-auto p-1.5 rounded-md text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors"
                title="Delete comment"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Body */}
          <p className="text-sm whitespace-pre-wrap">{comment.body}</p>
        </div>
      </div>
    </Card>
  );
}
