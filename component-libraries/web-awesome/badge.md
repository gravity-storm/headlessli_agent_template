# wa-badge — Web Awesome

Small status indicator or notification count. Use `wa-badge` for statuses and counts; use `wa-tag` for CMS content categories and keyword labels.

## Install

```bash
npm install @awesome.me/webawesome
```

```ts
import '@awesome.me/webawesome/dist/styles/webawesome.css'
import '@awesome.me/webawesome/dist/components/badge/badge.js'
```

## Attributes

| Attribute | Type | Default | Notes |
|-----------|------|---------|-------|
| `variant` | `'brand' \| 'neutral' \| 'success' \| 'warning' \| 'danger'` | `'brand'` | Map CMS status values: `new`/`featured` → `'brand'`, `active` → `'success'`, `sold-out`/`error` → `'danger'`. |
| `appearance` | `'accent' \| 'filled' \| 'outlined' \| 'filled-outlined'` | `'accent'` | |
| `pill` | boolean | `false` | Fully rounded — recommended for inline badges. |
| `attention` | `'none' \| 'pulse' \| 'bounce'` | `'none'` | Adds animation to draw attention. Use sparingly. |

## Slots

| Slot | Notes |
|------|-------|
| *(default)* | Badge label text. |

## Usage Example

```tsx
const STATUS_VARIANT: Record<string, 'brand' | 'neutral' | 'success' | 'warning' | 'danger'> = {
  new: 'brand',
  featured: 'brand',
  active: 'success',
  pending: 'warning',
  'sold-out': 'danger',
  error: 'danger',
}

export default function StatusBadge({ status }: { status: string }) {
  const variant = STATUS_VARIANT[status.toLowerCase()] ?? 'neutral'
  return (
    <wa-badge variant={variant} appearance="filled" pill>
      {status}
    </wa-badge>
  )
}
```

## CMS Mapping Notes

- Use for CMS fields like `status`, `availability`, or `label` with a small set of known values.
- For content tag arrays (`tags: String[]`), use `wa-tag` instead.
- Map CMS string values to `variant` with a lookup object — default unmapped values to `'neutral'`.
- `attention="pulse"` can be used for "new" or "live" indicators, but use sparingly.
- No `"use client"` needed.
