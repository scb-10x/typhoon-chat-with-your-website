import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['favicon.ico'],
  },
  // Enable experimental features if needed
  experimental: {
    // serverActions: true,
  },
};

export default nextConfig;
