import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
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
