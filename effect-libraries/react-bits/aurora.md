# Aurora — React Bits

Flowing aurora borealis colour wash fills a section background using a WebGL shader. Smooth, organic, and elegant — one of the more tasteful backgrounds in the library.

## Install

```bash
npm install ogl
npx shadcn@latest add https://reactbits.dev/r/Aurora-TS-TW
```

**Peer dependency:** `ogl@^1.0.11`.

## Props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `colorStops` | `string[]` | `['#5227FF', '#7cff67', '#5227FF']` | Array of hex colours blended across the aurora. 2–3 colours work best. |
| `amplitude` | `number` | `1.0` | Wave height intensity. Lower = gentler, higher = more dramatic. |
| `blend` | `number` | `0.5` | Smoothstep transition range between colour zones. |
| `speed` | `number` | `1.0` | Animation speed. Lower = slower, more meditative feel. |

## Usage Example

```tsx
import Aurora from '@/components/reactbits/Aurora'

export default function HeroBackground() {
  return (
    <div className="relative min-h-screen">
      {/* Aurora fills the background */}
      <div className="absolute inset-0 -z-10">
        <Aurora
          colorStops={['#3b82f6', '#8b5cf6', '#3b82f6']}
          amplitude={0.8}
          speed={0.6}
          blend={0.4}
        />
      </div>
      {/* Content on top */}
      <div className="relative z-10">
        {/* hero content */}
      </div>
    </div>
  )
}
```

## CMS Usage Notes

- Wrap `<Aurora>` in an `absolute inset-0` container inside a `relative` parent section.
- Match `colorStops` to the brand palette — use 2–3 shades of the primary colour for a cohesive look, or contrast complementary colours for drama.
- `amplitude={0.6}` + `speed={0.5}` is a calm, elegant preset for content-heavy pages.
- Dark text on an aurora background can be hard to read — add a semi-transparent overlay (`bg-black/40`) between the aurora and the content if needed.
- The aurora canvas fills its container — set a `min-height` on the parent section or the canvas will have zero height.
- Component is `"use client"` internally.
