# Stackd MVP - Deployment Guide

## Prerequisites

- Supabase account (free tier)
- Vercel account (free tier)
- GitHub account

## Step 1: Database Setup

1. Go to https://supabase.com and create a new project
2. Once created, go to the SQL Editor
3. Run the contents of `supabase/schema.sql`
4. Run the contents of `supabase/rls.sql`

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
   - Project URL (NEXT_PUBLIC_SUPABASE_URL)
   - Project API keys > anon public (NEXT_PUBLIC_SUPABASE_ANON_KEY)

## Step 5: Deploy to Vercel

1. Push your code to GitHub
2. Go to https://vercel.com
3. Click "Add New Project"
4. Import your GitHub repository
5. Configure environment variables:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - NEXT_PUBLIC_SITE_URL (your Vercel deployment URL)
6. Click "Deploy"

## Step 6: Update GitHub OAuth Callback

After deployment:

1. Go back to your GitHub OAuth App settings
2. Update the Authorization callback URL to your production URL:
   `https://yourdomain.vercel.app/auth/callback`
3. Save

## Step 7: Update Supabase Site URL

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

## Troubleshooting

**OAuth callback fails:**
- Check that callback URLs match exactly in GitHub OAuth settings and Supabase
- Ensure NEXT_PUBLIC_SITE_URL is set correctly

**Database errors:**
- Verify RLS policies are applied
- Check that tables were created correctly

**Vote not working:**
- Ensure user is authenticated
- Check browser console for errors
