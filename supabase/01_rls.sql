-- Profiles
alter table profiles enable row level security;

drop policy if exists "Profiles are viewable by everyone" on profiles;
create policy "Profiles are viewable by everyone"
  on profiles for select
  using (true);

drop policy if exists "Users can update own profile" on profiles;
create policy "Users can update own profile"
  on profiles for update
  using ((select auth.uid()) = id);

-- Posts
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

-- Votes
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

-- Comments
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
-- Note: RLS is not strictly required since this table is only accessed
-- server-side via service role client, which bypasses RLS
alter table rate_limits enable row level security;

create index idx_rate_limits_identifier on rate_limits(identifier, action);
create index idx_rate_limits_window on rate_limits(window_start);
