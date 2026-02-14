import { Tables } from '../../lib/supabase/types';
import { PostCard } from './PostCard';

interface PostListProps {
  posts: (Tables<'posts'> & {
    profiles: {
      username: string;
      avatar_url: string;
    } | null;
  })[];
  userVotes?: Record<string, 'up' | 'down'>;
  currentUserId?: string | null;
}

export function PostList({ posts, userVotes = {}, currentUserId }: PostListProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No posts yet. Be the first to share!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post: any) => (
        <PostCard 
          key={post.id} 
          post={post} 
          userVote={userVotes[post.id] || null}
          currentUserId={currentUserId}
        />
      ))}
    </div>
  );
}
