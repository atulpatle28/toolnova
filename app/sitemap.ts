import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://mytoolkraft.in";
  const currentDate = new Date();

  // Primary platform and directory routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/tools`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  // All active production tool endpoints
  const toolSlugs: { slug: string; priority: number; changeFrequency: "daily" | "weekly" }[] = [
    // Featured & High-Traffic Tools
    { slug: "heic-to-jpg", priority: 0.9, changeFrequency: "weekly" },
    { slug: "govt-job-photo-resizer", priority: 0.9, changeFrequency: "weekly" },
    { slug: "pdf-compressor", priority: 0.9, changeFrequency: "weekly" },
    { slug: "pdf-merge", priority: 0.9, changeFrequency: "weekly" },

    // Core PDF Suite
    { slug: "pdf-split", priority: 0.8, changeFrequency: "weekly" },
    { slug: "pdf-organize", priority: 0.8, changeFrequency: "weekly" },
    { slug: "pdf-protect", priority: 0.8, changeFrequency: "weekly" },

    // Document & Presentation Converters (To PDF)
    { slug: "word-to-pdf", priority: 0.85, changeFrequency: "weekly" },
    { slug: "jpg-to-pdf", priority: 0.85, changeFrequency: "weekly" },
    { slug: "powerpoint-to-pdf", priority: 0.8, changeFrequency: "weekly" },
    { slug: "excel-to-pdf", priority: 0.8, changeFrequency: "weekly" },
    { slug: "html-to-pdf", priority: 0.8, changeFrequency: "weekly" },

    // Document Converters (From PDF)
    { slug: "pdf-to-word", priority: 0.85, changeFrequency: "weekly" },
    { slug: "pdf-to-image", priority: 0.85, changeFrequency: "weekly" },
    { slug: "pdf-to-powerpoint", priority: 0.8, changeFrequency: "weekly" },
    { slug: "pdf-to-excel", priority: 0.8, changeFrequency: "weekly" },
    { slug: "pdf-to-pdfa", priority: 0.8, changeFrequency: "weekly" },

    // Image Studio Utilities
    { slug: "image-crop", priority: 0.8, changeFrequency: "weekly" },
    { slug: "image-compressor", priority: 0.85, changeFrequency: "weekly" },
    { slug: "png-to-jpg", priority: 0.8, changeFrequency: "weekly" },

    // Calculators & Text Utilities
    { slug: "qr-code-generator", priority: 0.85, changeFrequency: "weekly" },
    { slug: "sip-calculator", priority: 0.8, changeFrequency: "weekly" },
    { slug: "percentage-calculator", priority: 0.8, changeFrequency: "weekly" },
    { slug: "text-case-converter", priority: 0.8, changeFrequency: "weekly" },
  ];

  const toolRoutes: MetadataRoute.Sitemap = toolSlugs.map((tool) => ({
    url: `${baseUrl}/tools/${tool.slug}`,
    lastModified: currentDate,
    changeFrequency: tool.changeFrequency,
    priority: tool.priority,
  }));

  return [...staticRoutes, ...toolRoutes];
}