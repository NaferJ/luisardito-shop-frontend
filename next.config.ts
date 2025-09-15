import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  eslint: {
    // Do not fail production builds due to ESLint errors
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Do not fail production builds due to type errors
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: process.env.NEXT_PUBLIC_API_URL
          ? `${process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")}/api/:path*`
          : "http://localhost:3001/api/:path*",
      },
    ];
  },
};

export default nextConfig;
