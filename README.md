# Codefin

Share Code. Get Seen.

A modern platform for developers to share code snippets, get feedback, and build their reputation.

## Tech Stack

- **Frontend**: Next.js 16+ (App Router), TypeScript, TailwindCSS, Shadcn UI
- **Backend**: Supabase (PostgreSQL + Auth + RLS)
- **Auth**: GitHub OAuth via Supabase
- **Hosting**: Vercel (Free Tier compatible)
- **Syntax Highlighting**: Shiki

## Features

- GitHub OAuth authentication with auto-profile creation
- Create posts with title, code, language, file name, and tags (max 5)
- Rich feed with sorting (Hot, New, Top, Trending)
- Real-time voting system (upvote/downvote)
- Comments with delete functionality
- Tag filtering and trending topics
- User profiles with reputation scores
- Syntax highlighting for 20+ programming languages
- Responsive design (mobile, tablet, desktop)
- Dark/light theme support
- Rate limiting to prevent spam

## Prerequisites

- Node.js 18+ 
- npm or yarn
- GitHub account (for OAuth)
- Supabase account (free tier works)
- Vercel account (for deployment)

## Project Structure

```
codefin/
├── app/
│   ├── auth/                  # Authentication routes
│   │   ├── callback/          # OAuth callback handler
│   │   ├── login/             # Login page
│   │   └── logout/            # Logout handler
│   ├── components/            # React components
│   │   ├── editor/            # Code editor components
│   │   ├── feed/              # Feed components
│   │   ├── layout/            # Layout components (Header, Sidebars, etc.)
│   │   ├── post/              # Post components
│   │   ├── profile/           # Profile components
│   │   ├── theme/             # Theme components
│   │   └── ui/                # Reusable UI components (shadcn)
│   ├── lib/
│   │   ├── actions/           # Server actions (posts, comments, votes, auth)
│   │   ├── supabase/          # Supabase clients and types
│   │   └── utils/             # Utilities (validation, rate limiting, formatters)
│   ├── feed/                  # Feed page
│   ├── new/                   # New posts page
│   ├── top/                   # Top posts page
│   ├── trending/              # Trending posts page
│   ├── post/[id]/             # Post detail page
│   ├── profile/[username]/    # Profile page
│   ├── create/                # Create post page
│   ├── settings/              # User settings page
│   ├── discover/              # Discover page
│   ├── privacy/               # Privacy policy
│   ├── terms/                 # Terms of service
│   ├── error.tsx              # Error boundary
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   └── loading.tsx            # Loading states
├── components/ui/             # shadcn UI components
├── public/                    # Static assets
├── supabase/
│   ├── 00_schema.sql          # Database schema (tables, indexes)
│   ├── 01_rls.sql             # Row Level Security policies
│   ├── 02_functions.sql       # Database functions
│   ├── 03_triggers.sql        # Triggers
│   └── 04_service_role_permissions.sql  # Service role grants
├── middleware.ts              # Auth middleware
├── next.config.ts             # Next.js configuration
└── package.json
```

## Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/codefin.git
cd codefin
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note your project URL and anon key (Settings > API)
3. Get your service role key (Settings > API > service_role key)

### 4. Configure Environment Variables

Create `.env.local` in the project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Important**: Never commit `.env.local` to git. It's already in `.gitignore`.

### 5. Set Up Database

Run the SQL files in order in the Supabase SQL Editor:

**Step 1: Create Schema (Tables & Indexes)**

1. Open `supabase/00_schema.sql`
2. Copy the contents and paste into SQL Editor
3. Click "Run"

**Step 2: Apply RLS Policies (Security)**

1. Open `supabase/01_rls.sql`
2. Copy the contents and paste into SQL Editor
3. Click "Run"

**Step 3: Create Functions**

1. Open `supabase/02_functions.sql`
2. Copy the contents and paste into SQL Editor
3. Click "Run"

**Step 4: Create Triggers**

1. Open `supabase/03_triggers.sql`
2. Copy the contents and paste into SQL Editor
3. Click "Run"

**Step 5: Verify Setup**

Run this query in SQL Editor to verify:
```sql
-- Check if tables exist
SELECT tablename FROM pg_tables WHERE schemaname = 'public';
```

### 6. Set Up GitHub OAuth

1. Go to GitHub > Settings > Developer Settings > OAuth Apps > New OAuth App
2. Fill in:
    - Application name: Codefin (or your app name)
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3000/auth/callback`
3. Click "Register application"
4. Copy the Client ID
5. Generate a new Client Secret
6. Go to Supabase Dashboard > Authentication > Providers > GitHub
7. Enable GitHub provider
8. Paste in your Client ID and Client Secret
9. Save

### 7. Enable Password Security (Recommended)

Enable leaked password protection to prevent users from using compromised passwords:

1. Go to Supabase Dashboard > Authentication > Providers > Email
2. Enable **"Enable leaked credentials protection"**
3. Save

Alternatively, use the Supabase CLI:
```bash
supabase auth password-leaked-protection enable
```

### 8. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 9. Verify Everything Works

1. Click "Sign In" and authenticate with GitHub
2. Create a test post with tags
3. Vote on a post
4. Add a comment

## Deployment to Vercel

### 1. Push to GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. Framework Preset: Next.js
5. Click "Deploy"

**Note**: The first deploy will fail because environment variables aren't set yet.

### 3. Configure Environment Variables

In Vercel Dashboard > Your Project > Settings > Environment Variables, add:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=https://your-project.vercel.app
```

**Important**: 
- Replace `your-project` with your actual Vercel domain
- Make sure to add these to Production, Preview, and Development environments
- Click "Save" after adding all variables

### 4. Update GitHub OAuth Callback URL

1. Go to GitHub > Settings > Developer Settings > OAuth Apps > Your App
2. Update Authorization callback URL to: `https://your-project.vercel.app/auth/callback`
3. Save

### 5. Update Supabase Site URL

1. Go to Supabase Dashboard > Authentication > URL Configuration
2. Set Site URL to: `https://your-project.vercel.app`
3. Add `https://your-project.vercel.app/auth/callback` to Redirect URLs
4. Save

### 6. Redeploy

1. Go to Vercel Dashboard > Your Project
2. Click "Redeploy" (or push a new commit)
3. Wait for build to complete

### 7. Verify Production Deployment

1. Visit your Vercel URL
2. Test authentication
3. Create a post
4. Verify trending topics show real data

## Database Maintenance

### Check Database Status

```sql
-- View counts
SELECT 
  (SELECT COUNT(*) FROM posts) as post_count,
  (SELECT COUNT(*) FROM profiles) as user_count,
  (SELECT COUNT(*) FROM comments) as comment_count,
  (SELECT COUNT(*) FROM votes) as vote_count;
```

## Troubleshooting

### Build Fails

**Problem**: `npm run build` fails

**Solution**:
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Authentication Not Working

**Problem**: Can't sign in with GitHub

**Solution**:
1. Verify OAuth App callback URL matches your site URL exactly
2. Check Supabase Auth > Providers > GitHub is enabled
3. Ensure Client ID and Secret are correct
4. Check browser console for errors

### Database Connection Errors

**Problem**: "Failed to fetch" or connection errors

**Solution**:
1. Verify environment variables are set correctly
2. Check Supabase project is active (not paused)
3. Ensure RLS policies are set up (run `supabase/01_rls.sql`)
4. Check if you're using the correct anon key (not service role key for client)

### Account Deletion Fails

**Problem**: "Service role key not configured" error

**Solution**:
1. Add `SUPABASE_SERVICE_ROLE_KEY` to environment variables
2. Get it from Supabase Dashboard > Settings > API > service_role key
3. Never expose this key in client-side code (it's only used server-side)

## Environment Variables Reference

| Variable | Required | Description | Where to Get |
|----------|----------|-------------|--------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Your Supabase project URL | Supabase Dashboard > Settings > API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Public API key for client | Supabase Dashboard > Settings > API |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Secret key for admin operations | Supabase Dashboard > Settings > API |
| `NEXT_PUBLIC_SITE_URL` | Yes | Your site's URL | `http://localhost:3000` for dev, Vercel URL for prod |

## Security Features

Codefin implements comprehensive security measures for production deployment:

### Authentication & Authorization
- ✅ **Row Level Security (RLS)** - All tables protected with granular policies
- ✅ **GitHub OAuth** - Secure authentication via Supabase Auth
- ✅ **Session Management** - Secure httpOnly cookies with automatic refresh
- ✅ **Profile Auto-Creation** - Secure user onboarding with defaults

### Content Security
- ✅ **Strict CSP with Nonces** - Dynamic nonce generation for inline scripts
- ✅ **XSS Protection** - DOMPurify sanitizes all user-generated content
- ✅ **CSS-Based Syntax Highlighting** - Shiki uses CSS classes instead of inline styles
- ✅ **Input Validation** - All forms validated (UUIDs, tags, lengths, types)
- ✅ **Error Sanitization** - No internal error details leaked to clients

### Infrastructure Security
- ✅ **Distributed Rate Limiting** - Upstash Redis for production (shared across Vercel instances)
- ✅ **Security Headers** - HSTS, X-Frame-Options, CSP, and more
- ✅ **DDoS Protection** - Rate limiting prevents abuse
- ✅ **HTTPS Only** - All connections encrypted with TLS 1.3

### Code Security
- ✅ **TypeScript** - Type safety throughout the codebase
- ✅ **Secret Management** - Environment variables only, never in code
- ✅ **SQL Injection Prevention** - Parameterized queries via Supabase
- ✅ **CSRF Protection** - SameSite cookies and request validation

### Monitoring
- ✅ **Security.txt** - Standard security contact information
- ✅ **SECURITY.md** - Vulnerability reporting process

## Performance Features

- Client-side aggregation for trending tags
- Cached server actions with React cache
- Optimized database indexes
- Lazy loading of components
- Image optimization with Next.js
- Distributed rate limiting with Redis

## Production Security Checklist

Before deploying to production:

### Required Environment Variables

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# Upstash Redis (Required for Production)
UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-redis-token
```

### Deployment Steps

1. **Rotate Supabase Keys**
   - Go to Supabase Dashboard > Settings > API
   - Generate new API keys
   - Update Vercel environment variables

2. **Configure Upstash Redis**
   - Sign up at [upstash.com](https://upstash.com/)
   - Create a Redis database
   - Copy REST URL and token to Vercel

3. **Update GitHub OAuth**
   - Go to GitHub > Settings > Developer Settings > OAuth Apps
   - Update Authorization callback URL to production domain
   - Save changes

4. **Verify Security Headers**
   - Test with [securityheaders.com](https://securityheaders.com)
   - Ensure A+ rating

5. **Test All Functionality**
   - Authentication flow
   - Post creation/editing/deletion
   - Voting system
   - Comments
   - Theme switching
- Update `app/lib/utils/rateLimit.ts` to use Redis instead of in-memory Map
- Ensure rate limits are shared across all server instances

**Implementation:**
```typescript
// Use Upstash Redis for distributed rate limiting
import { Redis } from '@upstash/redis'
const redis = new Redis({ url: process.env.UPSTASH_REDIS_URL, token: process.env.UPSTASH_REDIS_TOKEN })
```

### Security Best Practices Implemented

The following security measures are already in place:

- ✅ **Row Level Security (RLS):** All tables have proper RLS policies restricting data access
- ✅ **XSS Protection:** DOMPurify sanitizes user-generated content before rendering
- ✅ **Input Validation:** All user inputs validated (UUIDs, tags, languages, lengths)
- ✅ **Authentication:** Proper session management with Supabase Auth
- ✅ **Authorization:** Server actions verify ownership before updates/deletions
- ✅ **Security Headers:** X-Frame-Options, X-Content-Type-Options, Referrer-Policy configured
- ✅ **Secrets Management:** Service role key isolated in environment variables (never committed)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm run test` (if available)
5. Submit a pull request

## License

MIT License - feel free to use this for personal or commercial projects.

## Support

If you encounter issues:
1. Check the Troubleshooting section above
2. Review the SQL files in `supabase/` directory:
   - `00_schema.sql` - Tables and indexes
   - `01_rls.sql` - RLS policies
   - `02_functions.sql` - Database functions
   - `03_triggers.sql` - Triggers
   - `04_service_role_permissions.sql` - Service role permissions
3. Check browser console and server logs
4. Open an issue on GitHub

---

**Built with ❤️ using Next.js, Supabase, and TailwindCSS**
