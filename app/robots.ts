import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/api/', // API routes ko google se hide rakhte hain security ke liye
    },
    sitemap: 'https://mytoolkraft.in/sitemap.xml',
  }
}