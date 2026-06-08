# Particles — React Bits

WebGL floating particle field that fills a section background. Renders 3D particles in a sphere, animated with sinusoidal motion. Subtle at low counts; dramatic at high counts.

## Install

```bash
npm install ogl
npx shadcn@latest add https://reactbits.dev/r/Particles-TS-TW
```

**Peer dependency:** `ogl@^1.0.11`.

## Props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `particleCount` | `number` | `200` | Fewer = subtler. 50–100 is tasteful for content pages. |
| `particleSpread` | `number` | `10` | How far particles spread from centre. |
| `speed` | `number` | `0.1` | Animation speed. Keep ≤0.15 for non-distracting backgrounds. |
| `particleColors` | `string[]` | (library default) | Array of hex colours. Match to brand palette. |
| `particleBaseSize` | `number` | `100` | Base size of each particle. |
| `sizeRandomness` | `number` | `1` | Variance in particle size. |
| `moveParticlesOnHover` | `boolean` | `false` | Particles react to mouse — avoid for content-heavy sections. |
| `particleHoverFactor` | `number` | `1` | How strongly particles react to hover. |
| `alphaParticles` | `boolean` | `false` | Enables transparency on particles — softer look. |
| `disableRotation` | `boolean` | `false` | Stops the sphere from rotating. More static feel. |
| `cameraDistance` | `number` | `20` | Camera zoom — higher = zoomed out, smaller particles. |
| `className` | `string` | — | Applied to the canvas wrapper. Use `absolute inset-0` for full-section fill. |

## Usage Example

```tsx
import Particles from '@/components/reactbits/Particles'

export default function HeroBackground({ brandColor = '#6366f1' }: { brandColor?: string }) {
  return (
    <div className="relative min-h-screen">
      {/* Background layer */}
      <Particles
        particleCount={80}
        speed={0.08}
        particleColors={[brandColor, '#ffffff']}
        alphaParticles
        disableRotation
        className="absolute inset-0 -z-10"
      />
      {/* Content sits on top */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
        {/* hero content */}
      </div>
    </div>
  )
}
```

## CMS Usage Notes

- The section wrapper **must** have `position: relative` — use `className="relative"` on the parent.
- Apply `absolute inset-0 -z-10` on `<Particles>` so it fills the section behind the content.
- Keep `particleCount` ≤100 for background use — it is decorative, not the focus.
- `alphaParticles={true}` + low `speed` is the tasteful preset. Avoid `moveParticlesOnHover` for content sections.
- WebGL canvas will be invisible if the parent has `overflow: hidden` and no explicit height — always set `min-height` on the section.
- Component is `"use client"` internally (WebGL requires browser APIs).
