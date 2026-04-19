/**
 * links.ts
 * ─────────────────────────────────────────────────────────────
 * Curated external reading list shown in the LinksWidget on the
 * desktop. Each entry is an outbound link with a short tag used
 * for display only.
 * ─────────────────────────────────────────────────────────────
 */

export interface LinkItem {
  title: string
  author: string
  url: string
  /** Freeform short label displayed under the author (e.g. "rust"). */
  tag: string
}

export const links: LinkItem[] = [
  { title: "Go Concurrency Patterns",     author: "Rob Pike",            url: "https://go.dev/blog/pipelines",                              tag: "go" },
  { title: "RAG is More Than Embeddings", author: "LlamaIndex",          url: "https://docs.llamaindex.ai/en/stable/",                      tag: "ai" },
  { title: "Designing Data-Intensive Apps", author: "Martin Kleppmann",  url: "https://dataintensive.net/",                                 tag: "systems" },
  { title: "The Twelve-Factor App",       author: "Heroku",              url: "https://12factor.net/",                                      tag: "architecture" },
  { title: "React Server Components",     author: "Dan Abramov",         url: "https://react.dev/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023", tag: "react" },
]
