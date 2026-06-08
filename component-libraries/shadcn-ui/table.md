# Table — shadcn/ui

Semantic HTML table with styled header, body, rows, and cells. Used for comparison tables, pricing matrices, data grids, and spec sheets from the CMS.

## Install

```bash
npx shadcn@latest add table
```

## Import

```tsx
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
```

## Sub-component Anatomy

```
Table
├── TableCaption        ← optional descriptive caption (renders below table)
├── TableHeader
│   └── TableRow
│       └── TableHead  ← one per column header
├── TableBody
│   └── TableRow       ← one per data row
│       └── TableCell  ← one per cell
└── TableFooter        ← optional summary row
    └── TableRow
        └── TableCell
```

All sub-components accept `className`. There are no required props beyond the standard HTML table semantics.

## Usage Example

```tsx
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type TableRow = Record<string, string>

export default function DataTableBlock({
  caption,
  headers,
  rows,
}: {
  caption?: string
  headers: string[]
  rows: TableRow[]
}) {
  return (
    <Table>
      {caption && <TableCaption>{caption}</TableCaption>}
      <TableHeader>
        <TableRow>
          {headers.map((h) => (
            <TableHead key={h}>{h}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row, i) => (
          <TableRow key={i}>
            {headers.map((h) => (
              <TableCell key={h}>{row[h] ?? "—"}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
```

## CMS Mapping Notes

- CMS table blocks vary widely. Common patterns:
  - `headers: String[]` + `rows: JSON` (array of objects) — use the generic pattern above.
  - Structured rows: `rows: { cells: String[] }[]` — map `row.cells[i]` to each `TableCell`.
- Wrap the `<Table>` in a `<div className="overflow-x-auto">` for mobile responsiveness.
- `TableCaption` renders below the table by default — use it for source attribution or footnotes.
- If the CMS block has a `footerRow` field, map it to `<TableFooter>`.
- This is a server component — no `"use client"` needed.
