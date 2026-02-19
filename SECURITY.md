# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |

## Reporting a Vulnerability

We take security seriously at Codefin. If you discover a security vulnerability, we appreciate your help in disclosing it to us in a responsible manner.

### Reporting Process

1. **Do Not** open public issues on GitHub for security vulnerabilities
2. Email us at **ssnofall@proton.me** with details about the vulnerability
3. Include the following information:
   - Description of the vulnerability
   - Steps to reproduce (if applicable)
   - Potential impact
   - Suggested fix (if any)

### Response Timeline

- **Initial Response**: Within 48 hours
- **Assessment**: Within 1 week
- **Fix & Disclosure**: Timeline depends on severity (see below)

### Severity Classification

- **Critical**: Immediate fix required, within 24-48 hours
- **High**: Fix required within 1 week
- **Medium**: Fix required within 1 month
- **Low**: Fix in next scheduled release

### Disclosure Policy

We follow responsible disclosure practices:

1. We will acknowledge receipt of your vulnerability report within 48 hours
2. We will provide an estimated timeline for a fix within 1 week
3. We will notify you when the vulnerability is fixed
4. We will publicly disclose the vulnerability after a fix is released, giving credit to the reporter (unless requested otherwise)

## Security Measures

Codefin implements the following security measures:

### Authentication & Authorization
- GitHub OAuth via Supabase Auth
- Row Level Security (RLS) policies on all database tables
- Session management with secure httpOnly cookies
- Automatic profile creation with secure defaults

### Data Protection
- All data encrypted at rest (Supabase PostgreSQL)
- TLS 1.3 for all connections
- No sensitive data in URLs or logs
- Input validation and sanitization on all forms

### Content Security
- Strict Content Security Policy (CSP) with nonce-based script execution
- XSS protection via DOMPurify
- CSRF protection via SameSite cookies and request validation
- SQL injection prevention via parameterized queries

### Infrastructure
- Distributed rate limiting with Redis (prevents abuse)
- Security headers (HSTS, X-Frame-Options, etc.)
- DDoS protection via Vercel Edge Network
- Regular dependency updates

### Code Security
- TypeScript for type safety
- Static analysis with ESLint
- No secrets in code (all via environment variables)
- Error message sanitization (no internal details leaked)

## Security Checklist for Deployment

Before deploying to production, ensure:

- [ ] All environment variables are set
- [ ] Supabase keys are rotated and secure
- [ ] Upstash Redis is configured for rate limiting
- [ ] GitHub OAuth callback URL is correct
- [ ] RLS policies are applied in Supabase
- [ ] Database functions and triggers are created
- [ ] Domain has SSL/TLS certificate
- [ ] Security headers are being sent (verify with securityheaders.com)

## Bug Bounty Program

We currently do not offer a bug bounty program, but we greatly appreciate security researchers who report vulnerabilities responsibly. We will:

- Acknowledge your contribution
- Add you to our Security Hall of Fame (if desired)
- Prioritize fixing reported vulnerabilities

## Security Contacts

- **Email**: ssnofall@proton.me

## Hall of Fame

We thank the following security researchers for their responsible disclosures:

*No vulnerabilities have been reported yet. Be the first!*

---

Last Updated: 2026-02-16
