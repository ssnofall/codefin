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
|   ├── migrations/
|   |    └── 00000000000000_initial.sql    # Fresh database initialization
│   ├── 00_schema.sql          # Database schema (tables, indexes)
│   ├── 01_rls.sql             # Row Level Security policies
│   ├── 02_functions.sql       # Database functions
│   ├── 03_triggers.sql        # Triggers
│   └── 04_service_role_permissions.sql  # Service role grants
├── middleware.ts              # Auth middleware
├── next.config.ts             # Next.js configuration
└── package.json
```

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

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

  This project is licensed under the GNU Affero General Public License
