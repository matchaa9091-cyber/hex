/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    domains: [
      'dkyikirsvpauhbexbhvu.supabase.co',
      'zdiosdkoxcimlovewroz.supabase.co',
      'wsrv.nl',
      'images.unsplash.com',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'wsrv.nl',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/location/:path*',
        destination: '/escorts-in/:path*',
        permanent: true,
      },
      {
        source: '/sitemap.txt',
        destination: '/sitemap.xml',
        permanent: true,
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/:category(thick|slim|curvy|vip|massage)-escorts-in/:location*',
        destination: '/category/:category/:location*',
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/((?!api/|hx-ctrl|admin).*)',
        headers: [
          {
            key: 'CDN-Cache-Control',
            value: 'public, max-age=300, stale-while-revalidate=86400',
          },
          {
            key: 'Cloudflare-CDN-Cache-Control',
            value: 'public, max-age=300, stale-while-revalidate=86400',
          },
        ],
      },
    ];
  },
  // Force trailing slash for consistency (better for SEO consolidation)
  trailingSlash: false,
}

export default nextConfig;