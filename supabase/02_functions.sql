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
-- This function can be called manually to refresh the view
create or replace function public.refresh_trending_tags()
returns void as $$
begin
  -- Use concurrent refresh to avoid locking the view during refresh
  -- This requires the unique index idx_trending_tags_unique_tag
  refresh materialized view concurrently trending_tags;
exception
  when others then
    -- Fallback to regular refresh if concurrent fails
    -- This can happen on first refresh or if unique index is missing
    refresh materialized view trending_tags;
end;
$$ language plpgsql set search_path = pg_catalog;

-- Auto-refresh trending tags on post change
-- This trigger is called after any post INSERT/UPDATE/DELETE
-- CRITICAL: Errors here will cause post operations to fail
create or replace function public.refresh_trending_tags_trigger()
returns trigger as $$
begin
  -- Attempt concurrent refresh first (non-blocking)
  -- If that fails, fall back to regular refresh
  begin
    refresh materialized view concurrently trending_tags;
  exception
    when others then
      -- Fallback to regular refresh if concurrent fails
      -- This ensures posts can still be created even if the view has issues
      refresh materialized view trending_tags;
  end;
  return null;
end;
$$ language plpgsql set search_path = pg_catalog;
