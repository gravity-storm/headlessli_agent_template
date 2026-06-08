# CountUp — React Bits

Animates a number from a start value to a target value using spring physics. Triggers when the element scrolls into view. Perfect for stats, metrics, and achievement blocks.

## Install

```bash
npm install motion
npx shadcn@latest add https://reactbits.dev/r/CountUp-TS-TW
```

**Peer dependency:** `motion` (the standalone Framer Motion package).

## Props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `to` | `number` | **Required** | The target number to count up (or down) to. |
| `from` | `number` | `0` | Starting value. |
| `direction` | `'up' \| 'down'` | `'up'` | `'up'` counts from `from` to `to`; `'down'` reverses. |
| `delay` | `number` | `0` | Delay in seconds before animation starts. |
| `duration` | `number` | `2` | Animation duration in seconds. |
| `separator` | `string` | `''` | Thousands separator, e.g. `','` renders `1,000`. |
| `startWhen` | `boolean` | `true` | Set to `false` to pause until you flip to `true` (controlled start). |
| `className` | `string` | `''` | Applied to the wrapper span. |
| `onStart` | `() => void` | — | Fires when animation begins. |
| `onEnd` | `() => void` | — | Fires when animation completes. |

## Usage Example

```tsx
import CountUp from '@/components/reactbits/CountUp'

// Single stat
export default function StatItem({
  value,
  label,
  suffix,
}: {
  value: number
  label: string
  suffix?: string
}) {
  return (
    <div className="text-center">
      <div className="text-5xl font-bold">
        <CountUp to={value} separator="," duration={2} />
        {suffix && <span>{suffix}</span>}
      </div>
      <p className="mt-1 text-muted-foreground">{label}</p>
    </div>
  )
}
```

## CMS Usage Notes

- The CMS stats block typically has an array of `{ value: Int, label: String, suffix?: String }` items — map each to a `StatItem`.
- Guard against `null` from the CMS: `to={stat.value ?? 0}`.
- The `suffix` (e.g. `%`, `+`, `x`) comes from the CMS as a separate String field — render it as a plain `<span>` beside `<CountUp>` rather than embedding it in the number.
- `separator=","` for any number likely to exceed 999 (user counts, revenue, etc.).
- Component is `"use client"` internally — does NOT need `QueenofheartsRenderComponent`, so it can have `"use client"` in its file if needed for hooks.
