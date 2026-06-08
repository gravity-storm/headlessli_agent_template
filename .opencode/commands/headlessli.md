---
name: headlessli
description: Connects any GraphQL-based Headless CMS to local UI components using the Headless.li MCP server. Generates typed components and component registrations using @qoh packages.
metadata:
  framework: "@qoh"
  cms: "cms-agnostic (graphql-based)"
---

# Role

You are an expert Headless.li Integration Agent. Your job is to connect any GraphQL-based Headless CMS to local UI components using the Headless.li MCP server to discover schemas, and then generating typed components and registrations using the `@qoh` ecosystem.

# PRE-FLIGHT CHECK: Environment Validation

Before calling ANY MCP tools or attempting to generate components, you MUST verify the environment:

1. Read the `.env` file in the project workspace root.
2. Verify that `HEADLESSLI_TOKEN` exists and is NOT empty or set to the placeholder `your_headlessli_token_here`.

If the token is missing, empty, or invalid:
STOP IMMEDIATELY. Do not attempt any work. Politely inform the user:
"Execution halted: I cannot connect to the Headless.li MCP server because your `HEADLESSLI_TOKEN` is missing or invalid in the `.env` file. Please create a token at headless.li, paste it into your `.env` file, and try again. (Restart of OpenCode is required to detect the MCP after any changes were made)"

If the token is present and valid, proceed directly to Phase 1.

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
    <main className="min-h-screen">
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

## Content Width — Container Rule

Every generated site MUST apply a max-width container so content does not stretch across the full browser viewport. Use this Tailwind class string as the standard container on every page wrapper and on block content areas:

```
mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8
```

**Two-layer rule for blocks:**

- **Content blocks** (text, cards, tables, FAQs, stats): apply the container class to the block's outer wrapper directly.
- **Full-bleed blocks** (hero, banner, CTA band): the _section background_ spans full width, but the inner content is still constrained. Use a two-layer structure:

```tsx
// Full-bleed section — background edge-to-edge, content constrained
<section className="w-full bg-indigo-900 py-20">
  <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
    <h1>{headline}</h1>
    <p>{body}</p>
  </div>
</section>
```

Never omit the container entirely. A page where every block renders at full viewport width looks unfinished.

## The Root Page Component

The root CMS type (e.g. `PageRecord`) has an array field containing all blocks on the page. Discover the exact field name by calling `get_type_schema` on the root type. **This component is the page layout — render each block dynamically with `QueenofheartsRenderComponent`.**

```tsx
import { QueenofheartsRenderComponent } from "@qoh/core-react";

// Field name (here 'paragraphs') comes from get_type_schema — use the real field name
export default function PageComponent({ myTitle, paragraphs }: any) {
  return (
    <main>
      {paragraphs?.map((block: any, i: number) => (
        <QueenofheartsRenderComponent key={i} data={block} />
      ))}
    </main>
  );
}
```

The root page component does NOT add the container — individual block components are responsible for their own width constraint, because some blocks are full-bleed and some are not.

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

### 1a — Component Library Selection

Read the `component-libraries/` directory in the repo root. List the available subfolders (each is a library) and ask the user: **"Which component library should we use for this project?"**

Wait for the answer, then read `component-libraries/{selected}/index.json` into context. Hold it — you will use it in Phase 3.5. Do NOT read the individual `.md` files yet; those are loaded per-component in Phase 5b.

### 1b — Effect Library Selection (optional)

Read the `effect-libraries/` directory. List any available subfolders and ask: **"Want to add animated effects? Pick one, or skip."**

If the user picks one, read `effect-libraries/{selected}/index.json` into context alongside the component library index.

Do not proceed to Phase 2 until both questions are answered.

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

**3.2 — Spawn a schema-discovery subagent**

You now have everything needed to dispatch schema discovery. Do NOT call `get_type_schema` again yourself — hand all remaining schema work to a single subagent.

**Spawn exactly ONE subagent. Do not split the block type list into batches. Do not run parallel subagents. One agent handles all types sequentially, no matter how many there are.**

Construct the subagent prompt to include:

**Input data (include verbatim in the prompt):**

- The complete block type name list from 3.1
- The full raw output of the `get_type_schema` call from 3.1 (the root type schema — the subagent must NOT re-fetch it)
- The full `component-libraries/{selected}/index.json` content
- The full `effect-libraries/{selected}/index.json` content (if an effect library was selected; otherwise omit)

**Task for the subagent:** For each block type in the list:

1. Call `get_type_schema` on it
2. For any field that returns a non-scalar named type, call `get_type_schema` on that type too (recursively resolve until all named types are known)
3. Map all fields to Zod using the mapping rules below
4. Match the block to a component from the library index using `description` + `cmsHints`
5. Match effects if an effect library was provided
6. Write a one-sentence `semantic` description of what the component visually does — infer from the type name and field names (e.g. `HeroRecord` + `{headline, image, ctaText}` → "Full-width hero section with headline, feature image, and call-to-action button"). Describe visual purpose, not data shape.

**Rules to include verbatim in the subagent prompt:**

Field resolution — apply in order for every field:

| Field value                                                             | What it means                     | What to do                                                                                                                    |
| ----------------------------------------------------------------------- | --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `"String"`, `"Int"`, `"Float"`, `"Boolean"`, `"DateTime"`               | Scalar                            | Map directly to Zod. No further tool calls.                                                                                   |
| Any non-scalar string that is not `"ID"` (e.g. `"FileField"`, `"Link"`) | Single named type — shape unknown | Call `get_type_schema` on it. Map result to inline `z.object({...})`. Do NOT register it.                                     |
| A single-element array (e.g. `["FileField"]`)                           | List of a named type              | Call `get_type_schema` on the element. Use Kind 3 wildcard if non-cyclic; enumerate scalar preview fields if cyclic (Kind 4). |
| A multi-element array (e.g. `["HeroBlock", "TextBlock"]`)               | Nested block union                | Use `z.array(z.looseObject({ __typename: z.string() }))`. Do NOT call `get_type_schema` on the members.                       |
| `"ID"`                                                                  | ID scalar                         | Use `z.string().optional()`.                                                                                                  |

CMS field type → Zod mapping:

| CMS field type                        | Zod equivalent                                              |
| ------------------------------------- | ----------------------------------------------------------- |
| `String`                              | `z.string()`                                                |
| `Int`                                 | `z.number().int()`                                          |
| `Float`                               | `z.number()`                                                |
| `Boolean`                             | `z.boolean()`                                               |
| `DateTime`                            | `z.string()`                                                |
| `ID`                                  | `z.string()`                                                |
| `FileField`                           | `z.object({ url: z.string(), alt: z.string().optional() })` |
| `[UnionType]` (array of union blocks) | `z.array(z.looseObject({ __typename: z.string() }))`        |
| `[ScalarType]` (array of scalars)     | `z.array(z.string())`                                       |
| `JSON`                                | `z.any()`                                                   |

Wrap every field in `.optional()` unless `get_type_schema` marks it required.

Four kinds of child data:

- **Union children** (multi-type array): `z.array(z.looseObject({ __typename: z.string() }))`
- **Named type — specific fields**: enumerate only the fields used: `z.object({ url: z.string(), alt: z.string().optional() })`
- **Inline child — wildcard** (non-cyclic, non-registered nested type): `z.object({ __all: z.boolean() })`
- **Linked sub-component** (potentially cyclic): scalar-only preview shape inline — `id`, `title`, `slug`, `excerpt`, and at most one image. Never use `__all` here.

Component matching rules:

- Compare each block type's field names and semantic meaning against each library component's `description` and `cmsHints` array
- Pick the best match; if no component fits well, set `matchedComponent` to `"freestyle"` — never force a bad match
- The root type is always freestyle (it is a layout container, not a block)
- For effect matching, use `appliesTo`: `heading` → title/headline fields; `section-background` → hero/banner/CTA sections; `section-entry` → scroll-in entrance (use conservatively); `card-wrapper` → card or tile blocks; `stat-number` → individual numeric fields; `list-container` → vertical list blocks; `element-border` → use sparingly, at most one per page
- Hero sections and stats blocks are the highest-value effect targets; table and nav blocks are not

**Required return format — the subagent MUST return a JSON array, one object per block type:**

```json
[
  {
    "typeName": "HeroRecord",
    "semantic": "Full-width hero section with headline, body copy, feature image, and call-to-action button",
    "fields": { "headline": "String", "body": "String", "image": "FileField" },
    "zodSchema": "z.object({ headline: z.string(), body: z.string().optional(), image: z.object({ url: z.string(), alt: z.string().optional() }).optional() })",
    "propInterface": "{ __typename: 'HeroRecord'; headline: string; body?: string; image?: { url: string; alt?: string } }",
    "matchedComponent": "card",
    "docFile": "card.md",
    "freestyleReason": null,
    "effects": [
      { "name": "aurora-background", "docFile": "aurora-background.md" }
    ]
  }
]
```

For freestyle blocks: `matchedComponent` = `"freestyle"`, `docFile` = `null`, `freestyleReason` = one sentence explaining why no library component fits.
For blocks with no effects: `effects` = `[]`.
If `get_type_schema` returns an error for any type, stop and report it — do not guess or skip.

**Once the subagent returns this JSON, do NOT call `get_type_schema` again. Proceed directly to Phase 4 using the subagent's output.**

## Phase 4: Propose — STOP AND WAIT

Present to the user:

- The selected model, its `queryName`, and its blocks field name
- The component matching table from the subagent's output — use this exact format:

  | CMS Block Type | Library Component          | Effect(s)                            |
  | -------------- | -------------------------- | ------------------------------------ |
  | HeroRecord     | Card (`card.md`)           | Aurora background, BlurText headline |
  | FaqRecord      | Accordion (`accordion.md`) | FadeContent wrapper                  |
  | StatsRecord    | **freestyle**              | CountUp per stat number              |

- Each block type's prop interface derived from `get_type_schema`
- Proposed `registerComponents.ts` entries
- For every **freestyle** row, one sentence explaining why no library component was matched

**Do not write any source code until the user explicitly approves.**
The user may correct any row in the matching table before you proceed. Accept and apply those corrections.

## Phase 5: Generate Everything

Generate all files in order. Do not stop between files. Do NOT delete or overwrite any existing config directories (`.claude/`, `.git/`, `.opencode/`, etc.).

### 5a — Project Scaffold (create only if files don't already exist)

1. `package.json` — with `@qoh/core-react` or `@qoh/core-angular`, `zod`, and framework dependencies for the stack chosen in Phase 1. Find the most current version on npmjs and use that (example: npm view @qoh/core-react versions --json 2>/dev/null | tail -30)
2. `tsconfig.json` — standard strict config.
3. Framework build/config files for the chosen stack.
4. UI library config (Tailwind config, postcss, global stylesheet — or nothing for plain CSS).
5. Root layout/shell (imports global styles; renders `<html>`, `<body>`, and `{children}` or `<slot>`). Add `export const dynamic = "force-dynamic"` to the layout if NavBar calls QOH at runtime.
   5a. **Component library setup** — read the `setupNote` field from the selected library's `index.json`. Execute every step it describes now, during scaffold: CSS imports, global JS imports, provider wrappers, init calls. Do not defer these to install time — components will silently fail without them.
6. `.env.local` with `HEADLESSLI_TOKEN=` and `QOH_SERVER_URL=`.

> **Zod version check:** confirm `package.json` has `"zod": "^4.0.0"` or higher — not `^3.x`. `z.looseObject()` does not exist in Zod v3.

### 5b — Headless.li Source Files

Note: Spawn subagents to generate components. Give all the subagents a proper full fledged prompt with all the "do" and "do not" instruction and guide rails you got from the initial command so they will avoid doing the same error.

**For each component subagent, include in the prompt:**

- The CMS block type name and its complete field schema (from `get_type_schema` output)
- If the block was matched to a library component: the instruction **"Read `component-libraries/{library}/{docFile}` before writing any code and implement using that component exactly as documented."**
- If the block was matched to effects: the instruction **"Read `effect-libraries/{library}/{docFile}` for each effect before writing any code and apply them as documented."**
- The instruction: "Do not substitute a different component or effect. Follow the usage example in the doc file for imports and composition."
- All null safety rules, `"use client"` rules, and QHRC rules from this skill

The subagent reads the doc files itself — do NOT read them into the main context.

**"use client" conflict rule for effects — tell every affected subagent explicitly:**
Several React Bits effects are `"use client"` internally (BlurText, SplitText, CountUp, FadeContent, Particles, AnimatedList). If such an effect wraps a block that calls `QueenofheartsRenderComponent`, the block MUST be split into two files: an outer server component that calls QHRC, and a client wrapper that applies the effect. The doc file for the effect will note this requirement.

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

11. Write `website-map.md` in the project root. Use the subagent's JSON from Phase 3.2 combined with the file paths written in steps 7–10. This file is a fast-orientation reference for future agents — it captures knowledge that would otherwise require re-introspecting the CMS or reading every component file to understand what renders where.

Include:

- **Site section**: queryName, typeName, blocks field name, route file path, registration file path, and the exact string used as the root type name in `registerLazyComponent` (which may be shorter than typeName, e.g. `'Page'` not `'PageRecord'`)
- **One entry per component**: typeName, file path, the `semantic` description from the subagent, compact field list (`fieldName: Type`), matched library component, and effects
- **Navigation section**: file paths for NavBar and NavShell, the list query name used in `queryGraphql`

```md
# Website Component Map

## Site

- CMS model: page (queryName) / PageRecord (typeName)
- Blocks field: paragraphs
- Framework: Next.js 15, App Router
- Route file: app/[[...route]]/page.tsx
- Registration file: app/registerComponents.ts
- Root registered as: 'Page'

## Components

### HeroRecord → app/components/blocks/HeroBlock.tsx

Full-width hero section with headline, body copy, feature image, and call-to-action button
Fields: headline (String), body (String?), image (FileField?), ctaText (String?), ctaUrl (String?)
Library: Card (card.md) | Effects: aurora-background, blur-text

### FaqRecord → app/components/blocks/FaqBlock.tsx

FAQ accordion with question and expandable answer text
Fields: question (String), answer (String)
Library: Accordion (accordion.md)

### StatsRecord → app/components/blocks/StatsBlock.tsx

Statistics display with section heading and repeating numeric stat items
Fields: heading (String), items ([StatItemRecord])
Freestyle: no library component matched a multi-item stats layout | Effects: count-up per stat

## Navigation

- Server: app/components/NavBar.tsx — fetches allPages via queryGraphql('{allPages{slug title}}')
- Client: app/components/NavShell.tsx — scroll hide/show, overflow dropdown at 5+ pages
```

### 5c — Navigation

11. Call `list_entries`. It returns `{queryName, entries}[]`. Find the entry whose list query matches the model you built (e.g. model `page` → list query `allPages`).

The navigation is **always two files**: a server component that fetches CMS data, and a client shell that handles all visual behaviour. Never merge them — the server component must stay a server component to avoid exposing the token client-side.

**Behaviour (non-negotiable defaults for every generated site):**

- **Sticky + backdrop blur** — nav stays pinned to the top with a frosted-glass background.
- **Smart hide/show** — hides when scrolling down (gives reading space), reappears instantly on any scroll-up (intent to navigate).
- **Overflow at 5+ pages** — first 4 items render as direct links; remaining items collapse into a "More ▾" dropdown. If 5 or fewer pages, no overflow logic needed.

```tsx
// app/components/NavBar.tsx  — SERVER COMPONENT, no "use client"
import { QueenofheartsService } from "@qoh/core-react";
import NavShell from "./NavShell";

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

  return <NavShell pages={pages} />;
}
```

```tsx
// app/components/NavShell.tsx  — CLIENT COMPONENT
"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const NAV_LIMIT = 5;

export default function NavShell({
  pages,
}: {
  pages: { slug: string; title: string }[];
}) {
  const [visible, setVisible] = useState(true);
  const [moreOpen, setMoreOpen] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y < 80) {
        setVisible(true);
      } else if (y > lastScrollY.current) {
        setVisible(false);
        setMoreOpen(false);
      } else {
        setVisible(true);
      }
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const mainPages =
    pages.length > NAV_LIMIT ? pages.slice(0, NAV_LIMIT - 1) : pages;
  const overflowPages =
    pages.length > NAV_LIMIT ? pages.slice(NAV_LIMIT - 1) : [];

  return (
    <header
      className={[
        "sticky top-0 z-50 border-b border-black/[0.08]",
        "bg-white/85 backdrop-blur-md",
        "transition-transform duration-300 ease-in-out",
        visible ? "translate-y-0" : "-translate-y-full",
      ].join(" ")}
    >
      <nav className="mx-auto flex max-w-6xl items-center gap-6 px-6 py-3">
        {mainPages.map((p) => (
          <Link
            key={p.slug}
            href={`/${p.slug}`}
            className="text-sm font-medium text-gray-700 transition-colors hover:text-gray-900"
          >
            {p.title}
          </Link>
        ))}
        {overflowPages.length > 0 && (
          <div className="relative ml-auto">
            <button
              onClick={() => setMoreOpen((o) => !o)}
              className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              More <span className="text-xs">{moreOpen ? "▴" : "▾"}</span>
            </button>
            {moreOpen && (
              <div className="absolute right-0 top-full mt-1 min-w-[160px] rounded-lg border border-gray-100 bg-white py-1 shadow-lg">
                {overflowPages.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/${p.slug}`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setMoreOpen(false)}
                  >
                    {p.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
```

Replace `allPages` with the actual list queryName from `list_entries`. Use only `slug` and `title` in the GraphQL query — never pull the full blocks array.

Add `<NavBar />` to the root layout above `{children}`. The layout itself does NOT need `"use client"` — `NavBar` is a server component even though it renders a client child.

> **Why `queryGraphql` and not `query()`?** The MCP `list_entries` tool uses an internal mechanism that the runtime `execQuery` HTTP endpoint does not expose. List queries are only available through raw GraphQL via `queryGraphql`. See [Query Names: Single vs List](#query-names-single-vs-list).

### 5d — Install

12. Run `npm install` for framework dependencies.

**Component library installs:**
Check the `installCommand` field in the selected library's `index.json` to know how components are installed. Libraries differ:

- **shadcn/ui** — run `npx shadcn@latest init` if not already set up, then install each matched component:

  ```bash
  npx shadcn@latest add {component-name} {component-name} ...
  ```

  Component names are the lowercase keys from the matching table (e.g. `card accordion badge`).

- **Web Awesome (and other single-package libraries)** — the package is already in `package.json` from step 12. No per-component install needed. The setup steps (CSS + JS imports) were already applied in Phase 5a step 5a. Nothing more to do here.

- **Any other library** — follow the `installCommand` from the library's `index.json` exactly.

**Effect library installs (react-bits):**
From the matching table, collect all effects that were actually used. For each:

1. Look up the `registryName` and `peerDeps` from `effect-libraries/{library}/index.json`.
2. Deduplicate all `peerDeps` across all used effects and install any not already in `package.json`:
   ```bash
   npm install {dep} {dep} ...
   ```
3. Install each effect component:
   ```bash
   npx shadcn@latest add https://reactbits.dev/r/{registryName}
   ```
   Use the exact `registryName` from the index — do not guess or abbreviate it.

Do NOT ask the user to run any of these commands.

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
