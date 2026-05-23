import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path((?!api(?:/|$)).*)",
        has: [{ type: "host", value: "www.masterzabor.by" }],
        destination: "https://masterzabor.by/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
