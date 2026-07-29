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
  Users,
  Activity,
  CheckCircle2,
} from "lucide-react";

type Category = "All" | "PDF Tools" | "Image Studio" | "Converters";

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
    description: "Ultra-fast browser compression. Shrink PDFs without losing clarity.",
    icon: Minimize2,
    href: "/tools/pdf-compressor",
    category: ["All", "PDF Tools"],
    badge: "Popular",
  },
  {
    id: "pdf-merge",
    name: "PDF Merger",
    description: "Combine multiple PDF documents into a single clean PDF instantly.",
    icon: Combine,
    href: "/tools/pdf-merge",
    category: ["All", "PDF Tools"],
  },
  {
    id: "pdf-split",
    name: "PDF Splitter",
    description: "Extract specific pages or break large documents into individual files.",
    icon: Scissors,
    href: "/tools/pdf-split",
    category: ["All", "PDF Tools"],
  },
  {
    id: "jpg-to-pdf",
    name: "JPG to PDF",
    description: "Turn your photos, scans, and images into formatted PDF files.",
    icon: FileType,
    href: "/tools/jpg-to-pdf",
    category: ["All", "Converters"],
  },
  {
    id: "image-compressor",
    name: "Image Compressor",
    description: "Reduce WebP, PNG & JPG file sizes locally inside your browser.",
    icon: Minimize2,
    href: "/tools/image-compressor",
    category: ["All", "Image Studio"],
  },
  {
    id: "image-resizer",
    name: "Image Resizer",
    description: "Change pixel dimensions or scale images by exact percentages.",
    icon: Maximize2,
    href: "/tools/image-resizer",
    category: ["All", "Image Studio"],
  },
  {
    id: "png-to-jpg",
    name: "PNG to JPG Converter",
    description: "Convert transparent or heavy PNG files into light JPG format.",
    icon: ImageIcon,
    href: "/tools/png-to-jpg",
    category: ["All", "Converters", "Image Studio"],
  },
  {
    id: "pdf-to-image",
    name: "PDF to Image",
    description: "Render and download PDF pages as sharp PNG or JPG images.",
    icon: FileText,
    href: "/tools/pdf-to-image",
    category: ["All", "Converters"],
  },
  {
    id: "image-crop",
    name: "Passport & Photo Crop",
    description: "Crop pictures to custom aspect ratios or official passport sizes.",
    icon: Crop,
    href: "/tools/image-crop",
    category: ["All", "Image Studio"],
  },
];

const categories: Category[] = ["All", "PDF Tools", "Image Studio", "Converters"];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTools = tools.filter((tool) => {
    const matchesCategory =
      activeCategory === "All" || tool.category.includes(activeCategory);
    const matchesSearch =
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans">
      {/* Background Accent Gradients */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[350px] bg-gradient-to-b from-blue-600/15 via-emerald-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Modern Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#090d16]/80 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 font-bold text-xl tracking-tight">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-emerald-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20">
              <Wrench className="w-5 h-5 text-slate-950" />
            </div>
            <span className="text-white font-extrabold text-2xl tracking-wide">
              Tool<span className="text-emerald-400">Kraft</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
            <Link href="#tools-list" className="hover:text-emerald-400 transition-colors">Tools</Link>
            <Link href="#stats" className="hover:text-emerald-400 transition-colors">Stats</Link>
            <Link href="#privacy" className="hover:text-emerald-400 transition-colors">Security</Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* New Hero Section */}
        <section className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-6">
            <ShieldCheck className="w-4 h-4" /> 100% Private Browser Utilities
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-5 leading-tight text-white">
            Fast, Free & Private <br />
            <span className="bg-gradient-to-r from-blue-400 via-emerald-400 to-teal-300 bg-clip-text text-transparent">
              Document & Image Toolkit
            </span>
          </h1>

          <p className="text-slate-400 text-base sm:text-lg mb-8 max-w-xl mx-auto">
            Process files right inside your browser with maximum speed. Zero server uploads.
          </p>

          {/* Search Box */}
          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tools (e.g. compress pdf, resize image)..."
              className="w-full pl-12 pr-4 py-3 bg-slate-900/90 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all text-sm shadow-xl"
            />
          </div>
        </section>

        {/* Category Filters */}
        <section id="tools-list" className="mb-8">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeCategory === category
                    ? "bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20"
                    : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        {/* New Layout Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-20">
          {filteredTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.id}
                href={tool.href}
                className="group p-6 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-emerald-500/50 hover:bg-slate-900 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all">
                      <Icon className="w-5 h-5" />
                    </div>
                    {tool.badge && (
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {tool.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors mb-2">
                    {tool.name}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">
                    {tool.description}
                  </p>
                </div>

                <div className="flex items-center text-xs font-bold text-emerald-400 gap-1 pt-3 border-t border-slate-800/50">
                  <span>Use Tool</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </section>

        {/* Security Highlights */}
        <section id="privacy" className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800/60">
            <Lock className="w-7 h-7 text-emerald-400 mb-3" />
            <h3 className="font-bold text-white mb-1">Local Processing</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Files remain on your device. Everything runs in your browser DOM.
            </p>
          </div>
          <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800/60">
            <Zap className="w-7 h-7 text-emerald-400 mb-3" />
            <h3 className="font-bold text-white mb-1">Instant Output</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Zero network upload delays. Multi-MB files process in milliseconds.
            </p>
          </div>
          <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800/60">
            <Globe className="w-7 h-7 text-emerald-400 mb-3" />
            <h3 className="font-bold text-white mb-1">Always Free</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              No signups, subscriptions, or file limits. Free forever.
            </p>
          </div>
        </section>

        {/* --- VISITOR COUNT & STATS SECTION --- */}
        <section id="stats" className="mb-12 p-6 rounded-2xl bg-gradient-to-r from-slate-900/80 via-slate-900/40 to-slate-900/80 border border-slate-800/80">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            
            {/* Visitors Card */}
            <div className="flex items-center justify-center gap-4 p-4 rounded-xl bg-slate-950/50 border border-slate-800/40">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
                <Users className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-xs text-slate-400 font-medium">Total Visitors</p>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black text-white">24,580+</span>
                  <span className="inline-flex items-center text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                    Live
                  </span>
                </div>
              </div>
            </div>

            {/* Processed Files */}
            <div className="flex items-center justify-center gap-4 p-4 rounded-xl bg-slate-950/50 border border-slate-800/40">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-xs text-slate-400 font-medium">Files Processed</p>
                <p className="text-xl font-black text-white">89,200+</p>
              </div>
            </div>

            {/* Active Users */}
            <div className="flex items-center justify-center gap-4 p-4 rounded-xl bg-slate-950/50 border border-slate-800/40">
              <div className="w-10 h-10 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
                <Activity className="w-5 h-5 animate-pulse" />
              </div>
              <div className="text-left">
                <p className="text-xs text-slate-400 font-medium">Active Now</p>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black text-white">142</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                </div>
              </div>
            </div>

          </div>
        </section>

      </main>

      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500 bg-[#070a11]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} ToolKraft. Client-side browser utilities.</p>
          <div className="flex items-center gap-2 text-slate-400 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            <span>24,580 Visitors Counter</span>
          </div>
        </div>
      </footer>
    </div>
  );
}