# Architecture

## Overview

The template is a **Bun + Turborepo monorepo** with four packages:

```
acme/
├── apps/web/              # Frontend — TanStack Start + React 19
├── packages/backend/      # Backend — Convex functions + schema
├── packages/env/          # Shared env var validation (Zod + t3-env)
├── packages/config/       # Shared Biome + TypeScript config
└── packages/infra/        # Alchemy deployment config
```

## Frontend (`apps/web`)

### Framework Stack

- **React 19** — UI library with the latest features (use(), transitions)
- **TanStack Start** — SSR framework built on Nitro
- **TanStack Router** — File-based, type-safe routing
- **Tailwind CSS v4** — Utility-first styling with `@theme inline` config

### Routing

Routes live in `src/routes/`. TanStack Router generates a typed route tree at `src/routeTree.gen.ts`. After adding/removing route files, regenerate it:

```bash
cd apps/web && npx @tanstack/router-cli generate
```

**Route patterns:**

| Pattern | Example | Purpose |
|---------|---------|---------|
| Layout routes | `_authenticated.tsx` | Wrap child routes with shared UI (app shell, auth guard) |
| Pathless layouts | `(auth)/_auth.tsx` | Group routes without adding URL segments |
| Index routes | `settings/index.tsx` | Default component for a directory |

### Data Flow

```
Route Loader → ensureQueryData(convexQuery(...)) → SSR prefetch
     ↓
Component → useSuspenseQuery(convexQuery(...)) → Reactive updates
```

1. **Route loaders** prefetch Convex queries via TanStack Query for SSR
2. **Components** subscribe to the same queries, getting instant data + real-time updates
3. **Mutations** use Convex's `useMutation` hook directly (not through TanStack Query)

The bridge between Convex and TanStack Query is `@convex-dev/react-query`'s `ConvexQueryClient`, configured in `src/router.tsx`.

### UI Components

Built on **@base-ui/react** primitives (not Radix) with **CVA** for variant styling:

- `Button` — No `asChild` prop. Use `buttonVariants()` with `<Link>` for navigation
- `FormField` — Wraps TanStack Form field + Input + Label + error display
- `Card` — Section container with header/content/footer
- `Toaster` — Sonner toast notifications with theme awareness

### State Management

No global state library. State flows through:

1. **Route context** — Auth state (`isAuthenticated`, `token`) set in `__root.tsx` `beforeLoad`
2. **Convex queries** — Server state via reactive subscriptions
3. **Component state** — Local `useState` for UI-only state (forms, toggles)
4. **Theme** — `ThemeProvider` context with localStorage persistence

### Internationalization

All user-facing text uses **Paraglide** (compile-time i18n):

```tsx
import * as m from "@/paraglide/messages";

// In JSX:
<h1>{m.landing_hero_title()}</h1>
```

Messages defined in `messages/en.json` and `messages/es.json`. The router rewrites URLs for locale prefixes via `localizeUrl`/`deLocalizeUrl`.

## Backend (`packages/backend`)

### Convex Architecture

Convex uses a **component architecture** where features are self-contained modules:

| Component | Purpose |
|-----------|---------|
| `betterAuth` | Auth tables (users, sessions, accounts, verifications) + HTTP handlers |
| `rateLimiter` | Token bucket rate limiting |
| `resend` | Transactional email via Resend API |

### Function Types

| Type | File Pattern | When to Use |
|------|-------------|-------------|
| `query` | Exported from module | Read data, reactive subscriptions |
| `mutation` | Exported from module | Write data, called from client |
| `action` | Exported from module | Side effects (external APIs, email) |
| `internalQuery/Mutation/Action` | Prefixed with `internal.` | Server-to-server only, not exposed to client |
| HTTP actions | `http.ts` | REST endpoints (auth callbacks, webhooks) |

### Schema

Database tables defined in `packages/backend/convex/schema.ts`. Auth tables are managed by the `betterAuth` component — only custom tables (like `contactMessages`) are explicitly defined.

### Rate Limiting

Rate limits configured in `rateLimit.ts` using token bucket algorithm:

```ts
// Example: 3 requests per 15 minutes
submitContactForm: { kind: "token bucket", rate: 3, period: 15 * MINUTE }
```

## Shared Packages

### `@acme/env`

Type-safe env vars via `@t3-oss/env-core` + Zod:

```ts
import { env } from "@acme/env/web";
// env.VITE_CONVEX_URL is typed and validated
```

### `@acme/config`

Shared TypeScript config (`tsconfig.base.json`) with strict settings:
- `strict: true`
- `noUncheckedIndexedAccess: true`
- `verbatimModuleSyntax: true`

## Testing

**Vitest + Testing Library + jsdom**. Config at `apps/web/vitest.config.ts` (separate from `vite.config.ts` to avoid SSR plugin conflicts).

Tests follow the pattern:
- Feature tests: `src/features/<name>/__tests__/`
- Shared component tests: `src/components/__tests__/`
- Library tests: `src/lib/__tests__/`
- Shared mocks: `src/test/mocks/` (router, sonner, theme)
