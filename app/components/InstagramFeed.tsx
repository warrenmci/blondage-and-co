import { getInstagramPosts, InstagramPost } from "@/lib/instagram";
import Image from "next/image";

function PostCard({ post }: { post: InstagramPost }) {
  const imageUrl =
    post.media_type === "VIDEO"
      ? (post.thumbnail_url ?? post.media_url)
      : post.media_url;

  return (
    <a
      href={post.permalink}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block aspect-square overflow-hidden rounded-lg border border-[#cab69c]/70 bg-white/60"
      aria-label={post.caption ? post.caption.slice(0, 80) : "Instagram post"}
    >
      <Image
        src={imageUrl}
        alt={post.caption ?? "Blondage & Co Instagram post"}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105"
      />

      {post.media_type === "VIDEO" && (
        <span className="absolute right-2 top-2 rounded bg-[#3c2617]/80 px-1.5 py-0.5 text-xs text-[#f7f1e9]">
          ▶
        </span>
      )}

      {post.media_type === "CAROUSEL_ALBUM" && (
        <span className="absolute right-2 top-2 rounded bg-[#3c2617]/80 px-1.5 py-0.5 text-xs text-[#f7f1e9]">
          ⧉
        </span>
      )}

      {/* Hover caption overlay */}
      {post.caption && (
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <p className="line-clamp-3 text-sm leading-snug text-white">
            {post.caption}
          </p>
        </div>
      )}
    </a>
  );
}

interface InstagramFeedProps {
  limit?: number;
  className?: string;
}

export default async function InstagramFeed({
  limit = 12,
  className = "",
}: InstagramFeedProps) {
  let posts: InstagramPost[];

  try {
    posts = await getInstagramPosts(limit);
  } catch (error) {
    console.error("[InstagramFeed]", error);
    // Fail silently in production — don't break the page
    return null;
  }

  if (!posts.length) return null;

  return (
    <section className={className}>
      <div className="mb-8">
        <h2 className="text-xs font-semibold uppercase tracking-[0.28em] text-[#a48663]">
          Recent Images | Gallery
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-6 lg:gap-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      <div className="mt-8 flex items-center justify-center gap-3 text-center">
        <a
          href="https://www.instagram.com/blondageandco"
          target="_blank"
          rel="noreferrer"
          className="text-[#5a4632] transition hover:text-[#3c2617] flex items-center"
          aria-label="Follow us on Instagram"
        >
          <p className="pr-2 text-sm sm:text-base text-[#6f5a45] max-w-xl">
            Explore more of our recent work on Instagram
          </p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
          </svg>
        </a>
      </div>
    </section>
  );
}
