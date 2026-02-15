-- ============================================================================
-- Stackd RLS (Row Level Security) Policies
-- ============================================================================
-- Security-optimized RLS policies using (select auth.uid()) pattern
-- Run this second: psql -f supabase/01_rls.sql
-- ============================================================================

-- ============================================================================
-- PROFILES RLS
-- ============================================================================
alter table profiles enable row level security;

-- Everyone can view profiles
drop policy if exists "Profiles are viewable by everyone" on profiles;
create policy "Profiles are viewable by everyone"
  on profiles for select
  using (true);

-- Users can only update their own profile (optimized: auth.uid() called once)
drop policy if exists "Users can update own profile" on profiles;
create policy "Users can update own profile"
  on profiles for update
  using ((select auth.uid()) = id);

-- ============================================================================
-- POSTS RLS
-- ============================================================================
alter table posts enable row level security;

-- Everyone can view posts
drop policy if exists "Posts are viewable by everyone" on posts;
create policy "Posts are viewable by everyone"
  on posts for select
  using (true);

-- Only authenticated users can create posts (optimized: auth.uid() called once)
drop policy if exists "Authenticated users can create posts" on posts;
create policy "Authenticated users can create posts"
  on posts for insert
  with check ((select auth.uid()) = author_id);

-- Users can update their own posts (optimized: auth.uid() called once)
drop policy if exists "Users can update their own posts" on posts;
create policy "Users can update their own posts"
  on posts for update
  using ((select auth.uid()) = author_id);

-- Users can delete their own posts (optimized: auth.uid() called once)
drop policy if exists "Users can delete own posts" on posts;
create policy "Users can delete own posts"
  on posts for delete
  using ((select auth.uid()) = author_id);

-- ============================================================================
-- VOTES RLS
-- ============================================================================
alter table votes enable row level security;

-- Everyone can view votes (for counting)
drop policy if exists "Votes are viewable by everyone" on votes;
create policy "Votes are viewable by everyone"
  on votes for select
  using (true);

-- Users can only create their own votes (optimized: auth.uid() called once)
drop policy if exists "Users can create own votes" on votes;
create policy "Users can create own votes"
  on votes for insert
  with check ((select auth.uid()) = user_id);

-- Users can only update their own votes (optimized: auth.uid() called once)
drop policy if exists "Users can update own votes" on votes;
create policy "Users can update own votes"
  on votes for update
  using ((select auth.uid()) = user_id);

-- Users can only delete their own votes (optimized: auth.uid() called once)
drop policy if exists "Users can delete own votes" on votes;
create policy "Users can delete own votes"
  on votes for delete
  using ((select auth.uid()) = user_id);

-- ============================================================================
-- COMMENTS RLS
-- ============================================================================
alter table comments enable row level security;

-- Everyone can view comments
drop policy if exists "Comments are viewable by everyone" on comments;
create policy "Comments are viewable by everyone"
  on comments for select
  using (true);

-- Only authenticated users can create comments (optimized: auth.uid() called once)
drop policy if exists "Authenticated users can create comments" on comments;
create policy "Authenticated users can create comments"
  on comments for insert
  with check ((select auth.uid()) = user_id);

-- Users can only delete their own comments (optimized: auth.uid() called once)
drop policy if exists "Users can delete own comments" on comments;
create policy "Users can delete own comments"
  on comments for delete
  using ((select auth.uid()) = user_id);
