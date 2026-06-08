# Breadcrumb — shadcn/ui

Hierarchical navigation trail showing the user's current location within the site. Renders as a semantic `<nav>` with `aria-label="breadcrumb"`.

## Install

```bash
npx shadcn@latest add breadcrumb
```

## Import

```tsx
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from "@/components/ui/breadcrumb"
```

## Props

All sub-components accept `className`. Key-specific props:

| Component | Key Prop | Notes |
|-----------|----------|-------|
| `BreadcrumbLink` | `href: string`, `asChild?: boolean` | Use `asChild` with Next.js `<Link>` for client-side navigation. |
| `BreadcrumbPage` | — | Renders the current (non-linked) page label. |
| `BreadcrumbSeparator` | `children?: ReactNode` | Default separator is `/`. Replace `children` to use a custom icon (e.g. `<ChevronRightIcon />`). |
| `BreadcrumbEllipsis` | — | Drop-in for collapsed middle segments. |

## Usage Example

```tsx
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import Link from "next/link"

type Crumb = { label: string; href?: string }

export default function BreadcrumbBlock({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {crumbs.map((crumb, i) => (
          <BreadcrumbItem key={i}>
            {i < crumbs.length - 1 ? (
              <>
                <BreadcrumbLink asChild>
                  <Link href={crumb.href ?? "/"}>{crumb.label}</Link>
                </BreadcrumbLink>
                <BreadcrumbSeparator />
              </>
            ) : (
              <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
            )}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
```

## CMS Mapping Notes

- The CMS breadcrumb block likely has an array field of `{ label, href }` items. The last item is the current page and should use `<BreadcrumbPage>` (no link).
- Use `asChild` + Next.js `<Link>` on `BreadcrumbLink` to avoid full-page reloads.
- `BreadcrumbSeparator` must be rendered **outside** `BreadcrumbItem` — place it as a sibling after each non-last item (see example above).
- This is a server component — no `"use client"` needed.
