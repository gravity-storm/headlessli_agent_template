# Carousel — shadcn/ui

Horizontally or vertically scrollable item slider with previous/next navigation controls. Built on Embla Carousel. Used for image galleries, testimonial sliders, and multi-item content blocks.

## Install

```bash
npx shadcn@latest add carousel
```

## Import

```tsx
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
```

## Props

### `<Carousel>`
| Prop | Type | Notes |
|------|------|-------|
| `orientation` | `"horizontal" \| "vertical"` | Default: `"horizontal"`. |
| `opts` | `EmblaOptionsType` | Embla options object. Common: `{ loop: true }`, `{ align: "start" }`. |
| `setApi` | `(api: CarouselApi) => void` | Callback to get the Embla API instance for programmatic control. |
| `plugins` | `EmblaPluginType[]` | E.g. Autoplay plugin. |

### `<CarouselItem>`
| Prop | Notes |
|------|-------|
| `className` | Use Tailwind `basis-*` to control item width: `basis-full` (1 item), `basis-1/2` (2 items), `basis-1/3` (3 items). |

`<CarouselPrevious>` and `<CarouselNext>` are pre-built arrow buttons — no required props.

## Usage Example

```tsx
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Image from "next/image"

export default function GalleryBlock({
  images,
}: {
  images: { url: string; alt?: string }[]
}) {
  return (
    <Carousel opts={{ loop: true }} className="w-full">
      <CarouselContent>
        {images.map((img, i) => (
          <CarouselItem key={i}>
            <div className="relative h-64 w-full">
              <Image src={img.url} alt={img.alt ?? ""} fill className="object-cover rounded-md" />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}
```

## CMS Mapping Notes

- The CMS gallery block typically has a `FileField[]` or `images[]` array — map each to a `<CarouselItem>`.
- For testimonial sliders, each `<CarouselItem>` wraps a `<Card>` with the testimonial content.
- Use `basis-1/2` or `basis-1/3` on `CarouselItem` to show multiple items at once.
- `opts={{ loop: true }}` is almost always desirable for gallery blocks.
- The component uses `"use client"` internally (Embla requires it) — your wrapper component does NOT need to add `"use client"` separately; it will be handled by the installed component file.
- `<CarouselPrevious>` and `<CarouselNext>` are absolutely positioned — the parent carousel needs `relative` positioning (already applied by default).
