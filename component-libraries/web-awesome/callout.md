# wa-callout — Web Awesome

Inline message block for tips, warnings, announcements, and error notices. Renders inside the page flow — not a toast or modal.

## Install

```bash
npm install @awesome.me/webawesome
```

```ts
import '@awesome.me/webawesome/dist/styles/webawesome.css'
import '@awesome.me/webawesome/dist/components/callout/callout.js'
import '@awesome.me/webawesome/dist/components/icon/icon.js'  // if using the icon slot
```

## Attributes

| Attribute | Type | Default | Notes |
|-----------|------|---------|-------|
| `variant` | `'brand' \| 'neutral' \| 'success' \| 'warning' \| 'danger'` | `'brand'` | Map CMS type field: info → `'brand'`, success → `'success'`, warning → `'warning'`, error → `'danger'`. |
| `appearance` | `'accent' \| 'filled' \| 'outlined' \| 'plain' \| 'filled-outlined'` | `'filled-outlined'` | |
| `size` | `'xs' \| 's' \| 'm' \| 'l' \| 'xl'` | `'m'` | |

## Slots

| Slot | Notes |
|------|-------|
| `icon` | Optional icon — use `<wa-icon>`. Pairs with matching variant for colour. |
| *(default)* | Main message content — can include `<strong>`, `<p>`, HTML. |

## Usage Example

```tsx
// Needs icon.js import alongside callout.js
const VARIANT_ICONS: Record<string, string> = {
  brand: 'circle-info',
  neutral: 'circle-info',
  success: 'circle-check',
  warning: 'triangle-exclamation',
  danger: 'circle-xmark',
}

export default function CalloutBlock({
  title,
  body,
  type = 'brand',
}: {
  title?: string
  body: string
  type?: 'brand' | 'neutral' | 'success' | 'warning' | 'danger'
}) {
  return (
    <wa-callout variant={type} appearance="filled-outlined">
      <wa-icon slot="icon" name={VARIANT_ICONS[type] ?? 'circle-info'}></wa-icon>
      {title && <strong>{title}</strong>}
      <p style={{ margin: 0 }}>{body}</p>
    </wa-callout>
  )
}
```

## CMS Mapping Notes

- Typical CMS fields: `title` (String, optional), `body` (String), `type` (String enum).
- Map `type` to `variant` — default unknown values to `'brand'`.
- The icon is optional but strongly recommended — it makes the callout type immediately clear.
- Body content can include inline HTML if the CMS field is rich text.
- No `"use client"` needed.
