# Fix Trending Topics Widget - Implementation Plan

## Problem
The trending topics widget shows "1 Post" for all tags instead of actual aggregated counts from the database.

## Root Cause
The JavaScript fallback aggregation in `getTrendingTags()` is not properly counting tags due to:
1. Query limits restricting data
2. Potential type inference issues with the tags array

## Solution
Implement Option B: Create a PostgreSQL Materialized View

### Implementation Steps

1. **Create SQL File** (`supabase/trending_tags_view.sql`)
   - Define materialized view to aggregate tags
   - Create indexes for performance
   - Add refresh function
   - Include auto-refresh cron job (optional)

2. **Execute in Supabase**
   - Run SQL in Supabase SQL Editor
   - Verify view creation
   - Test data aggregation

3. **Update Application (Optional)**
   - Regenerate Supabase types if needed
   - Verify `getTrendingTags()` uses the view

### SQL to Execute

```sql
-- Create materialized view
CREATE MATERIALIZED VIEW IF NOT EXISTS trending_tags AS
SELECT 
  unnest(tags) as tag,
  COUNT(*) as count
FROM posts
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY tag
ORDER BY count DESC;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_trending_tags_count ON trending_tags(count DESC);

-- Create refresh function
CREATE OR REPLACE FUNCTION refresh_trending_tags()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY trending_tags;
END;
$$ LANGUAGE plpgsql;

-- Initial refresh
REFRESH MATERIALIZED VIEW trending_tags;
```

### Benefits
- Fast queries (pre-aggregated at database level)
- Scales to millions of posts
- Uses PostgreSQL's efficient `unnest` function
- Existing code automatically uses the view

### Notes
- Data refreshes manually or via cron job
- View contains last 30 days of data
- CONCURRENTLY option allows reads during refresh
