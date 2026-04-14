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
      { name: "External 4K Monitor" },
      { name: "Mechanical Keyboard" },
      { name: "Noise-cancelling Headphones" },
    ],
  },
  {
    category: "Editor",
    items: [
      { name: "VS Code", note: "daily driver" },
      { name: "Neovim", note: "when I want a distraction" },
    ],
  },
  {
    category: "Terminal",
    items: [
      { name: "iTerm2" },
      { name: "zsh + Starship", note: "prompt" },
    ],
  },
  {
    category: "Tools",
    items: [
      { name: "Raycast", note: "launcher" },
      { name: "Linear", note: "project tracking" },
      { name: "Notion", note: "docs" },
      { name: "Figma", note: "UI work" },
    ],
  },
  {
    category: "Stack defaults",
    items: [
      { name: "TypeScript" },
      { name: "Next.js", note: "web" },
      { name: "PostgreSQL", note: "data" },
      { name: "Vercel", note: "deploy" },
    ],
  },
]
