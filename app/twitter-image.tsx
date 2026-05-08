/**
 * Twitter card image — rendered at build time via Next's ImageResponse.
 * Mirrors the OG image but at Twitter's preferred 1200x628 ratio.
 *
 * IMPORTANT: do NOT add next/font or fetch'd font imports here. The edge
 * runtime bundle for next/og + satori is already ~700KB; embedded fonts
 * push it past the 1MB Vercel edge function limit.
 */
import { ImageResponse } from "next/og"
import { siteConfig } from "@/config/siteConfig"

export const size = { width: 1200, height: 628 }
export const contentType = "image/png"
export const alt = siteConfig.seo.title

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "linear-gradient(135deg, #0a0a0a 0%, #151515 60%, #1f1f1f 100%)",
          color: "white",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 16,
            fontFamily: "monospace",
            letterSpacing: 2,
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.45)",
          }}
        >
          {siteConfig.personal.role}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 88, fontWeight: 600, lineHeight: 0.95 }}>
            {siteConfig.personal.fullName}
          </div>
          <div
            style={{
              fontSize: 26,
              lineHeight: 1.4,
              color: "rgba(255,255,255,0.62)",
              maxWidth: 960,
            }}
          >
            {siteConfig.seo.description}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 18,
            fontFamily: "monospace",
            color: "rgba(255,255,255,0.4)",
          }}
        >
          <span>@{siteConfig.social.twitterHandle}</span>
          <span>{siteConfig.personal.location}</span>
        </div>
      </div>
    ),
    size,
  )
}
