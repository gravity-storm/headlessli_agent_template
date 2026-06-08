# AnimatedList — React Bits

List items appear one-by-one with a staggered slide-in animation. Supports keyboard navigation and item selection callbacks. Good for feature lists, step-by-step blocks, and notification-style feeds.

## Install

```bash
npm install motion
npx shadcn@latest add https://reactbits.dev/r/AnimatedList-TS-TW
```

**Peer dependency:** `motion` (the standalone Framer Motion package).

## Props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `items` | `string[] \| ReactNode[]` | `['Item 1', ...]` | **Required.** Array of strings or JSX elements to display. |
| `onItemSelect` | `(item, index) => void` | — | Callback when an item is clicked or selected via keyboard. |
| `showGradients` | `boolean` | `true` | Fade gradients at top/bottom to hint at scrollability. |
| `enableArrowNavigation` | `boolean` | `true` | Arrow keys, Tab/Shift+Tab navigate; Enter selects. |
| `initialSelectedIndex` | `number` | `-1` | Pre-selected item index. `-1` = none. |
| `className` | `string` | `''` | Applied to the list container. |
| `itemClassName` | `string` | `''` | Applied to each list item. |
| `displayScrollbar` | `boolean` | `true` | Shows scrollbar when content overflows. |

## Usage Example

```tsx
import AnimatedList from '@/components/reactbits/AnimatedList'

// Feature list with icon + text items
export default function FeatureListBlock({
  features,
}: {
  features: { label: string; icon?: string }[]
}) {
  const items = features.map((f) => (
    <div className="flex items-center gap-3">
      {f.icon && <span className="text-xl">{f.icon}</span>}
      <span>{f.label}</span>
    </div>
  ))

  return (
    <AnimatedList
      items={items}
      showGradients={false}
      enableArrowNavigation={false}
      className="max-w-md"
    />
  )
}
```

## CMS Usage Notes

- For a simple list of text features: pass `items={features.map(f => f.label)}`.
- For rich items with icons or descriptions: map to `ReactNode[]` as shown above.
- Set `enableArrowNavigation={false}` and `showGradients={false}` for pure visual lists with no interaction.
- `onItemSelect` is only useful if the list items should navigate somewhere or trigger state — for read-only CMS feature lists, omit it.
- Component is `"use client"` internally due to keyboard/scroll interactions.
