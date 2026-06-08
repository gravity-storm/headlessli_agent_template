# wa-divider — Web Awesome

Thin horizontal or vertical line that visually separates sections. Semantic equivalent of `<hr>`.

## Install

```bash
npm install @awesome.me/webawesome
```

```ts
import '@awesome.me/webawesome/dist/styles/webawesome.css'
import '@awesome.me/webawesome/dist/components/divider/divider.js'
```

## Attributes

| Attribute | Type | Default | Notes |
|-----------|------|---------|-------|
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Vertical requires a flex parent with defined height. |

## CSS Custom Properties

| Property | Notes |
|----------|-------|
| `--color` | Line colour. |
| `--width` | Line thickness (e.g. `'2px'`). |
| `--spacing` | Margin above and below (horizontal) or left and right (vertical). |

## Usage Example

```tsx
// Simple section divider
export default function DividerBlock({
  spacing = '2rem',
  color,
}: {
  spacing?: string
  color?: string
}) {
  const style: React.CSSProperties = {
    '--spacing': spacing,
    ...(color ? { '--color': color } : {}),
  } as React.CSSProperties

  return <wa-divider style={style} />
}

// Vertical separator between inline items
export function InlineDivider() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', height: '1.25rem' }}>
      <span>Item A</span>
      <wa-divider orientation="vertical" />
      <span>Item B</span>
    </div>
  )
}
```

## CMS Mapping Notes

- A CMS divider/spacer block often has no fields beyond `__typename` — just render `<wa-divider />` with default spacing.
- If the block has a `spacing` field (e.g. `"small"`, `"medium"`, `"large"`), map to `--spacing`: `sm → '1rem'`, `md → '2rem'`, `lg → '4rem'`.
- CSS custom properties must be passed via inline `style` as a cast `React.CSSProperties` object.
- No `"use client"` needed.
