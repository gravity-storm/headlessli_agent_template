# wa-details — Web Awesome

Expandable/collapsible section with a summary trigger. Stack multiple with the same `name` attribute for native accordion behaviour (only one open at a time).

## Install

```bash
npm install @awesome.me/webawesome
```

```ts
import '@awesome.me/webawesome/dist/styles/webawesome.css'
import '@awesome.me/webawesome/dist/components/details/details.js'
```

## Attributes

| Attribute | Type | Default | Notes |
|-----------|------|---------|-------|
| `summary` | `string` | — | The header label shown when collapsed. Plain text only — use `slot="summary"` for HTML. |
| `open` | boolean | `false` | Expanded on first render. |
| `disabled` | boolean | `false` | Prevents toggling. |
| `name` | `string` | — | **Accordion key.** Multiple `wa-details` with the same `name` form an accordion group — only one stays open at a time. |
| `appearance` | `'outlined' \| 'filled' \| 'filled-outlined' \| 'plain'` | `'outlined'` | |
| `icon-placement` | `'start' \| 'end'` | `'end'` | Position of the expand/collapse chevron. |

## Slots

| Slot | Notes |
|------|-------|
| `summary` | HTML version of the header — use instead of `summary` attribute when formatting is needed. |
| *(default)* | Content shown when expanded. |
| `expand-icon` | Custom expand icon. |
| `collapse-icon` | Custom collapse icon. |

## Events

| Event | Fires when |
|-------|-----------|
| `wa-show` | The details starts opening. |
| `wa-after-show` | Opening animation completes. |
| `wa-hide` | The details starts closing. |
| `wa-after-hide` | Closing animation completes. |

## Usage Example — FAQ accordion

```tsx
export default function FaqBlock({
  items,
}: {
  items: { question: string; answer: string }[]
}) {
  return (
    <div>
      {items.map((item, i) => (
        <wa-details
          key={i}
          summary={item.question}
          name="faq"
          appearance="outlined"
          open={i === 0 || undefined}
        >
          <p style={{ margin: 0 }}>{item.answer}</p>
        </wa-details>
      ))}
    </div>
  )
}
```

## CMS Mapping Notes

- CMS FAQ blocks typically have an array of `{ question: String, answer: String }` — map each to a `<wa-details>`.
- Set `name="faq"` (or any shared string) on all items to enable accordion behaviour.
- Set `open` on the first item so users see content immediately on page load.
- If answers contain rich text / HTML, render via `dangerouslySetInnerHTML={{ __html: item.answer }}` in a wrapper `<div>` inside the default slot.
- No `"use client"` needed — `wa-details` manages its own open/close state natively.
