# wa-tab-group — Web Awesome

Tabbed content panels — one panel visible at a time. Uses `<wa-tab>` for triggers and `<wa-tab-panel>` for content. All three elements must be imported.

## Install

```bash
npm install @awesome.me/webawesome
```

```ts
import '@awesome.me/webawesome/dist/styles/webawesome.css'
import '@awesome.me/webawesome/dist/components/tab-group/tab-group.js'
import '@awesome.me/webawesome/dist/components/tab/tab.js'
import '@awesome.me/webawesome/dist/components/tab-panel/tab-panel.js'
```

## wa-tab-group Attributes

| Attribute | Type | Default | Notes |
|-----------|------|---------|-------|
| `active` | `string` | — | The `name` of the panel that should be active on load. |
| `placement` | `'top' \| 'bottom' \| 'start' \| 'end'` | `'top'` | Tab position relative to the content. |
| `activation` | `'auto' \| 'manual'` | `'auto'` | `'auto'` activates on focus; `'manual'` requires a click/Enter. |

## wa-tab-group Slots

| Slot | Notes |
|------|-------|
| `nav` | Contains `<wa-tab>` elements. |
| *(default)* | Contains `<wa-tab-panel>` elements. |

## wa-tab Attributes

| Attribute | Notes |
|-----------|-------|
| `panel` | **Required.** Must match the `name` attribute of the corresponding `<wa-tab-panel>`. |
| `active` | Boolean — marks this tab as active (prefer using `active` on the group). |
| `disabled` | Prevents selecting this tab. |

## wa-tab-panel Attributes

| Attribute | Notes |
|-----------|-------|
| `name` | **Required.** Unique string matching its `<wa-tab panel="...">`. |

## Usage Example

```tsx
import { QueenofheartsRenderComponent } from '@qoh/core-react'

type Tab = { label: string; content: any[] }

export default function TabsBlock({ tabs }: { tabs: Tab[] }) {
  if (!tabs?.length) return null
  const firstPanel = `panel-0`

  return (
    <wa-tab-group active={firstPanel}>
      {tabs.map((tab, i) => (
        <wa-tab key={i} slot="nav" panel={`panel-${i}`}>
          {tab.label}
        </wa-tab>
      ))}
      {tabs.map((tab, i) => (
        <wa-tab-panel key={i} name={`panel-${i}`}>
          <QueenofheartsRenderComponent data={tab.content} />
        </wa-tab-panel>
      ))}
    </wa-tab-group>
  )
}
```

## CMS Mapping Notes

- CMS tabs blocks typically have an array of `{ label: String, content: [blocks] }` items.
- `<wa-tab>` elements go in `slot="nav"`; `<wa-tab-panel>` elements go in the default slot.
- `panel` on `<wa-tab>` and `name` on `<wa-tab-panel>` **must match exactly** — use the same derived string (e.g. `panel-${i}`).
- Set `active` on `<wa-tab-group>` to the first panel's name so content is visible on load.
- `<wa-tab-panel>` can contain `<QueenofheartsRenderComponent>` — the outer `TabsBlock` must NOT have `"use client"`.
- All three JS imports are required — missing any one causes the tab group to silently break.
