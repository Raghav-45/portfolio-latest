/**
 * windows.ts
 * ─────────────────────────────────────────────────────────────
 * Single source of truth for every window (= application) the
 * desktop can open. Dock, window renderer, and context menu all
 * iterate over this array. To add a window:
 *
 *   1. Import your section component.
 *   2. Append an entry here with a unique `id`.
 *   3. That's it — it shows up in the dock and the window layer.
 *
 * `component` receives `{ compact: true }` when rendered inside
 * a MacWindow. All built-in section components already accept
 * that prop; yours should too.
 * ─────────────────────────────────────────────────────────────
 */

import {
  User, Briefcase, Code2, BookOpen, Mail,
  ScrollText, TerminalSquare, Cpu, NotebookPen,
  type LucideIcon,
} from "lucide-react"
import type { PostMeta } from "@/lib/posts"

import Hero       from "@/app/components/Hero"
import Experience from "@/app/components/sections/Experience"
import Projects   from "@/app/components/sections/Projects"
import Blogs      from "@/app/components/sections/Blogs"
import Contact    from "@/app/components/sections/Contact"
import Resume     from "@/app/components/sections/Resume"
import Terminal   from "@/app/components/sections/Terminal"
import Uses       from "@/app/components/sections/Uses"
import Notes      from "@/app/components/sections/Notes"

/** Extra data threaded from the server into a window (e.g. blog posts). */
export interface WindowContext {
  posts: PostMeta[]
  onOpen: (id: WindowId) => void
  onClose: (id: WindowId) => void
}

// One union of valid window ids keeps the rest of the app typo-safe.
export type WindowId =
  | "about" | "experience" | "projects" | "blogs" | "contact"
  | "resume" | "terminal" | "uses" | "notes"

export interface WindowDef {
  id: WindowId
  /** Shown in the dock tooltip and in the window title bar. */
  title: string
  icon: LucideIcon
  /** Default window size in px. */
  width: number
  height: number
  /** Offset from centre — lets multiple windows stagger nicely. */
  offsetX: number
  offsetY: number
  /** The component rendered inside the window. Different sections accept
   *  different props (Blogs needs posts, Terminal needs open/close callbacks);
   *  the extra props are threaded from Desktop.tsx, so this type stays loose. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: React.ComponentType<any>
}

export const windows: WindowDef[] = [
  { id: "about",      title: "About",      icon: User,           width: 560, height: 480, offsetX:   0, offsetY: -20, component: Hero },
  { id: "experience", title: "Experience", icon: Briefcase,      width: 680, height: 570, offsetX:  20, offsetY:  20, component: Experience },
  { id: "projects",   title: "Projects",   icon: Code2,          width: 720, height: 570, offsetX: -20, offsetY:  10, component: Projects },
  { id: "blogs",      title: "Blogs",      icon: BookOpen,       width: 660, height: 550, offsetX:  10, offsetY: -10, component: Blogs },
  { id: "contact",    title: "Contact",    icon: Mail,           width: 460, height: 330, offsetX: -10, offsetY:  30, component: Contact },
  { id: "resume",     title: "Résumé",     icon: ScrollText,     width: 660, height: 580, offsetX:  30, offsetY:   0, component: Resume },
  { id: "terminal",   title: "Terminal",   icon: TerminalSquare, width: 600, height: 460, offsetX: -30, offsetY:  15, component: Terminal },
  { id: "uses",       title: "Uses",       icon: Cpu,            width: 520, height: 500, offsetX:  40, offsetY: -30, component: Uses },
  { id: "notes",      title: "Notes",      icon: NotebookPen,    width: 500, height: 480, offsetX: -40, offsetY: -25, component: Notes },
]

/** Helper used by the Desktop to look up a window by id. */
export function getWindow(id: WindowId): WindowDef | undefined {
  return windows.find((w) => w.id === id)
}
