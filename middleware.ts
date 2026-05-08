/**
 * Edge middleware — emit X-Robots-Tag: noindex on every non-production
 * Vercel deploy (preview, dev). Without this, every preview branch
 * URL leaks into Google as a duplicate of the production site.
 */
import { NextResponse, type NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  const res = NextResponse.next()
  if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production") {
    res.headers.set("X-Robots-Tag", "noindex, nofollow")
  }
  return res
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
