# BlurText — React Bits

Animates a heading by blurring and fading each word (or character) into view when the element scrolls into the viewport. No external dependencies — uses CSS transitions via Intersection Observer.

## Install

```bash
npm install motion
npx shadcn@latest add https://reactbits.dev/r/BlurText-TS-TW
```

**Peer dependency:** `motion` (the standalone Framer Motion package).

## Props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `text` | `string` | `''` | **Required.** The heading text to animate. |
| `animateBy` | `'words' \| 'characters'` | `'words'` | `'words'` is subtler; `'characters'` is more dramatic. |
| `direction` | `'top' \| 'bottom'` | `'top'` | Direction the text enters from. |
| `delay` | `number` | `200` | Stagger delay in ms between each word/character. |
| `stepDuration` | `number` | `0.35` | Duration of each step in seconds. |
| `threshold` | `number` | `0.1` | Intersection observer threshold (0–1). |
| `rootMargin` | `string` | `'0px'` | Intersection observer root margin. |
| `className` | `string` | `''` | Applied to the wrapper element. |
| `animationFrom` | `object` | blur 10px, opacity 0 | Custom GSAP-style starting state. |
| `animationTo` | `object[]` | blur→0, opacity→1 | Custom animation steps. |
| `onAnimationComplete` | `() => void` | — | Fires when all elements finish animating. |

## Usage Example

```tsx
import BlurText from '@/components/reactbits/BlurText'

// Replaces a plain <h1> — wrap in the tag you need via className
export default function HeroHeadline({ headline }: { headline: string }) {
  return (
    <BlurText
      text={headline}
      animateBy="words"
      direction="top"
      delay={120}
      className="text-5xl font-bold tracking-tight"
    />
  )
}
```

## CMS Usage Notes

- **Replace the raw heading element** with `<BlurText>` — do not wrap a `<h1>` in `<BlurText>`. Apply heading styles via `className` directly on `<BlurText>`.
- Use `animateBy="words"` (default) for long headings; `animateBy="characters"` for short dramatic phrases (3–5 words max).
- Keep `delay` between 80–150ms for natural feel. Values above 200ms feel slow on long headings.
- This component uses `"use client"` internally — your wrapper does NOT need it, but the parent must not be a server component that also calls `QueenofheartsRenderComponent`. Split if needed.
