# Stackd - Deployment Guide

Complete guide for deploying Stackd to production on Vercel with full security hardening.

## Prerequisites

- Supabase account (free tier)
- Vercel account (free tier)
- GitHub account
- Upstash account (free tier - for Redis rate limiting)

## Pre-Deployment Security Checklist

Before deploying, complete all items below:

### 1. Environment Variables Setup

Copy `.env.example` to `.env.local` and fill in:

```env
# Supabase Configuration (Required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Site Configuration (Required)
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# Upstash Redis (Required for Production Rate Limiting)
UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-redis-token
```

### 2. Database Security Setup

1. **Create Supabase Project**
   - Go to https://supabase.com and create a new project
   - Choose a strong database password
   - Note: Store this password securely

2. **Run SQL Setup Scripts** (in order):
   ```sql
   -- 1. Schema (tables and indexes)
   -- Run: supabase/00_schema.sql

   -- 2. Row Level Security policies
   -- Run: supabase/01_rls.sql

   -- 3. Database functions
   -- Run: supabase/02_functions.sql

   -- 4. Triggers
   -- Run: supabase/03_triggers.sql

   -- 5. Service role permissions
   -- Run: supabase/04_service_role_permissions.sql
   ```

3. **Verify RLS is Enabled**:
   ```sql
   SELECT tablename, rowsecurity 
   FROM pg_tables 
   WHERE schemaname = 'public';
   -- All tables should show 'true' for rowsecurity
   ```

### 3. GitHub OAuth Configuration

1. **Create OAuth App**:
   - Go to GitHub > Settings > Developer Settings > OAuth Apps
   - Click "New OAuth App"
   - Fill in:
     - **Application name**: Stackd
     - **Homepage URL**: https://your-domain.com
     - **Authorization callback URL**: https://your-domain.com/auth/callback
   - Click "Register application"

2. **Get Credentials**:
   - Copy **Client ID**
   - Click "Generate a new client secret"
   - Copy the **Client Secret** (shown only once!)

3. **Configure in Supabase**:
   - Go to Supabase > Authentication > Providers > GitHub
   - Enable GitHub
   - Paste Client ID and Client Secret
   - Save

### 4. Upstash Redis Setup (Required for Production)

1. **Create Redis Database**:
   - Go to https://upstash.com and sign up
   - Click "Create Database"
   - Choose region closest to your users
   - Select "Global" for multi-region support (recommended)

2. **Get REST API Credentials**:
   - Go to your database details
   - Click "REST API" tab
   - Copy:
     - **UPSTASH_REDIS_REST_URL**
     - **UPSTASH_REDIS_REST_TOKEN**

3. **Test Connection**:
   ```bash
   curl $UPSTASH_REDIS_REST_URL/ping \
     -H "Authorization: Bearer $UPSTASH_REDIS_REST_TOKEN"
   # Should return: "PONG"
   ```

### 5. Key Rotation (CRITICAL)

**Rotate Supabase Keys Before Production:**

1. Go to Supabase > Project Settings > API
2. Click "Generate new API keys"
3. Update environment variables with new keys
4. **Never commit old keys to git**

### 6. Vercel Deployment

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Security hardening for production"
   git push origin main
   ```

2. **Create Vercel Project**:
   - Go to https://vercel.com
   - Click "Add New Project"
   - Import your GitHub repository
   - Framework Preset: Next.js

3. **Configure Environment Variables**:
   Add these to Vercel (Production, Preview, and Development):
   ```
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   SUPABASE_SERVICE_ROLE_KEY
   NEXT_PUBLIC_SITE_URL
   UPSTASH_REDIS_REST_URL
   UPSTASH_REDIS_REST_TOKEN
   ```

4. **Deploy**:
   - Click "Deploy"
   - Wait for build to complete

### 7. Post-Deployment Configuration

1. **Update GitHub OAuth Callback**:
   - Go to GitHub OAuth App settings
   - Update Authorization callback URL to your production URL
   - Save

2. **Update Supabase Site URL**:
   - Go to Supabase > Authentication > URL Configuration
   - Set Site URL to: https://your-domain.com
   - Add to Redirect URLs: https://your-domain.com/auth/callback
   - Save

3. **Configure Custom Domain (Optional)**:
   - In Vercel: Project > Settings > Domains
   - Add your custom domain
   - Update DNS records as instructed

## Security Verification

After deployment, verify all security measures are working:

### 1. Check Security Headers

Visit https://securityheaders.com and scan your domain:
- **Expected Grade**: A or A+
- **Required Headers**:
  - Content-Security-Policy
  - Strict-Transport-Security
  - X-Frame-Options: DENY
  - X-Content-Type-Options: nosniff
  - Referrer-Policy

### 2. Test Rate Limiting

```bash
# Test that rate limiting works (should block after limit)
for i in {1..10}; do
  curl -X POST https://your-domain.com/api/vote \
    -H "Content-Type: application/json" \
    -d '{"postId":"test","type":"up"}'
done
```

### 3. Verify CSP Nonce

Check that CSP header includes a nonce:
```bash
curl -I https://your-domain.com | grep -i content-security-policy
# Should see: script-src 'self' 'nonce-xxx' 'strict-dynamic'
```

### 4. Test Authentication Flow

- Sign in with GitHub
- Verify cookies are httpOnly and Secure
- Check that session persists correctly

### 5. Verify Error Sanitization

Trigger an error (e.g., try to create post without auth):
- Error message should be generic: "Failed to create post. Please try again."
- Should NOT contain SQL details or internal error messages

## Troubleshooting

### Rate Limiting Not Working

**Symptom**: Rate limits reset on every deployment

**Solution**:
- Verify `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are set
- Check Vercel logs for Redis connection errors
- Ensure Redis database is in "Active" state in Upstash

### CSP Violations

**Symptom**: Console shows CSP errors

**Solution**:
- Check that nonce is being generated in middleware.ts
- Verify script tags include nonce attribute
- For Shiki: Ensure CSS classes are being applied (check globals.css)

### OAuth Callback Fails

**Symptom**: "Authentication failed" after GitHub sign-in

**Solution**:
- Check that callback URL in GitHub OAuth settings matches exactly
- Verify `NEXT_PUBLIC_SITE_URL` includes https://
- Ensure Supabase > Auth > URL Configuration has correct site URL

### Database Connection Errors

**Symptom**: "Failed to fetch" or timeout errors

**Solution**:
- Verify Supabase project is not paused
- Check that RLS policies were applied correctly
- Ensure you're using anon key (not service role) for client-side

## Maintenance

### Regular Security Tasks

**Weekly**:
- Review Vercel deployment logs for errors
- Check Upstash Redis usage (free tier: 10,000 req/day)

**Monthly**:
- Review and rotate API keys if needed
- Update dependencies: `npm update`
- Check securityheaders.com for grade changes

**Quarterly**:
- Full security audit
- Review access logs for suspicious activity
- Test disaster recovery (database backup restore)

### Monitoring

Set up monitoring for:
- Failed authentication attempts
- Rate limit triggers
- Database connection errors
- CSP violations (via report-uri)

## Support

If you encounter issues:

1. Check logs in Vercel Dashboard
2. Review [SECURITY.md](./SECURITY.md) for vulnerability reporting
3. Open an issue on GitHub (do not include sensitive data)

---

**Last Updated**: 2026-02-16  
**Stackd Version**: 1.0.0
