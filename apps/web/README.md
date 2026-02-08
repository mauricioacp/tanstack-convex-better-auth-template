# Web App

TanStack Start (SSR) + React 19 frontend with file-based routing via TanStack Router.

## Directory Structure

```
src/
├── components/          # Shared UI — header, app-shell, loader, not-found
│   ├── ui/              # Base components (button, input, card, etc.)
│   └── __tests__/       # Tests for shared components
├── features/            # Domain-specific code
│   └── auth/
│       ├── components/  # Auth forms (sign-in, sign-up, etc.)
│       └── __tests__/   # Auth component tests
├── routes/              # File-based routing (TanStack Router)
│   ├── (auth)/          # Auth pages (pathless layout group)
│   │   └── _auth/       # Layout: redirects authenticated users away
│   ├── _authenticated/  # Layout: requires authentication
│   └── __root.tsx       # Root layout — loads auth token, provides context
├── hooks/               # Custom hooks (useCountdown, etc.)
├── lib/                 # Utilities — auth clients, seo, validations, rate-limit
└── test/                # Test setup and shared mocks
    └── mocks/           # Reusable mocks (router, sonner)
```

## Adding a New Feature

1. Create `src/features/<name>/components/` and `src/features/<name>/__tests__/`
2. Add route files under `src/routes/`
3. Regenerate the route tree:
   ```bash
   npx @tanstack/router-cli generate
   ```
4. Write tests following TDD — shared mocks are in `src/test/mocks/`

## Adding a Protected Route

Place the route file under `src/routes/_authenticated/`. The `_authenticated.tsx` layout handles the auth guard and wraps the page in the app shell.

```
src/routes/_authenticated/dashboard.tsx   # accessible at /dashboard
src/routes/_authenticated/settings.tsx    # accessible at /settings
```

No extra `beforeLoad` auth check needed — the layout handles it.

## Data Fetching

Use Convex queries bridged through TanStack Query:

- **Prefetch in loader:** `ensureQueryData(convexQuery(api.foo.bar, args))`
- **Read in component:** `useSuspenseQuery(convexQuery(api.foo.bar, args))`

## SEO

Use the `seo()` helper from `@/lib/seo` in route `head()`:

```ts
export const Route = createFileRoute("/about")({
  head: () => ({
    meta: seo({ title: "About", description: "About page" }),
  }),
});
```

Child route meta overrides parent meta by `name`/`property`.

## Testing

Vitest + Testing Library with jsdom. Config at `vitest.config.ts` (separate from `vite.config.ts` to avoid SSR plugin conflicts).

```bash
bunx vitest run                                          # all tests
bunx vitest run src/features/auth/__tests__/sign-in-form.test.tsx  # single test
bunx vitest                                              # watch mode
```

**Shared mocks** in `src/test/mocks/`:
- `router.tsx` — `createRouterMock()`, `mockNavigate`
- `sonner.ts` — `createSonnerMock()`

**Mock targets:** `@/lib/auth-client`, `@tanstack/react-router`, `sonner`

## Code Style

Biome handles lint + format. Run from repo root:

```bash
bun run check    # auto-fix
```

See the [root CONTRIBUTING.md](../../CONTRIBUTING.md) for full conventions.
