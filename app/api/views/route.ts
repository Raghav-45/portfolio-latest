import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

// Uses Upstash REST API — set UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN in Vercel env vars.
// GET = read-only (any number of widgets can call this safely).
// POST = increment + return new count (called exactly once per page visit).
function getIsoWeekId(date: Date) {
  const utcDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
  const day = utcDate.getUTCDay() || 7
  utcDate.setUTCDate(utcDate.getUTCDate() + 4 - day)
  const yearStart = new Date(Date.UTC(utcDate.getUTCFullYear(), 0, 1))
  const week = Math.ceil(((utcDate.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
  return `${utcDate.getUTCFullYear()}-W${String(week).padStart(2, "0")}`
}

function getBucketKeys(date = new Date()) {
  const year = String(date.getUTCFullYear())
  const month = `${year}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`
  const day = `${month}-${String(date.getUTCDate()).padStart(2, "0")}`
  const week = getIsoWeekId(date)

  return {
    total: "portfolio:views",
    month: `portfolio:views:monthly:${month}`,
    week: `portfolio:views:weekly:${week}`,
    day: `portfolio:views:daily:${day}`,
  }
}

async function callRedis(op: "get" | "incr", key: string) {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null

  try {
    const res = await fetch(`${url}/${op}/${key}`, {
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
  const keys = getBucketKeys()
  return NextResponse.json({ count: await callRedis("get", keys.total) })
}

export async function POST() {
  const keys = getBucketKeys()

  // In local dev, React StrictMode + HMR fire effects multiple times per visit.
  // Read the current value instead of incrementing so we don't pollute prod.
  if (process.env.NODE_ENV === "development") {
    return NextResponse.json({ count: await callRedis("get", keys.total) })
  }

  const [total] = await Promise.all([
    callRedis("incr", keys.total),
    callRedis("incr", keys.month),
    callRedis("incr", keys.week),
    callRedis("incr", keys.day),
  ])

  return NextResponse.json({ count: total })
}
