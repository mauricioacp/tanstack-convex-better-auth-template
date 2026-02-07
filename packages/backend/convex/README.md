# Acme — Convex Backend

Convex functions and configuration for the Acme application.

## Components

Three Convex components are installed (see `convex.config.ts`):

| Component | Package | Purpose |
|-----------|---------|---------|
| `betterAuth` | `@convex-dev/better-auth` | Auth adapter — maps Better Auth to Convex tables |
| `rateLimiter` | `@convex-dev/rate-limiter` | Token-bucket rate limiting |
| `resend` | `@convex-dev/resend` | Transactional email via Resend |

## Functions

| File | Export | Type | Description |
|------|--------|------|-------------|
| `auth.ts` | `createAuth` | — | Factory that builds a Better Auth instance per request |
| `auth.ts` | `getCurrentUser` | query | Returns the authenticated user or `null` |
| `healthCheck.ts` | `get` | query | Returns `"OK"` — used for uptime checks |
| `privateData.ts` | `get` | query | Returns a message; guards on auth status |
| `http.ts` | default | httpRouter | Registers Better Auth HTTP routes |

## Rate Limit Configuration

Defined in `rateLimit.ts`:

| Name | Kind | Rate | Period |
|------|------|------|--------|
| `sendVerificationOTP` | token bucket | 3 | 5 min |
| `sendResetPassword` | token bucket | 2 | 10 min |

## Email Templates

HTML email generators live in `emails/`:

- `otpVerification.ts` — OTP verification code email
- `resetPassword.ts` — Password reset link email

## Required Convex Environment Variables

Set these in the Convex dashboard under your project's settings:

| Variable | Description |
|----------|-------------|
| `BETTER_AUTH_SECRET` | Secret for Better Auth session signing |
| `SITE_URL` | App public URL (used as `baseURL` + trusted origin) |
| `RESEND_API_KEY` | Resend API key |
| `RESEND_FROM` | Sender email address |
