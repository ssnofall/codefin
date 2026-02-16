-- Auto-create profile on user signup
create trigger if not exists on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Update scores on vote change
create trigger if not exists on_vote_change
  after insert or update or delete on votes
  for each row execute procedure public.update_post_score();

-- Trending tags materialized view
-- This view pre-aggregates tag counts from the last 30 days for fast queries
-- Note: Must be created AFTER the posts table exists (in 00_schema.sql)
create materialized view if not exists trending_tags as
select 
  unnest(tags) as tag,
  count(*) as count
from posts
where created_at >= now() - interval '30 days'
group by tag
order by count desc;

-- Required indexes for the materialized view
-- NOTE: The unique index is REQUIRED for REFRESH MATERIALIZED VIEW CONCURRENTLY
-- Without it, concurrent refresh will fail, causing post creation/voting to fail
create unique index if not exists idx_trending_tags_unique_tag on trending_tags(tag);
create index if not exists idx_trending_tags_count on trending_tags(count desc);
create index if not exists idx_trending_tags_tag on trending_tags(tag);

-- Auto-refresh trending tags on post change
-- This trigger ensures the materialized view stays up to date
-- CRITICAL: If this trigger fails, post creation and voting will fail
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

-- Initial population with regular refresh (not concurrent)
-- We use regular refresh here because concurrent refresh requires the view
-- to have been refreshed at least once before
refresh materialized view trending_tags;
