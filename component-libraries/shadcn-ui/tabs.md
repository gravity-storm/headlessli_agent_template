# Tabs — shadcn/ui

Tabbed content panels — one panel visible at a time, switched by clicking tab triggers. Used for multi-section content blocks, product variants, code examples, and any "choose a view" pattern.

## Install

```bash
npx shadcn@latest add tabs
```

## Import

```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
```

## Props

### `<Tabs>`
| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `defaultValue` | `string` | — | `value` of the tab open on first render. Should match a `TabsTrigger` value. |
| `value` | `string` | — | Controlled active tab. |
| `onValueChange` | `(value: string) => void` | — | Controlled change handler. |
| `variant` | `"default" \| "line"` | `"default"` | `"line"` shows an underline indicator instead of a pill. |
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | |

### `<TabsTrigger>`
| Prop | Type | Notes |
|------|------|-------|
| `value` | `string` | **Required.** Must match its corresponding `TabsContent` value. |
| `disabled` | `boolean` | |

### `<TabsContent>`
| Prop | Type | Notes |
|------|------|-------|
| `value` | `string` | **Required.** Must match its corresponding `TabsTrigger` value. |

## Usage Example

```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { QueenofheartsRenderComponent } from "@qoh/core-react"

type Tab = {
  label: string
  content: any[]  // CMS block array
}

export default function TabsBlock({ tabs }: { tabs: Tab[] }) {
  if (!tabs?.length) return null
  const firstValue = `tab-0`

  return (
    <Tabs defaultValue={firstValue}>
      <TabsList>
        {tabs.map((tab, i) => (
          <TabsTrigger key={i} value={`tab-${i}`}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab, i) => (
        <TabsContent key={i} value={`tab-${i}`}>
          <QueenofheartsRenderComponent data={tab.content} />
        </TabsContent>
      ))}
    </Tabs>
  )
}
```

## CMS Mapping Notes

- CMS tabs blocks typically have an array of `{ label: String, content: [blocks] }` items.
- Use array index as `value` (e.g. `"tab-0"`) since CMS items rarely have unique string IDs.
- `TabsContent` can contain `<QueenofheartsRenderComponent>` for nested CMS blocks — the outer `TabsBlock` must NOT have `"use client"` (it calls QHRC).
- If tab switching needs to drive external state (e.g. a URL parameter), use controlled mode (`value` + `onValueChange`) — but that requires `"use client"` and means you must split: an outer server component renders the content, an inner client component handles the trigger clicks.
- `defaultValue` must be set or the first tab renders with no visible content. Always default to the first tab.
