-- ============================================================================
-- Stackd Triggers and Materialized Views
-- ============================================================================
-- All triggers and the trending_tags materialized view
-- Run this fourth: psql -f supabase/03_triggers.sql
-- ============================================================================

-- ============================================================================
-- AUTH: AUTO-CREATE PROFILE ON SIGNUP
-- ============================================================================
-- Trigger that calls handle_new_user when a new user signs up
-- ============================================================================
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================================
-- VOTES: AUTO-UPDATE SCORES
-- ============================================================================
-- Trigger that updates post and author scores when votes change
-- ============================================================================
drop trigger if exists on_vote_change on votes;
create trigger on_vote_change
  after insert or update or delete on votes
  for each row execute procedure update_post_score();

-- ============================================================================
-- TRENDING TAGS: MATERIALIZED VIEW
-- ============================================================================
-- Pre-aggregated view of tag counts from posts in the last 30 days
-- Provides O(1) query performance vs O(n) scanning
-- ============================================================================
drop materialized view if exists trending_tags;
create materialized view trending_tags as
select 
  unnest(tags) as tag,
  count(*) as count
from posts
where created_at >= now() - interval '30 days'
group by tag
order by count desc;

-- Index for fast sorting by count
create index if not exists idx_trending_tags_count on trending_tags(count desc);

-- Index for fast lookups by tag
create index if not exists idx_trending_tags_tag on trending_tags(tag);

-- Unique index required for CONCURRENTLY refresh
create unique index if not exists idx_trending_tags_unique_tag on trending_tags(tag);

-- ============================================================================
-- TRENDING TAGS: AUTO-REFRESH TRIGGER
-- ============================================================================
-- Automatically refresh materialized view when posts change
-- ============================================================================
drop trigger if exists refresh_trending_tags_on_change on posts;
create trigger refresh_trending_tags_on_change
  after insert or update or delete on posts
  for each statement
  execute function refresh_trending_tags_trigger();

-- ============================================================================
-- INITIAL DATA POPULATION
-- ============================================================================
-- Populate the materialized view with existing data
-- ============================================================================
refresh materialized view concurrently trending_tags;

-- ============================================================================
-- VERIFICATION QUERIES (uncomment to test)
-- ============================================================================
-- Select * from trending_tags order by count desc limit 10;
-- Select * from profiles limit 5;
-- Select * from posts limit 5;
