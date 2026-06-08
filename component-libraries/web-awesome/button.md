# wa-button — Web Awesome

Clickable action element with visual variants, sizes, and icon slots. Renders as an `<a>` tag when `href` is set — no wrapper needed.

## Install

```bash
npm install @awesome.me/webawesome
```

```ts
import '@awesome.me/webawesome/dist/styles/webawesome.css'
import '@awesome.me/webawesome/dist/components/button/button.js'
```

## Attributes

| Attribute | Type | Default | Notes |
|-----------|------|---------|-------|
| `variant` | `'neutral' \| 'brand' \| 'success' \| 'warning' \| 'danger'` | `'neutral'` | `'brand'` for primary CTAs. |
| `appearance` | `'accent' \| 'filled' \| 'outlined' \| 'plain' \| 'filled-outlined'` | `'accent'` | `'filled'` for solid buttons; `'outlined'` for secondary. |
| `size` | `'xs' \| 's' \| 'm' \| 'l' \| 'xl'` | `'m'` | |
| `href` | `string` | — | Set to make the button an anchor link. No wrapper needed. |
| `target` | `string` | — | `'_blank'` for external links. |
| `pill` | boolean | `false` | Fully rounded edges. |
| `disabled` | boolean | `false` | |
| `loading` | boolean | `false` | Shows a spinner in place of content. |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | |

## Slots

| Slot | Notes |
|------|-------|
| *(default)* | Button label text. |
| `start` | Icon or element before the label. |
| `end` | Icon or element after the label. |

## Usage Example

```tsx
// Primary CTA link
export default function CtaButton({ label, href }: { label: string; href: string }) {
  return (
    <wa-button href={href} variant="brand" appearance="filled" size="l">
      {label}
    </wa-button>
  )
}

// Button with icon
export function IconButton({ label, icon, href }: { label: string; icon: string; href: string }) {
  return (
    <wa-button href={href} variant="brand" appearance="outlined">
      <wa-icon slot="start" name={icon}></wa-icon>
      {label}
    </wa-button>
  )
}
```

## CMS Mapping Notes

- Use `href` directly on `wa-button` for link buttons — no Next.js `<Link>` wrapper needed. For client-side navigation within Next.js, use a click handler with `router.push()` from `useRouter()` — that requires `"use client"`.
- Map CMS `style`/`type` field to `variant` + `appearance`: primary → `variant="brand" appearance="filled"`, secondary → `variant="neutral" appearance="outlined"`.
- Map CMS `size` field to the `size` attribute.
- For multiple CTAs (primary + secondary), render them in a `<div className="flex gap-3">`.
- No `"use client"` needed for pure link buttons.
