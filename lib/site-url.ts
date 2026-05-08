/**
 * Single source of truth for the site's public URL.
 * Used by metadata, sitemap, robots, JSON-LD, and OG images so canonical
 * links never diverge between the three surfaces.
 *
 * In production builds the env var is required — the build fails loudly
 * if it's missing instead of silently shipping localhost URLs to crawlers.
 */

const FALLBACK = "https://aditya.is-a.dev"

function resolveSiteUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL
  if (envUrl) return envUrl.replace(/\/$/, "")

  if (process.env.NODE_ENV === "production" && !process.env.VERCEL_ENV) {
    throw new Error(
      "NEXT_PUBLIC_SITE_URL must be set in production. " +
      "Set it in your Vercel project env (e.g. https://aditya.is-a.dev).",
    )
  }
  return FALLBACK
}

export const SITE_URL = resolveSiteUrl()
