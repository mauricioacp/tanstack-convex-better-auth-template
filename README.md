# Acme

Full-stack TypeScript monorepo template built with [Better-T-Stack](https://github.com/AmanVarshney01/create-better-t-stack).

## Use as Template

### Option 1: GitHub Template

Click **"Use this template"** on GitHub, then:

```bash
git clone <your-new-repo-url>
cd <repo>
bun install && bun run init
```

### Option 2: degit (no git history)

```bash
npx degit mauricioacp/tanstack-convex-better-auth-template my-project
cd my-project
bun install && bun run init
```

### Option 3: gitpick

```bash
npx gitpick mauricioacp/tanstack-convex-better-auth-template my-project
cd my-project
bun install && bun run init
```

### After init

```bash
bun run dev:setup   # configure Convex (follow prompts)
bun run dev         # start developing
```

> **What does `bun run init` do?** It interactively renames all `@acme/` scopes, display names, and infra references to your chosen project name. It also resets versions, clears the changelog, and optionally reinitializes git. The init script self-deletes after running.

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

**Convex dashboard env vars** — set via CLI (not filesystem `.env` files):

```bash
npx convex env set BETTER_AUTH_SECRET $(openssl rand -base64 32)
npx convex env set SITE_URL http://localhost:3001
npx convex env set RESEND_API_KEY re_xxxxxxxxxxxxx   # from https://resend.com/api-keys
npx convex env set RESEND_FROM noreply@yourdomain.com
```

Or set these in the Convex dashboard (Settings → Environment Variables):

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
| `bun run lint` | Biome lint check (read-only) |
| `bun run format` | Biome format check (read-only) |
| `cd apps/web && bun run test` | Run Vitest test suite |
| `cd apps/web && bun run test:watch` | Run tests in watch mode |
| `bun run release` | Bump version, update changelog, create tag |
| `bun run release:first` | Create first release (v0.1.0) |
| `bun run release:dry` | Preview what a release would do |
| `bun run release:patch` | Force a patch release |
| `bun run release:minor` | Force a minor release |
| `bun run release:major` | Force a major release |

## Commit Conventions

This project enforces [Conventional Commits](https://conventionalcommits.org) via commitlint + husky.

| Type | Purpose |
|------|---------|
| `feat` | New feature (bumps minor) |
| `fix` | Bug fix (bumps patch) |
| `perf` | Performance improvement (bumps patch) |
| `docs` | Documentation only |
| `style` | Code style (formatting, semicolons, etc.) |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `test` | Adding or updating tests |
| `build` | Build system or external dependencies |
| `ci` | CI configuration |
| `chore` | Other changes (tooling, configs) |
| `revert` | Reverting a previous commit |

**Format:** `type(scope): description` — scope is optional, freeform.

**Examples:**

```
feat(auth): add email OTP verification
fix(web): prevent double form submission
docs: update README setup instructions
refactor(backend): extract rate limit config
```

A breaking change appends `!` after the type/scope: `feat(api)!: change response format`

## Releasing

Releases use [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) which reads conventional commits to automatically:

1. Determine the next semver version based on commit types
2. Update `CHANGELOG.md` with grouped changes
3. Bump `version` in `package.json`
4. Create a git commit and tag

```bash
# First release (creates v0.1.0 without bumping)
bun run release:first

# Subsequent releases (auto-determines bump from commits)
bun run release

# Preview without making changes
bun run release:dry

# Force a specific bump level
bun run release:patch   # 0.1.0 → 0.1.1
bun run release:minor   # 0.1.0 → 0.2.0
bun run release:major   # 0.1.0 → 1.0.0
```

After releasing, push the commit and tag:

```bash
git push --follow-tags
```

## CI/CD

GitHub Actions runs on every push to `main` and on pull requests targeting `main`.

| Job | What it checks |
|-----|---------------|
| **Lint & Format** | Biome lint + format (read-only, no auto-fix) |
| **Type Check** | TypeScript across all workspaces |
| **Test** | Vitest suite in `apps/web` |
| **Build** | Full production build (runs after the above 3 pass) |

See [`.github/workflows/ci.yml`](.github/workflows/ci.yml) for details.

## Auth Features

- **Email + password** sign-up/sign-in with email verification required
- **Email OTP** — 6-digit code, 10-minute expiry, auto-sent on sign-up
- **Password reset** via email link
- **Rate limiting** — OTP: 3 requests / 5 min, password reset: 2 requests / 10 min

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

## Documentation

For deeper guides, see the [`docs/`](./docs/) directory:

- [Getting Started](./docs/getting-started.md) — Install, configure, and run
- [Architecture](./docs/architecture.md) — How everything fits together
- [Authentication](./docs/auth.md) — Auth flows, protection, and config
- [Deployment](./docs/deployment.md) — Ship to production
- [Customization](./docs/customization.md) — Add pages, functions, translations, tests
