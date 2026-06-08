# SpotlightCard — React Bits

A radial spotlight glows under the cursor as it moves over the card, following mouse position. Wraps any card content — pairs with shadcn/ui `<Card>` as the inner element.

## Install

```bash
npx shadcn@latest add https://reactbits.dev/r/SpotlightCard-TS-TW
```

No peer dependencies.

## Props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `children` | `ReactNode` | **Required** | The card content. Put a `<Card>` here. |
| `spotlightColor` | `string` | `'rgba(255,255,255,0.25)'` | Colour and opacity of the spotlight gradient. Match to brand. |
| `className` | `string` | `''` | Applied to the outer wrapper div. |

## Usage Example

```tsx
import SpotlightCard from '@/components/reactbits/SpotlightCard'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export default function FeatureCard({
  title,
  description,
  icon,
}: {
  title: string
  description?: string
  icon?: string
}) {
  return (
    <SpotlightCard
      spotlightColor="rgba(99, 102, 241, 0.3)"
      className="rounded-xl"
    >
      <Card className="h-full border-0 bg-transparent">
        <CardHeader>
          {icon && <span className="text-3xl">{icon}</span>}
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      </Card>
    </SpotlightCard>
  )
}
```

## CMS Usage Notes

- `SpotlightCard` is the **outer** wrapper; the shadcn `<Card>` sits **inside** it as `children`.
- Set `border-0 bg-transparent` on the inner `<Card>` if the spotlight wrapper already has its own background/border — avoids a double-border.
- Match `spotlightColor` to the brand's primary colour at 20–35% opacity for a cohesive look.
- The spotlight effect requires mouse events — the component is `"use client"` internally.
- For card grids, wrap each card individually in `<SpotlightCard>`, not the entire grid.
