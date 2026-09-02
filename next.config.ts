import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "si.geilicdn.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.oopbuyanswers.com" }],
        destination: "https://oopbuyanswers.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
