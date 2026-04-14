/**
 * config/index.ts
 * ─────────────────────────────────────────────────────────────
 * Barrel file — re-exports every config module so components can
 * import from a single path:
 *
 *     import { siteConfig, projects, experience } from "@/config"
 *
 * If you'd rather import each module directly (e.g. for tree-
 * shaking), use:
 *
 *     import { siteConfig } from "@/config/siteConfig"
 *     import { projects }   from "@/config/projects"
 * ─────────────────────────────────────────────────────────────
 */

export * from "./siteConfig"
export * from "./projects"
export * from "./experience"
export * from "./skills"
export * from "./terminal"
export * from "./quotes"
export * from "./links"
export * from "./notes"
export * from "./uses"
export * from "./themes"
export * from "./status"
// Blog content has moved to /content/blog (MDX). Read via lib/posts.ts.
