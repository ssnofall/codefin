-- MANUAL FIX SQL - Run this in your Supabase SQL Editor to fix the current database
-- This fixes the missing/broken trending_tags materialized view that's causing
-- post creation and voting to fail

-- Step 1: Create the materialized view if it doesn't exist
create materialized view if not exists trending_tags as
select 
  unnest(tags) as tag,
  count(*) as count
from posts
where created_at >= now() - interval '30 days'
group by tag
order by count desc;

-- Step 2: Create required indexes
-- NOTE: The unique index is REQUIRED for REFRESH MATERIALIZED VIEW CONCURRENTLY
create unique index if not exists idx_trending_tags_unique_tag on trending_tags(tag);
create index if not exists idx_trending_tags_count on trending_tags(count desc);
create index if not exists idx_trending_tags_tag on trending_tags(tag);

-- Step 3: Create the refresh function with error handling
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

-- Step 4: Create the trigger (if it doesn't exist)
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

-- Step 5: Initial population with regular refresh
-- We use regular refresh here because concurrent refresh requires the view
-- to have been refreshed at least once before
refresh materialized view trending_tags;

-- Step 6: Verify everything works
select 'Setup complete!' as status;
select count(*) as tag_count from trending_tags;
