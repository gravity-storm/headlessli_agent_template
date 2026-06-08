# wa-tag — Web Awesome

Inline label for content categories, keywords, and taxonomy tags. Prefer `wa-tag` over `wa-badge` for CMS tag/category fields — `wa-badge` is for status indicators and counts.

## Install

```bash
npm install @awesome.me/webawesome
```

```ts
import '@awesome.me/webawesome/dist/styles/webawesome.css'
import '@awesome.me/webawesome/dist/components/tag/tag.js'
```

## Attributes

| Attribute | Type | Default | Notes |
|-----------|------|---------|-------|
| `variant` | `'brand' \| 'neutral' \| 'success' \| 'warning' \| 'danger'` | `'neutral'` | `'neutral'` is the right default for content tags. Use `'brand'` to highlight a featured category. |
| `appearance` | `'accent' \| 'filled' \| 'outlined' \| 'filled-outlined'` | `'accent'` | `'outlined'` or `'filled'` for flat tag lists. |
| `size` | `'xs' \| 's' \| 'm' \| 'l' \| 'xl'` | `'m'` | |
| `pill` | boolean | `false` | Fully rounded edges — recommended for tag lists. |
| `with-remove` | boolean | `false` | Adds a remove button — only useful for interactive tag inputs, not CMS display. |

## Usage Example

```tsx
// Single tag
export default function CategoryTag({ label }: { label: string }) {
  return (
    <wa-tag variant="neutral" appearance="outlined" pill>
      {label}
    </wa-tag>
  )
}

// Tag list from a CMS array field
export function TagList({ tags }: { tags: string[] }) {
  if (!tags?.length) return null
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
      {tags.map((tag) => (
        <wa-tag key={tag} variant="neutral" appearance="outlined" size="s" pill>
          {tag}
        </wa-tag>
      ))}
    </div>
  )
}
```

## CMS Mapping Notes

- CMS tag fields are typically `String[]` — map each string to a `<wa-tag>`.
- Use `variant="neutral" appearance="outlined" pill` as the default — it works on any background.
- Do NOT use `with-remove` for CMS display — it is for interactive inputs only.
- Wrap multiple tags in a `flex flex-wrap gap-2` container.
- No `"use client"` needed.
