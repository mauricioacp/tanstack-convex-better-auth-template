# Contributing

Thanks for your interest in contributing! This guide covers what you need to get started.

## Prerequisites

- [Bun](https://bun.sh) (v1.3+)
- [Node.js](https://nodejs.org) (v20+)
- A [Convex](https://convex.dev) account (free tier works)
- A [Resend](https://resend.com) account (for email features)

## Setup

```bash
git clone https://github.com/mauricioacp/tanstack-convex-better-auth-template.git
cd tanstack-convex-better-auth-template
bun install
bun run dev:setup   # configure Convex project
```

Copy environment files and fill in values — see the [README](README.md#3-configure-environment-variables) for details.

```bash
cp apps/web/.env.example apps/web/.env
cp packages/backend/.env.local.example packages/backend/.env.local
bun run dev
```

## Development Workflow

1. Create a branch from `main`
2. Make your changes following [TDD](#testing) — write a failing test first
3. Run checks before committing:
   ```bash
   bun run check         # Biome lint + format (auto-fix)
   bun run check-types   # TypeScript across all workspaces
   cd apps/web && bunx vitest run  # test suite
   ```
4. Commit using [conventional commits](#commit-conventions)
5. Open a pull request against `main`

## Commit Conventions

Commits are enforced by [commitlint](https://commitlint.js.org) + husky.

**Format:** `type(scope): description`

| Type | Purpose |
|------|---------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Code style (formatting) |
| `refactor` | Neither fix nor feature |
| `test` | Adding or updating tests |
| `chore` | Tooling, configs |

Breaking changes append `!`: `feat(api)!: change response format`

## Pull Requests

- Describe what your PR does and why
- Ensure CI passes (lint, types, tests, build)
- Link related issues with `Closes #123`
- Keep PRs focused — one logical change per PR

## Code Style

This project uses **Biome** (not ESLint/Prettier). Run `bun run check` to auto-fix.

- Tabs for indentation
- Double quotes
- Imports auto-organized by Biome
- Tailwind classes sorted via `useSortedClasses` rule

Do not add ESLint or Prettier configs — Biome handles everything.

## Testing

Tests use **Vitest + Testing Library** with jsdom. Config at `apps/web/vitest.config.ts`.

**TDD workflow:** red (failing test) → green (minimal code) → refactor.

```bash
# Run all tests
cd apps/web && bunx vitest run

# Run a single test file
cd apps/web && bunx vitest run src/features/auth/__tests__/sign-in-form.test.tsx

# Watch mode
cd apps/web && bunx vitest
```

- Target **80%+ coverage**
- Test naming: `should [behavior] when [condition]`
- Shared mocks live in `apps/web/src/test/mocks/`
- Mock targets: `@/lib/auth-client`, `@tanstack/react-router`, `sonner`

## Project Structure

See [README.md](README.md#project-structure) for the high-level layout and [apps/web/README.md](apps/web/README.md) for frontend-specific patterns.

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
