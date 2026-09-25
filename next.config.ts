import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['tldraw'],
  turbopack: {
    root: __dirname,
  },
  async headers() {
    return [{ source: '/(.*)', headers: [{ key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' }, { key: 'X-Content-Type-Options', value: 'nosniff' }] }]
  },
}

export default nextConfig
