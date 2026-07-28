"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
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
  Zap,
} from "lucide-react";

type Category = "All" | "Organize" | "Optimize" | "Convert" | "Image Studio";

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: any;
  href: string;
  category: Category[];
  badge?: string;
}

const tools: Tool[] = [
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
    badge: "New",
  },
];

const categories: Category[] = [
  "All",
  "Organize",
  "Optimize",
  "Convert",
  "Image Studio",
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");

  const filteredTools = tools.filter((tool) =>
    tool.category.includes(activeCategory)
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

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
            High-performance browser tools for PDFs & Images. Process your files instantly with complete privacy — nothing ever leaves your device.
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.id}
                href={tool.href}
                className="group relative p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-blue-500/50 hover:bg-slate-900 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <Icon className="w-6 h-6" />
                    </div>
                    {tool.badge && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {tool.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
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
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} ToolKraft. Private, client-side web utility suite.</p>
      </footer>
    </div>
  );
}