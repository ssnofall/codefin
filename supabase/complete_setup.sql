-- ============================================================================
-- STACKD DATABASE COMPLETE SETUP
-- ============================================================================
-- Run this entire file in your Supabase SQL Editor (New Query)
-- This creates everything needed for the Stackd app to work
-- ============================================================================

-- ============================================================================
-- STEP 1: TABLES AND INDEXES (from 00_schema.sql)
-- ============================================================================

-- Profiles table - stores user profile data
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  avatar_url text not null,
  joined_at timestamp with time zone default now() not null,
  score int default 0 not null
);

-- Posts table - stores code posts
create table if not exists posts (
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

-- Votes table - stores user votes on posts
create table if not exists votes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  post_id uuid references posts(id) on delete cascade not null,
  type text check (type in ('up', 'down')) not null,
  created_at timestamp with time zone default now() not null,
  unique(user_id, post_id)
);

-- Comments table - stores post comments
create table if not exists comments (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references posts(id) on delete cascade not null,
  user_id uuid references profiles(id) on delete cascade not null,
  body text not null,
  created_at timestamp with time zone default now() not null
);

-- Indexes for performance
create index if not exists idx_posts_author_id on posts(author_id);
create index if not exists idx_posts_created_at on posts(created_at desc);
create index if not exists idx_posts_upvotes on posts(upvotes desc);
create index if not exists idx_votes_post_id on votes(post_id);
create index if not exists idx_comments_post_id on comments(post_id);
create index if not exists idx_comments_user_id on comments(user_id);

-- ============================================================================
-- STEP 2: ROW LEVEL SECURITY (from 01_rls.sql)
-- ============================================================================

-- Profiles RLS
alter table profiles enable row level security;

drop policy if exists "Profiles are viewable by everyone" on profiles;
create policy "Profiles are viewable by everyone"
  on profiles for select
  using (true);

drop policy if exists "Users can update own profile" on profiles;
create policy "Users can update own profile"
  on profiles for update
  using ((select auth.uid()) = id);

-- Posts RLS
alter table posts enable row level security;

drop policy if exists "Posts are viewable by everyone" on posts;
create policy "Posts are viewable by everyone"
  on posts for select
  using (true);

drop policy if exists "Authenticated users can create posts" on posts;
create policy "Authenticated users can create posts"
  on posts for insert
  with check ((select auth.uid()) = author_id);

drop policy if exists "Users can update their own posts" on posts;
create policy "Users can update their own posts"
  on posts for update
  using ((select auth.uid()) = author_id);

drop policy if exists "Users can delete own posts" on posts;
create policy "Users can delete own posts"
  on posts for delete
  using ((select auth.uid()) = author_id);

-- Votes RLS
alter table votes enable row level security;

drop policy if exists "Votes are viewable by everyone" on votes;
create policy "Votes are viewable by everyone"
  on votes for select
  using (true);

drop policy if exists "Users can create own votes" on votes;
create policy "Users can create own votes"
  on votes for insert
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update own votes" on votes;
create policy "Users can update own votes"
  on votes for update
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can delete own votes" on votes;
create policy "Users can delete own votes"
  on votes for delete
  using ((select auth.uid()) = user_id);

-- Comments RLS
alter table comments enable row level security;

drop policy if exists "Comments are viewable by everyone" on comments;
create policy "Comments are viewable by everyone"
  on comments for select
  using (true);

drop policy if exists "Authenticated users can create comments" on comments;
create policy "Authenticated users can create comments"
  on comments for insert
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can delete own comments" on comments;
create policy "Users can delete own comments"
  on comments for delete
  using ((select auth.uid()) = user_id);

-- Rate Limits Table (for multi-instance rate limiting)
create table if not exists rate_limits (
  id uuid default gen_random_uuid() primary key,
  identifier text not null,
  action text not null,
  count int default 1 not null,
  window_start timestamp with time zone default now() not null,
  created_at timestamp with time zone default now() not null,
  unique(identifier, action, window_start)
);

-- Enable RLS for consistency with other tables
alter table rate_limits enable row level security;

create index if not exists idx_rate_limits_identifier on rate_limits(identifier, action);
create index if not exists idx_rate_limits_window on rate_limits(window_start);

-- ============================================================================
-- STEP 3: FUNCTIONS (from 02_functions.sql)
-- ============================================================================

-- Auto-create profile on signup
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
$$ language plpgsql security definer set search_path = pg_catalog;

-- Update post and author score on vote change
create or replace function public.update_post_score()
returns trigger as $$
begin
  update posts
  set 
    upvotes = (select count(*) from votes where post_id = coalesce(new.post_id, old.post_id) and type = 'up'),
    downvotes = (select count(*) from votes where post_id = coalesce(new.post_id, old.post_id) and type = 'down')
  where id = coalesce(new.post_id, old.post_id);
  
  update profiles
  set score = (
    select coalesce(sum(upvotes - downvotes), 0)
    from posts
    where author_id = (select author_id from posts where id = coalesce(new.post_id, old.post_id))
  )
  where id = (select author_id from posts where id = coalesce(new.post_id, old.post_id));
  
  return coalesce(new, old);
end;
$$ language plpgsql security definer set search_path = pg_catalog;

-- Refresh trending tags materialized view
create or replace function public.refresh_trending_tags()
returns void as $$
begin
  refresh materialized view concurrently trending_tags;
exception
  when others then
    refresh materialized view trending_tags;
end;
$$ language plpgsql set search_path = pg_catalog;

-- Auto-refresh trending tags on post change
create or replace function public.refresh_trending_tags_trigger()
returns trigger as $$
begin
  begin
    refresh materialized view concurrently trending_tags;
  exception
    when others then
      refresh materialized view trending_tags;
  end;
  return null;
end;
$$ language plpgsql set search_path = pg_catalog;

-- ============================================================================
-- STEP 4: TRIGGERS AND MATERIALIZED VIEWS (from 03_triggers.sql)
-- ============================================================================

-- Auto-create profile on user signup
create trigger if not exists on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Update scores on vote change
create trigger if not exists on_vote_change
  after insert or update or delete on votes
  for each row execute procedure public.update_post_score();

-- Trending tags materialized view
create materialized view if not exists trending_tags as
select 
  unnest(tags) as tag,
  count(*) as count
from posts
where created_at >= now() - interval '30 days'
group by tag
order by count desc;

-- Required indexes for the materialized view
create unique index if not exists idx_trending_tags_unique_tag on trending_tags(tag);
create index if not exists idx_trending_tags_count on trending_tags(count desc);
create index if not exists idx_trending_tags_tag on trending_tags(tag);

-- Auto-refresh trending tags on post change
do $$
begin
  if not exists (
    select 1 from pg_trigger where tgname = 'refresh_trending_tags_on_change'
  ) then
    create trigger refresh_trending_tags_on_change
      after insert or update or delete on posts
      for each statement
      execute function public.refresh_trending_tags_trigger();
  end if;
end $$;

-- Initial population with regular refresh
refresh materialized view trending_tags;

-- ============================================================================
-- VERIFICATION
-- ============================================================================

select 'Database setup complete!' as status;
select 
  (select count(*) from information_schema.tables where table_schema = 'public') as table_count,
  (select count(*) from pg_trigger where tgname like '%trending%') as trending_triggers,
  (select count(*) from pg_matviews where matviewname = 'trending_tags') as materialized_views;
