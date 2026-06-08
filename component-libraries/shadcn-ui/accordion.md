# Accordion — shadcn/ui

Vertically stacked sections that expand/collapse to reveal content. Best for FAQ blocks, nested expandable lists, or any "show more" pattern where multiple items share space.

## Install

```bash
npx shadcn@latest add accordion
```

## Import

```tsx
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
```

## Props

### `<Accordion>`
| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `type` | `"single" \| "multiple"` | — | **Required.** `"single"` allows one open at a time; `"multiple"` allows many. |
| `collapsible` | `boolean` | `false` | Only for `type="single"`. Allows closing the open item. |
| `defaultValue` | `string` | — | `value` of the item open on first render. |
| `value` | `string` | — | Controlled open item. |
| `onValueChange` | `(value: string) => void` | — | Controlled change handler. |

### `<AccordionItem>`
| Prop | Type | Notes |
|------|------|-------|
| `value` | `string` | **Required.** Unique identifier for this item. |
| `disabled` | `boolean` | Prevents expanding/collapsing this item. |

### `<AccordionTrigger>`
Renders a `<button>` with a chevron icon. Accepts `children` (the label text) and standard HTML button props.

### `<AccordionContent>`
Accepts `children` — the content shown when the item is expanded.

## Usage Example

```tsx
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function FaqBlock({ items }: { items: { question: string; answer: string }[] }) {
  return (
    <Accordion type="single" collapsible defaultValue="item-0">
      {items.map((item, i) => (
        <AccordionItem key={i} value={`item-${i}`}>
          <AccordionTrigger>{item.question}</AccordionTrigger>
          <AccordionContent>{item.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
```

## CMS Mapping Notes

- The CMS block will typically have an array field (e.g. `items`, `entries`, `faqs`) — map each element to an `AccordionItem`.
- Use the array index as `value` if the CMS items have no unique id field.
- `AccordionContent` supports rich content — nest `<p>`, `<ul>`, or even `<QueenofheartsRenderComponent>` for sub-blocks inside it.
- Do NOT add `"use client"` unless the accordion needs controlled state driven by external React state. The component handles its own open/close state internally.
