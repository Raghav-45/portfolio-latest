import { NextResponse } from "next/server"

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN

const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token"
const NOW_PLAYING_ENDPOINT = "https://api.spotify.com/v1/me/player/currently-playing"

async function getAccessToken(): Promise<string | null> {
  if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) return null

  const res = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: REFRESH_TOKEN,
    }),
  })

  if (!res.ok) return null
  const data = await res.json()
  return data.access_token ?? null
}

export async function GET() {
  try {
    const accessToken = await getAccessToken()

    if (!accessToken) {
      return NextResponse.json({ isPlaying: false, configured: false })
    }

    const res = await fetch(NOW_PLAYING_ENDPOINT, {
      headers: { Authorization: `Bearer ${accessToken}` },
      next: { revalidate: 0 },
    })

    if (res.status === 204 || res.status >= 400) {
      return NextResponse.json({ isPlaying: false, configured: true })
    }

    const song = await res.json()

    // Handle podcasts / episodes
    if (song.currently_playing_type === "episode") {
      return NextResponse.json({
        isPlaying: song.is_playing,
        configured: true,
        type: "episode",
        title: song.item?.name ?? "Unknown episode",
        artist: song.item?.show?.name ?? "Podcast",
        albumImageUrl: song.item?.images?.[0]?.url ?? null,
        songUrl: song.item?.external_urls?.spotify ?? null,
      })
    }

    return NextResponse.json({
      isPlaying: song.is_playing,
      configured: true,
      type: "track",
      title: song.item.name,
      artist: song.item.artists.map((a: { name: string }) => a.name).join(", "),
      album: song.item.album.name,
      albumImageUrl: song.item.album.images[0]?.url ?? null,
      songUrl: song.item.external_urls.spotify,
    })
  } catch {
    return NextResponse.json({ isPlaying: false, configured: false })
  }
}
