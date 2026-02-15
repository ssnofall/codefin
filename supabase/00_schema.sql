-- ============================================================================
-- Stackd Database Schema
-- ============================================================================
-- Core tables and indexes
-- Run this first: psql -f supabase/00_schema.sql
-- ============================================================================

-- ============================================================================
-- PROFILES TABLE
-- ============================================================================
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  avatar_url text not null,
  joined_at timestamp with time zone default now() not null,
  score int default 0 not null
);

comment on table profiles is 'User profiles, auto-created on first login';

-- ============================================================================
-- POSTS TABLE
-- ============================================================================
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

-- ============================================================================
-- VOTES TABLE
-- ============================================================================
create table votes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  post_id uuid references posts(id) on delete cascade not null,
  type text check (type in ('up', 'down')) not null,
  created_at timestamp with time zone default now() not null,
  unique(user_id, post_id)
);

comment on table votes is 'User votes on posts - one per user per post';

-- ============================================================================
-- COMMENTS TABLE
-- ============================================================================
create table comments (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references posts(id) on delete cascade not null,
  user_id uuid references profiles(id) on delete cascade not null,
  body text not null,
  created_at timestamp with time zone default now() not null
);

comment on table comments is 'Comments on posts';

-- ============================================================================
-- INDEXES
-- ============================================================================
-- Posts indexes
create index idx_posts_author_id on posts(author_id);
create index idx_posts_created_at on posts(created_at desc);
create index idx_posts_upvotes on posts(upvotes desc);

-- Votes indexes
create index idx_votes_post_id on votes(post_id);
-- Note: idx_votes_user_id dropped - covered by unique constraint

-- Comments indexes
create index idx_comments_post_id on comments(post_id);
create index idx_comments_user_id on comments(user_id);
