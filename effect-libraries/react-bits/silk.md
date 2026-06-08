# Silk — React Bits

Fluid animated silk-like shader fills a section background. The most minimal and elegant background in React Bits — slow-moving, smooth, and doesn't compete with content.

## Install

```bash
npm install @react-three/fiber three
npx shadcn@latest add https://reactbits.dev/r/Silk-TS-TW
```

**Peer dependencies:** `@react-three/fiber@^9.3.0` and `three@^0.167.1` (Three.js, not OGL).

## Props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `speed` | `number` | `5` | Animation speed. Higher = faster ripples. Keep ≤3 for subtle background use. |
| `scale` | `number` | `1` | Pattern scale. Higher = larger folds, lower = finer texture. |
| `color` | `string` | `'#7B7481'` | Hex colour of the silk. Match to brand palette. |
| `noiseIntensity` | `number` | `1.5` | Amount of variation in the folds. Higher = more organic. |
| `rotation` | `number` | `0` | Rotates the animation in degrees. |

## Usage Example

```tsx
import Silk from '@/components/reactbits/Silk'

export default function SectionBackground({ color = '#1e1b4b' }: { color?: string }) {
  return (
    <div className="relative">
      <div className="absolute inset-0 -z-10 opacity-60">
        <Silk
          color={color}
          speed={2}
          scale={1.2}
          noiseIntensity={1.2}
        />
      </div>
      <div className="relative z-10">
        {/* section content */}
      </div>
    </div>
  )
}
```

## CMS Usage Notes

- Use `opacity-60` or lower on the wrapper to prevent the background from overpowering the content.
- `speed={2}` + `noiseIntensity={1.2}` is a tasteful preset — barely noticeable at a glance but clearly not static.
- Works best with dark base colours — a dark silk with light text is the most legible combination.
- Like all WebGL backgrounds: parent needs `position: relative`, wrapper needs `absolute inset-0`, parent needs a `min-height`.
- Component is `"use client"` internally.
