/**
 * notes.ts
 * ─────────────────────────────────────────────────────────────
 * Short, informal journal-style notes rendered in the Notes
 * window. Paragraphs are separated by blank lines (\n\n) — single
 * newlines are preserved as line breaks.
 *
 * Sort order is as written — newest first is the convention.
 * ─────────────────────────────────────────────────────────────
 */

export interface NoteItem {
  /** Display date, e.g. "Mar 2026". */
  date: string
  /** Body text. Separate paragraphs with a blank line. */
  body: string
}

export const notes: NoteItem[] = [
  {
    date: "Jan 2026",
    body: `Delete this note and write your own.

Notes are for raw, unpolished thoughts — the kind you'd write in
a pocket notebook. Not blog posts. Not marketing copy. Just things
you want to remember.`,
  },
]
