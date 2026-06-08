# wa-card — Web Awesome

Bordered content container with optional header, media image, body, and footer areas. The most versatile CMS block component — use for hero sections, feature tiles, testimonials, blog post previews, and pricing cards.

## Install

```bash
npm install @awesome.me/webawesome
```

Add to your root layout or providers file (run once, covers all cards on the page):
```ts
import '@awesome.me/webawesome/dist/styles/webawesome.css'
import '@awesome.me/webawesome/dist/components/card/card.js'
```

## Attributes

| Attribute | Type | Default | Notes |
|-----------|------|---------|-------|
| `appearance` | `'outlined' \| 'filled' \| 'accent' \| 'plain' \| 'filled-outlined'` | `'outlined'` | `'filled'` for cards on a white background; `'outlined'` for cards in a grid. |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | `'horizontal'` places media on the left and content on the right. |
| `with-header` | boolean | `false` | Must be `true` for the `header` slot to render. |
| `with-media` | boolean | `false` | Must be `true` for the `media` slot to render. |
| `with-footer` | boolean | `false` | Must be `true` for the `footer` and `footer-actions` slots to render. |

## Slots

| Slot | Notes |
|------|-------|
| `header` | Card title — enable with `with-header` attribute. |
| `header-actions` | Action elements in the header (vertical orientation only). |
| `media` | Image or media element — enable with `with-media` attribute. |
| *(default)* | Main body content — text, paragraphs, nested elements. |
| `footer` | Footer text or metadata — enable with `with-footer` attribute. |
| `footer-actions` | Buttons/links in the footer (vertical orientation only). |
| `actions` | Action elements (horizontal orientation only). |

## Usage Example

```tsx
// Import once in layout or providers
// import '@awesome.me/webawesome/dist/components/card/card.js'

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
    <wa-card
      appearance="outlined"
      with-header
      with-media={!!image?.url || undefined}
      with-footer={!!(ctaLabel && ctaHref) || undefined}
    >
      {image?.url && (
        <img slot="media" src={image.url} alt={image.alt ?? ''} style={{ width: '100%', objectFit: 'cover' }} />
      )}
      <span slot="header">{title}</span>
      {description && <p>{description}</p>}
      {ctaLabel && ctaHref && (
        <wa-button slot="footer-actions" href={ctaHref} variant="brand" appearance="filled">
          {ctaLabel}
        </wa-button>
      )}
    </wa-card>
  )
}
```

## CMS Mapping Notes

- `slot="header"` → CMS `title`, `heading`, or `name` field.
- `slot="media"` → CMS `FileField` — use `image.url` for `src`, `image.alt` for `alt`.
- Default slot (body) → CMS `description`, `body`, `excerpt`, or rich text.
- `slot="footer-actions"` → CTA button using `wa-button` with `href` and `slot="footer-actions"`.
- Boolean slot attributes (`with-header`, `with-media`, `with-footer`) must be present for their slots to render — omit them (or set to `undefined`) when the corresponding CMS field is empty.
- For a card grid, wrap in `<div className="grid grid-cols-1 md:grid-cols-3 gap-6">`.
- No `"use client"` needed — web components hydrate on the client automatically.
