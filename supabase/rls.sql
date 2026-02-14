-- Stackd MVP RLS Policies
-- Run this after schema.sql

-- ============================================
-- PROFILES RLS
-- ============================================
alter table profiles enable row level security;

-- Everyone can view profiles
create policy "Profiles are viewable by everyone"
  on profiles for select
  using (true);

-- Users can only update their own profile
create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- ============================================
-- POSTS RLS
-- ============================================
alter table posts enable row level security;

-- Everyone can view posts
create policy "Posts are viewable by everyone"
  on posts for select
  using (true);

-- Only authenticated users can create posts
create policy "Authenticated users can create posts"
  on posts for insert
  with check (auth.uid() = author_id);

-- Users can delete their own posts
create policy "Users can delete own posts"
  on posts for delete
  using (auth.uid() = author_id);

-- ============================================
-- VOTES RLS
-- ============================================
alter table votes enable row level security;

-- Everyone can view votes (for counting)
create policy "Votes are viewable by everyone"
  on votes for select
  using (true);

-- Users can only create their own votes
create policy "Users can create own votes"
  on votes for insert
  with check (auth.uid() = user_id);

-- Users can only update their own votes
create policy "Users can update own votes"
  on votes for update
  using (auth.uid() = user_id);

-- Users can only delete their own votes
create policy "Users can delete own votes"
  on votes for delete
  using (auth.uid() = user_id);

-- ============================================
-- COMMENTS RLS
-- ============================================
alter table comments enable row level security;

-- Everyone can view comments
create policy "Comments are viewable by everyone"
  on comments for select
  using (true);

-- Only authenticated users can create comments
create policy "Authenticated users can create comments"
  on comments for insert
  with check (auth.uid() = user_id);

-- Users can only delete their own comments
create policy "Users can delete own comments"
  on comments for delete
  using (auth.uid() = user_id);
