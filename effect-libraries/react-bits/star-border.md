# StarBorder — React Bits

An animated sparkle/star travels continuously around the border of any element. Draws the eye to key CTAs, badges, or highlighted cards without being overwhelming.

## Install

```bash
npx shadcn@latest add https://reactbits.dev/r/StarBorder-TS-TW
```

No peer dependencies.

## Props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `children` | `ReactNode` | **Required** | Content inside the bordered element. |
| `as` | `React.ElementType` | `'button'` | HTML element or component to render as. Use `'div'` for non-interactive wrappers. |
| `color` | `string` | `'white'` | Colour of the animated star/sparkle. |
| `speed` | `string` | `'6s'` | CSS animation duration — lower = faster orbit. `'4s'` is snappy, `'8s'` is calm. |
| `thickness` | `number` | `1` | Padding (px) between the border animation and the inner content. |
| `className` | `string` | `''` | Applied to the outer wrapper. |
| `...rest` | `object` | — | Standard HTML attributes spread to the root element. |

## Usage Example

```tsx
import StarBorder from '@/components/reactbits/StarBorder'
import { Button } from '@/components/ui/button'

// CTA button with animated star border
export default function CtaButton({
  label,
  href,
}: {
  label: string
  href: string
}) {
  return (
    <StarBorder as="div" color="#6366f1" speed="5s" className="inline-block rounded-lg">
      <Button asChild size="lg" className="border-0">
        <a href={href}>{label}</a>
      </Button>
    </StarBorder>
  )
}

// Highlighted card or pricing tier
export function FeaturedTile({ children }: { children: React.ReactNode }) {
  return (
    <StarBorder as="div" color="#f59e0b" speed="4s" className="rounded-xl">
      {children}
    </StarBorder>
  )
}
```

## CMS Usage Notes

- Use `as="div"` when wrapping non-interactive content (cards, tiles, image containers).
- Use `as="button"` only if the element itself is clickable — otherwise prefer wrapping a shadcn `<Button>` inside a `div` wrapper (see example).
- `color` should match the brand accent colour. White works universally on dark backgrounds.
- Apply sparingly — one or two per page is effective; more than that becomes visual noise.
- The border animation is CSS-only, no `"use client"` required in your wrapper component.
