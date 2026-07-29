"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Image as ImageIcon,
  Minimize2,
  Maximize2,
  Combine,
  Scissors,
  FileType,
  Crop,
  ArrowRight,
  ShieldCheck,
  Wrench,
  ChevronDown,
  Lock,
  Zap,
  Globe,
  Sparkles,
} from "lucide-react";

type Category = "All" | "Organize" | "Optimize" | "Convert" | "Image Studio" | "AI & OCR";

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: any;
  href: string;
  category: Category[];
  badge?: string;
  featured?: boolean;
}

const tools: Tool[] = [
  {
    id: "editor-studio",
    name: "Smart Image & Text Editor",
    description: "Detect and edit English & Marathi text inside images and documents using matching fonts.",
    icon: Sparkles,
    href: "/tools/editor-studio",
    category: ["All", "Image Studio", "AI & OCR"],
    badge: "🔥 New Feature",
    featured: true,
  },
  {
    id: "pdf-compressor",
    name: "PDF Compressor",
    description: "Reduce PDF file size without losing quality locally in your browser.",
    icon: Minimize2,
    href: "/tools/pdf-compressor",
    category: ["All", "Optimize"],
    badge: "Popular",
  },
  {
    id: "pdf-merge",
    name: "PDF Merger",
    description: "Combine multiple PDF documents into a single organized file.",
    icon: Combine,
    href: "/tools/pdf-merge",
    category: ["All", "Organize"],
  },
  {
    id: "pdf-split",
    name: "PDF Splitter",
    description: "Extract specific pages or split large PDFs into individual files.",
    icon: Scissors,
    href: "/tools/pdf-split",
    category: ["All", "Organize"],
  },
  {
    id: "jpg-to-pdf",
    name: "JPG to PDF",
    description: "Convert images and photos into high-quality PDF documents.",
    icon: FileType,
    href: "/tools/jpg-to-pdf",
    category: ["All", "Convert"],
  },
  {
    id: "image-compressor",
    name: "Image Compressor",
    description: "Optimize and reduce image size while maintaining clear quality.",
    icon: Minimize2,
    href: "/tools/image-compressor",
    category: ["All", "Optimize", "Image Studio"],
  },
  {
    id: "image-resizer",
    name: "Image Resizer",
    description: "Resize dimensions of PNG or JPG images by exact pixels or percent.",
    icon: Maximize2,
    href: "/tools/image-resizer",
    category: ["All", "Optimize", "Image Studio"],
  },
  {
    id: "png-to-jpg",
    name: "PNG to JPG Converter",
    description: "Quickly convert transparent PNG images to standard JPG format.",
    icon: ImageIcon,
    href: "/tools/png-to-jpg",
    category: ["All", "Convert", "Image Studio"],
  },
  {
    id: "pdf-to-image",
    name: "PDF to Image",
    description: "Render PDF pages into clear, standalone PNG or JPG images.",
    icon: FileText,
    href: "/tools/pdf-to-image",
    category: ["All", "Convert"],
  },
  {
    id: "image-crop",
    name: "Image & Passport Cropper",
    description: "Crop photos to exact ratios or standard passport dimensions.",
    icon: Crop,
    href: "/tools/image-crop",
    category: ["All", "Image Studio"],
  },
];

const categories: Category[] = [
  "All",
  "AI & OCR",
  "Organize",
  "Optimize",
  "Convert",
  "Image Studio",
];

const faqs = [
  {
    question: "Is ToolKraft completely free to use?",
    answer:
      "Yes, ToolKraft is 100% free with no hidden fees, subscriptions, or file processing limits.",
  },
  {
    question: "Can I edit Marathi and English text in images?",
    answer:
      "Yes! Our Smart Image & Text Editor supports OCR recognition for both English and Marathi (Devanagari) fonts like Mukta and Baloo 2 directly in your browser.",
  },
  {
    question: "Are my files uploaded to any server?",
    answer:
      "No. ToolKraft operates entirely on client-side Web APIs and JavaScript in your browser. Your files never leave your computer or phone.",
  },
  {
    question: "Do I need to create an account to process PDFs or images?",
    answer:
      "No sign-up or registration is required. You can instantly access and use all PDF and image utilities.",
  },
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const filteredTools = tools.filter((tool) =>
    tool.category.includes(activeCategory)
  );

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-black text-xl tracking-tight">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm shadow-md shadow-blue-500/20">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              ToolKraft
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
            <Link href="/" className="hover:text-white transition-colors">
              All Tools
            </Link>
            <Link href="#faqs" className="hover:text-white transition-colors">
              FAQ
            </Link>
            <Link href="#about-seo" className="hover:text-white transition-colors">
              About
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-4">
            <ShieldCheck className="w-4 h-4" /> 100% Client-Side & Private
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4 bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Power Up Your Files with <span className="text-blue-500">ToolKraft</span>
          </h1>
          <p className="text-slate-400 text-base sm:text-lg">
            High-performance browser tools for PDFs, Images & OCR Text Editing (English + Marathi). Process your files instantly with complete privacy.
          </p>
        </section>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeCategory === category
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
                  : "bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800/80"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {filteredTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.id}
                href={tool.href}
                className={`group relative p-6 rounded-2xl transition-all flex flex-col justify-between ${
                  tool.featured
                    ? "bg-gradient-to-b from-blue-900/40 via-slate-900 to-slate-900 border-2 border-blue-500/80 shadow-xl shadow-blue-500/10 md:col-span-2 lg:col-span-3"
                    : "bg-slate-900/60 border border-slate-800/80 hover:border-blue-500/50 hover:bg-slate-900"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                        tool.featured
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                          : "bg-blue-500/10 text-blue-400 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white"
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    {tool.badge && (
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold border ${
                          tool.featured
                            ? "bg-blue-500 text-white border-blue-400 animate-pulse"
                            : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        }`}
                      >
                        {tool.badge}
                      </span>
                    )}
                  </div>
                  <h3
                    className={`font-bold mb-2 transition-colors ${
                      tool.featured
                        ? "text-2xl text-white group-hover:text-blue-300"
                        : "text-lg text-white group-hover:text-blue-400"
                    }`}
                  >
                    {tool.name}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">
                    {tool.description}
                  </p>
                </div>

                <div className="flex items-center text-xs font-semibold text-blue-400 group-hover:translate-x-1 transition-transform gap-1">
                  <span>Open Tool</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Feature Highlights Section for SEO */}
        <section id="about-seo" className="mb-20 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/60">
            <Lock className="w-8 h-8 text-blue-500 mb-4" />
            <h3 className="text-lg font-bold mb-2">Zero Server Uploads</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Every document compression, merge, and image editing task happens strictly locally in your browser DOM.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/60">
            <Zap className="w-8 h-8 text-blue-500 mb-4" />
            <h3 className="text-lg font-bold mb-2">Lightning Fast Processing</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Skip waiting for large network uploads or server queues. Process multi-megabyte PDFs in milliseconds.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/60">
            <Globe className="w-8 h-8 text-blue-500 mb-4" />
            <h3 className="text-lg font-bold mb-2">Universal Compatibility</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Built on modern browser standards. Access ToolKraft seamlessly on Mac, Windows, iOS, and Android.
            </p>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faqs" className="max-w-3xl mx-auto mb-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">Frequently Asked Questions</h2>
            <p className="text-slate-400 text-sm">Everything you need to know about ToolKraft privacy and usage.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="rounded-2xl bg-slate-900/60 border border-slate-800/80 overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between font-semibold text-slate-200 hover:text-white transition-colors"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform ${
                      openFaq === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4 text-sm text-slate-400 leading-relaxed border-t border-slate-800/40 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} ToolKraft. Private, client-side web utility suite.</p>
      </footer>
    </div>
  );
}