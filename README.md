# Acme

Full-stack TypeScript monorepo built with [Better-T-Stack](https://github.com/AmanVarshney01/create-better-t-stack).

## Tech Stack

- **Framework** — [TanStack Start](https://tanstack.com/start) (SSR + TanStack Router)
- **UI** — [Base UI](https://base-ui.com) (`@base-ui/react`) + [Tailwind CSS v4](https://tailwindcss.com) + [CVA](https://cva.style)
- **Backend** — [Convex](https://convex.dev) (reactive BaaS)
- **Auth** — [Better Auth](https://www.better-auth.com) + Convex plugin (email/password, email OTP, password reset)
- **Email** — [Resend](https://resend.com) via `@convex-dev/resend`
- **Rate Limiting** — `@convex-dev/rate-limiter` (token bucket)
- **Build** — [Turborepo](https://turbo.build)
- **Linting** — [Biome](https://biomejs.dev)
- **Testing** — [Vitest](https://vitest.dev) + [Testing Library](https://testing-library.com)
- **Deployment** — Cloudflare via [Alchemy](https://alchemy.run)

## Project Structure

```
acme/
├── apps/
│   └── web/              # Frontend (TanStack Start + React 19)
├── packages/
│   ├── backend/          # Convex functions, schema, auth config
│   ├── config/           # Shared Biome + TypeScript config
│   ├── env/              # Shared environment variable validation (Zod)
│   └── infra/            # Alchemy deployment config
```

## Getting Started

### 1. Install dependencies

```bash
bun install
```

### 2. Set up Convex

```bash
bun run dev:setup
```

Follow the prompts to create a Convex project. This generates `packages/backend/.env.local` with your `CONVEX_DEPLOYMENT`.

### 3. Configure environment variables

**Filesystem env vars** — copy from the example files:

```bash
cp apps/web/.env.example apps/web/.env
cp packages/backend/.env.local.example packages/backend/.env.local
```

Fill in `apps/web/.env`:

| Variable | Description |
|----------|-------------|
| `VITE_CONVEX_URL` | Convex deployment URL (from Convex dashboard) |
| `VITE_CONVEX_SITE_URL` | Convex HTTP actions URL (from Convex dashboard) |

**Convex dashboard env vars** — set these in your Convex project's environment variables:

| Variable | Description |
|----------|-------------|
| `BETTER_AUTH_SECRET` | Random secret for Better Auth session signing |
| `SITE_URL` | Your app's public URL (e.g. `http://localhost:3001`) |
| `RESEND_API_KEY` | API key from Resend |
| `RESEND_FROM` | Sender email address (e.g. `noreply@yourdomain.com`) |

### 4. Start development

```bash
bun run dev
```

Opens at [http://localhost:3001](http://localhost:3001). Convex dev server runs alongside.

## Auth Features

- **Email + password** sign-up/sign-in with email verification required
- **Email OTP** — 6-digit code, 10-minute expiry, auto-sent on sign-up
- **Password reset** via email link
- **Rate limiting** — OTP: 3 requests / 5 min, password reset: 2 requests / 10 min

## Available Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start all apps + Convex in development mode |
| `bun run build` | Build all applications |
| `bun run dev:web` | Start only the web app |
| `bun run dev:server` | Start only the Convex backend |
| `bun run dev:setup` | Configure Convex project |
| `bun run check-types` | TypeScript type checking across all packages |
| `bun run check` | Biome formatting + linting (with auto-fix) |
| `cd apps/web && bun run test` | Run Vitest test suite |
| `cd apps/web && bun run test:watch` | Run tests in watch mode |

## Testing

Tests use Vitest + Testing Library with jsdom. Config at `apps/web/vitest.config.ts`.

```bash
cd apps/web && bun run test
```

## Deployment

Deployed to Cloudflare via Alchemy:

```bash
bun run deploy     # deploy
bun run destroy    # tear down
```

See [Deploying to Cloudflare with Alchemy](https://www.better-t-stack.dev/docs/guides/cloudflare-alchemy) for details.
