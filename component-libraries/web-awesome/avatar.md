# wa-avatar — Web Awesome

Circular (or square) profile image with an initials fallback when the image is missing or fails to load.

## Install

```bash
npm install @awesome.me/webawesome
```

```ts
import '@awesome.me/webawesome/dist/styles/webawesome.css'
import '@awesome.me/webawesome/dist/components/avatar/avatar.js'
```

## Attributes

| Attribute | Type | Default | Notes |
|-----------|------|---------|-------|
| `image` | `string` | `''` | Image URL from the CMS. |
| `initials` | `string` | `''` | 1–2 character fallback shown when image is absent or fails. |
| `label` | `string` | `''` | Accessible description (e.g. the person's name). Required for accessibility. |
| `shape` | `'circle' \| 'square' \| 'rounded'` | `'circle'` | |
| `loading` | `'eager' \| 'lazy'` | `'eager'` | Use `'lazy'` for avatars below the fold. |

## Slots

| Slot | Notes |
|------|-------|
| `icon` | Fallback icon shown when neither image nor initials are set. Use `<wa-icon>`. |

## Usage Example

```tsx
function getInitials(name: string): string {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

export default function AuthorBlock({
  name,
  photo,
  role,
}: {
  name: string
  photo?: { url: string; alt?: string }
  role?: string
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      <wa-avatar
        image={photo?.url ?? ''}
        initials={getInitials(name)}
        label={name}
        shape="circle"
        loading="lazy"
      />
      <div>
        <p style={{ margin: 0, fontWeight: 600 }}>{name}</p>
        {role && <p style={{ margin: 0, fontSize: '0.875rem', opacity: 0.7 }}>{role}</p>}
      </div>
    </div>
  )
}
```

## CMS Mapping Notes

- Always provide `initials` — it is the graceful fallback when the CMS image URL is empty or the image fails to load.
- `label` should be the person's name for screen reader accessibility.
- CMS `FileField` gives `{ url, alt }` — pass `url` to `image`. The `alt` is not used by `wa-avatar` directly but use it for `label` if no name field is available.
- For team member grids, wrap multiple `AuthorBlock` components in a CSS grid.
- No `"use client"` needed.
