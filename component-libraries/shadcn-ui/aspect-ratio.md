# AspectRatio — shadcn/ui

Constrains an image, video, or embedded content to a fixed aspect ratio regardless of the container width. Essential for consistent image blocks where the CMS returns a URL but no explicit height.

## Install

```bash
npx shadcn@latest add aspect-ratio
```

## Import

```tsx
import { AspectRatio } from "@/components/ui/aspect-ratio"
```

## Props

### `<AspectRatio>`
| Prop | Type | Required | Notes |
|------|------|----------|-------|
| `ratio` | `number` | Yes | Expressed as `width / height`. Common values: `16/9`, `4/3`, `1/1`, `9/16`. |
| `className` | `string` | No | Applied to the wrapper div. |

The children fill the wrapper and should have `className="object-cover w-full h-full"` to fill correctly.

## Usage Example

```tsx
import { AspectRatio } from "@/components/ui/aspect-ratio"
import Image from "next/image"

export default function ImageBlock({
  image,
  ratio = 16 / 9,
}: {
  image: { url: string; alt?: string }
  ratio?: number
}) {
  return (
    <AspectRatio ratio={ratio}>
      <Image
        src={image.url}
        alt={image.alt ?? ""}
        fill
        className="rounded-md object-cover"
      />
    </AspectRatio>
  )
}
```

## CMS Mapping Notes

- The CMS `FileField` type gives you `{ url: string, alt?: string }` — pass `url` to `src` and `alt` to `alt`.
- Use Next.js `<Image fill>` inside AspectRatio rather than `<img>` for automatic optimization.
- When `<Image fill>` is used, the AspectRatio wrapper must have `position: relative` — this is already handled by the component's default styles.
- If the CMS block has a `ratio` or `format` field (e.g. `"square"`, `"widescreen"`), map it to the numeric ratio: `"widescreen" → 16/9`, `"square" → 1/1`, `"portrait" → 9/16`.
- This is a server component — no `"use client"` needed.
