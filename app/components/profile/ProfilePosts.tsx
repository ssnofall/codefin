'use client';

import { useState } from 'react';
import { PostList } from '../feed/PostList';
import { Card } from '../ui/Card';
import { Tables } from '../../lib/supabase/types';

interface PostWithProfile extends Tables<'posts'> {
  profiles: {
    username: string;
    avatar_url: string;
  } | null;
}

interface ProfilePostsProps {
  posts: PostWithProfile[];
  currentUserId?: string | null;
}

type SortOption = 'newest' | 'top' | 'oldest';

export function ProfilePosts({ posts, currentUserId }: ProfilePostsProps) {
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  const sortedPosts = [...posts].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'oldest':
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case 'top':
        return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
      default:
        return 0;
    }
  });

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'newest', label: 'Newest' },
    { value: 'top', label: 'Top' },
    { value: 'oldest', label: 'Oldest' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          Posts ({posts.length})
        </h2>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-3 py-1.5 rounded-lg bg-card border border-input text-sm focus:outline-none focus:border-emerald-500/50"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {sortedPosts.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-muted-foreground">No posts yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              This user hasn&apos;t shared any code snippets yet.
            </p>
          </div>
        </Card>
      ) : (
        <PostList posts={sortedPosts} currentUserId={currentUserId} />
      )}
    </div>
  );
}
