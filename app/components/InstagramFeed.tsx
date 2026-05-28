import { getInstagramPosts, InstagramPost } from '@/lib/instagram'
import Image from 'next/image'

function PostCard({ post }: { post: InstagramPost }) {
  const imageUrl =
    post.media_type === 'VIDEO' ? post.thumbnail_url ?? post.media_url : post.media_url

  return (
    <a
      href={post.permalink}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block aspect-square overflow-hidden rounded-lg bg-neutral-100"
      aria-label={post.caption ? post.caption.slice(0, 80) : 'Instagram post'}
    >
      <Image
        src={imageUrl}
        alt={post.caption ?? 'Blondage & Co Instagram post'}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        className="object-cover transition-transform duration-300 group-hover:scale-105"
      />

      {post.media_type === 'VIDEO' && (
        <span className="absolute right-2 top-2 rounded bg-black/50 px-1.5 py-0.5 text-xs text-white">
          ▶
        </span>
      )}

      {post.media_type === 'CAROUSEL_ALBUM' && (
        <span className="absolute right-2 top-2 rounded bg-black/50 px-1.5 py-0.5 text-xs text-white">
          ⧉
        </span>
      )}

      {/* Hover caption overlay */}
      {post.caption && (
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <p className="line-clamp-3 text-sm leading-snug text-white">{post.caption}</p>
        </div>
      )}
    </a>
  )
}

interface InstagramFeedProps {
  limit?: number
  className?: string
}

export default async function InstagramFeed({ limit = 12, className = '' }: InstagramFeedProps) {
  let posts: InstagramPost[]

  try {
    posts = await getInstagramPosts(limit)
  } catch (error) {
    console.error('[InstagramFeed]', error)
    // Fail silently in production — don't break the page
    return null
  }

  if (!posts.length) return null

  return (
    <section className={className}>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-medium">@blondageandco</h2>
        <a
          href="https://instagram.com/blondageandco"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-neutral-500 hover:text-neutral-800 transition-colors"
        >
          Follow on Instagram →
        </a>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  )
}
