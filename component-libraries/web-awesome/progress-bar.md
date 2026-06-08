# wa-progress-bar — Web Awesome

Horizontal bar showing numeric completion as a percentage. Use for skill bars, stat blocks, fundraising progress, and step completion indicators.

## Install

```bash
npm install @awesome.me/webawesome
```

```ts
import '@awesome.me/webawesome/dist/styles/webawesome.css'
import '@awesome.me/webawesome/dist/components/progress-bar/progress-bar.js'
```

## Attributes

| Attribute | Type | Default | Notes |
|-----------|------|---------|-------|
| `value` | `number` | `0` | Completion percentage, 0–100. |
| `label` | `string` | `''` | Accessible label for screen readers. Use the skill/stat name. |
| `indeterminate` | boolean | `false` | Animated indeterminate state — use when value is unknown. |

## CSS Custom Properties

| Property | Notes |
|----------|-------|
| `--track-height` | Bar thickness. Default is thin — set to `'8px'` or `'12px'` for visible skill bars. |

## Usage Example

```tsx
export default function SkillBar({
  label,
  value,
}: {
  label: string
  value: number
}) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
        <span>{label}</span>
        <span>{value ?? 0}%</span>
      </div>
      <wa-progress-bar
        value={value ?? 0}
        label={label}
        style={{ '--track-height': '8px' } as React.CSSProperties}
      />
    </div>
  )
}

// Multiple skill bars from a CMS array
export function SkillsBlock({ skills }: { skills: { label: string; value: number }[] }) {
  return (
    <div>
      {(skills ?? []).map((skill) => (
        <SkillBar key={skill.label} label={skill.label} value={skill.value} />
      ))}
    </div>
  )
}
```

## CMS Mapping Notes

- CMS stat/skill blocks typically have an array of `{ label: String, value: Int }` — map each to a `SkillBar`.
- Guard against CMS `null`: `value={skill.value ?? 0}`.
- If the CMS stores ratios (e.g. `0.75`), multiply by 100: `value={(skill.value ?? 0) * 100}`.
- Set `--track-height` via inline `style` prop using React's `CSSProperties` cast — the CSS variable syntax requires it.
- No `"use client"` needed.
