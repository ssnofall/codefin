# Security Documentation

## Overview

This document outlines the security architecture, implementations, and considerations for the Stackd application. Stackd is a code-sharing platform that allows users to share code snippets, vote on posts, and engage in discussions.

**Document Version:** 1.0  
**Last Updated:** February 2026  
**Application Status:** Beta

---

## Table of Contents

1. [Authentication & Authorization](#1-authentication--authorization)
2. [Database Security](#2-database-security)
3. [Rate Limiting](#3-rate-limiting)
4. [Input Validation & Sanitization](#4-input-validation--sanitization)
5. [Content Security Policy](#5-content-security-policy)
6. [Security Headers](#6-security-headers)
7. [Environment Variables](#7-environment-variables)
8. [Data Protection](#8-data-protection)
9. [Infrastructure](#9-infrastructure)
10. [Known Risks & Tradeoffs](#10-known-risks--tradeoffs)
11. [Third-Party Dependencies](#11-third-party-dependencies)

---

## 1. Authentication & Authorization

### Authentication Provider: GitHub OAuth Only

Stackd uses **GitHub OAuth** as the sole authentication method. Users cannot register with email/password.

**How it works:**

1. User clicks "Sign In with GitHub"
2. Redirects to GitHub's OAuth authorization page
3. User approves Stackd access
4. GitHub returns authorization code
5. Stackd exchanges code for access token via Supabase
6. Supabase creates session with JWT tokens

**Why GitHub OAuth only:**
- No password management required
- Reduced attack surface (no email/password vectors)
- Trusted identity provider
- Users already have GitHub accounts (target audience is developers)

**Implementation:**
- Authentication handled by Supabase Auth
- OAuth flow configured in Supabase Dashboard
- GitHub OAuth App credentials stored as environment variables in Supabase
- Session managed via HTTP-only cookies

### Protected Routes

The application uses Next.js middleware to protect routes that require authentication:

```typescript
// middleware.ts - Route protection
if (request.nextUrl.pathname.startsWith('/create') && !user) {
  return NextResponse.redirect(new URL('/auth/login', request.url));
}

if (request.nextUrl.pathname.startsWith('/settings') && !user) {
  return NextResponse.redirect(new URL('/auth/login', request.url));
}
```

**Protected routes:**
- `/create` - Post creation page
- `/settings` - Account settings page

### Server-Side Authorization

All server actions (mutations) perform their own authorization checks. The UI cannot bypass these:

```typescript
// Example: updatePost in app/lib/actions/posts.ts
const { data: post } = await supabase
  .from('posts')
  .select('author_id')
  .eq('id', postId)
  .single()

if (post.author_id !== user.id) {
  throw new Error('Not authorized')
}
```

**Authorization pattern:**
1. Verify user is authenticated (check Supabase session)
2. Fetch the resource from database
3. Verify ownership (author_id === user.id)
4. Proceed with operation

---

## 2. Database Security

### Row Level Security (RLS)

All database tables have **Row Level Security** enabled. This ensures that even if an attacker gains access to the database credentials, they can only access data they're authorized to see.

**Tables with RLS:**
- `profiles`
- `posts`
- `votes`
- `comments`
- `rate_limits` (RLS not functionally required - see note below)

### RLS Policies

#### Profiles Table

| Operation | Policy | Condition |
|-----------|--------|-----------|
| SELECT | Public | `using (true)` |
| UPDATE | Owner only | `using ((select auth.uid()) = id)` |
| INSERT | N/A | Managed by trigger |
| DELETE | N/A | Managed by cascade |

**Rationale:** Profiles are public (usernames, avatars) but users can only modify their own.

#### Posts Table

| Operation | Policy | Condition |
|-----------|--------|-----------|
| SELECT | Public | `using (true)` |
| INSERT | Authenticated | `with check ((select auth.uid()) = author_id)` |
| UPDATE | Owner only | `using ((select auth.uid()) = author_id)` |
| DELETE | Owner only | `using ((select auth.uid()) = author_id)` |

**Rationale:** Posts are public content. Only authenticated users can create posts, and only the author can modify/delete their own posts.

#### Votes Table

| Operation | Policy | Condition |
|-----------|--------|-----------|
| SELECT | Public | `using (true)` |
| INSERT | Authenticated | `with check ((select auth.uid()) = user_id)` |
| UPDATE | Owner only | `using ((select auth.uid()) = user_id)` |
| DELETE | Owner only | `using ((select auth.uid()) = user_id)` |

**Rationale:** Vote counts are public. Users can only vote on their own behalf.

#### Comments Table

| Operation | Policy | Condition |
|-----------|--------|-----------|
| SELECT | Public | `using (true)` |
| INSERT | Authenticated | `with check ((select auth.uid()) = user_id)` |
| DELETE | Owner only | `using ((select auth.uid()) = user_id)` |

**Rationale:** Comments are public. Users can only delete their own comments.

#### Rate Limits Table

The `rate_limits` table has RLS enabled for consistency with other tables, but it is **not functionally required**.

**Why RLS is not needed:**

| Factor | Explanation |
|--------|-------------|
| Access pattern | Only server-side code uses this table |
| Client exposure | Not exposed via PostgREST API to clients |
| Service role | Bypasses all RLS policies |
| Data sensitivity | Contains only rate limit counters, no sensitive data |

The service role client used in `app/lib/utils/rateLimit.ts` bypasses RLS entirely, so this table would be accessible regardless of RLS policies.

### Optimized auth.uid() Pattern

The application uses an optimized pattern for RLS policies:

```sql
-- Before (inefficient - re-evaluates for each row):
using (auth.uid() = author_id)

-- After (optimized - evaluates once):
using ((select auth.uid()) = author_id)
```

**Why this matters:**
- `auth.uid()` called per-row: Can cause performance issues with many rows
- `(select auth.uid())`: Evaluates once and caches the result
- This optimization is applied to all RLS policies in the application

### Database Functions Security

All database functions use `security definer` with explicit `search_path`:

```sql
-- Example: handle_new_user function
CREATE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- function body
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog;
```

**Security measures:**
- `security definer`: Function executes with definer's privileges
- `set search_path = pg_catalog`: Prevents privilege escalation via path manipulation

---

## 3. Rate Limiting

### Multi-Instance Rate Limiting

The application uses **Supabase table-based rate limiting** that works across multiple Vercel serverless instances.

**Why table-based?**
- In-memory rate limiting (Map) doesn't work across multiple instances
- Each Vercel serverless function has its own memory
- Supabase table provides shared state across all instances

### Rate Limit Table Schema

```sql
CREATE TABLE rate_limits (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  identifier text NOT NULL,
  action text NOT NULL,
  count int DEFAULT 1 NOT NULL,
  window_start timestamp with time zone DEFAULT now() NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  UNIQUE(identifier, action, window_start)
);
```

### Rate Limits Configuration

| Action | Window | Max Requests | Description |
|--------|--------|--------------|-------------|
| `createPost` | 1 hour | 3 | Creating new posts |
| `createComment` | 1 hour | 10 | Posting comments |
| `vote` | 10 seconds | 1 | Voting on posts |
| `deleteAccount` | 1 hour | 1 | Account deletion |

### Rate Limit Implementation

The rate limiter:
1. Queries existing count for identifier + action + time window
2. If under limit: increments count
3. If at limit: rejects request
4. If no record: creates new entry

**Graceful degradation:** If rate limiting fails (database error), requests are allowed to proceed. This prevents legitimate users from being blocked due to infrastructure issues.

---

## 4. Input Validation & Sanitization

### Server-Side Validation

All user input is validated server-side before processing. The UI provides feedback, but cannot be trusted.

#### UUID Validation

All IDs (post IDs, comment IDs) are validated as UUIDs:

```typescript
import { validate as validateUUID } from 'uuid'

export function validateId(id: string, fieldName: string): void {
  if (!validateUUID(id)) {
    throw new Error(`Invalid ${fieldName} format`)
  }
}
```

**Why:** Prevents SQL injection, IDOR attacks, and malformed requests.

#### Language Validation

Languages must match a predefined whitelist:

```typescript
const LANGUAGES = [
  'JavaScript', 'TypeScript', 'Python', 'Go', 'Rust',
  'Java', 'C++', 'C#', 'Ruby', 'PHP', 'Swift', 'Kotlin',
  'HTML', 'CSS', 'SQL', 'Shell', 'Other'
]
```

Users cannot inject arbitrary language values.

#### Tag Validation

Tags must match a strict regex:

```typescript
const VALID_TAG_REGEX = /^[a-z0-9-]+$/
const MAX_TAG_LENGTH = 30
const MAX_TAGS = 5
```

**Constraints:**
- Only lowercase alphanumeric and hyphens
- Max 30 characters per tag
- Max 5 tags per post

### Content Sanitization

#### Comments

All HTML is stripped from comments:

```typescript
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '')
}

export function sanitizeComment(body: string): string {
  const trimmed = body.trim()
  if (trimmed.length > MAX_COMMENT_LENGTH) {
    throw new Error(`Comment must be less than ${MAX_COMMENT_LENGTH} characters`)
  }
  return stripHtml(trimmed)
}
```

**Result:** Comments are plain text only. No HTML, no script tags.

#### Code Syntax Highlighting

The application uses Shiki for syntax highlighting. The output is sanitized with DOMPurify:

```typescript
const sanitizedHtml = DOMPurify.sanitize(html, {
  ALLOWED_TAGS: ['pre', 'code', 'span', 'div'],
  ALLOWED_ATTR: ['class', 'style', 'data-lang'],
})
```

**Allowed elements:**
- `<pre>`, `<code>`, `<span>`, `<div>` - Only code-related tags
- Attributes: `class`, `style`, `data-lang` - Only presentation attributes

**Result:** Even if a user somehow embeds malicious code, it cannot execute.

---

## 5. Content Security Policy

### Current CSP Configuration

```http
Content-Security-Policy: 
  default-src 'self'; 
  script-src 'self' 'unsafe-eval' 'unsafe-inline'; 
  style-src 'self' 'unsafe-inline'; 
  img-src 'self' https://*.githubusercontent.com data:; 
  connect-src 'self' https://*.supabase.co; 
  font-src 'self';
```

### Understanding the Tradeoffs

#### unsafe-eval

**Why it's needed:** The Shiki syntax highlighting library uses `eval()` internally to compile language grammars at runtime.

**Risk level:** Medium  
**Mitigation:** User input is sanitized via DOMPurify before rendering. Only trusted Shiki-generated HTML is rendered.

**Future hardening:** Explore Shiki WebAssembly build that doesn't require eval.

#### unsafe-inline

**Why it's needed:** Tailwind CSS uses inline styles for dynamic class application.

**Risk level:** Low  
**Mitigation:** No user input reaches inline styles. All styles are pre-defined Tailwind classes.

**Future hardening:** Use nonce-based inline scripts for Tailwind.

### Why This CSP is Acceptable

1. **User input is sanitized:** Comments strip all HTML. Code is sanitized via DOMPurify.
2. **Only trusted code runs:** Shiki is a well-maintained library. Tailwind is pre-defined.
3. **No eval of user data:** User content never reaches eval().
4. **Auth is server-side:** Even if XSS were possible, it cannot bypass authentication.

---

## 6. Security Headers

### Configured Headers

| Header | Value | Purpose |
|--------|-------|---------|
| X-Frame-Options | DENY | Prevents clickjacking (iframe embedding) |
| X-Content-Type-Options | nosniff | Prevents MIME-type sniffing |
| Referrer-Policy | strict-origin-when-cross-origin | Controls referrer information |
| X-DNS-Prefetch-Control | on | DNS prefetching enabled (performance) |

### Implementation

Headers are configured in `next.config.ts`:

```typescript
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Content-Security-Policy', value: "..." },
        { key: 'X-DNS-Prefetch-Control', value: 'on' },
      ],
    },
  ]
}
```

---

## 7. Environment Variables

### Variable Classification

| Variable | Exposure | Used By |
|----------|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Client & Server | All Supabase connections |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client & Server | Public API access |
| `SUPABASE_SERVICE_ROLE_KEY` | Server Only | Admin operations (account deletion, rate limiting) |

### Security Classification

**Public Variables (NEXT_PUBLIC_*):**
- These are exposed to the browser
- Only contain non-sensitive configuration
- Can be viewed in "View Source"

**Server-Only Variables:**
- `SUPABASE_SERVICE_ROLE_KEY` is never exposed to client
- Only used in server actions
- Used for: account deletion, rate limiting

### Implementation

```typescript
// Server-side only (app/lib/actions/auth.ts)
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!serviceRoleKey) {
  throw new Error('Service role key not configured. Cannot delete account.');
}

const adminClient = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  serviceRoleKey,
  { auth: { autoRefreshToken: false, persistSession: false } }
);
```

---

## 8. Data Protection

### Data Classification

| Data Type | Visibility | Protection |
|-----------|------------|------------|
| Usernames | Public | None (by design) |
| Avatars | Public | GitHub CDN |
| Posts | Public | RLS: public read |
| Comments | Public | RLS: public read |
| Votes | Public | RLS: public read (counts only) |
| Email | Private | Not stored in app |
| Auth tokens | Private | HTTP-only cookies |

### No Sensitive Data Exposure

- **No API keys in frontend:** All sensitive operations use server-side code
- **No secrets in client:** Service role key never reaches browser
- **No PII collected:** Only username and avatar from GitHub

### Account Deletion

When a user deletes their account:

1. Server action verifies authentication
2. Rate limit check (1 deletion per hour)
3. Service role client deletes user from Supabase Auth
4. Cascade delete removes profile, posts, comments, votes
5. All data is permanently removed

```typescript
// app/lib/actions/auth.ts
const { error: deleteError } = await adminClient.auth.admin.deleteUser(user.id);
// Foreign key CASCADE deletes all associated data
```

---

## 9. Infrastructure

### Hosting Platform: Vercel

**Security measures:**
- Automatic HTTPS/TLS
- DDoS protection
- Edge network
- Serverless functions (code runs in isolated containers)

### Database: Supabase

**Security measures:**
- Row Level Security
- Built-in authentication
- Automatic backups (paid plans)
- Network-level security

### Authentication: GitHub OAuth

**Security measures:**
- OAuth 2.0 flow
- Token refresh handled by Supabase
- No password storage
- GitHub's security for identity verification

### Deployment Architecture

```
User Browser
     │
     ▼ HTTPS
Vercel Edge Network
     │
     ├── Static Assets (Next.js)
     │
     └── Serverless Functions
           │
           ▼ HTTPS
      Supabase
      ├── Database (PostgreSQL)
      ├── Auth
      └── Rate Limits Table
```

---

## 10. Known Risks & Tradeoffs

### Acceptable Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| CSP unsafe-eval | Medium | User input sanitized; Shiki is trusted |
| CSP unsafe-inline | Low | No user data in inline styles |
| Rate limit bypass | Low | Database failures allow requests (graceful degradation) |

### Future Hardening Options

1. **CSP Hardening:**
   - Replace unsafe-inline with nonce-based Tailwind
   - Use Shiki WebAssembly build to remove unsafe-eval

2. **Rate Limiting:**
   - Add Redis (Upstash) for faster rate limiting
   - Add IP-based throttling for public endpoints

3. **Monitoring:**
   - Add security event logging
   - Add anomaly detection for unusual activity

### What is NOT Implemented (And Why)

| Feature | Reason |
|---------|--------|
| Email/password auth | Not needed; GitHub OAuth sufficient |
| Two-factor auth | GitHub handles this |
| Admin panel | Reduced attack surface |
| IP blocking | Requires additional infrastructure |
| Detailed audit logging | Beta phase - future enhancement |

---

## 11. Third-Party Dependencies

### Core Dependencies

| Package | Version | Purpose | Security |
|---------|---------|---------|----------|
| next | 16.1.6 | Framework | ✅ Maintained |
| @supabase/ssr | ^0.8.0 | Auth helpers | ✅ Maintained |
| @supabase/supabase-js | ^2.95.3 | Database client | ✅ Maintained |
| react | 19.2.3 | UI Framework | ✅ Maintained |
| shiki | ^3.22.0 | Syntax highlighting | ✅ Maintained |
| dompurify | ^3.3.1 | HTML sanitization | ✅ Maintained |
| lucide-react | ^0.563.0 | Icons | ✅ Maintained |

### No Known Vulnerabilities

All dependencies are up-to-date and have no known security vulnerabilities at the time of this document.

---

## Summary

Stackd implements defense-in-depth security with multiple layers:

1. **Authentication:** GitHub OAuth only (no password attacks)
2. **Authorization:** Server-side checks + RLS policies
3. **Input Validation:** UUID, regex, whitelist validation
4. **Sanitization:** DOMPurify + HTML stripping
5. **Rate Limiting:** Supabase table-based (multi-instance)
6. **Headers:** CSP, X-Frame-Options, etc.
7. **Data Protection:** No sensitive data exposure
8. **Infrastructure:** Vercel + Supabase (enterprise-grade)

The application is suitable for a public beta launch with the understanding that:
- CSP has relaxations needed for functionality
- Rate limiting gracefully degrades
- No admin panel reduces attack surface

For production hardening, consider the future improvements outlined in this document.

---

*This document should be updated whenever security configurations change.*
