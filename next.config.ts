import type { NextConfig } from "next";

const CANONICAL_ORIGIN = "https://www.masterzabor.by";
const DUPLICATE_VERCEL_HOST = "masterzabor-site.vercel.app";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path((?!api(?:/|$)).*)",
        has: [
          {
            type: "host",
            value: DUPLICATE_VERCEL_HOST,
          },
        ],
        destination: `${CANONICAL_ORIGIN}/:path`,
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
