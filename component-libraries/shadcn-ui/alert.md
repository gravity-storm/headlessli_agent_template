# Alert — shadcn/ui

Displays a callout box for important messages — announcements, warnings, info banners, or inline notifications. Not a toast/popup; this renders inline in the page layout.

## Install

```bash
npx shadcn@latest add alert
```

## Import

```tsx
import {
  Alert,
  AlertDescription,
  AlertTitle,
  AlertAction,
} from "@/components/ui/alert"
```

## Props

### `<Alert>`
| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `variant` | `"default" \| "destructive"` | `"default"` | `"destructive"` renders in red for errors/warnings. |

### `<AlertTitle>`
Text node — the headline of the alert. Accepts `children`.

### `<AlertDescription>`
Text node — the body copy of the alert. Accepts `children`.

### `<AlertAction>`
Optional slot for a button or link placed at the end of the alert. Accepts `children`.

## Usage Example

```tsx
import { Alert, AlertDescription, AlertTitle, AlertAction } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { InfoIcon } from "lucide-react"

export default function AnnouncementBlock({
  title,
  body,
  variant,
}: {
  title: string
  body: string
  variant?: "default" | "destructive"
}) {
  return (
    <Alert variant={variant ?? "default"}>
      <InfoIcon />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{body}</AlertDescription>
    </Alert>
  )
}
```

## CMS Mapping Notes

- Typical CMS fields: `title` (String), `body`/`description` (String), `type`/`variant` (String enum).
- Map the CMS `type` field to the `variant` prop — coerce unknown values to `"default"`.
- The icon is optional but recommended. Use a Lucide icon appropriate to the variant (`InfoIcon` for default, `AlertTriangleIcon` for destructive).
- `AlertAction` is optional — only render it if the CMS block has a CTA field (e.g. `ctaLabel` + `ctaHref`).
- This is a server component — no `"use client"` needed.
