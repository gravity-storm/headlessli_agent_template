# NavigationMenu — shadcn/ui

Horizontal navigation bar with optional dropdown flyout panels for sub-pages or link groups. Used for site header navigation blocks.

## Install

```bash
npx shadcn@latest add navigation-menu
```

## Import

```tsx
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
```

## Sub-component Anatomy

```
NavigationMenu
└── NavigationMenuList
    └── NavigationMenuItem (one per top-level nav item)
        ├── Option A: NavigationMenuTrigger + NavigationMenuContent (has dropdown)
        └── Option B: NavigationMenuLink (plain link, no dropdown)
```

## Props

### `<NavigationMenuTrigger>`
Renders a button with a chevron. Accepts `children` (the link label). No required props.

### `<NavigationMenuLink>`
| Prop | Type | Notes |
|------|------|-------|
| `asChild` | `boolean` | Use with Next.js `<Link>` for client-side navigation. |
| `className` | `string` | Use `navigationMenuTriggerStyle()` for consistent styling with trigger items. |

### `<NavigationMenuContent>`
Dropdown panel. Position and animation are handled automatically. Accepts `children`.

## Usage Example

```tsx
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import Link from "next/link"

type NavItem = {
  label: string
  href?: string
  children?: { label: string; href: string; description?: string }[]
}

export default function NavBlock({ items }: { items: NavItem[] }) {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {items.map((item) =>
          item.children?.length ? (
            <NavigationMenuItem key={item.label}>
              <NavigationMenuTrigger>{item.label}</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[300px] gap-3 p-4">
                  {item.children.map((child) => (
                    <li key={child.href}>
                      <NavigationMenuLink asChild>
                        <Link href={child.href} className="block p-2 rounded-md hover:bg-accent">
                          <p className="font-medium">{child.label}</p>
                          {child.description && (
                            <p className="text-sm text-muted-foreground">{child.description}</p>
                          )}
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          ) : (
            <NavigationMenuItem key={item.label}>
              <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                <Link href={item.href ?? "/"}>{item.label}</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          )
        )}
      </NavigationMenuList>
    </NavigationMenu>
  )
}
```

## CMS Mapping Notes

- The CMS nav block typically has an array of `{ label, href, children? }` items.
- Use `asChild` + Next.js `<Link>` on `NavigationMenuLink` to avoid full-page reloads.
- `navigationMenuTriggerStyle()` is a utility function that returns a `className` string — apply it to plain link items so they match the visual style of trigger items.
- The dropdown flyout (`NavigationMenuContent`) handles its own positioning — do not wrap it in a `relative` container.
- This component uses Radix UI internally and already handles keyboard navigation and accessibility.
- The outer component does NOT need `"use client"` — the installed component file handles that internally.
