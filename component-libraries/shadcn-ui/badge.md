# Badge — shadcn/ui

Small inline label for tags, categories, statuses, keywords, and counts. Renders as a styled `<span>` — not a button unless wrapped with `asChild`.

## Install

```bash
npx shadcn@latest add badge
```

## Import

```tsx
import { Badge } from "@/components/ui/badge"
```

## Props

### `<Badge>`
| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `variant` | `"default" \| "secondary" \| "destructive" \| "outline" \| "ghost" \| "link"` | `"default"` | Visual style. `"secondary"` for neutral tags; `"outline"` for bordered; `"destructive"` for warnings. |
| `asChild` | `boolean` | `false` | Renders as a child element (e.g. `<a>`) instead of `<span>`. |
| `className` | `string` | — | |

## Usage Example

```tsx
import { Badge } from "@/components/ui/badge"

// Single badge
export default function CategoryBadge({ label, variant }: { label: string; variant?: "default" | "secondary" | "outline" }) {
  return <Badge variant={variant ?? "secondary"}>{label}</Badge>
}

// Tag list from a CMS array field
export function TagList({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Badge key={tag} variant="secondary">{tag}</Badge>
      ))}
    </div>
  )
}
```

## CMS Mapping Notes

- CMS tag fields are often `String[]` — map each string to a `<Badge>`.
- If the CMS has a `type` or `status` field with known values (e.g. `"new"`, `"sale"`, `"sold-out"`), map those values to appropriate variants: `"new" → "default"`, `"sold-out" → "destructive"`, everything else → `"secondary"`.
- For a single category label, just render one `<Badge>`. For a tag array, use `TagList` pattern above.
- Badges are inline elements — wrap multiple in `flex flex-wrap gap-2` for responsive layout.
- This is a server component — no `"use client"` needed.
