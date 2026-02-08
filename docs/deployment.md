# Deployment

## Overview

The template deploys to:

- **Frontend** → Cloudflare Workers (via Alchemy)
- **Backend** → Convex Cloud (managed by Convex)

## Convex Backend

### Deploy to Production

```bash
npx convex deploy
```

This pushes your functions and schema to the production Convex deployment.

### Environment Variables

Set these in your **production** Convex deployment:

```bash
npx convex env set BETTER_AUTH_SECRET $(openssl rand -base64 32) --prod
npx convex env set SITE_URL https://yourdomain.com --prod
npx convex env set RESEND_API_KEY re_xxxxxxxxxxxxx --prod
npx convex env set RESEND_FROM noreply@yourdomain.com --prod

# Optional
npx convex env set CONTACT_NOTIFY_EMAIL your-email@example.com --prod
```

> **Important**: Generate a new `BETTER_AUTH_SECRET` for production — don't reuse the dev secret.

Or set these in the Convex dashboard (Production → Settings → Environment Variables):

| Variable | Value |
|----------|-------|
| `BETTER_AUTH_SECRET` | Random 32+ character secret |
| `SITE_URL` | Your production URL (e.g. `https://myapp.com`) |
| `RESEND_API_KEY` | Production Resend API key |
| `RESEND_FROM` | Verified sender email |
| `CONTACT_NOTIFY_EMAIL` | Email for contact form notifications (optional) |

## Frontend (Cloudflare)

### Prerequisites

- [Cloudflare account](https://dash.cloudflare.com)
- Wrangler CLI authenticated (`npx wrangler login`)

### Deploy

```bash
bun run deploy
```

This uses [Alchemy](https://alchemy.run) to deploy the TanStack Start app as a Cloudflare Worker. Config is in `packages/infra/`.

### Tear Down

```bash
bun run destroy
```

### Environment Variables

Set `VITE_CONVEX_URL` and `VITE_CONVEX_SITE_URL` for your production Convex deployment. These are build-time variables embedded during the build step.

## CI/CD

GitHub Actions (`.github/workflows/ci.yml`) runs on every push to `main` and on pull requests:

| Job | What it does |
|-----|-------------|
| Lint & Format | `biome lint` + `biome format` (read-only) |
| Type Check | `tsc --noEmit` across all workspaces |
| Test | Vitest suite in `apps/web` |
| Build | Full production build (after above pass) |
| Bundle Analysis | Compares bundle size against base branch on PRs |

### Build Metadata

Production builds inject metadata via Vite's `define`:

- `__BUILD_COMMIT__` — Git short SHA
- `__BUILD_TIME__` — ISO timestamp
- `__APP_VERSION__` — From `package.json`

These are available at runtime and exposed via the `/api/health` endpoint.

## Production Checklist

- [ ] Set all Convex environment variables
- [ ] Verify Resend sender domain is authenticated
- [ ] Set `SITE_URL` to the production domain
- [ ] Update `BETTER_AUTH_SECRET` (don't reuse dev secret)
- [ ] Run `bun run build` to verify production build succeeds
- [ ] Test auth flow end-to-end in production
- [ ] Verify email delivery (OTP, password reset, contact form)
