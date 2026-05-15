import type { NextConfig } from "next";
import { siteConfig } from "@/config/siteConfig";
import { SITE_URL } from "@/lib/site-url";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), interest-cohort=(), browsing-topics=()",
  },
];

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  // Explicit — prevents 308 redirects for trailing-slash URLs that
  // Google Search Console flags as "Page with redirect".
  trailingSlash: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "i.scdn.co" },
      { protocol: "https", hostname: "github.com" },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  output: "standalone",
};

export default nextConfig;
