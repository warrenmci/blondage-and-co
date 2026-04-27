"use client";

import { useEffect, useState, useRef, useCallback } from "react";

interface Review {
  name: string;
  profileUrl: string;
  rating: number;
  text: string;
  timestamp: string;
}

interface ReviewsData {
  averageRating: number;
  totalReviews: number;
  reviews: Review[];
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className="h-4 w-4"
          fill={star <= rating ? "#fbbf24" : "none"}
          stroke="#fbbf24"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.53.044.739.676.354 1.014l-4.193 3.674a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.193-3.674a.562.562 0 01.354-1.014l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
          />
        </svg>
      ))}
    </div>
  );
}

function getTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 7) {
    const weeks = Math.max(1, Math.floor(diffDays / 7));
    return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} month${months > 1 ? "s" : ""} ago`;
  } else {
    const years = Math.floor(diffDays / 365);
    return `${years} year${years > 1 ? "s" : ""} ago`;
  }
}

export function GoogleReviews() {
  const [data, setData] = useState<ReviewsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    fetch("/api/reviews")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load reviews");
        return res.json();
      })
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch(() => {
        setError("Unable to load reviews");
        setLoading(false);
      });
  }, []);

  // Auto-scroll animation
  useEffect(() => {
    if (loading || error || !scrollContainerRef.current || isPaused) return;

    const container = scrollContainerRef.current;
    let animationFrameId: number;
    let lastTime = performance.now();
    const speed = 0.5; // pixels per millisecond

    const scroll = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      container.scrollLeft += speed * deltaTime;
      lastTime = currentTime;

      // Infinite scroll: when we've scrolled past the first set, reset
      const cardWidth = container.querySelector("article")?.offsetWidth || 0;
      const gap = 20; // gap-5 = 1.25rem = 20px
      const setWidth = (cardWidth + gap) * 3; // 3 cards visible at a time

      if (container.scrollLeft >= setWidth) {
        container.scrollLeft = 0;
      }

      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [loading, error, isPaused]);

  if (loading) {
    return (
      <section id="reviews" className="border-y border-black/5 bg-[#f2e7db]">
        <div className="mx-auto w-full max-w-5xl px-6 sm:px-8 lg:px-10 xl:max-w-6xl py-12 sm:py-14 lg:py-16">
          <div className="flex items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#cab69c] border-t-transparent" />
          </div>
        </div>
      </section>
    );
  }

  if (error || !data?.reviews?.length) {
    return null;
  }

  // Duplicate reviews for seamless infinite scroll (need 2 sets to fill the visible area)
  const displayReviews = [...data.reviews, ...data.reviews, ...data.reviews];

  return (
    <section id="reviews" className="border-y border-black/5 bg-[#f2e7db]">
      <div className="mx-auto w-full max-w-5xl px-6 sm:px-8 lg:px-10 xl:max-w-6xl py-12 sm:py-14 lg:py-16">
        {/* Section header */}
        <div className="mb-8 text-center">
          <h2 className="text-xs font-semibold uppercase tracking-[0.28em] text-[#a48663]">
            What Clients Say
          </h2>
          <div className="mt-4 flex items-center justify-center gap-4">
            <div className="text-center">
              <p className="text-4xl font-semibold text-[#241a11]">
                {data.averageRating.toFixed(1)}
              </p>
              <StarRating rating={Math.round(data.averageRating)} />
            </div>
            <div className="h-10 w-px bg-black/10" />
            <div className="text-left">
              <p className="text-sm font-medium text-[#5a4632]">
                Based on {data.totalReviews} Google reviews
              </p>
              <a
                href="https://www.google.com/search?q=blondage+and+co&rlz=1C1MMCH_enNZ1068NZ1068&oq=blondage+and+co&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIGCAEQRRg8MgYIAhBFGDwyBggDEEUYPNIBCDQ0MzVqMGo3qAIAsAIA"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-[#7c6750] underline-offset-2 transition hover:underline"
              >
                View all reviews on Google
              </a>
            </div>
          </div>
        </div>

        {/* Carousel container */}
        <div
          ref={scrollContainerRef}
          className="overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="flex gap-5" style={{ width: "max-content" }}>
            {displayReviews.map((review, index) => (
              <article
                key={`${index}-${review.name}`}
                className="w-[min(100%,350px)] rounded-2xl bg-white/90 p-5 shadow-sm ring-1 ring-black/5 flex-shrink-0"
              >
                <div className="flex items-start justify-between">
                  <a
                    href={review.profileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-semibold text-[#3c2617] underline-offset-2 transition hover:underline"
                  >
                    {review.name}
                  </a>
                  <StarRating rating={review.rating} />
                </div>
                <p className="mt-1 text-[0.65rem] uppercase tracking-[0.15em] text-[#b29578]">
                  {getTimeAgo(review.timestamp)}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-[#5a4632] line-clamp-4">
                  &ldquo;{review.text}&rdquo;
                </p>
              </article>
            ))}
          </div>
        </div>

        {/* Google attribution - required by Google */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[#8a7157]">
          <img
            src="https://www.gstatic.com/localredesign/images/static_map_lightblue.png"
            alt=""
            className="h-4 w-4 opacity-50"
          />
          <span>Powered by Google</span>
        </div>
      </div>
    </section>
  );
}
