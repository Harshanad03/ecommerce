import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async redirects() {
    return [
      {
        source: '/category/:path*',
        destination: '/categories/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
