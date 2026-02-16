# Stackd MVP - Deployment Guide

## Prerequisites

- Supabase account (free tier)
- Vercel account (free tier)
- GitHub account

## Step 1: Database Setup (CRITICAL - DO THIS FIRST!)

**⚠️ COMMON ERROR:** If you see `relation "posts" does not exist`, you haven't run the database setup!

### Option A: Quick Setup (Recommended for new projects)

Run the complete setup in one go:

1. Go to https://supabase.com and create a new project
2. Once created, go to the **SQL Editor**
3. Click **"New Query"**
4. Open `supabase/complete_setup.sql` from this repo
5. Copy the entire contents and paste into the SQL Editor
6. Click **"Run"**
7. Check the output - you should see:
   - `Database setup complete!`
   - Table count, trigger count, and materialized view count

### Option B: Step-by-Step Setup

If you prefer to run files individually, run them in this exact order:

1. `supabase/00_schema.sql` - Creates tables and indexes
2. `supabase/01_rls.sql` - Sets up Row Level Security
3. `supabase/02_functions.sql` - Creates database functions
4. `supabase/03_triggers.sql` - Creates triggers and materialized view

### ⚠️ Critical: Materialized View

The `trending_tags` materialized view is **REQUIRED** for the app to work. If it's missing or broken:
- Post creation will fail
- Voting will fail
- The trending page won't work

If you need to fix it manually, run:
```sql
-- Fix trending_tags materialized view
refresh materialized view trending_tags;
```

## Step 2: GitHub OAuth Setup

1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Click "New OAuth App"
3. Fill in:
   - Application name: Stackd
   - Homepage URL: http://localhost:3000 (for dev) or your Vercel URL
   - Authorization callback URL: http://localhost:3000/auth/callback (for dev) or https://yourdomain.vercel.app/auth/callback
4. Click "Register application"
5. Copy the Client ID
6. Click "Generate a new client secret" and copy it

## Step 3: Configure Supabase Auth

1. In Supabase, go to Authentication > Providers
2. Enable GitHub
3. Paste your GitHub Client ID and Client Secret
4. Save

## Step 4: Get Supabase Credentials

1. In Supabase, go to Project Settings > API
2. Copy:
   - Project URL (`NEXT_PUBLIC_SUPABASE_URL`)
   - Project API keys > anon public (`NEXT_PUBLIC_SUPABASE_ANON_KEY`)
3. Also copy the **service role key** (keep this secret!): Project API keys > service_role (`SUPABASE_SERVICE_ROLE_KEY`)
   - This is required for rate limiting to work across Vercel instances
   - Without it, rate limiting will be disabled (graceful degradation)

## Step 5: Environment Variables

Create `.env.local` file for local development:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Step 6: Deploy to Vercel

1. Push your code to GitHub
2. Go to https://vercel.com
3. Click "Add New Project"
4. Import your GitHub repository
5. Configure environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL` (your Vercel deployment URL)
   - `SUPABASE_SERVICE_ROLE_KEY` (for rate limiting)
6. Click "Deploy"

## Step 7: Update GitHub OAuth Callback

After deployment:

1. Go back to your GitHub OAuth App settings
2. Update the Authorization callback URL to your production URL:
   `https://yourdomain.vercel.app/auth/callback`
3. Save

## Step 8: Update Supabase Site URL

1. In Supabase, go to Authentication > URL Configuration
2. Set Site URL to your production URL
3. Add your production URL to Redirect URLs
4. Save

## Verification

Visit your deployed URL and test:
1. Sign in with GitHub
2. Create a post
3. Vote on posts
4. Add comments
5. View profiles
6. Check the trending tags on the discover page

## Troubleshooting

### "Invalid API key" Error

**Error:** `Rate limit fetch error: Invalid API key`

**Cause:** Your `SUPABASE_SERVICE_ROLE_KEY` is wrong or missing

**Solution:**
1. Go to Supabase Dashboard > Project Settings > API
2. Copy the **service_role** key (NOT the anon key!)
3. Add it to your `.env.local` file:
   ```
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   ```
4. Restart your dev server or redeploy to Vercel

**Note:** The app will still work without this key - rate limiting just gets disabled (graceful degradation).

### "relation 'posts' does not exist" Error

**Error:** `Error upserting vote: relation "posts" does not exist`

**Cause:** You haven't run the database setup SQL files

**Solution:**
1. Go to Supabase Dashboard > SQL Editor
2. Run `supabase/complete_setup.sql` (or all 4 SQL files in order)
3. Verify tables were created:
   ```sql
   select tablename from pg_tables where schemaname = 'public';
   ```
   You should see: `profiles`, `posts`, `votes`, `comments`, `rate_limits`

### OAuth callback fails
- Check that callback URLs match exactly in GitHub OAuth settings and Supabase
- Ensure NEXT_PUBLIC_SITE_URL is set correctly

### Database errors
- Verify all 4 SQL files were run in the correct order (00, 01, 02, 03)
- Check that the `trending_tags` materialized view exists:
  ```sql
  select * from trending_tags limit 1;
  ```
- Check that the `rate_limits` table exists:
  ```sql
  select * from rate_limits limit 1;
  ```

### Post creation or voting fails
- **Most likely cause:** The `trending_tags` materialized view is missing or broken
- Check browser console for error messages
- Try refreshing the materialized view manually in SQL Editor:
  ```sql
  refresh materialized view trending_tags;
  ```

### Rate limiting issues
- If you see `[Rate Limit] Service role key not configured` in logs, add `SUPABASE_SERVICE_ROLE_KEY` to your environment variables
- Rate limiting gracefully degrades (allows all requests) if the service role key is missing

### Comments work but posts/voting don't
- This is a clear sign the `trending_tags` materialized view trigger is failing
- Run `supabase/03_triggers.sql` again in the SQL Editor
