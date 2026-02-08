# Acme Template Documentation

## Guides

| Document | Description |
|----------|-------------|
| [Getting Started](./getting-started.md) | Install, configure, and run the template |
| [Architecture](./architecture.md) | How the monorepo, frontend, and backend fit together |
| [Authentication](./auth.md) | Auth flows, route protection, and configuration |
| [Deployment](./deployment.md) | Deploy to Cloudflare + Convex production |
| [Customization](./customization.md) | Add pages, backend functions, translations, and tests |

## Quick Reference

```bash
bun run dev          # Start all services
bun run build        # Production build
bun run check        # Lint + format
bun run check-types  # TypeScript check
cd apps/web && bun run test  # Run tests
```

## Project Structure

```
acme/
├── apps/web/              # TanStack Start + React 19 frontend
├── packages/backend/      # Convex functions + schema
├── packages/env/          # Type-safe env var validation
├── packages/config/       # Shared Biome + TS config
├── packages/infra/        # Cloudflare deployment config
└── docs/                  # You are here
```
