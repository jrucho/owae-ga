import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [{
      source: "/DecayEngine-v1.0-macOS.zip",
      destination: "https://drive.google.com/uc?export=download&id=1Gkpihp_Ts-OL8Fplzio_opn5_t0zv803",
      permanent: false,
    }];
  },
  async headers() {
    const safeHeaders = [
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-Content-Type-Options", value: "nosniff" },
    ];

    return [
      {
        source: "/",
        headers: [
          ...safeHeaders,
          { key: "Permissions-Policy", value: "camera=(), geolocation=(), microphone=()" },
        ],
      },
      {
        source: "/service-worker.js",
        headers: [
          ...safeHeaders,
          { key: "Cache-Control", value: "no-store, max-age=0" },
          { key: "Service-Worker-Allowed", value: "/" },
        ],
      },
      ...[
        "/owae-ga-social.jpg",
        "/owae-ga-hero.webp",
        "/owae-ga-hero.avif",
        "/sofianima-cover.webp",
        "/sofianima-cover.avif",
      ].map((source) => ({
        source,
        headers: [
          ...safeHeaders,
          { key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" },
        ],
      })),
    ];
  },
};

export default nextConfig;
