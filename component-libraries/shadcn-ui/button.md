# Button — shadcn/ui

Clickable button with multiple visual variants and sizes. Use for CTA blocks, link buttons, and any interactive action within a content block.

## Install

```bash
npx shadcn@latest add button
```

## Import

```tsx
import { Button } from "@/components/ui/button"
```

## Props

### `<Button>`
| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `variant` | `"default" \| "outline" \| "ghost" \| "destructive" \| "secondary" \| "link"` | `"default"` | Visual style. `"link"` renders as an underlined anchor-style button. |
| `size` | `"default" \| "xs" \| "sm" \| "lg" \| "icon"` | `"default"` | `"icon"` is a square button for icon-only use. |
| `asChild` | `boolean` | `false` | Renders as its child element — use with Next.js `<Link>` to make a button that navigates without a full reload. |
| `disabled` | `boolean` | `false` | Standard HTML disabled. |

## Usage Example

```tsx
import { Button } from "@/components/ui/button"
import Link from "next/link"

// CTA button that links somewhere
export default function CtaBlock({
  label,
  href,
  variant,
}: {
  label: string
  href: string
  variant?: "default" | "outline" | "secondary"
}) {
  return (
    <Button asChild variant={variant ?? "default"} size="lg">
      <Link href={href}>{label}</Link>
    </Button>
  )
}

// Button with no navigation (e.g. a download trigger)
export function ActionButton({ label, onClick }: { label: string; onClick?: () => void }) {
  return <Button onClick={onClick}>{label}</Button>
}
```

## CMS Mapping Notes

- CMS CTA fields are typically `{ label: String, href: String, style?: String }`. Map `style` to `variant` — unknown values default to `"default"`.
- Always use `asChild` + `<Link>` when the button navigates to a URL. Do NOT put an `href` on `<Button>` directly.
- If the button triggers an interaction (onClick), the parent component needs `"use client"`. If the button is purely a link, it is a server component.
- For multiple CTA buttons (primary + secondary), render them in a `flex gap-3` wrapper.
