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
    {
      title: "IOSD MAIT Website",
      description: "Official website for IOSD MAIT — the largest technical society at Maharaja Agrasen Institute of Technology. Central hub for events (IMPULSE), member projects, and recruitment.",
      tech: ["Next.js", "TypeScript", "Tailwind CSS"],
      link: "https://github.com/Raghav-45/iosd-web",
      caseStudy: {
        metric: { value: "Largest", label: "tech society at MAIT" },
        problem:
          "IOSD MAIT didn't have a single canonical web presence. Information about events like IMPULSE, the projects members shipped, and how new students could get involved was scattered across WhatsApp threads, Notion pages, and Google docs. Prospective members would ask 'what does IOSD actually do?' and there wasn't a single link to send them.",
        approach:
          "Built the official site as the central hub: events surface, project showcases, member directory, recruitment funnel. Next.js App Router for SEO-friendly static pages so the recruitment landing page gets indexed. Typed content schemas (events, projects, members are TypeScript objects, not raw markdown) so multiple society members can contribute without breaking each other's pages. Tailwind-based design system that anyone with basic frontend chops can extend.",
        outcome:
          "The canonical landing page for the society — linked from every official IOSD communication, used during recruitment drives, and the page IMPULSE attendees see when they first hear about the event. Maintained by the team as a living artifact of what IOSD MAIT ships.",
      },
    },
    {
      title: "Wave Linux",
      description: "Minimal Linux distribution built from torvalds/linux + uutils/coreutils. Build script fetches the kernel, compiles BusyBox and ~100 Rust coreutils with musl static linking, and packages a bootable image.",
      tech: ["Rust", "Linux Kernel", "BusyBox", "musl", "uutils", "Shell"],
      link: "https://github.com/Raghav-45/wave-linux",
      caseStudy: {
        metric: { value: "100+", label: "Rust coreutils statically linked" },
        problem:
          "'Build your own minimal Linux' tutorials skip the actually-hard parts: how do you pin a kernel version, fetch the source, configure it for x86_64-musl, and link a Rust-rewritten coreutils into a bootable image without inheriting a distro's assumptions? The knowledge is scattered across 17 stale blog posts. There wasn't a single repo that does it end-to-end.",
        approach:
          "One Python build script (build-minimal.py) drives the whole pipeline: download a specific Linux kernel tarball, extract it, configure for x86_64, compile. Same for BusyBox. Then drive cargo to build ~100 Rust uutils crates against x86_64-unknown-linux-musl with --release. Musl static linking avoids the 'glibc isn't on the target system' trap. The output is a kernel image plus a userland that runs on top of it with zero host-system dependencies.",
        outcome:
          "A reproducible build that takes a fresh Ubuntu host and produces a bootable minimal Linux with Rust coreutils. The repo doubles as a teaching artifact: it makes concrete what's actually inside the Linux you're running, without the abstraction blanket of a distro's package manager. Useful for anyone who wants to understand the boundary between kernel and userland from first principles.",
      },
    },
    {
      title: "RaghavOS",
      description: "Bootloader written from scratch in C and x86 assembly. Boots from BIOS, transitions into a custom runtime, and serves as a forcing function for understanding what the OS layer actually does for you.",
      tech: ["C", "x86 Assembly", "BIOS", "QEMU"],
      link: "https://github.com/Raghav-45/scratch-bootloader",
      caseStudy: {
        metric: { value: "512 bytes", label: "MBR boot sector" },
        problem:
          "Modern engineers spend their careers above 5+ layers of abstraction (frameworks, runtimes, kernels, libc) and rarely see the moment where the BIOS hands the CPU to your code. That's the moment everything else is built on top of, and treating it as a black box leaves a gap in the mental model of what 'the computer is doing right now' actually means.",
        approach:
          "Hand-written x86 boot sector in assembly that BIOS loads at 0x7C00. Custom linker setup to compile and link C code in a no-libc, no-runtime environment — every malloc, every printf, every memcpy is something you provide or do without. Built and tested under QEMU first to keep the iteration loop tight, with the final image written to bootable media for hardware verification.",
        outcome:
          "A working boot path from BIOS to a usable environment. More importantly: a permanent shift in how I read application code. When I see a string concatenation or a syscall now, I'm aware of what it actually costs in a way that pure-application engineers usually aren't. That perspective shows up in how I think about latency, allocations, and the 'cost of an abstraction' debate.",
      },
    },
    {
      title: "Never Remember",
      description: "Personal password manager. NextAuth for OAuth, Upstash Redis for storage, search + copy-paste UX. 'You don't have to remember 235 passwords.'",
      tech: ["Next.js", "TypeScript", "NextAuth.js", "Upstash Redis", "Tailwind CSS"],
      link: "https://github.com/Raghav-45/never-remember",
      caseStudy: {
        metric: { value: "0", label: "passwords to remember" },
        problem:
          "The average person has dozens of accounts with weak or recycled passwords. Every commercial password manager wants a subscription. I wanted a self-hostable, free-tier-friendly password manager I'd actually use myself, where the architecture was simple enough to audit in an afternoon.",
        approach:
          "Next.js with NextAuth for OAuth-based identity (no password to manage about your password manager — the irony is intentional). Upstash Redis for storage because it's free-tier, fast, and the data shape (user → list of entries) maps cleanly to a key-value store without schema migrations. Dashboard is a searchable list with a NewEntryDialog for adds, copy-to-clipboard for fast paste, and a paginated table for power users with hundreds of entries.",
        outcome:
          "A working personal password manager running on free-tier Upstash + Vercel. The architectural call (Redis instead of Postgres) is one I'd defend even at scale: the access pattern is single-user-fetches-their-own-list, which is exactly what KV stores are good at. No N+1, no schema drift, no migrations.",
      },
    },
    {
      title: "SkyCast",
      description: "Full-stack weather + COVID dashboard. Next.js frontend consumes a Python backend on a DigitalOcean droplet. Location-aware via browser geolocation.",
      tech: ["Next.js", "TypeScript", "Python", "DigitalOcean", "REST"],
      link: "https://github.com/Raghav-45/skycast",
      caseStudy: {
        metric: { value: "Full-stack", label: "Next.js + Python backend" },
        problem:
          "Most weather dashboards call public APIs directly from the browser, which leaks API keys and ties the UX latency to the upstream provider's response time. I wanted a dashboard where the frontend never sees an upstream API key, and the backend can swap providers, batch requests, or cache responses without redeploying the frontend.",
        approach:
          "Next.js frontend with internal API routes (/api/weather, /api/covid) that proxy to a Python backend deployed on a DigitalOcean droplet. The backend owns the upstream API keys, the rate-limiting logic, and any caching. Frontend uses browser geolocation to grab lat/lon, then queries the right backend handler via a type discriminator. Clean architectural split: frontend stays React, backend stays Python, neither owns the other's concerns.",
        outcome:
          "A self-hosted full-stack data dashboard. The split paid off the first time the upstream weather provider rate-limited me — swapping the backend's source took 5 lines of Python, no frontend redeploy. The same architecture pattern (frontend proxies through your own backend, never directly to upstream) is the one I default to now for any data-fetching app.",
      },
    },
    {
      title: "Krishi Sahayak AI",
      description: "Multilingual AI assistant for Indian smallholder farmers. Hyperlocal weather, image-based pest/disease diagnosis (CNN), market price forecasting, alternative credit scoring, parametric crop insurance. Voice-first for low-literacy users.",
      tech: ["Next.js", "TypeScript", "Python", "Gemini 1.5 Pro", "Groq", "CNN", "PWA"],
      link: "https://github.com/Raghav-45/pragati",
      status: "Hackathon",
      caseStudy: {
        metric: { value: "Top 25", label: "Facebook Pragati AI for Impact" },
        problem:
          "Indian smallholder farmers face a stack of compounding problems: no timely hyperlocal weather forecasts, no quick pest/disease diagnosis, opaque mandi prices, financial exclusion from formal credit due to lack of land collateral, slow insurance payouts. Existing apps either solve one of these in isolation, or assume an English-literate user comfortable navigating a smartphone-first menu UI. Neither matches the actual user.",
        approach:
          "Built a unified platform organized around three pillars: Gyan Dhara (knowledge — AI weather + pest/disease doctor), Bazaar Bridge (market — price forecasting + verified input marketplace), Arthik Sahara (financial — alternative credit + parametric insurance). Hyperlocal weather advisories generated by tying ML forecasts to the farmer's specific crop and growth stage, delivered as multilingual voice + text. Pest/disease diagnosis via a CNN trained on Indian crop disease imagery with confidence scoring and IPM-prioritized treatment. Voice-first chatbot on top of Groq + Gemini 1.5 Pro so farmers can ask in Hindi (\"कल मौसम कैसा रहेगा?\") instead of typing English. Frontend Next.js PWA, backend Python serving ML models.",
        outcome:
          "Top 25 at Facebook's Pragati AI for Impact Hackathon. The platform shape — pillars over feature lists, voice over text, Hindi alongside English, parametric over traditional insurance — is the unlock. The lesson generalizes: when designing for users outside Silicon Valley defaults, the input modality is the product. A perfect app for an English-literate urban user is a useless app for a Hindi-speaking smallholder.",
      },
    },
    {
      title: "Encephalon Lab",
      description: "MCP-aware AI agent playground. Chat with Gemini-backed agents that have plug-and-play tool access — Alpaca for trading, GitHub for repos, Slack/Notion for work. SSE streaming, model picker, MCP server registry.",
      tech: ["Next.js", "TypeScript", "LangChain", "Gemini 2.5", "MCP", "Prisma"],
      link: "https://github.com/Raghav-45/encephalon-lab",
      caseStudy: {
        metric: { value: "MCP-native", label: "agent platform" },
        problem:
          "ChatGPT-style chat UIs don't naturally compose with the Model Context Protocol. You either hardcode tool integrations into the prompt scaffolding, or you spin up separate agents per tool. Neither matches how engineers actually want to use agents in practice: pick a model, pick which tools it has access to this session, then chat.",
        approach:
          "Built a chat platform where MCP servers (Alpaca trading, GitHub, Slack, Notion, others) are first-class registered entities. Frontend has an mcp-servers page that lets users browse and add servers. Chat backend uses LangChain over Gemini 2.5 Flash by default, with a model picker for switching. Two parallel chat endpoints — /api/chat (LangChain-orchestrated) and /api/chat/without-langchain (raw Gemini) — so the LangChain overhead can be measured directly. SSE streaming for character-by-character output. SIMULATE_RESPONSES env flag for offline iteration.",
        outcome:
          "An MCP-native agent playground where the tool selection is per-session, not per-deployment. The dual-pipeline pattern paid off in a non-obvious way: being able to A/B the same prompt against LangChain vs raw provider calls made the cost of every abstraction layer visible. Several latency assumptions I had about LangChain turned out to be wrong; some it added, some it didn't.",
      },
    },
    {
      title: "Lexa AI",
      description: "OpenAI variant of Encephalon Lab. Same MCP-aware agent shell, GPT-4-class models behind the chat. Built specifically to compare whether MCP agent UX feels different across model providers.",
      tech: ["Next.js", "TypeScript", "LangChain", "OpenAI", "MCP", "Prisma"],
      link: "https://github.com/Raghav-45/lexa-ai",
      caseStudy: {
        metric: { value: "Cross-provider", label: "agent A/B" },
        problem:
          "Two big questions when picking a model for an MCP agent platform: does the model's native tool-calling matter more than the surrounding orchestration, and does swapping providers break user behavior in subtle ways? You can't answer either by reading benchmarks — you have to run the same UX on both and compare.",
        approach:
          "Forked Encephalon Lab's codebase, swapped Gemini for OpenAI in the agent layer, kept everything else identical: same MCP registry, same chat surface, same Prisma schema, same SSE streaming pattern. The point of the fork is exactly this — change one variable, hold everything else constant. The same MCP servers (Alpaca, GitHub, Slack, Notion) work in both, which confirms MCP's promise of model-agnostic tooling holds in practice.",
        outcome:
          "A controlled cross-provider comparison rather than a separate product. The valuable bit isn't the second platform itself — it's having both running side-by-side, which let me see where each provider's tool-calling behavior diverges. The takeaway: differences are smaller than benchmark papers suggest, and orchestration choices matter more than provider choice for end-user UX.",
      },
    },
  ],

  client: [
    {
      title: "Human Archive Data Platform",
      description: "Built Human Archive's (YC W26) enterprise data platform — TB-scale robotics dataset delivery with Cognito multi-tenant auth, S3 signed URLs, and recursive folder resolution across AWS.",
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
    {
      title: "Bynd — AI News Intelligence",
      description: "News aggregator and summarization pipeline tracking the major AI labs (OpenAI, Anthropic, DeepMind, Microsoft, Meta). Six-step Python pipeline running fully on local LLMs.",
      tech: ["Python", "Ollama", "trafilatura", "SQLite", "RSS"],
      link: "https://github.com/Raghav-45/Bynd-Intelligence",
      caseStudy: {
        metric: { value: "6-step", label: "automated pipeline" },
        problem:
          "Bynd needed to track news coverage of the major AI labs (OpenAI, Anthropic, DeepMind, Microsoft, Meta) at scale. The off-the-shelf options were expensive per-seat news intelligence platforms or hand-rolled Google Alerts that produce noise, not signal. They wanted structured, summarized output they could feed into downstream analysis without paying per-article fees forever.",
        approach:
          "Built a 6-step Python pipeline. (1) Collect from Google News RSS, Yahoo Finance RSS, and optional NewsAPI. (2) First-pass classify by company keywords on titles to discard noise cheaply. (3) Resolve Google News redirect URLs and extract article body with trafilatura. (4) Re-classify on full text to catch articles that mention the company in the body but not the title. (5) Generate 30-40 word summaries via Ollama (llama3.2:3b) running locally — no per-token cost, no rate limits, no data leaving the machine. (6) Persist to SQLite plus a CSV export for downstream analysis.",
        outcome:
          "A standalone news intelligence pipeline that runs end-to-end on a single machine. Two-pass classification (title-first as a cheap filter, full-text as the recall pass) cut false positives meaningfully without doubling compute. The local-LLM choice traded a small accuracy hit for unlimited throughput at zero marginal cost — the right call for a pipeline that runs every news cycle, not just on-demand.",
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
