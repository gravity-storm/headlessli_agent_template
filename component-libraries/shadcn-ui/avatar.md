# Avatar — shadcn/ui

Circular profile image with an automatic text initials fallback when the image fails to load. Used for author bios, team members, testimonial attributions, and profile blocks.

## Install

```bash
npx shadcn@latest add avatar
```

## Import

```tsx
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  AvatarGroup,
  AvatarGroupCount,
} from "@/components/ui/avatar"
```

## Props

### `<Avatar>`
| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `size` | `"default" \| "sm" \| "lg"` | `"default"` | Controls the circle diameter. |
| `className` | `string` | — | |

### `<AvatarImage>`
| Prop | Type | Notes |
|------|------|-------|
| `src` | `string` | Image URL from the CMS. |
| `alt` | `string` | Alt text — use the person's name. |

### `<AvatarFallback>`
Renders text (typically initials) when the image fails or is absent. Accepts `children`.

### `<AvatarGroup>` / `<AvatarGroupCount>`
Used when rendering a list of overlapping avatars (e.g. contributors). Wrap multiple `<Avatar>` in `<AvatarGroup>` and add `<AvatarGroupCount>+N</AvatarGroupCount>` for overflow.

## Usage Example

```tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
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
    <div className="flex items-center gap-3">
      <Avatar size="default">
        {photo?.url && <AvatarImage src={photo.url} alt={photo.alt ?? name} />}
        <AvatarFallback>{getInitials(name)}</AvatarFallback>
      </Avatar>
      <div>
        <p className="font-medium">{name}</p>
        {role && <p className="text-sm text-muted-foreground">{role}</p>}
      </div>
    </div>
  )
}
```

## CMS Mapping Notes

- Always render `<AvatarFallback>` with initials — the CMS image URL may be empty or fail to load.
- The CMS `FileField` gives `{ url: string, alt?: string }` — use `url` for `src`. If no `alt`, use the person's name.
- For team member grids, wrap multiple `AuthorBlock` in a grid rather than using `AvatarGroup` (group is only for compact inline stacks).
- This is a server component — no `"use client"` needed.
