-- Tables
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  avatar_url text not null,
  joined_at timestamp with time zone default now() not null,
  score int default 0 not null
);

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

create table votes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  post_id uuid references posts(id) on delete cascade not null,
  type text check (type in ('up', 'down')) not null,
  created_at timestamp with time zone default now() not null,
  unique(user_id, post_id)
);

create table comments (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references posts(id) on delete cascade not null,
  user_id uuid references profiles(id) on delete cascade not null,
  body text not null,
  created_at timestamp with time zone default now() not null
);

-- Indexes
create index idx_posts_author_id on posts(author_id);
create index idx_posts_created_at on posts(created_at desc);
create index idx_posts_upvotes on posts(upvotes desc);
create index idx_votes_post_id on votes(post_id);
create index idx_comments_post_id on comments(post_id);
create index idx_comments_user_id on comments(user_id);
