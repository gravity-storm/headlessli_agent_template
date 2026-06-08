# Collapsible — shadcn/ui

A single expandable/collapsible section with a trigger and a content panel. Unlike Accordion, Collapsible is a standalone block — use it for "show more", read-more toggles, or any single expandable region.

## Install

```bash
npx shadcn@latest add collapsible
```

## Import

```tsx
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
```

## Props

### `<Collapsible>`
| Prop | Type | Notes |
|------|------|-------|
| `open` | `boolean` | Controlled open state. Omit for uncontrolled. |
| `defaultOpen` | `boolean` | Initial state when uncontrolled. |
| `onOpenChange` | `(open: boolean) => void` | Callback when state changes (required when controlled). |
| `disabled` | `boolean` | Prevents toggling. |

### `<CollapsibleTrigger>`
Renders a `<button>` by default. Accepts `asChild` to render as a custom element. Accepts `children`.

### `<CollapsibleContent>`
Animated expand/collapse wrapper. Accepts `children`.

## Usage Example — Uncontrolled (server-safe)

```tsx
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"

export default function ExpandableBlock({
  summary,
  detail,
}: {
  summary: string
  detail: string
}) {
  return (
    <Collapsible>
      <CollapsibleTrigger asChild>
        <Button variant="ghost">{summary}</Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <p className="text-sm text-muted-foreground">{detail}</p>
      </CollapsibleContent>
    </Collapsible>
  )
}
```

## Usage Example — Controlled (needs `"use client"`)

```tsx
"use client"
import { useState } from "react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

export default function ControlledCollapsible({ summary, detail }: { summary: string; detail: string }) {
  const [open, setOpen] = useState(false)
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger>{open ? "Hide" : summary}</CollapsibleTrigger>
      <CollapsibleContent>{detail}</CollapsibleContent>
    </Collapsible>
  )
}
```

## CMS Mapping Notes

- For a simple show/hide block: use uncontrolled (no `"use client"` needed).
- For toggle label changes (`"Show more"` ↔ `"Show less"`), use controlled mode — the component needs `"use client"` and must NOT call `QueenofheartsRenderComponent` (split if needed).
- If the CMS block has an array of expandable items, use `Accordion` instead — it handles multiple items natively.
- `CollapsibleContent` supports nested CMS blocks via `<QueenofheartsRenderComponent>` only in the uncontrolled (server) version.
