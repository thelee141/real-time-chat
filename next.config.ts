// next.config.js
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  typedRoutes: true,
  // In dev the app may be reached through a proxy whose forwarded host does
  // not match the browsing origin (e.g. a Codespace port forward: origin
  // localhost:3000 vs x-forwarded-host <codespace>-3000.app.github.dev),
  // which makes Next 16 abort Server Actions requests with "Invalid Server
  // Actions request". Allowlist those origins in development only;
  // production keeps the strict CSRF check.
  ...(process.env.NODE_ENV === 'development' && {
    experimental: {
      serverActions: {
        allowedOrigins: [
          'localhost:3000',
          '127.0.0.1:3000',
          '*.app.github.dev',
        ],
      },
    },
  }),
  images: {
    dangerouslyAllowSVG: true,
    // contentDispositionType: 'attachment',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig
