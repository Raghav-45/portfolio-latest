#!/usr/bin/env node
/**
 * setup-spotify.mjs
 * ─────────────────────────────────────────────────────────────
 * One-shot helper that exchanges a Spotify authorisation code for
 * a refresh token so the NowPlaying widget can work in production.
 *
 * Usage (two steps):
 *
 *   1. Create an app at https://developer.spotify.com/dashboard
 *      and note the Client ID + Client Secret. Add a Redirect URI
 *      (e.g. http://localhost:3000/). Then export:
 *
 *        export SPOTIFY_CLIENT_ID=your_client_id
 *        export SPOTIFY_CLIENT_SECRET=your_client_secret
 *        export SPOTIFY_REDIRECT_URI=http://localhost:3000/
 *
 *   2. Run this script once without arguments — it prints the
 *      authorisation URL. Visit it, approve, and copy the `code`
 *      from the redirect URL. Then run:
 *
 *        node setup-spotify.mjs THE_CODE
 *
 *      It prints a SPOTIFY_REFRESH_TOKEN to add to your .env.local.
 *
 * NOTHING IS HARDCODED. Never commit secrets to this file.
 * ─────────────────────────────────────────────────────────────
 */

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI

if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI) {
  console.error("\nMissing env vars. Export all three first:\n")
  console.error("  export SPOTIFY_CLIENT_ID=...")
  console.error("  export SPOTIFY_CLIENT_SECRET=...")
  console.error("  export SPOTIFY_REDIRECT_URI=...\n")
  process.exit(1)
}

const code = process.argv[2]

if (!code) {
  const scope = encodeURIComponent("user-read-currently-playing user-read-playback-state")
  const redirect = encodeURIComponent(REDIRECT_URI)
  console.log("\n1. Visit this URL, approve, and copy the `code` query param from the redirect:\n")
  console.log(`https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${redirect}&scope=${scope}\n`)
  console.log("2. Then run: node setup-spotify.mjs THE_CODE\n")
  process.exit(0)
}

const res = await fetch("https://accounts.spotify.com/api/token", {
  method: "POST",
  headers: {
    Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64")}`,
    "Content-Type": "application/x-www-form-urlencoded",
  },
  body: new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: REDIRECT_URI,
  }),
})

const data = await res.json()

if (data.error) {
  console.error(`\nError: ${data.error} — ${data.error_description}`)
  console.error("The code may have expired. Get a new one and run again immediately.\n")
  process.exit(1)
}

console.log("\n✅ Success. Add this to .env.local (alongside CLIENT_ID / CLIENT_SECRET):\n")
console.log(`SPOTIFY_REFRESH_TOKEN=${data.refresh_token}\n`)
