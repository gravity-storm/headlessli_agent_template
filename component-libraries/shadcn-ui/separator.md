# Separator — shadcn/ui

Thin horizontal or vertical line that visually divides sections or groups of content. Renders as a semantic `<hr>` equivalent with Radix UI's accessible separator role.

## Install

```bash
npx shadcn@latest add separator
```

## Import

```tsx
import { Separator } from "@/components/ui/separator"
```

## Props

### `<Separator>`
| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | Vertical requires the parent to have a fixed height and `flex` layout. |
| `decorative` | `boolean` | `false` | If `true`, hides from screen readers (purely visual). |
| `className` | `string` | — | Use `my-*` for vertical spacing around horizontal separators. |

## Usage Example

```tsx
import { Separator } from "@/components/ui/separator"

// Horizontal divider between sections
export default function DividerBlock({ spacing = "md" }: { spacing?: "sm" | "md" | "lg" }) {
  const spacingClass = { sm: "my-4", md: "my-8", lg: "my-16" }[spacing]
  return <Separator className={spacingClass} decorative />
}

// Vertical separator between inline items
export function InlineSeparator() {
  return (
    <div className="flex h-5 items-center gap-4">
      <span>Item one</span>
      <Separator orientation="vertical" />
      <span>Item two</span>
    </div>
  )
}
```

## CMS Mapping Notes

- A CMS "divider" or "spacer" block usually has no fields beyond `__typename` — just render `<Separator decorative />`.
- If the block has a `spacing` or `size` field, map it to `my-*` Tailwind spacing on the separator.
- If the block has a `style` field (e.g. `"dashed"`, `"dotted"`), use `className` to override the border style.
- Use `decorative` for visual-only dividers so screen readers skip them.
- This is a server component — no `"use client"` needed.
