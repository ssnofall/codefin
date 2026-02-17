import { notFound } from 'next/navigation';
import { getProfileByUsername } from '../../lib/actions/profiles';
import { getPostsByUser, getUserVotesForPosts } from '../../lib/actions/posts';
import { createClient, createStaticClient } from '../../lib/supabase/server';
import { ProfileHeader } from '../../components/profile/ProfileHeader';
import { ProfilePosts } from '../../components/profile/ProfilePosts';
import { Tables } from '../../lib/supabase/types';
import { APP_NAME } from '../../lib/utils/constants';

interface ProfilePageProps {
  params: Promise<{ username: string }>;
}

// Pre-render top 50 user profiles at build time
export async function generateStaticParams() {
  const supabase = createStaticClient();
  const { data: profiles } = await supabase
    .from('profiles')
    .select('username')
    .order('score', { ascending: false })
    .limit(50);

  return profiles?.map((profile: Tables<'profiles'>) => ({
    username: profile.username,
  })) || [];
}

// Revalidate every 60 seconds for ISR
export const revalidate = 60;

// Force dynamic rendering to allow cookie access
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: ProfilePageProps) {
  const { username } = await params;
  return {
    title: `${username} - ${APP_NAME}`,
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;
  
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    // Fetch profile first to get the ID for languages
    const profile = await getProfileByUsername(username);
    
    if (!profile) {
      notFound();
    }
    
    // Fetch posts
    const posts = await getPostsByUser(username);

    // Fetch user votes for the posts
    const postIds = posts.map((p: Tables<'posts'>) => p.id);
    const userVotes = postIds.length > 0 ? await getUserVotesForPosts(postIds) : {};

    return (
      <div className="space-y-6">
        {/* Profile Header */}
        <ProfileHeader 
          profile={profile} 
          postsCount={posts.length}
        />

        {/* Posts */}
        <ProfilePosts posts={posts} userVotes={userVotes} currentUserId={user?.id || null} />
      </div>
    );
  } catch (error) {
    notFound();
  }
}
