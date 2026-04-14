import Desktop from './components/Desktop'
import { getAllPosts } from '@/lib/posts'

// Server component — reads MDX metadata from /content/blog and hands
// it down. Desktop (client) and everything beneath it gets plain data.
export default function Home() {
  const posts = getAllPosts()
  return <Desktop posts={posts} />
}
