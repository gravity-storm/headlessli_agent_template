# GlareHover — React Bits

A diagonal glare sweep animates across the element on hover, like light reflecting off a glass surface. More dramatic than SpotlightCard — best for hero CTAs, pricing cards, or featured tiles.

## Install

```bash
npx shadcn@latest add https://reactbits.dev/r/GlareHover-TS-TW
```

No peer dependencies.

## Props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `children` | `ReactNode` | **Required** | Content inside the glare wrapper. |
| `width` | `string` | `'500px'` | Width of the wrapper. Use `'100%'` to fill the parent. |
| `height` | `string` | `'500px'` | Height of the wrapper. Set to match the card's content height or use `'auto'`. |
| `background` | `string` | `'#000'` | Background colour of the card. |
| `borderRadius` | `string` | `'10px'` | Border radius. Match the card's `rounded-*` class value. |
| `borderColor` | `string` | `'#333'` | Border colour. |
| `glareColor` | `string` | `'#ffffff'` | Colour of the glare highlight. |
| `glareOpacity` | `number` | `0.5` | Opacity of the glare. Lower = subtler. |
| `glareAngle` | `number` | `-45` | Angle of the glare sweep in degrees. |
| `glareSize` | `number` | `250` | Width of the glare band in pixels. |
| `transitionDuration` | `number` | `650` | Hover animation duration in ms. |
| `playOnce` | `boolean` | `false` | If `true`, glare only plays once, not on every hover. |
| `className` | `string` | `''` | |
| `style` | `object` | `{}` | Inline styles on the wrapper. |

## Usage Example

```tsx
import GlareHover from '@/components/reactbits/GlareHover'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

export default function PricingCard({
  title,
  price,
  description,
}: {
  title: string
  price: string
  description?: string
}) {
  return (
    <GlareHover
      width="100%"
      height="auto"
      background="#0f0f0f"
      borderColor="#333"
      borderRadius="12px"
      glareColor="#6366f1"
      glareOpacity={0.25}
      glareSize={300}
    >
      <Card className="border-0 bg-transparent text-white">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription className="text-gray-400">{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">{price}</p>
        </CardContent>
      </Card>
    </GlareHover>
  )
}
```

## CMS Usage Notes

- Set `width="100%"` and `height="auto"` unless the card has a fixed size — the defaults (`500px × 500px`) are for demo purposes only.
- `background`, `borderColor`, `borderRadius` on `GlareHover` replace the card's own styling — set the inner `<Card>` to `border-0 bg-transparent`.
- `glareOpacity={0.2}` is a subtle, professional preset. Values above 0.4 start to look tacky.
- Match `glareColor` to the brand primary colour for cohesion.
- Component is `"use client"` internally.
