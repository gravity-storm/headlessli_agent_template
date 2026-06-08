# wa-carousel — Web Awesome

Scrollable slide container for image galleries, testimonial sliders, and multi-item content blocks. Built-in navigation arrows, dot pagination, and autoplay.

## Install

```bash
npm install @awesome.me/webawesome
```

```ts
import '@awesome.me/webawesome/dist/styles/webawesome.css'
import '@awesome.me/webawesome/dist/components/carousel/carousel.js'
import '@awesome.me/webawesome/dist/components/carousel-item/carousel-item.js'
```

## wa-carousel Attributes

| Attribute | Type | Default | Notes |
|-----------|------|---------|-------|
| `navigation` | boolean | `false` | Shows previous/next arrow buttons. |
| `pagination` | boolean | `false` | Shows dot indicators below slides. |
| `loop` | boolean | `false` | Enables infinite looping. |
| `autoplay` | boolean | `false` | Auto-advances slides. |
| `autoplay-interval` | number | `3000` | Milliseconds between auto-advances. |
| `slides-per-page` | number | `1` | Visible slides at once. Use `2` or `3` for multi-item carousels. |
| `slides-per-move` | number | `1` | Slides advanced per navigation step. |
| `mouse-dragging` | boolean | `false` | Enables mouse drag to scroll. |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | |

## Slots

| Slot | Notes |
|------|-------|
| *(default)* | `<wa-carousel-item>` elements. |
| `next-icon` | Custom next button icon. |
| `previous-icon` | Custom previous button icon. |

## Usage Example

```tsx
export default function GalleryBlock({
  images,
}: {
  images: { url: string; alt?: string }[]
}) {
  if (!images?.length) return null

  return (
    <wa-carousel navigation pagination loop mouse-dragging>
      {images.map((img, i) => (
        <wa-carousel-item key={i}>
          <img
            src={img.url}
            alt={img.alt ?? ''}
            style={{ width: '100%', height: '400px', objectFit: 'cover' }}
          />
        </wa-carousel-item>
      ))}
    </wa-carousel>
  )
}
```

## CMS Mapping Notes

- CMS gallery blocks typically have a `FileField[]` or `images[]` array — map each to a `<wa-carousel-item>`.
- Use `navigation` and `pagination` for most gallery use cases. `loop` is almost always desirable.
- For testimonial sliders, each `<wa-carousel-item>` wraps a `<wa-card>` with the testimonial content.
- `slides-per-page="2"` or `"3"` shows multiple items at once — useful for logos or small cards.
- Both `carousel.js` and `carousel-item.js` must be imported — missing `carousel-item.js` causes blank slides.
- No `"use client"` needed.
