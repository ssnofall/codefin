-- Stackd MVP Database Schema
-- Run this in Supabase SQL Editor

-- ============================================
-- PROFILES TABLE
-- ============================================
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  avatar_url text not null,
  joined_at timestamp with time zone default now() not null,
  score int default 0 not null
);

comment on table profiles is 'User profiles, auto-created on first login';

-- ============================================
-- POSTS TABLE
-- ============================================
create table posts (
  id uuid default gen_random_uuid() primary key,
  author_id uuid references profiles(id) on delete cascade not null,
  title text not null,
  code text not null,
  language text not null,
  file_name text,
  tags text[] default array[]::text[],
  created_at timestamp with time zone default now() not null,
  upvotes int default 0 not null,
  downvotes int default 0 not null
);

comment on table posts is 'Code snippets and posts';

-- ============================================
-- VOTES TABLE
-- ============================================
create table votes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  post_id uuid references posts(id) on delete cascade not null,
  type text check (type in ('up', 'down')) not null,
  created_at timestamp with time zone default now() not null,
  unique(user_id, post_id)
);

comment on table votes is 'User votes on posts - one per user per post';

-- ============================================
-- COMMENTS TABLE
-- ============================================
create table comments (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references posts(id) on delete cascade not null,
  user_id uuid references profiles(id) on delete cascade not null,
  body text not null,
  created_at timestamp with time zone default now() not null
);

comment on table comments is 'Comments on posts';

-- ============================================
-- INDEXES
-- ============================================
create index idx_posts_author_id on posts(author_id);
create index idx_posts_created_at on posts(created_at desc);
create index idx_posts_upvotes on posts(upvotes desc);
create index idx_votes_post_id on votes(post_id);
create index idx_votes_user_id on votes(user_id);
create index idx_comments_post_id on comments(post_id);
create index idx_comments_user_id on comments(user_id);

-- ============================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- ============================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'user_name', new.raw_user_meta_data->>'preferred_username', 'user_' || substr(new.id::text, 1, 8)),
    coalesce(new.raw_user_meta_data->>'avatar_url', 'https://github.com/identicons/' || new.id::text || '.png')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to auto-create profile
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================
-- VOTE SCORE UPDATE FUNCTION
-- ============================================
create or replace function update_post_score()
returns trigger as $$
begin
  -- Calculate new score for the affected post
  update posts
  set 
    upvotes = (select count(*) from votes where post_id = coalesce(new.post_id, old.post_id) and type = 'up'),
    downvotes = (select count(*) from votes where post_id = coalesce(new.post_id, old.post_id) and type = 'down')
  where id = coalesce(new.post_id, old.post_id);
  
  -- Update author profile score
  update profiles
  set score = (
    select coalesce(sum(upvotes - downvotes), 0)
    from posts
    where author_id = (select author_id from posts where id = coalesce(new.post_id, old.post_id))
  )
  where id = (select author_id from posts where id = coalesce(new.post_id, old.post_id));
  
  return coalesce(new, old);
end;
$$ language plpgsql security definer;

-- Trigger to update scores on vote changes
create trigger on_vote_change
  after insert or update or delete on votes
  for each row execute procedure update_post_score();

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS on posts table
alter table posts enable row level security;

-- Allow anyone to read posts
create policy "Posts are viewable by everyone"
  on posts for select
  using (true);

-- Allow authenticated users to insert their own posts
create policy "Users can insert their own posts"
  on posts for insert
  with check (auth.uid() = author_id);

-- Allow users to update their own posts
create policy "Users can update their own posts"
  on posts for update
  using (auth.uid() = author_id);

-- Allow users to delete their own posts
create policy "Users can delete their own posts"
  on posts for delete
  using (auth.uid() = author_id);

-- Enable RLS on votes table
alter table votes enable row level security;

-- Allow anyone to read votes
create policy "Votes are viewable by everyone"
  on votes for select
  using (true);

-- Allow authenticated users to insert their own votes
create policy "Users can insert their own votes"
  on votes for insert
  with check (auth.uid() = user_id);

-- Allow users to update/delete their own votes
create policy "Users can manage their own votes"
  on votes for all
  using (auth.uid() = user_id);

-- Enable RLS on comments table
alter table comments enable row level security;

-- Allow anyone to read comments
create policy "Comments are viewable by everyone"
  on comments for select
  using (true);

-- Allow authenticated users to insert their own comments
create policy "Users can insert their own comments"
  on comments for insert
  with check (auth.uid() = user_id);

-- Allow users to update/delete their own comments
create policy "Users can manage their own comments"
  on comments for all
  using (auth.uid() = user_id);
