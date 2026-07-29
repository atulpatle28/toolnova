import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://toolkraft.vercel.app'

  // Aapke saare tools ki list
  const tools = [
    'pdf-compressor',
    'pdf-merge',
    'pdf-split',
    'jpg-to-pdf',
    'image-compressor',
    'image-resizer',
    'png-to-jpg',
    'pdf-to-image',
    'image-crop'
  ]

  // Tools ke URL generate karna
  const toolUrls = tools.map((tool) => ({
    url: `${baseUrl}/tools/${tool}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    ...toolUrls,
  ]
}