// @file next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: { ignoreBuildErrors: true },
  images: {
    remotePatterns: [{ hostname: 'avatars.githubusercontent.com' }],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=()',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/github',
        destination: process.env.NEXT_PUBLIC_GITHUB_URL ?? 'https://github.com/oathmesh/oathmesh',
        permanent: false,
      },
      {
        source: '/npm',
        destination: 'https://www.npmjs.com/package/oathmesh',
        permanent: false,
      },
      {
        source: '/pypi',
        destination: 'https://pypi.org/project/oathmesh/',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
