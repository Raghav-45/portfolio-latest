import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

// Uses Upstash REST API — set UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN in Vercel env vars.
// GET = read-only (any number of widgets can call this safely).
// POST = increment + return new count (called exactly once per page visit).
async function callRedis(op: "get/portfolio:views" | "incr/portfolio:views") {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null

  try {
    const res = await fetch(`${url}/${op}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    })
    const data = await res.json()
    return data.result === null ? 0 : Number(data.result)
  } catch {
    return null
  }
}

export async function GET() {
  return NextResponse.json({ count: await callRedis("get/portfolio:views") })
}

export async function POST() {
  // In local dev, React StrictMode + HMR fire effects multiple times per visit.
  // Read the current value instead of incrementing so we don't pollute prod.
  const op = process.env.NODE_ENV === "development"
    ? "get/portfolio:views"
    : "incr/portfolio:views"
  return NextResponse.json({ count: await callRedis(op) })
}
