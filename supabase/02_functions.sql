-- ============================================================================
-- Stackd Database Functions
-- ============================================================================
-- All functions with secure search_path setting
-- Run this third: psql -f supabase/02_functions.sql
-- ============================================================================

-- ============================================================================
-- PROFILE AUTO-CREATION FUNCTION
-- ============================================================================
-- Creates a user profile automatically when they sign up
-- Security: Uses search_path = pg_catalog to prevent privilege escalation
-- ============================================================================
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

-- ============================================================================
-- VOTE SCORE UPDATE FUNCTION
-- ============================================================================
-- Automatically updates post upvotes/downvotes and author score when votes change
-- Security: Uses search_path = pg_catalog to prevent privilege escalation
-- ============================================================================
create or replace function public.update_post_score()
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
$$ language plpgsql security definer set search_path = pg_catalog;

-- ============================================================================
-- TRENDING TAGS MANUAL REFRESH FUNCTION
-- ============================================================================
-- Manually refresh the trending_tags materialized view
-- Security: Uses search_path = pg_catalog to prevent privilege escalation
-- ============================================================================
create or replace function public.refresh_trending_tags()
returns void as $$
begin
  refresh materialized view concurrently trending_tags;
end;
$$ language plpgsql set search_path = pg_catalog;

-- ============================================================================
-- TRENDING TAGS AUTO-REFRESH TRIGGER FUNCTION
-- ============================================================================
-- Automatically refreshes trending_tags materialized view when posts change
-- Security: Uses search_path = pg_catalog to prevent privilege escalation
-- ============================================================================
create or replace function public.refresh_trending_tags_trigger()
returns trigger as $$
begin
  refresh materialized view concurrently trending_tags;
  return null;
end;
$$ language plpgsql set search_path = pg_catalog;
