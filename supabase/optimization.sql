-- Phase 2 Optimization: Materialized View for Trending Tags
-- Run this in your Supabase SQL Editor for much faster trending tags

-- Create materialized view for trending tags
CREATE MATERIALIZED VIEW IF NOT EXISTS trending_tags AS
SELECT 
  unnest(tags) as tag,
  COUNT(*) as count
FROM posts
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY tag
ORDER BY count DESC;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_trending_tags_count ON trending_tags(count DESC);

-- Create function to refresh the materialized view
CREATE OR REPLACE FUNCTION refresh_trending_tags()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW trending_tags;
END;
$$ LANGUAGE plpgsql;

-- Optional: Set up a cron job to refresh every 5 minutes
-- Uncomment and run if you have pg_cron enabled:
-- SELECT cron.schedule('refresh-trending-tags', '*/5 * * * *', 'SELECT refresh_trending_tags()');

-- To manually refresh the view after creating posts:
-- SELECT refresh_trending_tags();
