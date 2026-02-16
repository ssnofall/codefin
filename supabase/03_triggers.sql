-- Auto-create profile on user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Update scores on vote change
create trigger on_vote_change
  after insert or update or delete on votes
  for each row execute procedure update_post_score();

-- Trending tags materialized view
create materialized view trending_tags as
select 
  unnest(tags) as tag,
  count(*) as count
from posts
where created_at >= now() - interval '30 days'
group by tag
order by count desc;

create index idx_trending_tags_count on trending_tags(count desc);
create index idx_trending_tags_tag on trending_tags(tag);
create unique index idx_trending_tags_unique_tag on trending_tags(tag);

-- Auto-refresh trending tags on post change
create trigger refresh_trending_tags_on_change
  after insert or update or delete on posts
  for each statement
  execute function refresh_trending_tags_trigger();

-- Initial population
refresh materialized view concurrently trending_tags;
