# Card — shadcn/ui

Boxed content container with a header, content area, and optional footer. The most versatile CMS block component — used for hero sections, feature tiles, testimonials, blog post previews, and pricing cards.

## Install

```bash
npx shadcn@latest add card
```

## Import

```tsx
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
```

## Props

### `<Card>`
| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `size` | `"default" \| "sm"` | `"default"` | `"sm"` reduces internal padding. |
| `className` | `string` | — | Use for layout: `w-full`, grid columns, etc. |

All other sub-components (`CardHeader`, `CardTitle`, `CardDescription`, `CardAction`, `CardContent`, `CardFooter`) accept only `className`.

### Sub-component anatomy
```
Card
└── CardHeader
    ├── CardTitle       ← main headline
    ├── CardDescription ← subtitle or short description
    └── CardAction      ← optional top-right slot (badge, icon button)
└── CardContent         ← body — images, text, custom markup
└── CardFooter          ← bottom row — buttons, metadata, tags
```

## Usage Example

```tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function FeatureCard({
  title,
  description,
  image,
  ctaLabel,
  ctaHref,
}: {
  title: string
  description?: string
  image?: { url: string; alt?: string }
  ctaLabel?: string
  ctaHref?: string
}) {
  return (
    <Card>
      {image?.url && (
        <CardContent className="p-0">
          <div className="relative h-48 w-full">
            <Image src={image.url} alt={image.alt ?? ""} fill className="rounded-t-lg object-cover" />
          </div>
        </CardContent>
      )}
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      {ctaLabel && ctaHref && (
        <CardFooter>
          <Button asChild variant="outline">
            <a href={ctaHref}>{ctaLabel}</a>
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
```

## CMS Mapping Notes

- `CardTitle` → CMS `title`, `heading`, or `name` field.
- `CardDescription` → CMS `subtitle`, `summary`, `excerpt`, or `description` field.
- `CardContent` → body copy, image, rich text, or nested CMS blocks via `<QueenofheartsRenderComponent>`.
- `CardFooter` → CTA buttons, author info, publish date, tags.
- `CardAction` → secondary action like a share/bookmark icon in the top-right corner.
- For a grid of cards, wrap them in `<div className="grid grid-cols-1 md:grid-cols-3 gap-6">` in the parent layout.
- This is a server component — no `"use client"` needed unless the card contains interactive elements.
