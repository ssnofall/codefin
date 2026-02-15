-- Phase 2 Optimization: Materialized View for Trending Tags
-- Run this in your Supabase SQL Editor for much faster trending tags
-- 
-- This creates a pre-aggregated view that counts tags from posts in the last 30 days
-- Includes auto-refresh trigger to keep data current when posts are created/updated/deleted

-- ============================================
-- STEP 1: Create Materialized View
-- ============================================
-- Pre-aggregates tag counts from posts in the last 30 days

CREATE MATERIALIZED VIEW IF NOT EXISTS trending_tags AS
SELECT 
  unnest(tags) as tag,
  COUNT(*) as count
FROM posts
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY tag
ORDER BY count DESC;

-- ============================================
-- STEP 2: Create Indexes for Performance
-- ============================================

CREATE INDEX IF NOT EXISTS idx_trending_tags_count ON trending_tags(count DESC);
CREATE INDEX IF NOT EXISTS idx_trending_tags_tag ON trending_tags(tag);

-- ============================================
-- STEP 3: Create Manual Refresh Function
-- ============================================
-- Use this function to manually refresh the view if needed

CREATE OR REPLACE FUNCTION refresh_trending_tags()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY trending_tags;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- STEP 4: Create Auto-Refresh Trigger (IMPORTANT)
-- ============================================
-- This trigger automatically refreshes the view whenever posts change
-- This ensures trending tags are always up-to-date without manual intervention

-- Drop existing triggers/functions if they exist (for idempotency)
DROP TRIGGER IF EXISTS refresh_trending_tags_trigger ON posts;
DROP TRIGGER IF EXISTS refresh_trending_tags_on_change ON posts;
DROP FUNCTION IF EXISTS refresh_trending_tags_on_post_change();

-- Create the auto-refresh function
CREATE OR REPLACE FUNCTION refresh_trending_tags_trigger()
RETURNS TRIGGER AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY trending_tags;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger on posts table
CREATE TRIGGER refresh_trending_tags_on_change
AFTER INSERT OR UPDATE OR DELETE ON posts
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_trending_tags_trigger();

-- ============================================
-- STEP 5: Initial Data Population
-- ============================================
-- Populate the view with existing data immediately

REFRESH MATERIALIZED VIEW trending_tags;

-- ============================================
-- STEP 6: Verification
-- ============================================
-- Verify the view is working correctly

-- SELECT * FROM trending_tags ORDER BY count DESC LIMIT 10;

-- ============================================
-- NOTES
-- ============================================
-- 
-- The materialized view stores pre-aggregated data for fast queries
-- The auto-refresh trigger ensures data stays current (runs on every post change)
-- CONCURRENTLY option allows reads during refresh without blocking
-- View contains only posts from the last 30 days
-- 
-- If you need to disable auto-refresh temporarily:
--   DROP TRIGGER refresh_trending_tags_on_change ON posts;
-- 
-- To manually refresh at any time:
--   SELECT refresh_trending_tags();
--   OR
--   REFRESH MATERIALIZED VIEW CONCURRENTLY trending_tags;

-- ============================================
-- OPTIONAL: Cron Job for Periodic Refresh
-- ============================================
-- Uncomment if you prefer periodic refresh instead of trigger-based
-- (Not needed if using the trigger above)

-- SELECT cron.schedule('refresh-trending-tags', '*/5 * * * *', 'SELECT refresh_trending_tags()');
