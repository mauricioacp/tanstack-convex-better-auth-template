# Getting Started

## Prerequisites

- [Bun](https://bun.sh) (v1.1+)
- [Node.js](https://nodejs.org) (v20+, needed by some tooling)
- A [Convex](https://convex.dev) account (free tier available)
- A [Resend](https://resend.com) account (for transactional email)

## Quick Start

### 1. Clone and install

```bash
# Using GitHub template
git clone <your-repo-url>
cd <repo>
bun install && bun run init

# Or via degit
npx degit mauricioacp/tanstack-convex-better-auth-template my-project
cd my-project
bun install && bun run init
```

The `init` script renames all `@acme/` scopes to your project name, resets versions, and optionally reinitializes git.

### 2. Set up Convex

```bash
bun run dev:setup
```

Follow the prompts to create or link a Convex project. This generates `packages/backend/.env.local` with your deployment URL.

### 3. Configure environment variables

**Local `.env` files:**

```bash
cp apps/web/.env.example apps/web/.env
cp packages/backend/.env.local.example packages/backend/.env.local
```

Fill in `apps/web/.env`:

| Variable | Source |
|----------|--------|
| `VITE_CONVEX_URL` | Convex dashboard → Settings → URL |
| `VITE_CONVEX_SITE_URL` | Convex dashboard → Settings → HTTP Actions URL |

**Convex dashboard env vars** (Settings → Environment Variables):

| Variable | Description |
|----------|-------------|
| `BETTER_AUTH_SECRET` | Random 32+ character string for session signing |
| `SITE_URL` | Your app URL (`http://localhost:3001` for local dev) |
| `RESEND_API_KEY` | From Resend dashboard |
| `RESEND_FROM` | Sender email (e.g. `noreply@yourdomain.com`) |
| `CONTACT_NOTIFY_EMAIL` | Email to receive contact form submissions |

### 4. Start developing

```bash
bun run dev
```

Opens at [http://localhost:3001](http://localhost:3001). The Convex dev server starts alongside via Turborepo.

### 5. Verify everything works

- Visit the landing page at `/`
- Sign up with email + password
- Check your email for the OTP verification code
- Sign in and access the dashboard at `/dashboard`
- Update your profile at `/settings`

## Useful Commands

```bash
bun run dev          # Start all services
bun run dev:web      # Frontend only
bun run dev:server   # Convex backend only
bun run build        # Production build
bun run check        # Biome lint + format (auto-fix)
bun run check-types  # TypeScript check all workspaces
```

## Next Steps

- [Architecture](./architecture.md) — Understand how the pieces fit together
- [Auth](./auth.md) — Deep dive into the authentication system
- [Customization](./customization.md) — Adapt the template to your needs
- [Deployment](./deployment.md) — Ship to production
