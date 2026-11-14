import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Instagram images are rendered `unoptimized` (served straight from
    // Instagram's CDN), so no remote hosts are allowlisted for optimization.
    remotePatterns: [],
    // Guardrails for any local images added later: cache transformed copies
    // for 31 days and limit the width/quality/format variants Next.js can
    // request, so each image costs only a handful of transformations.
    minimumCacheTTL: 2678400,
    deviceSizes: [640, 828, 1080, 1440, 1920],
    imageSizes: [64, 128, 256, 384],
    qualities: [75],
    formats: ["image/webp"],
  },
};

export default nextConfig;
