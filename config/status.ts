/**
 * status.ts
 * ─────────────────────────────────────────────────────────────
 * Data for the StatusWidget shown in the desktop's top-right
 * corner. Flip `available` to false to render a muted indicator.
 *
 * The `currently` rows are free-form "label + value" pairs — add
 * or remove as many as you want.
 * ─────────────────────────────────────────────────────────────
 */

export interface StatusRow {
  /** Short label (5-10 chars reads best). */
  label: string
  value: string
}

export interface StatusConfig {
  available: boolean
  label: string
  currently: StatusRow[]
}

export const status: StatusConfig = {
  available: true,
  label: "Building @ YC W26",
  currently: [
    { label: "Building", value: "Data platform at Human Archive (YC W26)" },
    { label: "Hacking",  value: "RAG pipelines & LLM" },
    { label: "Studying", value: "Computer Science @ MAIT, New Delhi" },
  ],
}
