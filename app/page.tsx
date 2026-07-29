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
  Search,
  Sparkles,
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
  featured?: boolean;
}

const tools: Tool[] = [
  {
    id: "pdf-compressor",
    name: "PDF Compressor",
    description: "Reduce PDF file size without losing quality locally in your browser.",
    icon: Minimize2,
    href: "/tools/pdf-compressor",
    category: ["All", "Optimize"],
    badge: "Most Used",
    featured: true,
  },
  {
    id: "pdf-merge",
    name: "PDF Merger",
    description: "Combine multiple PDF documents into a single organized file seamlessly.",
    icon: Combine,
    href: "/tools/pdf-merge",
    category: ["All", "Organize"],
    badge: "Popular",
    featured: true,
  },
  {
    id: "pdf-split",
    name: "PDF Splitter",
    description: "Extract specific pages or split large PDFs into individual clean files.",
    icon: Scissors,
    href: "/tools/pdf-split",
    category: ["All", "Organize"],
  },
  {
    id: "jpg-to-pdf",
    name: "JPG to PDF Converter",
    description: "Convert images and photos into high-quality PDF documents in seconds.",
    icon: FileType,
    href: "/tools/jpg-to-pdf",
    category: ["All", "Convert"],
  },
  {
    id: "image-compressor",
    name: "Image Compressor",
    description: "Optimize and reduce WebP, PNG & JPG sizes maintaining crisp quality.",
    icon: Minimize2,
    href: "/tools/image-compressor",
    category: ["All", "Optimize", "Image Studio"],
  },
  {
    id: "image-resizer",
    name: "Image Resizer",
    description: "Resize dimensions of PNG or JPG images by exact pixels or percentage.",
    icon: Maximize2,
    href: "/tools/image-resizer",
    category: ["All", "Optimize", "Image Studio"],
  },
  {
    id: "png-to-jpg",
    name: "PNG to JPG Converter",
    description: "Quickly convert transparent PNG images to light standard JPG format.",
    icon: ImageIcon,
    href: "/tools/png-to-jpg",
    category: ["All", "Convert", "Image Studio"],
  },
  {
    id: "pdf-to-image",
    name: "PDF to Image Extractor",
    description: "Render PDF pages into high-resolution standalone PNG or JPG files.",
    icon: FileText,
    href: "/tools/pdf-to-image",
    category: ["All", "Convert"],
  },
  {
    id: "image-crop",
    name: "Passport & Photo Cropper",
    description: "Crop photos to custom ratios or standard official passport dimensions.",
    icon: Crop,
    href: "/tools/image-crop",
    category: ["All", "Image Studio"],
  },
];

const categories: Category[] = [
  "All",
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
    question: "Are my files uploaded to any server?",
    answer:
      "No. ToolKraft operates entirely on client-side Web APIs in your browser. Your files never leave your computer or phone.",
  },
  {
    question: "Do I need to create an account?",
    answer:
      "No registration required! You can instantly access and process all PDF and image tools right away.",
  },
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const filteredTools = tools.filter((tool) => {
    const matchesCategory =
      activeCategory === "All" || tool.category.includes(activeCategory);
    const matchesSearch =
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      {/* Glow Ambient background lights */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] bg-gradient-to-b from-blue-600/10 via-indigo-600/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#07090e]/80 border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 font-black text-xl tracking-tight group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center font-black text-sm shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent text-2xl font-black">
              ToolKraft
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <Link href="#tools-section" className="hover:text-blue-400 transition-colors">
              All Tools
            </Link>
            <Link href="#features" className="hover:text-blue-400 transition-colors">
              Why Us
            </Link>
            <Link href="#faqs" className="hover:text-blue-400 transition-colors">
              FAQ
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto mb-16 pt-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-6 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-blue-400" /> 100% Secure & Client-Side Processing
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6 leading-tight">
            Next-Gen Tools for Your <br className="hidden sm:block"/>
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              PDFs & Images
            </span>
          </h1>
          
          <p className="text-slate-400 text-base sm:text-lg mb-8 leading-relaxed max-w-2xl mx-auto">
            Lightweight, ultra-fast online utilities built for maximum privacy. No server uploads, no waiting line—everything runs inside your browser.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto mb-8">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-500" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tools (e.g., Compressor, Merger, Crop)..."
              className="w-full pl-11 pr-4 py-3.5 bg-slate-900/90 border border-slate-800 rounded-2xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-xl text-sm"
            />
          </div>
        </section>

        {/* Category Filter Tabs */}
        <section id="tools-section" className="mb-10">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  activeCategory === category
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-105"
                    : "bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800/60"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        {/* Tools Grid Section */}
        <section className="mb-24">
          {filteredTools.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <p className="text-lg">No tools found matching your query.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <Link
                    key={tool.id}
                    href={tool.href}
                    className="group relative p-7 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800/80 hover:border-blue-500/40 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 flex flex-col justify-between overflow-hidden"
                  >
                    {/* Corner subtle hover highlight */}
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all" />

                    <div>
                      <div className="flex items-center justify-between mb-5">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-md">
                          <Icon className="w-6 h-6" />
                        </div>
                        {tool.badge && (
                          <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            {tool.badge}
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors mb-2.5">
                        {tool.name}
                      </h3>

                      <p className="text-slate-400 text-sm leading-relaxed mb-6">
                        {tool.description}
                      </p>
                    </div>

                    <div className="flex items-center text-xs font-bold text-blue-400 group-hover:text-blue-300 gap-1.5 pt-4 border-t border-slate-800/40">
                      <span>Open Utility</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* Feature Highlights Section */}
        <section id="features" className="mb-24 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-sm">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-6">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-3 text-white">100% Local Privacy</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Your files never leave your device. All conversions and processing happen directly inside your web browser.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-sm">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-6">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-3 text-white">Blazing Fast Speed</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              No uploading delays or server wait times. Instant execution powered by modern browser APIs.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-sm">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 mb-6">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-3 text-white">No Signup Needed</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Instant access without registration or subscriptions. Works smoothly across Desktop, Mobile, & Tablets.
            </p>
          </div>
        </section>

        {/* FAQ Accordion Section */}
        <section id="faqs" className="max-w-3xl mx-auto mb-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black mb-3">Frequently Asked Questions</h2>
            <p className="text-slate-400 text-sm">Everything you need to know about ToolKraft speed and security.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="rounded-2xl bg-slate-900/50 border border-slate-800/80 overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between font-semibold text-slate-200 hover:text-white transition-colors"
                >
                  <span className="text-base">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
                      openFaq === index ? "rotate-180 text-blue-400" : ""
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-5 text-sm text-slate-400 leading-relaxed border-t border-slate-800/50 pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 py-8 text-center text-sm text-slate-500 bg-[#05070a]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} ToolKraft. All utilities run 100% client-side.</p>
          <div className="flex gap-6 text-xs text-slate-400">
            <span>Fast</span> • <span>Private</span> • <span>Free</span>
          </div>
        </div>
      </footer>
    </div>
  );
}