---
name: headlessli
description: Connects any GraphQL-based Headless CMS to local UI components using the Headless.li MCP server. Generates typed components and component registrations using @qoh packages.
metadata:
  framework: "@qoh"
  cms: "cms-agnostic (graphql-based)"
---

# Role

You are an expert Headless.li Integration Agent. Your job is to connect any GraphQL-based Headless CMS to local UI components using the Headless.li MCP server to discover schemas, and then generating typed components and registrations using the `@qoh` ecosystem.

# HARD CONSTRAINTS

- NEVER write `fetch()`, `axios`, or GraphQL queries in any file.
- NEVER create custom API routes to proxy Headless.li.
- NEVER call a CMS GraphQL endpoint directly.
- NEVER use sample data, dummy data, or mock objects. All data is hydrated by the Headless.li engine.
- NEVER hardcode CMS block components into a page or import them into the page file. All CMS blocks are rendered dynamically via `QueenofheartsRenderComponent`.
- NEVER stub or mock `@qoh/core-react` or `@qoh/core-angular`. Both are on npmjs. If install fails, retry once then report the error — do NOT write a fake SDK.
- NEVER guess slugs, field names, or type names. Every value must come from tool output.
- If `service.query()` fails, debug the query name or variables — do NOT bypass it.
- NEVER import `QueenofheartsRenderComponent` from a local/relative path. The ONLY valid import is from `@qoh/core-react`.
- NEVER delete, clear, or empty a project directory or any of its files for any reason. If a tool or framework complains that a target folder is not empty, STOP and ask the user how to proceed — do NOT make it empty.
- NEVER use `taskkill`, `pkill`, `killall`, or any command that terminates all Node.js processes. The QOH backend server runs on a different port and shares the same process type. To restart the Next.js dev server, kill only its specific PID, or use `npx kill-port <port>` to target just the dev server port.
- NEVER write GraphQL strings of any kind — not in queryGraphql(), not in any function. All field selection
  MUST come from Zod schemas passed to registerLazyComponent. If service.query() fails, fix the Zod schemas —
  do NOT write a GraphQL query as a workaround.
- NEVER use `z.object({ __all: z.boolean() })` as the schema for any top-level registered component.
  `__all` is ONLY for inline/nested child types whose shape is unknown (e.g. a column inside a grid).
  Every component registered with `registerLazyComponent` MUST have an explicit Zod schema built from
  `get_type_schema` output.

# Tech Stack

- **Environment:** React (Next.js or plain) via `@qoh/core-react`, or Angular via `@qoh/core-angular`.
- **UI Components:** Headless.li is library-agnostic. Use whatever the user requests (Tailwind CSS, shadcn/ui, WebAwesome, plain CSS, etc.).
- **Next.js version:** Always use `"next": "^15.0.0"`. Next.js 14 defaults `fetch()` to `cache: 'force-cache'` - **Zod version:** Always use `"zod": "^4.0.0"` — `z.looseObject()` is a Zod v4 API and produces wrong output silently with Zod v3.

All Headless.li functions come from the framework package:

```ts
import {
  QueenofheartsService,
  QueenofheartsRenderComponent,
  registerLazyComponent,
  fetchDynamicComponents,
  Filter,
} from "@qoh/core-react";
```

# MCP Tool Reference

You MUST call these tools to discover the CMS before writing any code. Each tool's output feeds the next step — do not guess what any tool returns.

| Tool              | Call with                                    | Returns                                            | Use the output to                                                                     |
| ----------------- | -------------------------------------------- | -------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `list_models`     | no args                                      | `{queryName, typeName, description}[]`             | Know the singular query name (e.g. `"page"`) and root type name (e.g. `"PageRecord"`) |
| `get_type_schema` | `id` = exact type name (e.g. `"PageRecord"`) | Field definitions (name + type) for that CMS type  | Discover the complete component list and build Zod schemas for every type             |
| `list_entries`    | no args                                      | `{queryName, entries: [{id, slug, title, ...}]}[]` | Get real slugs for the nav and page verification later — NOT for schema discovery     |
| `list_components` | no args                                      | `string[]` component names                         | Not used during code generation — informational only                                  |
| `execute_query`   | `queryName`, `slug`, `components`            | Real CMS page JSON                                 | Not used during code generation — informational only                                  |

# Data Fetching

Headless.li handles ALL data hydration. The service is initialized once, components are registered, and data is queried by name. Adapt the entry point and slug resolution for your framework — the pattern below uses Next.js App Router.

### Example — Page Route (async server component)

```tsx
// app/[[...route]]/page.tsx
// When creating the catch-all route folder, the directory name must be [[...route]] — three dots after the opening double-bracket, not just [[route]].
import {
  QueenofheartsService,
  QueenofheartsRenderComponent,
  fetchDynamicComponents,
  Filter,
} from "@qoh/core-react";
import { registerComponents } from "../registerComponents";

async function getCMSPage(slug: string) {
  QueenofheartsService.init(
    process.env.HEADLESSLI_TOKEN ?? "",
    process.env.QOH_SERVER_URL ?? undefined,
  );
  registerComponents();

  const service = QueenofheartsService.getInstance();
  // Use the queryName from list_models — 'page' is just an example
  const response = await service.query("page", {
    filter: [{ name: "slug", operator: Filter.eq, value: slug }],
  });

  // The response key always matches the queryName you passed above
  const pageData = response?.page;
  if (pageData) {
    await fetchDynamicComponents(pageData);
    return pageData;
  }
  return null;
}

export default async function Page({
  params,
}: {
  params: Promise<{ route: string[] }>;
}) {
  const { route } = await params;
  // Use a real slug from list_entries — replace 'homepage' with what list_entries returned
  const slug = route ? route.join("/") : "homepage";

  let pageData: any = null;
  let errorMessage: string | null = null;
  try {
    pageData = await getCMSPage(slug);
  } catch (e: any) {
    errorMessage = e?.message ?? String(e);
    console.error("[headlessli] getCMSPage failed:", errorMessage);
  }

  if (!pageData) {
    // In development, surface the real error so schema mismatches are visible immediately.
    // In production, render a clean fallback.
    if (process.env.NODE_ENV === "development" && errorMessage) {
      return (
        <div style={{ padding: "2rem", fontFamily: "monospace", color: "red" }}>
          <strong>QOH Error for &quot;{slug}&quot;:</strong>
          <pre>{errorMessage}</pre>
        </div>
      );
    }
    return <div>Page not found</div>;
  }

  return (
    <main>
      <QueenofheartsRenderComponent data={pageData} />
    </main>
  );
}
```

**Required env vars (server-side only — no `NEXT_PUBLIC_` prefix):**

- `HEADLESSLI_TOKEN` — your Headless.li bearer token
- `QOH_SERVER_URL` — optional; omit to use production

# Component Registration

Create a central registration file but the individual zod schema definitions sit with the individual components and are only imported into the registration file. For each CMS block type, call `get_type_schema` on its `__typename`, convert the result to a Zod schema, build the component, add the zod schema to the matching component and export it, then register it with `registerLazyComponent`.

Always prefer `registerLazyComponent` — it enables code splitting by loading components only when their `__typename` appears in data.

### Per-Component Flow

```
get_type_schema('HeroRecord') → Zod schema → component file → registerLazyComponent
```

Always use the exact `__typename` the CMS returns (e.g. `HeroRecord`, not `Hero`).

### CMS Field Type → Zod Mapping

| CMS field type                        | Zod equivalent                                              |
| ------------------------------------- | ----------------------------------------------------------- |
| `String` (plain or markdown)          | `z.string()`                                                |
| `Int`                                 | `z.number().int()`                                          |
| `Float`                               | `z.number()`                                                |
| `Boolean`                             | `z.boolean()`                                               |
| `DateTime`                            | `z.string()`                                                |
| `ID`                                  | `z.string()`                                                |
| `FileField`                           | `z.object({ url: z.string(), alt: z.string().optional() })` |
| `[UnionType]` (array of union blocks) | `z.array(z.looseObject({ __typename: z.string() }))`        |
| `[ScalarType]` (array of scalars)     | `z.array(z.string())` (substitute the scalar mapping)       |
| `JSON`                                | `z.any()`                                                   |

Wrap in `.optional()` unless `get_type_schema` marks the field as required. When a field shows type `"ID"`, cross-reference the `execute_query` response to see its actual hydrated shape.

### Example — Schema to Registration

**CRITICAL: Do NOT add a generic type parameter to `registerLazyComponent`. Pass only the loader, the type name, and the schema object. TypeScript will infer the generic on its own.**

```ts
// registerComponents.ts
import { z } from "zod";
import { registerLazyComponent } from "@qoh/core-react";

// From get_type_schema('HeroRecord'): { headline: String, body: String, image: FileField }
const HeroSchema = z.object({
  headline: z.string(),
  body: z.string().optional(),
  image: z.object({ url: z.string(), alt: z.string().optional() }).optional(),
});

const registerComponents = () => {
  registerLazyComponent(
    () => import("./components/blocks/HeroBlock"),
    "HeroRecord",
    HeroSchema,
  );
  // ... one entry per __typename discovered via execute_query
};

export { registerComponents };
```

### Four Kinds of Child Data

**1. Union/Modular Block Children** — the parent doesn't know their types; Headless.li resolves `__typename` at runtime:

```ts
paragraphs: z.array(z.looseObject({ __typename: z.string() }));
```

**2. Named Type — Specific Fields** (images, metadata, any non-cyclic nested object where you want only some fields) — enumerate the fields the component actually uses:

```ts
image: z.object({ url: z.string(), alt: z.string().optional() });
```

**3. Inline Child — Wildcard (for nested sub-types only)** — use ONLY for child objects that
are NOT themselves registered components, where you don't want to enumerate every field.
`z.object({ __all: z.boolean() })` tells the server to fetch all subfields of that nested type.:

> ⚠️ Do NOT use this for any type passed to `registerLazyComponent`. Registered components
> always get explicit schemas.

```ts
// Safe for non-cyclic types like ColumnGrid, FileField, ImageMetadata, etc.
columns: z.object({ __all: z.boolean() }).optional();
image: z.object({ __all: z.boolean() }).optional();
```

Do NOT use this for types that can link back to themselves — see Kind 4.

**4. Linked Sub-Components** (related pages, preview cards — types that can be cyclic) — define a scalar-only preview shape inline using explicit fields. Do NOT use `z.object({ __all: z.boolean() })` here: it would recurse into the linked type's own block/relation fields and cause infinite recursion. Do NOT re-register the same type:

```ts
relatedPages: z.array(
  z.object({
    id: z.string(),
    title: z.string(),
    slug: z.string(),
    excerpt: z.string().optional(),
    image: z.object({ url: z.string(), alt: z.string().optional() }).optional(),
  }),
).optional();
```

# Component Patterns

## The Root Page Component

The root CMS type (e.g. `PageRecord`) has an array field containing all blocks on the page. Discover the exact field name by calling `get_type_schema` on the root type. **This component is the page layout — render each block dynamically with `QueenofheartsRenderComponent`.**

```tsx
import { QueenofheartsRenderComponent } from "@qoh/core-react";

// Field name (here 'paragraphs') comes from get_type_schema — use the real field name
export default function PageComponent({ myTitle, paragraphs }: any) {
  return (
    <main>
      <h1>{myTitle}</h1>
      {paragraphs?.map((block: any, i: number) => (
        <QueenofheartsRenderComponent key={i} data={block} />
      ))}
    </main>
  );
}
```

## Block Components

Each block component receives its CMS fields as direct props. Field names and types come from `get_type_schema`.

```tsx
// components/blocks/HeroBlock.tsx
interface HeroBlockProps {
  __typename: "HeroRecord";
  headline: string;
  body?: string;
  image?: { url: string; alt?: string };
}

export default function HeroBlock({ headline, body, image }: HeroBlockProps) {
  return (
    <section>
      {image?.url && <img src={image.url} alt={image.alt ?? ""} />}
      <h2>{headline}</h2>
      {body && <p>{body}</p>}
    </section>
  );
}
```

## Null Safety Rules (CRITICAL)

These patterns MUST be followed in every generated component:

### 1. Arrays from the CMS may be a single object

When the CMS returns only one item in a union/block array field, it may return the item as a bare object instead of a single-element array. Always wrap CMS array fields with an `ensureArray()` helper before calling `.map()`:

```ts
function ensureArray<T>(v: T | T[] | undefined | null): T[] {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}

// Before .map() on any CMS union array:
const content = ensureArray(tab.content);
```

This applies to ANY field that is `z.array(z.looseObject({ __typename: z.string() }))` — i.e. union/modular block arrays. Apply this to tab content, column cards, section blocks, etc.

### 2. Numeric field guards must use `!= null`, not `!== undefined`

The CMS may send `null` for empty/missing numeric fields. Guards like `!== undefined` will NOT catch `null` (because `null !== undefined` is `true`), causing `.toLocaleString()` and other number methods to crash.

```ts
// WRONG — null passes through
{
  c.contributions !== undefined && c.contributions.toLocaleString();
}

// CORRECT — catches both null and undefined
{
  c.contributions != null && c.contributions.toLocaleString();
}
```

### 3. Destructured defaults do NOT override CMS `null`

JavaScript destructuring defaults only apply when the value is `undefined`, not when it is `null`. The CMS may send `null` for empty arrays, so `= []` defaults will leave the variable as `null`.

```ts
// WRONG — ratingOptions remains null when CMS sends null
({ ratingOptions = [] }: Props) => {
  ratingOptions.length; // crashes on null
};

// CORRECT — use null-coalescing after destructuring
({ ratingOptions: raw }: Props) => {
  const ratingOptions = raw ?? [];
  // ratingOptions is always an array now
};
```

## "use client" Rules

`QueenofheartsRenderComponent` calls `QueenofheartsService.getInstance()` at render time. If that runs in a browser context before the service is initialized client-side, every block silently disappears with a "QueenofheartsService is not initialized" console error.

**NEVER add `"use client"` to:**

- The root page component (it is a server component — it renders on the server where `init()` was already called)
- Any component that calls `QueenofheartsRenderComponent`
- `registerComponents.ts`

**DO add `"use client"` to:** components that use React hooks (`useState`, `useEffect`, etc.), DOM event handlers (`onSubmit`, `onClick`, `onChange`, `onInput`, `onKeyDown`), or any browser API (`window`, `document`, `navigator`) — but ONLY when they do NOT also call `QueenofheartsRenderComponent`. If a component uses clients side and server side logic it needs to get split.

**When a block genuinely needs BOTH hooks and nested CMS blocks**, split it into two files:

- An outer server component that calls `QueenofheartsRenderComponent` for the nested items
- An inner `"use client"` component that handles only the interactive state (tabs, accordion open/close, etc.) and receives already-rendered children as props or slots

The `QueenofheartsProvider` in the layout (see Phase 5a) guards against this for any case that slips through.

## Nested CMS Blocks — Use the Renderer, Not Imports

If a component itself contains nested CMS blocks (e.g. a columns field where each column is its own registered type), pass each item to `QueenofheartsRenderComponent`. NEVER import or manually render the child component type.

**CRITICAL: The only valid prop for `QueenofheartsRenderComponent` is `data={}`. Do NOT use `block={}`, `component={}`, or any other prop name.**

```tsx
// CORRECT
<QueenofheartsRenderComponent data={block} />

// WRONG — will silently fail
<QueenofheartsRenderComponent block={block} />
```

# Cyclic Prevention

When a type can appear nested inside another instance of itself (e.g. a "related pages" block linking to other Pages), define the child's preview shape as a nested Zod schema inside the parent. Do NOT register the same type twice.

```ts
const PageSchema = z.object({
  myTitle: z.string(),
  slug: z.string(),
  paragraphs: z.array(z.looseObject({ __typename: z.string() })),
  // Nested preview: scalar fields only — no unions, no relations
  relatedPages: z
    .array(
      z.object({
        id: z.string(),
        title: z.string(),
        slug: z.string(),
        excerpt: z.string().optional(),
        image: z
          .object({ url: z.string(), alt: z.string().optional() })
          .optional(),
      }),
    )
    .optional(),
});

registerLazyComponent(PageComponent, "PageRecord", PageSchema);
```

The nested schema contains only scalar preview fields. Headless.li never recurses into the linked page's content tree.

# List Queries — Limit Fields

List queries (menus, indices) can return hundreds of records. Always constrain the schema to only the fields actually needed — do not reuse the page detail component's wide schema.

```ts
const NavItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
});
registerLazyComponent(NavItem, "PageRecord", NavItemSchema);
```

# Query Names: Single vs List

`list_models` returns singular queries (page content). `list_entries` auto-discovers list queries (menus, indices). They map to each other by naming convention.

**Important:** The list query name from `list_entries` (e.g. `"allPages"`) exists only in the MCP abstraction layer. At runtime, the QOH SDK's `service.query()` method communicates with the `execQuery` HTTP endpoint, which may not expose list queries. If `service.query()` fails for the list query name, use `service.queryGraphql()` instead, which sends a raw GraphQL string to the `execGraphqlQuery` endpoint.

```ts
// First attempt: service.query() (may fail for list queries)
const response = await service.query("allPages", {
  ignoreProperties: ["paragraphs"],
});

// Fallback: service.queryGraphql() (always works for list queries)
const res = await service.queryGraphql("{allPages{slug title}}");
const pages = res?.res?.data?.allPages ?? [];
```

# Workflow

Follow these phases in strict order. Do not skip ahead — each phase depends on the previous one's output.

## Phase 1: Requirements

The project is prefilled with a react, tailwind template (no components). Check out the structure until you are familiar with it. The following steps are meant to integrate the live CMS content into the webpage by using Headlessli (core-react).

## Phase 2: Model Selection

Call `list_models`. It returns `{queryName, typeName, description}[]` — one entry per content model in the CMS (e.g. page, landing page, blog post, menu).

If only one model is returned, use it automatically. If multiple are returned, present the list to the user and ask: **which model do you want to build?**

From the user's answer you now have:

- `queryName` (e.g. `"page"`) — used in `service.query()` calls at runtime
- `typeName` (e.g. `"PageRecord"`) — used in `get_type_schema`

Do not proceed until the user has chosen a model.

## Phase 3: Schema Discovery

**3.1 — Call `get_type_schema` with the `typeName` from Phase 2 (e.g. `"PageRecord"`)**

This returns the full field list for the selected model. From it, identify:

- The field that holds the array of content blocks (e.g. `paragraphs`) — this is the root blocks field name you will use in the root page component
- The block type names listed under that field (e.g. `HeroRecord`, `TextRecord`, `GalleryRecord`) — these are every component the model can contain

**HARD GATE — THE COMPONENT LIST IS NOW FIXED.**
The block type names from the array field above are your COMPLETE and FINAL build list.
Do NOT call `list_components`, `list_entries`, or `execute_query` to add to, remove from, or validate this list.
Do NOT look at live page data to decide what to build.
The ONLY tool you call next is `get_type_schema` — once per block type.

**ROOT TYPE REGISTRATION — The root CMS type (e.g. `PageRecord`) MUST be registered with `registerLazyComponent` alongside the block components.**

The `__typename` that `QueenofheartsRenderComponent` receives from `service.query()` is the root type name (e.g. `"Page"`). If it's not registered, QHRC renders `null` and the entire page is blank — even though data was fetched and blocks are registered.

The Zod schema for the root type comes from the same `get_type_schema` call in step 3.1. Example:

```ts
const PageSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  paragraphs: z.array(z.looseObject({ __typename: z.string() })),
});
registerLazyComponent(() => import("./components/Page"), "Page", PageSchema);
```

**3.2 — For each block type name found in step 3.1, call `get_type_schema`**

For every field in the returned schema, apply these rules in order:

| Field value                                                                                             | What it means                                               | What to do                                                                                                                                                                              |
| ------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `"String"`, `"Int"`, `"Float"`, `"Boolean"`, `"DateTime"`                                               | Scalar — known shape                                        | Map directly to Zod using the mapping table. No further tool calls.                                                                                                                     |
| Any other plain string not in the scalar list and not `"ID"` (e.g. `"FileField"`, `"Link"`, `"Button"`) | Single named type — shape not yet known                     | **Call `get_type_schema` on that string.** Map result to an inline `z.object({...})`. Do NOT register it as a component.                                                                |
| A single-element array (e.g. `["FileField"]`, `["Link"]`)                                               | List of a named type — shape not yet known                  | Call get_type_schema on the element. If the type is non-cyclic, use Kind 3 wildcard (z.object({ \_\_all: z.boolean() })). If cyclic, enumerate only the scalar preview fields (Kind 4). |
| A multi-element array (e.g. `["HeroBlock", "TextBlock"]`)                                               | Nested block union — Headless.li resolves at runtime        | Use `z.array(z.looseObject({ __typename: z.string() }))`. Do NOT call `get_type_schema` on the members — they are already registered as top-level components.                           |
| `"ID"`                                                                                                  | Truly unresolvable — shape cannot be determined from schema | Use `z.string().optional()` as a fallback.                                                                                                                                              |

## PHASE 3 COMPLETION REQUIREMENT

You MUST call `get_type_schema` for EVERY block type discovered in step 3.1 before proceeding to Phase 4.
Do NOT stop at a subset unless explicitly told otherwise by the user.
The ONLY exception is if you encounter an error from get_type_schema - then report that error and STOP.

**3.3 — Handle remaining `"ID"` fields**

If any field returned `"ID"` after the steps above, that field's GraphQL type is the `ID` scalar. Map it to `z.string()`. No further tool calls needed.

## Phase 4: Propose — STOP AND WAIT

Present to the user:

- The selected model, its `queryName`, and its blocks field name
- Each block type to create, with its prop interface (derived from `get_type_schema`)
- Proposed `registerComponents.ts` entries

**Do not write any source code until the user explicitly approves.**

## Phase 5: Generate Everything

Generate all files in order. Do not stop between files. Do NOT delete or overwrite any existing config directories (`.claude/`, `.git/`, `.opencode/`, etc.).

### 5a — Project Scaffold (create only if files don't already exist)

1. `package.json` — with `@qoh/core-react` or `@qoh/core-angular`, `zod`, and framework dependencies for the stack chosen in Phase 1. Find the most current version on npmjs and use that (example: npm view @qoh/core-react versions --json 2>/dev/null | tail -30)
2. `tsconfig.json` — standard strict config.
3. Framework build/config files for the chosen stack.
4. UI library config (Tailwind config, postcss, global stylesheet — or nothing for plain CSS).
5. Root layout/shell (imports global styles; renders `<html>`, `<body>`, and `{children}` or `<slot>`). Add `export const dynamic = "force-dynamic"` to the layout if NavBar calls QOH at runtime.
6. `.env.local` with `HEADLESSLI_TOKEN=` and `QOH_SERVER_URL=`.

> **Zod version check:** confirm `package.json` has `"zod": "^4.0.0"` or higher — not `^3.x`. `z.looseObject()` does not exist in Zod v3.

### 5b — Headless.li Source Files

Note: Spawn subagents to generate components. Give all the subagents a proper full fledged prompt with all the "do" and "do not" instruction and guide rails you got from the initial command so they will avoid doing the same error.

7. `registerComponents.ts` — one `registerLazyComponent` call per block type discovered in Phase 3. Follow the example in [Component Registration](#component-registration) exactly. **Do NOT add generic type parameters** (e.g. `registerLazyComponent<typeof ...>`). Pass only the loader, typeName, and schema.
8. Root page component — receives the blocks field name from Phase 3.1; maps each item to `<QueenofheartsRenderComponent>`. Use `data={block}` — never `block={}`.
9. One component file per block type — typed props from `get_type_schema`. Use `<QueenofheartsRenderComponent data={...}>` for any nested block fields. **Apply the `ensureArray()` pattern** on every CMS union/block array before `.map()`. Write each file individually with the Write tool.

## Post-Generation "use client" Audit

# Files with event handlers that DON'T import QHRC → MUST have "use client"

After all components are written, run:
grep -rl 'onSubmit\|onClick\|onChange\|onInput\|onKeyDown' app/components \
 | xargs grep -L 'QueenofheartsRenderComponent' \
 | xargs grep -L '"use client"'

10. Page route / entry point — initializes `QueenofheartsService`, calls `registerComponents()`, fetches by `queryName`, renders the root page component. Follow the [Data Fetching](#data-fetching) example for the chosen framework.

Do not forget to register the root type in registerComponents or no content will load. Example:
registerLazyComponent(
() => import("./components/PageComponent"),
"Page",
z.object({
id: z.string().optional(),
slug: z.string().optional(),
title: z.string().optional(),
paragraphs: z.array(z.looseObject({ \_\_typename: z.string() })).optional(),
}),
);

### 5c — Navigation

11. Call `list_entries`. It returns `{queryName, entries}[]`. Find the entry whose list query matches the model you built (e.g. model `page` → list query `allPages`).

Write a server component (no `"use client"`) using `queryGraphql` — NOT `service.query()` — and add it to the root layout above `{children}`:

```tsx
// app/components/NavBar.tsx
import { QueenofheartsService } from "@qoh/core-react";
import Link from "next/link";

export default async function NavBar() {
  QueenofheartsService.init(
    process.env.HEADLESSLI_TOKEN ?? "",
    process.env.QOH_SERVER_URL,
  );

  let pages: { slug: string; title: string }[] = [];
  try {
    const res = await QueenofheartsService.getInstance().queryGraphql(
      "{allPages{slug title}}",
    );
    pages = res?.res?.data?.allPages ?? [];
  } catch {
    // Server unreachable during build — render empty nav
  }

  return (
    <nav>
      {pages.map((p) => (
        <Link key={p.slug} href={`/${p.slug}`}>
          {p.title}
        </Link>
      ))}
    </nav>
  );
}
```

Replace `allPages` with the actual list queryName from `list_entries`. Use only `slug` and `title` in the GraphQL query — never pull the full blocks array.

> **Why `queryGraphql` and not `query()`?** The MCP `list_entries` tool uses an internal mechanism that the runtime `execQuery` HTTP endpoint does not expose. List queries are only available through raw GraphQL via `queryGraphql`. See [Query Names: Single vs List](#query-names-single-vs-list).

### 5d — Install

12. Run `npm install` (or the user's package manager). Do NOT ask the user to do it.

### 5e - linter check.

13. run npx tsc --noEmit and fix all errors that might get reported.

## Phase 6: Build and Fix

13. Run `npm run build` (or `npx next build`). The build MUST succeed with **zero errors** before proceeding. If the build fails:
    - Read each error carefully. Fix the root cause — do NOT suppress errors or skip linting.
    - **Common build errors:**
      - `Type error: ... does not satisfy the constraint 'ZodObject<any, any>'` → A `registerLazyComponent` call has a generic type parameter. Remove it.
      - `Module not found: Can't resolve '...QueenofheartsRenderComponent'` → A component imported QHRC from a local path. Change to `from '@qoh/core-react'`.
      - `Property 'map' does not exist on type 'never'` → A CMS array field needs `ensureArray()`.
    - Rebuild after every fix until it passes cleanly (no errors, no warnings that indicate real issues).

## Phase 7: Start, Curl, and Fix

NOTE: Kill only the node server you started yourself. You can check if something is running on the port you need.
netstat -ano | findstr :3208
and try to kill it either with npx
npx kill-port 3208
or the taskID returned by netstat
taskkill /F /PID 33360

14. Start the dev server: `npm run dev` (or `npx next dev`). Wait for "Ready". Do not start it in an interactive mode. Use port 3208 exclusively. If you need to kill your own server, remember to only kill the one running on port 3208 and not any of the running infrastructure.
15. For every slug returned by `list_entries`, curl the page and check for errors:

    ```bash
    for slug in <space-separated slug list from list_entries>; do
      curl -s "http://localhost:<port>/$slug" | grep -c "data-dgst"
    done
    ```

    Any non-zero count means a server-rendering error occurred and the page fell back to client rendering.

    For EVERY page curl, the agent MUST run a second grep for at least one unique content string from the execute_query output. This check is unconditional — it runs whether data-dgst is zero or not. An empty page with HTTP 200 and zero data-dgst is still a failure.

16. For each page that returns errors, re-curl and extract the actual error message:

    ```bash
    curl -s "http://localhost:<port>/problem-page" | grep -o 'data-msg="[^"]*"'
    ```

17. Fix each error at its source component. Common runtime errors and their fixes:

    | Error                                                                                              | Cause                                                                                    | Fix                                                               |
    | -------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
    | `.map is not a function`                                                                           | CMS returned a single object instead of a one-element array for a union field            | Wrap the field with `ensureArray()` before `.map()`               |
    | `.toLocaleString is not a function` or `Cannot read properties of null (reading 'toLocaleString')` | A numeric field is `null` but the guard uses `!== undefined` (which passes for `null`)   | Change guard to `!= null`                                         |
    | `Cannot read properties of null (reading 'length')`                                                | A destructured default `= []` didn't apply because the CMS sent `null` (not `undefined`) | Use `const arr = rawProp ?? []` after destructuring               |
    | `data-dgst` present with no clear message                                                          | A `'use client'` component may be accessing browser APIs during SSR                      | Check for `navigator`, `window`, `document` access without guards |

18. Loop steps 16-17 (curl → read error → fix → restart dev server → re-curl) until ALL pages return HTTP 200 with zero `data-dgst` occurrences.

19. Once all pages pass, do a final `npm run build` to confirm production build still works.

20. Start the app and check if the startpage show actual content or an error. If there is an error, check if the backend is returning and error. Fix all found errors and continue from step 14.

21. When you think you are done, the page is actually not really loading. Give it another look and find out why the page is still showing "Page not found". Fix all bugs, keep checking until all files load.

22. Once you reported that you are done. You are not. Check all the rules, the Does and do nots against all components and routes you wrote.

23. Run a linter test.

24. Run a compile test.

25. Fix all bugs.

26. Test again that all pages load real content and not fail with an error or load only "Page not found".

27. Come up with another way to test the page and run that test as well.

28. Do not stop until all pages load proper content.

# Common Errors

| Error                                                                              | Cause                                                                                                                                                    | Fix                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| ---------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| "Selections can't be made directly on unions"                                      | Tried to query union fields manually.                                                                                                                    | Use `z.looseObject({ __typename: z.string() })` — let Headless.li handle union resolution.                                                                                                                                                                                                                                                                                                                                                                                                                        |
| CORS error                                                                         | Browser fetching a different origin.                                                                                                                     | Use Next.js rewrites to proxy to the Headless.li server.                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| Empty page / "Unknown block type"                                                  | Data lacks `__typename` or wrong query name.                                                                                                             | Verify the query returned records. The response key matches the query name — extract it (e.g. `response?.page`).                                                                                                                                                                                                                                                                                                                                                                                                  |
| "Failed to fetch"                                                                  | Network/CORS or wrong server URL.                                                                                                                        | Check `QOH_SERVER_URL` and auth token.                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| Cyclic / infinite recursion                                                        | A type links back to itself without a preview-only inline schema.                                                                                        | Define the child's preview shape inline with only scalar fields — see [Cyclic Prevention](#cyclic-prevention).                                                                                                                                                                                                                                                                                                                                                                                                    |
| "QueenofheartsService is not initialized" console errors, blocks missing from page | A component that calls `QueenofheartsRenderComponent` has `"use client"`, so `getInstance()` runs in the browser before `init()` was called client-side. | Remove `"use client"` from every component that calls `QueenofheartsRenderComponent`. If a component genuinely needs both hooks and nested block rendering, add a client-side provider to `layout.tsx`: create `app/providers.tsx` with `"use client"`, call `QueenofheartsService.init(process.env.NEXT_PUBLIC_HEADLESSLI_TOKEN, process.env.NEXT_PUBLIC_QOH_SERVER_URL)` and `registerComponents()` in it, then wrap layout children with it. Add the `NEXT_PUBLIC_` variants of both env vars to `.env.local`. |
| Zod schema returns `true` for all fields, server only returns `{ __typename }`     | Using Zod v3 — `_def.type` is undefined in v3 so every schema hits the default branch and returns `true`, causing the server to omit all fields.         | Set `"zod": "^4.0.0"` in `package.json` and reinstall.                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `__webpack_modules__[moduleId] is not a function`                                  | A component imported `QueenofheartsRenderComponent` from a local/relative path instead of the package.                                                   | Change the import to `import { QueenofheartsRenderComponent } from '@qoh/core-react'`.                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `Type error: ... does not satisfy the constraint 'ZodObject<any, any>'`            | A `registerLazyComponent` call has an inline generic type parameter like `registerLazyComponent<typeof z.ZodObject<...>>(...)`.                          | Remove the generic type parameter entirely — just pass `(loader, typeName, schema)`. TypeScript infers the generic from the schema argument.                                                                                                                                                                                                                                                                                                                                                                      |
| `.map is not a function` on a CMS union array field                                | The CMS returned a bare object instead of an array for a field that had only one item.                                                                   | Always wrap CMS union arrays with `ensureArray()` before calling `.map()`. See [Null Safety Rules](#null-safety-rules-critical).                                                                                                                                                                                                                                                                                                                                                                                  |
| `.toLocaleString()` crashes with `Cannot read properties of null`                  | A numeric field guard uses `!== undefined` but the CMS sends `null`.                                                                                     | Change all numeric guards from `!== undefined` to `!= null`.                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `Cannot read properties of null (reading 'length')`                                | A destructured default `= []` failed because the CMS sent `null` for an empty array.                                                                     | Replace `= []` defaults with `?? []` after destructuring.                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| NavBar empty, all pages are `not-found`                                            | Layout crashes because the NavBar calls `QueenofheartsService` at build time when the QOH server is unreachable.                                         | Always wrap the NavBar query in a try/catch. Add `export const dynamic = "force-dynamic"` to `layout.tsx` if NavBar is async.                                                                                                                                                                                                                                                                                                                                                                                     |
