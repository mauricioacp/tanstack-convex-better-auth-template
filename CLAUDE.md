# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Dev
bun run dev                   # all services (turbo TUI)
bun run dev:web               # frontend only
bun run dev:server            # convex backend only
bun run dev:setup             # first-time backend setup (convex configure)

# Build & Check
bun run build                 # full production build
bun run check                 # biome lint + format (auto-fix)
bun run check-types           # typecheck all workspaces

# Release
bun run release               # bump version + changelog + tag (auto from commits)
bun run release:first         # first release (v0.1.0, no bump)
bun run release:dry           # preview release without changes
bun run release:patch         # force patch bump
bun run release:minor         # force minor bump
bun run release:major         # force major bump

# Test
cd apps/web && bunx vitest run                           # all frontend tests
cd apps/web && bunx vitest run src/components/__tests__/header.test.tsx  # single test
cd apps/web && bunx vitest                               # watch mode

# Type-check individually
bun run check-types                                      # all workspaces via turbo
cd packages/backend && bunx tsc --noEmit --project convex/tsconfig.json  # backend only
```

## Architecture

Monorepo (Bun + Turborepo): `apps/web` (frontend) + `packages/backend` (Convex) + `packages/env` + `packages/config`

### Frontend (`apps/web`)

**React 19 + TanStack Start** (SSR) with file-based routing via TanStack Router.

- Router config: `src/router.tsx` — creates `ConvexQueryClient`, wires SSR query integration, registers typed router
- Route tree auto-generated at `src/routeTree.gen.ts` — **regenerate after adding/removing routes**: `cd apps/web && npx @tanstack/router-cli generate`
- Data fetching: Convex queries bridged through TanStack Query via `@convex-dev/react-query` (`convexQuery(api.foo.bar, args)`)

**Auth flow** (3-layer chain):
1. `src/lib/auth-server.ts` — SSR-side: exports `getToken`, `handler`, `fetchAuthQuery/Mutation/Action` via `convexBetterAuthReactStart()`
2. `src/lib/auth-client.ts` — client-side: `createAuthClient` with `convexClient()` + `emailOTPClient()` plugins
3. `__root.tsx` `beforeLoad` — calls `getToken()` server fn, injects token into `convexQueryClient.serverHttpClient`, returns `{ isAuthenticated, token }` as route context

**Accessing auth state**: `useRouteContext({ from: "__root__" })` → `{ isAuthenticated, token }`

**Route patterns**:
- Pathless layouts: `(auth)/_auth.tsx` + `(auth)/_auth/` directory — shared layout for auth pages, redirects authed users
- Protected routes: `beforeLoad` checks `context.isAuthenticated`, throws `redirect({ to: "/sign-in" })`
- Search param validation: `validateSearch: z.object({ ... })`

### Backend (`packages/backend/convex`)

**Convex** with component architecture (`convex.config.ts`):
- `betterAuth` — auth tables + HTTP handlers
- `rateLimiter` — token bucket rate limiting (email OTP, password reset)
- `resend` — transactional email

Auth HTTP routes registered in `http.ts` via `authComponent.registerRoutes(http, createAuth)`.
`getCurrentUser` query uses `authComponent.safeGetAuthUser(ctx)` (returns null if unauthenticated).

Backend env vars accessed via `process.env` (`SITE_URL`, `RESEND_FROM`, `CONVEX_DEPLOYMENT`, etc.).

### Shared Packages

- `@acme/env` — type-safe env vars via `@t3-oss/env-core` + Zod. Frontend: `import { env } from "@acme/env/web"` (`VITE_CONVEX_URL`, `VITE_CONVEX_SITE_URL`)
- `@acme/config` — shared `tsconfig.base.json` (strict, `noUncheckedIndexedAccess`, `verbatimModuleSyntax`)

## UI

### Component System

**@base-ui/react** primitives (NOT Radix) + shadcn/ui (nova style, zinc base) + CVA + Tailwind v4.

**Button has NO `asChild`** — for links styled as buttons use `<Link className={buttonVariants({ variant, size })}>`. Button accepts `loading` prop (shows spinner, disables).

Tailwind v4: config via `@theme inline` in `src/index.css`, no `tailwind.config.ts`. Sorted classes enforced by Biome (`clsx`, `cva`, `cn` functions).

Icons: `lucide-react`. Toasts: `sonner` (`<Toaster richColors />`).

### Locale

All user-facing copy in **Spanish (Spain)**.

### UX Patterns

- Loading: spinner + original label, min 300ms visible
- Optimistic updates when success likely
- Confirm destructive actions
- Rate limit errors: parse retry-after, show countdown via `useCountdown` hook

## Code Style

**Biome** (not ESLint/Prettier): tabs, double quotes, auto-organize imports. Run `bun run check` to fix.

Key rules: `useSortedClasses` (Tailwind), `noParameterAssign`, `useSelfClosingElements`, `noInferrableTypes`, `useExhaustiveDependencies` (info-level).

## Testing

Vitest + Testing Library + jsdom. Separate `vitest.config.ts` (not vite.config.ts — avoids SSR plugin conflicts). Setup: `src/test/setup.ts`.

Tests live in `src/components/__tests__/`. Mock targets: `@/lib/auth-client`, `@tanstack/react-router` (Link, useNavigate, useRouteContext), `sonner`.

TDD: red → green → refactor. Target 80%+ coverage. Naming: `should [behavior] when [condition]`.

## Workflow

- Conventional commits enforced by **commitlint + husky** (`commit-msg` hook)
- Pre-commit hook runs `bun run check` (Biome lint + format with auto-fix)
- Feature work: new branch → implement with tests → open descriptive PR
- Before developing: check available skills (e.g., convex skills for backend work)
- Use shadcn MCP for UI components, TanStack MCP for framework info
- Use `/frontend-design` skill and `/baseline-ui` for UI changes

## Gotchas

- `routeTree.gen.ts` must be regenerated after route file changes
- `packages/backend/convex/schema.ts` has expected unused imports (`defineTable`, `v`) — schema is empty, tables managed by components
- Frontend `check-types` runs via `turbo -F web check-types` — requires the workspace script to exist
- Do not use type `Never` (per project convention)
