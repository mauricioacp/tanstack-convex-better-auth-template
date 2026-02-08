# Authentication

## Overview

Auth is powered by **Better Auth** with a Convex adapter, providing:

- Email + password sign-up/sign-in
- Email OTP verification (6-digit code)
- Password reset via email link
- Session management with JWT tokens
- Rate limiting on sensitive operations

## Architecture

Auth spans three layers:

### 1. Backend — Convex (`packages/backend/convex/auth.ts`)

```
createAuth(ctx) → betterAuth({...})
```

Configures Better Auth with:
- **Convex adapter** — stores auth data in Convex tables
- **Email + password** — with required email verification
- **Email OTP plugin** — 6-digit codes, 10-minute expiry
- **Rate limiting** — token bucket on OTP and password reset
- **Email sending** — via Resend component

Key exports:
- `authComponent` — Convex auth component instance
- `createAuth` — Factory function for Better Auth instances
- `getCurrentUser` — Query to get the authenticated user

### 2. Server-side — TanStack Start (`src/lib/auth-server.ts`)

```ts
export const { getToken, handler, fetchAuthQuery, fetchAuthMutation, fetchAuthAction }
  = convexBetterAuthReactStart();
```

Provides server functions for SSR auth:
- `getToken()` — Returns the JWT token from the session cookie
- `handler` — HTTP handler for auth API routes
- `fetchAuth*` — Server-side Convex calls with auth context

### 3. Client-side — Browser (`src/lib/auth-client.ts`)

```ts
export const authClient = createAuthClient({
  plugins: [convexClient(), emailOTPClient()],
});
```

Provides client methods:
- `authClient.signUp.email()` — Create account
- `authClient.signIn.email()` — Sign in
- `authClient.emailOtp.sendVerificationOtp()` — Send OTP
- `authClient.emailOtp.verifyEmail()` — Verify email
- `authClient.forgetPassword()` — Request password reset
- `authClient.resetPassword()` — Reset with token
- `authClient.changePassword()` — Change (requires current password)
- `authClient.updateUser()` — Update profile (name)
- `authClient.signOut()` — Sign out

## Auth Flow

### Sign Up

```
1. User submits email + password + name
2. authClient.signUp.email() → Backend creates user
3. Backend sends OTP email (6-digit code)
4. User redirected to /verify-email
5. User enters OTP code
6. authClient.emailOtp.verifyEmail() → Email verified
7. User redirected to /dashboard
```

### Sign In

```
1. User submits email + password
2. authClient.signIn.email() → Backend validates
3. If email not verified → redirect to /verify-email
4. If success → session cookie set
5. User redirected to /dashboard
```

### Password Reset

```
1. User clicks "Forgot password?" on sign-in page
2. authClient.forgetPassword() → Backend sends reset email
3. User clicks link → opens /reset-password?token=...
4. authClient.resetPassword() → Password updated
5. User redirected to /sign-in
```

## Route Protection

### Pathless Layout: `_auth.tsx`

Guards auth pages (sign-in, sign-up, etc.) — redirects to `/dashboard` if already authenticated.

### Pathless Layout: `_authenticated.tsx`

Guards protected routes (dashboard, settings) — redirects to `/sign-in` if not authenticated. Also wraps content in the `AppShell` component.

### Auth State Access

Auth state is injected into route context by `__root.tsx`'s `beforeLoad`:

```tsx
// In any route or component:
const { isAuthenticated } = useRouteContext({ from: "__root__" });
```

## Rate Limits

| Operation | Limit | Window |
|-----------|-------|--------|
| Email OTP | 3 requests | 5 minutes |
| Password reset | 2 requests | 10 minutes |
| Contact form | 3 requests | 15 minutes |

Rate limit errors are parsed by `parseAuthError()` and displayed with countdown timers via the `useCountdown()` hook.

## Environment Variables

Set in the Convex dashboard:

| Variable | Required | Description |
|----------|----------|-------------|
| `BETTER_AUTH_SECRET` | Yes | Session signing secret (32+ chars) |
| `SITE_URL` | Yes | App public URL |
| `RESEND_API_KEY` | Yes | Resend email API key |
| `RESEND_FROM` | Yes | Sender email address |
