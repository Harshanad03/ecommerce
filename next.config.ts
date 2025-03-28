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
  webpack: (config, { isServer }) => {
    // Resolve punycode deprecation warning
    config.resolve.fallback = {
      ...config.resolve.fallback,
      punycode: false,
    };
    
    return config;
  },
};

export default nextConfig;
