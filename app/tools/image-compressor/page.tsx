import { ImageCompressorTool } from "@/app/components/ToolComponents";

export const metadata = {
  title: "Image Compressor | ToolNova",
  description: "Compress JPG, PNG and WEBP images instantly in your browser with smart quality presets and batch processing.",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How does ToolNova compress images?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "ToolNova processes images directly in your browser using the canvas API, so your files stay private and are never uploaded to a server.",
      },
    },
    {
      "@type": "Question",
      name: "What file types are supported?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can upload JPG, PNG and WEBP images and compress them with presets or a custom quality slider.",
      },
    },
    {
      "@type": "Question",
      name: "Can I compress multiple images at once?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. The batch mode lets you upload several images and download each compressed result individually.",
      },
    },
  ],
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <ImageCompressorTool />
    </>
  );
}
