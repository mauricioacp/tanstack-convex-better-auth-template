# Customization

## Renaming the Project

Run `bun run init` after cloning. It interactively renames:
- All `@acme/` package scopes
- Display names and references
- Infrastructure identifiers
- Resets versions and changelog

## Theming

### Colors and Design Tokens

Tailwind CSS v4 config lives in `apps/web/src/index.css` using `@theme inline`:

```css
@theme inline {
  --color-primary: ...;
  --color-background: ...;
  /* etc. */
}
```

The theme supports dark/light/system modes via `ThemeProvider`. Colors use CSS variables that change based on the `dark` class on `<html>`.

### Fonts

Add fonts in `__root.tsx`'s `head()` configuration and reference them in `index.css`.

### Components

UI components are in `apps/web/src/components/ui/`. They're built on **@base-ui/react** primitives with **CVA** for variants:

```tsx
// Example: Button variants
const buttonVariants = cva("base-classes", {
  variants: {
    variant: { default: "...", outline: "...", ghost: "..." },
    size: { sm: "...", default: "...", lg: "..." },
  },
});
```

To add new UI components, follow the existing pattern in `src/components/ui/`.

## Adding Pages

### Public Route

Create `src/routes/my-page.tsx`:

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/my-page")({
  head: () => seo({ title: "My Page", path: "/my-page" }),
  component: MyPage,
});

function MyPage() {
  return <div>My content</div>;
}
```

Then regenerate the route tree:

```bash
cd apps/web && npx @tanstack/router-cli generate
```

### Protected Route

Place under `src/routes/_authenticated/`:

```tsx
// src/routes/_authenticated/my-page.tsx
export const Route = createFileRoute("/_authenticated/my-page")({
  head: () => seo({ title: "My Page", path: "/my-page" }),
  component: MyPage,
});
```

The `_authenticated.tsx` layout automatically redirects unauthenticated users and wraps content in the `AppShell`.

## Adding Backend Functions

### Query (read data)

```ts
// packages/backend/convex/myModule.ts
import { query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: { limit: v.optional(v.number()) },
  returns: v.array(v.any()),
  handler: async (ctx, args) => {
    return await ctx.db.query("myTable").take(args.limit ?? 10);
  },
});
```

### Mutation (write data)

```ts
export const create = mutation({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.insert("myTable", { name: args.name });
  },
});
```

### Using in Components

```tsx
import { api } from "@acme/backend/convex/_generated/api";
import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMutation } from "convex/react";

function MyComponent() {
  const { data } = useSuspenseQuery(convexQuery(api.myModule.list, {}));
  const create = useMutation(api.myModule.create);

  return (
    <button onClick={() => create({ name: "New item" })}>
      Add ({data.length} items)
    </button>
  );
}
```

## Adding Translations

1. Add keys to `messages/en.json` and `messages/es.json`
2. Use in components via `import * as m from "@/paraglide/messages"`
3. Call as functions: `m.my_key()` or `m.my_key({ param: "value" })`

## Adding Tests

Follow the existing pattern:

```tsx
// src/features/myFeature/__tests__/my-component.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@tanstack/react-router", () => createRouterMock());
vi.mock("@/paraglide/messages", () => ({
  my_key: () => "My text",
}));

import { MyComponent } from "../components/my-component";

describe("MyComponent", () => {
  it("should render text", () => {
    render(<MyComponent />);
    expect(screen.getByText("My text")).toBeInTheDocument();
  });
});
```

Shared mocks: `src/test/mocks/router.tsx`, `src/test/mocks/sonner.ts`, `src/test/mocks/theme.ts`.

## Modifying the Landing Page

Landing page sections are in `src/features/landing/components/`:

| Component | Section |
|-----------|---------|
| `hero.tsx` | Hero with gradient text and CTAs |
| `features-grid.tsx` | 8-feature card grid |
| `tech-stack.tsx` | Technology showcase |
| `testimonials.tsx` | Customer quotes |
| `pricing.tsx` | 2-tier pricing |
| `contact-form.tsx` | Contact form with Convex backend |
| `footer.tsx` | Footer with links |

All composed in `src/routes/index.tsx`. Add, remove, or reorder sections there.

## Email Templates

Email templates are in `packages/backend/convex/emails/`:

- `otpVerification.ts` — OTP verification code
- `resetPassword.ts` — Password reset link
- `contactNotification.ts` — Contact form notification

Each exports an HTML string builder function. Modify the HTML/CSS directly.
