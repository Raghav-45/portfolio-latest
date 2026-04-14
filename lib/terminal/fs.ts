/**
 * lib/terminal/fs.ts
 * ─────────────────────────────────────────────────────────────
 * Virtual filesystem used by the Terminal window. Content for
 * each "file" lives in /config/terminal.ts so the structure is
 * data-driven — adding a new file is one entry, no code changes.
 * ─────────────────────────────────────────────────────────────
 */

import { terminal as terminalData } from "@/config/terminal"

export type FSNode =
  | { type: "file"; content: string[] }
  | { type: "dir"; children: Record<string, FSNode> }

/** Root of the virtual filesystem. */
export const FS: FSNode = {
  type: "dir",
  children: {
    "about.txt":      { type: "file", content: terminalData.about },
    "skills.txt":     { type: "file", content: terminalData.skills },
    "experience.txt": { type: "file", content: terminalData.experience },
    "contact.txt":    { type: "file", content: terminalData.contact },
    "resume.pdf":     { type: "file", content: terminalData.resume },
    ".env":           { type: "file", content: ["nice try :)"] },
  },
}

/** Resolve a sequence of path parts relative to `cwd`. Returns the new path or null if invalid. */
export function resolvePath(cwd: string[], parts: string[]): string[] | null {
  const stack = [...cwd]
  for (const part of parts) {
    if (part === "" || part === ".") continue
    if (part === "..") {
      if (stack.length > 0) stack.pop()
    } else {
      stack.push(part)
    }
  }
  return stack
}

/** Walk the FS tree and return the node at `path`, or null if missing. */
export function getNode(path: string[]): FSNode | null {
  let node: FSNode = FS
  for (const seg of path) {
    if (node.type !== "dir") return null
    const child = node.children[seg]
    if (!child) return null
    node = child
  }
  return node
}

/** Pretty-print a cwd stack as "~/foo/bar". */
export function cwdToString(cwd: string[]): string {
  if (cwd.length === 0) return "~"
  return "~/" + cwd.join("/")
}
