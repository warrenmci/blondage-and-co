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

  if (diffDays < 7)
    return `${Math.max(1, Math.floor(diffDays / 7))} week${Math.floor(diffDays / 7) > 1 ? "s" : ""} ago`;
  if (diffDays < 30)
    return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? "s" : ""} ago`;
  if (diffDays < 365)
    return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? "s" : ""} ago`;
  return `${Math.floor(diffDays / 365)} year${Math.floor(diffDays / 365) > 1 ? "s" : ""} ago`;
}

export function GoogleReviews() {
  const [data, setData] = useState<ReviewsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const reviews = data?.reviews || [];
  const infiniteReviews = [...reviews, ...reviews]; // duplicate once for seamless loop

  const scroll = (direction: "left" | "right") => {
    if (isScrolling || reviews.length === 0) return;

    const container = scrollContainerRef.current;
    if (!container) return;

    setIsScrolling(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    const halfWidth = container.scrollWidth / 2;
    const cardPlusGap = halfWidth / reviews.length;

    // Round current position to nearest card slot to prevent drift
    const currentSlot = Math.round(container.scrollLeft / cardPlusGap);
    const baseScroll = currentSlot * cardPlusGap;

    if (direction === "right") {
      const targetSlot = currentSlot + 1;

      // If crossing into second copy, wrap to first copy
      if (targetSlot >= reviews.length) {
        container.scrollTo({ left: 0, behavior: "instant" as ScrollBehavior });
        setTimeout(() => {
          container.scrollTo({ left: cardPlusGap, behavior: "smooth" });
          setCurrentIndex((prev) => (prev + 1) % reviews.length);
          timeoutRef.current = setTimeout(() => setIsScrolling(false), 550);
        }, 50);
        return;
      }

      container.scrollTo({
        left: targetSlot * cardPlusGap,
        behavior: "smooth",
      });
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    } else {
      const targetSlot = currentSlot - 1;

      // If going before first slot, wrap to end of first copy
      if (targetSlot < 0) {
        container.scrollTo({
          left: halfWidth,
          behavior: "instant" as ScrollBehavior,
        });
        setTimeout(() => {
          container.scrollTo({
            left: halfWidth - cardPlusGap,
            behavior: "smooth",
          });
          setCurrentIndex(
            (prev) => (prev - 1 + reviews.length) % reviews.length,
          );
          timeoutRef.current = setTimeout(() => setIsScrolling(false), 550);
        }, 50);
        return;
      }

      container.scrollTo({
        left: targetSlot * cardPlusGap,
        behavior: "smooth",
      });
      setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
    }

    timeoutRef.current = setTimeout(() => setIsScrolling(false), 550);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    fetch("/api/reviews")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load reviews");
        return res.json();
      })
      .then((result: ReviewsData) => {
        setData(result);
        setLoading(false);
      })
      .catch(() => {
        setError("Unable to load reviews");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!data?.reviews.length) return;

    const interval = setInterval(() => {
      scroll("right");
    }, 10000);

    return () => clearInterval(interval);
  }, [data]);

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

  if (error || reviews.length === 0) return null;

  return (
    <section id="reviews" className="border-y border-black/5 bg-[#f2e7db]">
      <div className="mx-auto w-full max-w-5xl px-6 sm:px-8 lg:px-10 xl:max-w-6xl py-12 sm:py-14 lg:py-16">
        {/* Header - unchanged */}
        <div className="mb-8 text-center">
          <h2 className="text-xs font-semibold uppercase tracking-[0.28em] text-[#a48663]">
            What Clients Say
          </h2>
          <div className="mt-4 flex items-center justify-center gap-4">
            <div className="text-center">
              <p className="text-4xl font-semibold text-[#241a11]">
                {data!.averageRating.toFixed(1)}
              </p>
              <StarRating rating={Math.round(data!.averageRating)} />
            </div>
            <div className="h-10 w-px bg-black/10" />
            <div className="text-left">
              <p className="text-sm font-medium text-[#5a4632]">
                Based on {data!.totalReviews} Google reviews
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

        {/* Carousel */}
        <div className="relative">
          <button
            onClick={() => scroll("left")}
            className="absolute -left-12 sm:-left-14 top-1/2 -translate-y-1/2 z-10 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-black/10 transition hover:bg-[#f2e7db]"
            aria-label="Scroll left"
          >
            <svg
              className="h-4 w-4 sm:h-5 sm:w-5 text-[#5a4632]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <div
            ref={scrollContainerRef}
            className="overflow-x-auto scrollbar-hide scroll-smooth py-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <div className="flex gap-4 sm:gap-5">
              {infiniteReviews.map((review, index) => (
                <article
                  key={`review-${index}`}
                  className="w-[85vw] sm:w-[342px] rounded-2xl bg-white/90 p-4 sm:p-5 shadow-sm ring-1 ring-black/5 flex-shrink-0"
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
                    “{review.text}”
                  </p>
                </article>
              ))}
            </div>
          </div>

          <button
            onClick={() => scroll("right")}
            className="absolute -right-12 sm:-right-14 top-1/2 -translate-y-1/2 z-10 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-black/10 transition hover:bg-[#f2e7db]"
            aria-label="Scroll right"
          >
            <svg
              className="h-4 w-4 sm:h-5 sm:w-5 text-[#5a4632]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

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
