# Stackd MVP

Share Code. Get Seen.

## Tech Stack

- **Frontend**: Next.js 14+ (App Router), TypeScript, TailwindCSS
- **Backend**: Supabase (PostgreSQL + Auth + RLS)
- **Auth**: GitHub OAuth via Supabase
- **Hosting**: Vercel (Free Tier compatible)

## Features

- GitHub OAuth authentication
- Create posts with title, code, language, and tags (max 5)
- Feed with sorting (Hot, New, Top)
- Voting system (upvote/downvote)
- Comments (text-only, delete own)
- Tag filtering
- User profiles with stats
- Syntax highlighting with Shiki

## Project Structure

```
stackd/
├── app/
│   ├── (routes)/
│   │   ├── feed/              # Main feed
│   │   ├── new/               # Newest posts
│   │   ├── top/               # Top posts
│   │   ├── trending/          # Trending posts
│   │   ├── saved/             # Saved posts
│   │   ├── post/[id]/         # Post detail
│   │   ├── profile/[username]/# Profile page
│   │   └── create/            # Create post form
│   ├── auth/
│   │   ├── login/             # GitHub OAuth login
│   │   ├── callback/          # OAuth callback
│   │   └── logout/            # Sign out
│   ├── components/
│   │   ├── layout/            # Layout components
│   │   ├── feed/              # Feed components
│   │   ├── post/              # Post components
│   │   ├── profile/           # Profile components
│   │   └── ui/                # Reusable UI
│   ├── lib/
│   │   ├── supabase/          # Supabase clients
│   │   ├── actions/           # Server actions
│   │   └── utils/             # Utilities
│   └── globals.css
├── supabase/
│   ├── schema.sql             # Database schema
│   └── rls.sql                # RLS policies
└── ...
```

## Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Database Setup

1. Create a new Supabase project
2. Run the SQL in `supabase/schema.sql`
3. Run the SQL in `supabase/rls.sql`
4. Enable GitHub OAuth in Authentication > Providers
5. Add your GitHub OAuth credentials

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deployment

### Vercel

1. Push to GitHub
2. Import project on Vercel
3. Add environment variables
4. Deploy

### Environment Variables for Production

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
```

## License

MIT
