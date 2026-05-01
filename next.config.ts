import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ── Compiler options ──────────────────────────────────────────────────────
  reactStrictMode: true,

  // ── Image optimization ────────────────────────────────────────────────────
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },

  // ── Security headers ──────────────────────────────────────────────────────
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      {
        // API routes: no caching
        source: "/api/(.*)",
        headers: [
          { key: "Cache-Control", value: "no-store, max-age=0" },
        ],
      },
    ];
  },

  // ── Experimental ──────────────────────────────────────────────────────────
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
