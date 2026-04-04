import type { NextConfig } from "next";

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-bf202700e529451897e4e6f1fea9e3d6.r2.dev',
      },
    ],
  },
}

export default nextConfig
