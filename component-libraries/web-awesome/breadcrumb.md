# wa-breadcrumb — Web Awesome

Navigation trail showing the user's current location in the site hierarchy. Semantic `<nav>` with `aria-label` built in.

## Install

```bash
npm install @awesome.me/webawesome
```

```ts
import '@awesome.me/webawesome/dist/styles/webawesome.css'
import '@awesome.me/webawesome/dist/components/breadcrumb/breadcrumb.js'
import '@awesome.me/webawesome/dist/components/breadcrumb-item/breadcrumb-item.js'
```

## wa-breadcrumb Attributes

| Attribute | Notes |
|-----------|-------|
| `label` | Accessible `aria-label` for the nav element. Default: `'Breadcrumb'`. |

## wa-breadcrumb Slots

| Slot | Notes |
|------|-------|
| *(default)* | `<wa-breadcrumb-item>` elements. |
| `separator` | Custom separator between items (e.g. a `<wa-icon>`). |

## wa-breadcrumb-item

Add `href` to make an item a link. The last item (current page) should have no `href` — it automatically gets `aria-current="page"`.

| Slot | Notes |
|------|-------|
| *(default)* | Item label text. |
| `start` | Icon before the label. |
| `end` | Icon after the label. |

## Usage Example

```tsx
type Crumb = { label: string; href?: string }

export default function BreadcrumbBlock({ crumbs }: { crumbs: Crumb[] }) {
  if (!crumbs?.length) return null
  return (
    <wa-breadcrumb>
      {crumbs.map((crumb, i) => (
        <wa-breadcrumb-item key={i} href={crumb.href ?? undefined}>
          {crumb.label}
        </wa-breadcrumb-item>
      ))}
    </wa-breadcrumb>
  )
}
```

## CMS Mapping Notes

- CMS breadcrumb blocks typically have an array of `{ label: String, href?: String }` items.
- The last item (current page) must have no `href` — `wa-breadcrumb-item` handles `aria-current` automatically when `href` is absent.
- `href` on `wa-breadcrumb-item` triggers a full page navigation — for Next.js client-side routing, use a click handler with `router.push()` (needs `"use client"`). For most CMS sites, full navigation is acceptable.
- Both `breadcrumb.js` and `breadcrumb-item.js` must be imported.
- No `"use client"` needed for standard navigation links.
