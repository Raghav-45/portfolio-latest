/**
 * projects.ts
 * ─────────────────────────────────────────────────────────────
 * All projects shown in the Projects window.
 * Split into two lists: `personal` (side projects) and `client`
 * (paid / contracted work). Both use the same ProjectItem shape.
 *
 *  - `tech`   → array of tags rendered beneath the description.
 *  - `stars`  → optional — shown next to the title if present.
 *  - `status` → optional — rendered as a pill (e.g. "Paused").
 * ─────────────────────────────────────────────────────────────
 */

export interface CaseStudy {
  /** What the user/team was struggling with — be concrete, name the metric. */
  problem: string
  /** What was actually built and the key technical bets. */
  approach: string
  /** Outcome — quantified where possible. */
  outcome: string
  /** Optional headline metric pulled out for the modal hero. */
  metric?: { value: string; label: string }
}

export interface ProjectItem {
  title: string
  description: string
  tech: string[]
  status?: string
  stars?: number
  link: string
  /** Long-form case study rendered in the project modal. */
  caseStudy?: CaseStudy
}

export interface ProjectsConfig {
  personal: ProjectItem[]
  client: ProjectItem[]
}

export const projects: ProjectsConfig = {
  personal: [
    {
      title: "Thunder Forms",
      description: "State-driven form builder with drag-and-drop composition, AI-assisted creation, and a deep analytics pipeline — shipped as a production SaaS with 10K+ visits.",
      tech: ["Next.js", "TypeScript", "SSE", "PostgreSQL", "NextAuth.js", "Shadcn UI"],
      link: "https://thunderforms.in",
      caseStudy: {
        metric: { value: "10K+", label: "production visits" },
        problem:
          "Existing form builders force you to choose: either a clean drag-and-drop UI with shallow analytics (Typeform), or deep analytics with no first-class form composition (Posthog). Builders shipping a quick survey or lead-gen form had to glue together 3+ tools to get session-aware metrics.",
        approach:
          "Built a single-state form schema that drives both the editor and the renderer — one source of truth, no drift between what you compose and what users see. Drag-and-drop composition via dnd-kit. AI-assisted form generation streams field suggestions over SSE so the user sees the form being built field-by-field instead of waiting for a full response. The analytics pipeline aggregates raw events (impressions, focus, blur, submit) into session-aware rollups with bounce rate, partial-completion buckets, and a live visitor counter.",
        outcome:
          "Shipped as a production SaaS with 10K+ visits. 1st Runner Up at Appocalypse 2.0 MAIT. The schema-driven approach made adding new field types a 50-line change instead of touching three places, which kept the iteration loop tight enough that I could ship features the same day a user requested them.",
      },
    },
    {
      title: "Fantastic Robo",
      description: "High-throughput, multi-format ingestion pipeline with adaptive extraction, OCR, semantic chunking, and a production-grade LLM load balancer for resilient RAG service levels.",
      tech: ["Docker", "Sentry", "Vector Embeddings", "Mistral OCR", "CI/CD", "DigitalOcean"],
      link: "https://github.com/Raghav-45/fantastic-robo",
      caseStudy: {
        metric: { value: "6+", label: "input formats end-to-end" },
        problem:
          "RAG pipelines that work on PDFs fall apart the moment users upload DOCX, PPTX, XLSX, scanned images, or email exports. Each format needs a different extractor, a different chunking strategy, and a different OCR fallback. Most teams ship a PDF-only MVP and accumulate technical debt every time a new format is requested.",
        approach:
          "Adaptive extraction: detect format → pick extractor → measure extraction quality → fall back to Mistral OCR if the text-layer is empty or scrambled. Semantic chunking respects document structure (slides for PPTX, sheets for XLSX, threads for emails) instead of brute-force splitting on token count. Embedding batching plus an HNSW vector index gives sub-100ms similarity search over the full corpus. The LLM load balancer routes requests across providers with telemetry-driven failover so a single upstream outage doesn't degrade the whole service.",
        outcome:
          "Production-grade ingestion across 6+ formats with sub-second retrieval. Hybrid retrieval (dense + BM25) plus dynamic Top-K turned out to outperform either alone for legal-style documents where exact phrase recall matters as much as semantic relevance.",
      },
    },
  ],

  client: [
    {
      title: "Human Archive Data Platform",
      description: "Enterprise data platform for delivering TB-scale robotics datasets with multi-tenant auth and deep AWS integration.",
      tech: ["React", "TanStack Router", "Express", "PostgreSQL", "AWS"],
      link: "https://humanarchive.ai",
      caseStudy: {
        metric: { value: "TB-scale", label: "datasets served" },
        problem:
          "Human Archive (YC W26) needed an enterprise platform to deliver multimodal robotics datasets at terabyte scale. Customers wanted role-gated access to specific dataset slices, recursive S3 folder structure preserved end-to-end, and auth that supported multiple organizations without leaking data across tenants. Off-the-shelf data portals couldn't handle the storage scale or the multi-tenant boundary.",
        approach:
          "Led the platform end-to-end: React with TanStack Router for the file-tree UI, an Express API, Postgres for metadata, and a deep AWS integration (Cognito for auth, S3 for storage, Lambda for orchestration, CloudFront with signed URLs for delivery). Multi-tenant auth verifies Cognito JWTs server-side and enriches them with role and org profiles from Postgres — the role then branches entire component subtrees on the frontend, so an enterprise viewer never even sees the contributor surface area. The dataset pipeline does recursive S3 folder resolution and batched ingestion with conflict-safe upserts.",
        outcome:
          "The primary tool for delivering TB-scale datasets to enterprise customers. Recursive folder resolution survived the move to multi-region S3. Role-gated UI branching kept the contributor and consumer codepaths from cross-contaminating, which would have been the inevitable failure mode if I had used a feature-flag-per-button approach.",
      },
    },
    {
      title: "Conqr AI Legal Chatbot",
      description: "RAG-powered legal chatbot with end-to-end document pipeline — scan detection, OCR, chunking, and Go-powered parallel processing.",
      tech: ["Go", "RAG", "PDF.js", "OCR", "Vector Embeddings"],
      link: "https://conqr.ai",
      caseStudy: {
        metric: { value: "5min → <1min", label: "ingestion for ~25 docs" },
        problem:
          "Legal teams onboard with batches of contracts, briefs, and exhibits — typically 20-30 PDFs at once. The naive single-threaded pipeline took 5+ minutes per batch, which felt broken to a user who'd just dragged files in and was watching a spinner. Worse, mixed batches (some text-layer PDFs, some scans) had to be processed at the slower rate of the scanned ones because OCR ran inline.",
        approach:
          "Rewrote the ingestion pipeline in Go to exploit parallelism per document. Scan detection runs first as a cheap heuristic on the PDF text layer; only documents that actually need OCR pay the OCR cost. Chunking is page-wise so cross-section context (a clause referenced 30 pages later) survives retrieval. Each stage of the pipeline is a goroutine fed by a buffered channel, so a single slow OCR doc doesn't block the rest of the batch.",
        outcome:
          "Ingestion dropped from 5+ minutes to under 60 seconds for ~25 documents — a 6x improvement at the user-perceived layer. The team-onboarding experience went from 'go grab a coffee' to 'wait, it's done?' which directly impacted activation rate. Page-wise chunking with metadata-backed storage made later retrieval explainable, which matters disproportionately in a legal product where every answer needs a source.",
      },
    },
  ],
}

/** Résumé-only condensed project highlights (short names + long descriptions). */
export interface ResumeProjectItem {
  name: string
  desc: string
}

export const resumeProjects: ResumeProjectItem[] = [
  {
    name: "Fantastic Robo",
    desc: "High-throughput, multi-format ingestion pipeline supporting PDFs, DOCX, PPTX, XLSX, images, and emails with adaptive extraction, OCR, semantic chunking, and embedding batching. Scalable vector search layer with HNSW-based similarity matching, dynamic Top-K and Hybrid retrieval. Production-grade LLM load balancer with smart request routing and telemetry feedback.",
  },
  {
    name: "Thunder Forms",
    desc: "State-driven form builder with drag-and-drop composition, schema-driven rendering, and an AI-assisted creation pipeline. Deep analytics pipeline aggregating event-level data into session-aware metrics (impressions, bounce rate, live users); shipped as a production SaaS with 10K+ visits.",
  },
]
