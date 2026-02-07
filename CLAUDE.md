## Architecture

- **Stack**: React 19 + TanStack Start/Router (file-based)
- **Backend**: Convex + BetterAuth
- **UI**: Tailwind v4 + shadcn/ui
- **Monorepo**: turborepo

## Before developing
- Look your skills and see if any of them are needed, for example, when working with convex use convex skills.

## UI Essentials

### Locale

- All user-facing copy in this project should be in **Spanish (Spain)**

### Patterns

- Loading: spinner + original label, min 300ms visible
- Optimistic updates when success likely
- Confirm destructive actions

## For UI Changes

- Use shadcn mcp when building
- Use tanstack mcp when framework info is needed
- Use `/frontend-design` skill and `/baseline-ui`

## Testing (TDD)

1. Write failing test first
2. Minimal code to pass
3. Refactor keeping green
4. Target 80%+ coverage
- Test naming: `should [behavior] when [condition]`

## Tooling and Validation

- Verify server runs: `bun run build` (repo root)
- Lint/format: `bun run check lint format`
- Tests: `bun run test` (repo root)
- Frontend types: `bun run check-types:frontend` (runs `turbo -F web check-types`)
- Backend types: run `bunx tsc --noEmit` in `packages/backend/convex`

## Plan Mode

- Keep plans extremely concise; sacrifice grammar for concision
- End each plan with unresolved questions (if any)
- Use AskUserQuestionTool for missing info; iterate in Plan Mode until crystal clear

### Components

- Keep components small and focused on a single responsibility, use shadcn components when possible.
- avoid nested ternaries.

### Workflow

For new feature changes open a new branch, when it is complete and unit tested open a descriptive pr, use conventional commits.
