import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/_next/static/', '/api/cache-generation'],
        disallow: ['/api/', '/admin/', '/hx-ctrl-7k9/', '/hx-ctrl-partner/', '/location/'],
      }
    ],
    sitemap: [
      'https://www.hexescortsug.com/sitemap.xml',
    ],
    host: 'www.hexescortsug.com',
  }
}
