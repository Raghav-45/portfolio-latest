/**
 * uses.ts
 * ─────────────────────────────────────────────────────────────
 * Data for the /uses-style window. Group your tools by category;
 * each item has a name and an optional short note.
 *
 * Categories and counts are fully flexible — the UI iterates over
 * whatever you provide.
 * ─────────────────────────────────────────────────────────────
 */

export interface UseItem {
  name: string
  /** Optional short descriptor shown in the faint mono style. */
  note?: string
}

export interface UseGroup {
  category: string
  items: UseItem[]
}

export const uses: UseGroup[] = [
  {
    category: "Hardware",
    items: [
      { name: "MacBook Pro", note: "primary machine" },
      { name: "External Monitor" },
      { name: "Mechanical Keyboard" },
      { name: "Noise-cancelling Headphones" },
    ],
  },
  {
    category: "Editor",
    items: [
      { name: "VS Code", note: "daily driver" },
      { name: "Claude Code", note: "AI pair programmer" },
    ],
  },
  {
    category: "Terminal",
    items: [
      { name: "iTerm2" },
      { name: "zsh", note: "shell" },
    ],
  },
  {
    category: "Tools",
    items: [
      { name: "Docker", note: "containers" },
      { name: "Postman", note: "API testing" },
      { name: "Sentry", note: "error tracking" },
      { name: "Figma", note: "UI work" },
    ],
  },
  {
    category: "Stack defaults",
    items: [
      { name: "TypeScript + Go", note: "languages" },
      { name: "React / Next.js", note: "frontend" },
      { name: "Express / Bun", note: "backend" },
      { name: "PostgreSQL", note: "database" },
      { name: "AWS", note: "cloud" },
      { name: "Prisma / Drizzle", note: "ORM" },
    ],
  },
]
