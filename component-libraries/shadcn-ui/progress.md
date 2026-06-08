# Progress — shadcn/ui

Horizontal bar that fills to show a numeric completion percentage. Used for skill bars, step indicators, fundraising progress, and stat blocks.

## Install

```bash
npx shadcn@latest add progress
```

## Import

```tsx
import { Progress } from "@/components/ui/progress"
```

## Props

### `<Progress>`
| Prop | Type | Notes |
|------|------|-------|
| `value` | `number` | Completion percentage, 0–100. Pass `null` for indeterminate (animated pulse). |
| `className` | `string` | Use `h-*` to change the bar height (default is `h-2`). |

## Usage Example

```tsx
import { Progress } from "@/components/ui/progress"

export default function SkillBar({
  label,
  value,
}: {
  label: string
  value: number
}) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <Progress value={value} className="h-3" />
    </div>
  )
}

// Multiple skill bars from a CMS array
export function SkillsBlock({ skills }: { skills: { label: string; value: number }[] }) {
  return (
    <div className="space-y-4">
      {skills.map((skill) => (
        <SkillBar key={skill.label} label={skill.label} value={skill.value} />
      ))}
    </div>
  )
}
```

## CMS Mapping Notes

- CMS stat/skill blocks typically have an array of `{ label: String, value: Int }` — map each to a `<SkillBar>`.
- The `value` prop is 0–100. If the CMS stores raw numbers (e.g. `0.75` for 75%), multiply by 100.
- Guard against `null` values from the CMS: `value={skill.value ?? 0}`.
- For an indeterminate loading state (value unknown), pass `value={null}` — the bar will animate.
- This is a server component — no `"use client"` needed.
