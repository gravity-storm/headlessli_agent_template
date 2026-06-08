# SplitText — React Bits

Animates a heading by revealing each character or word with a slide+fade using GSAP ScrollTrigger. More kinetic than BlurText — best for large hero headlines.

## Install

```bash
npm install gsap @gsap/react
npx shadcn@latest add https://reactbits.dev/r/SplitText-TS-TW
```

**Peer dependencies:** `gsap@^3.13.0` and `@gsap/react@^2.1.2`.

## Props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `text` | `string` | **Required** | The heading text. |
| `splitType` | `string` | `'chars'` | `'chars'` for per-character; `'words'` for per-word. |
| `tag` | `string` | `'p'` | HTML tag to render (use `'h1'`, `'h2'` etc. for semantic headings). |
| `from` | `object` | `{ opacity: 0, y: 40 }` | GSAP starting state for each element. |
| `to` | `object` | `{ opacity: 1, y: 0 }` | GSAP end state. |
| `delay` | `number` | `50` | Stagger delay in ms between elements. |
| `duration` | `number` | `1.25` | Animation duration in seconds per element. |
| `ease` | `string` | `'power3.out'` | GSAP easing. Common alternatives: `'power2.out'`, `'back.out(1.7)'`. |
| `threshold` | `number` | `0.1` | ScrollTrigger visibility threshold. |
| `rootMargin` | `string` | `'-100px'` | Scroll trigger root margin — negative value delays trigger. |
| `textAlign` | `string` | `'center'` | CSS text-align. |
| `className` | `string` | `''` | Applied to the wrapper. |
| `onLetterAnimationComplete` | `() => void` | — | Fires when all character animations complete. |

## Usage Example

```tsx
import SplitText from '@/components/reactbits/SplitText'

export default function HeroHeadline({ headline }: { headline: string }) {
  return (
    <SplitText
      text={headline}
      tag="h1"
      splitType="chars"
      delay={30}
      duration={0.8}
      ease="power3.out"
      textAlign="left"
      className="text-6xl font-extrabold leading-tight"
    />
  )
}
```

## CMS Usage Notes

- Use `tag="h1"` / `tag="h2"` for semantic HTML — don't default to `'p'`.
- `splitType="chars"` works best on short hero phrases (2–6 words). For longer headings use `'words'`.
- `delay={30}` with `duration={0.8}` is a fast, punchy preset. Increase `delay` to 50+ for a gentler cascade.
- Requires `gsap` package — ensure `npm install gsap` runs during Phase 5d install step.
- Component is `"use client"` internally.
