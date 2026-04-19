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
    date: "Apr 2026",
    body: `Working on scaling our data platform at Human Archive to handle
TB-scale robotics datasets. The challenge of building multi-tenant
auth with Cognito + Postgres role enrichment has been one of the
most rewarding architecture problems I've tackled.`,
  },
  {
    date: "Feb 2026",
    body: `Joined Human Archive through YC W26. Leading the data platform
team — building everything from the React frontend with TanStack
Router to the Express API layer, all wired into AWS (S3, Lambda,
CloudFront signed URLs). Startup life hits different.`,
  },
  {
    date: "Jan 2026",
    body: `Wrapping up my time at Conqr AI. Proud of what we shipped —
took document ingestion from 5+ minutes down to under a minute
for 25 docs using Go's concurrency model. The RAG legal chatbot
is now handling real user queries in production.`,
  },
  {
    date: "Oct 2025",
    body: `Won 3rd Runner Up at Bajaj HackRX 6.0 — the Larry Page Award
for Best Innovation. Also placed Top 25 at Facebook's Pragati AI
for Impact Hackathon. Good streak of hackathon results lately.`,
  },
]
