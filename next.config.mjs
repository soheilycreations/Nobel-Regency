/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  experimental: {
    optimizePackageImports: ["framer-motion", "lucide-react"],
  },
  // These pages read live data from Supabase (rooms, tours, locations) and
  // MUST reflect admin panel changes on every visit. `export const dynamic
  // = "force-dynamic"` on the pages themselves should already guarantee
  // this, but that only controls Next.js's own rendering behavior — it
  // doesn't stop Vercel's CDN from caching the resulting HTTP response if
  // something else causes it to look cacheable. This makes it explicit and
  // unambiguous at the HTTP header level, closing that gap entirely.
  async headers() {
    const noStore = { key: "Cache-Control", value: "no-store, must-revalidate" };
    return [
      { source: "/", headers: [noStore] },
      { source: "/rooms/:path*", headers: [noStore] },
      { source: "/tours", headers: [noStore] },
      { source: "/tours/:path*", headers: [noStore] },
      { source: "/locations", headers: [noStore] },
      { source: "/locations/:path*", headers: [noStore] },
      { source: "/booking", headers: [noStore] },
    ];
  },
};

export default nextConfig;
