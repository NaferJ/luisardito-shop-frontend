import type { NextConfig } from 'next'
const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: '*.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'kick.com',
      },
      {
        protocol: 'https',
        hostname: '*.kick.com',
      },
    ],
  },
  async rewrites() {
    console.log('🔧 NEXT_PUBLIC_API_URL env var:', process.env.NEXT_PUBLIC_API_URL)
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
      ? `${process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, '')}/api/:path*`
      : 'http://localhost:3001/api/:path*'
    console.log('🔧 Rewrite destination:', apiUrl)
    return [
      {
        source: '/api/:path*',
        destination: apiUrl
      }
    ]
  }
}
export default nextConfig
