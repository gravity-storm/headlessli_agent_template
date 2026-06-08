# wa-skeleton — Web Awesome

Animated placeholder shown while content is loading. Compose multiple skeletons to mirror the shape of the real component.

## Install

```bash
npm install @awesome.me/webawesome
```

```ts
import '@awesome.me/webawesome/dist/styles/webawesome.css'
import '@awesome.me/webawesome/dist/components/skeleton/skeleton.js'
```

## Attributes

| Attribute | Type | Default | Notes |
|-----------|------|---------|-------|
| `effect` | `'sheen' \| 'pulse' \| 'none'` | `'none'` | `'sheen'` is the most recognisable loading animation — recommended. |

## CSS Custom Properties

| Property | Notes |
|----------|-------|
| `--color` | Base colour of the skeleton block. |
| `--sheen-color` | Highlight colour of the sheen animation. |

Shape and size are controlled by CSS on the element itself — use `width`, `height`, and `border-radius` via inline styles or Tailwind classes.

## Usage Examples

```tsx
import React from 'react'

// Card placeholder
export function CardSkeleton() {
  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
      <wa-skeleton effect="sheen" style={{ height: '200px', display: 'block' }} />
      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <wa-skeleton effect="sheen" style={{ height: '1.25rem', width: '60%', display: 'block', borderRadius: '4px' }} />
        <wa-skeleton effect="sheen" style={{ height: '1rem', width: '80%', display: 'block', borderRadius: '4px' }} />
        <wa-skeleton effect="sheen" style={{ height: '1rem', width: '40%', display: 'block', borderRadius: '4px' }} />
      </div>
    </div>
  )
}

// Avatar + text placeholder
export function AuthorSkeleton() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      <wa-skeleton effect="sheen" style={{ width: '40px', height: '40px', borderRadius: '50%', display: 'block' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <wa-skeleton effect="sheen" style={{ height: '1rem', width: '120px', display: 'block', borderRadius: '4px' }} />
        <wa-skeleton effect="sheen" style={{ height: '0.875rem', width: '80px', display: 'block', borderRadius: '4px' }} />
      </div>
    </div>
  )
}
```

## CMS Mapping Notes

- `wa-skeleton` requires `display: 'block'` (or `display: 'flex'`) via inline style — it is an inline element by default and has no height without it.
- Mirror the shape of the real component: if the card has a media image, header, and two lines of text, match that structure in the skeleton.
- Skeleton is infrastructure, not a CMS block type — use it as the `<Suspense fallback={...}>` element wrapping components that stream data.
- No `"use client"` needed.
