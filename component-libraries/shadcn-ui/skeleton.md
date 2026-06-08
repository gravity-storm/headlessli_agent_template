# Skeleton — shadcn/ui

Animated grey shimmer placeholder shown while content is loading. Use inside Suspense boundaries or streaming SSR to fill the visual space before real data arrives.

## Install

```bash
npx shadcn@latest add skeleton
```

## Import

```tsx
import { Skeleton } from "@/components/ui/skeleton"
```

## Props

### `<Skeleton>`
| Prop | Type | Notes |
|------|------|-------|
| `className` | `string` | **This is how you size it.** Always provide `h-*` and `w-*` Tailwind classes. Use `rounded-full` for circular avatars, `rounded-md` for cards. |

There are no other props — sizing and shape are entirely controlled through `className`.

## Usage Examples

```tsx
import { Skeleton } from "@/components/ui/skeleton"

// Text line placeholders
export function TextSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  )
}

// Card placeholder
export function CardSkeleton() {
  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <Skeleton className="h-48 w-full rounded-md" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  )
}

// Avatar + text placeholder
export function AuthorSkeleton() {
  return (
    <div className="flex items-center gap-3">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="space-y-1">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  )
}
```

## CMS Mapping Notes

- Skeleton is not tied to a CMS block type — it is used as the `fallback` in a `<Suspense>` boundary wrapping a component that fetches data.
- Mirror the shape of the real component: if the real card has an image, title, and description, the skeleton should have corresponding `Skeleton` elements at the same sizes.
- Do not use Skeleton to represent a CMS "loading block" type — it is infrastructure, not content.
- This is a server component — no `"use client"` needed.
