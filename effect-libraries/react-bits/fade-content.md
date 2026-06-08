# FadeContent — React Bits

Wraps any block of content so it fades (and optionally blurs) in as it scrolls into the viewport. The most versatile scroll animation — apply it to any section that should feel like it "arrives" rather than just being there.

## Install

```bash
npm install gsap
npx shadcn@latest add https://reactbits.dev/r/FadeContent-TS-TW
```

**Peer dependency:** `gsap@^3.13.0`.

## Props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `children` | `ReactNode` | **Required** | The content to animate. |
| `blur` | `boolean` | `false` | Also animates a blur effect alongside the fade. Adds extra polish. |
| `duration` | `number` | `1000` | Animation duration. Values >10 are treated as ms; ≤10 as seconds. |
| `delay` | `number` | `0` | Delay before animation starts (same ms/s convention). |
| `ease` | `string` | `'power2.out'` | GSAP easing. |
| `threshold` | `number` | `0.1` | Scroll trigger threshold (0–1). |
| `initialOpacity` | `number` | `0` | Starting opacity (0 = invisible). |
| `disappearAfter` | `number` | `0` | If >0, fades out again after this delay. Leave at 0 for standard "fade in and stay" behaviour. |
| `className` | `string` | `''` | Applied to the wrapper div. |
| `style` | `CSSProperties` | — | Inline styles on the wrapper. |

## Usage Example

```tsx
import FadeContent from '@/components/reactbits/FadeContent'
import { QueenofheartsRenderComponent } from '@qoh/core-react'

// Wrap any CMS block in FadeContent to give it a scroll-in entrance
export default function FeaturesSection({ blocks }: { blocks: any[] }) {
  return (
    <FadeContent blur duration={800} delay={100}>
      <section className="py-16 px-6">
        <QueenofheartsRenderComponent data={blocks} />
      </section>
    </FadeContent>
  )
}
```

## CMS Usage Notes

- Wrap the **outer section container**, not individual elements inside it. One `<FadeContent>` per CMS block is the right granularity.
- `blur={true}` adds a premium feel with minimal performance cost — recommended for hero and feature sections.
- `duration={800}` with `delay={0}` is a good general preset. Stagger multiple sections by incrementing `delay` (0, 100, 200ms).
- `disappearAfter` should stay at `0` for CMS content pages — content should remain visible once revealed.
- **Important:** `FadeContent` wraps `children` in a `<div>`. If the content inside calls `QueenofheartsRenderComponent`, the `FadeContent` wrapper must NOT have `"use client"`. Since `FadeContent` is `"use client"` internally, this creates a conflict — split the component: an outer server wrapper calls QHRC, an inner client component wraps the result with `FadeContent` after the data is resolved.
