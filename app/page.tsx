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
  Lock,
  Zap,
  Globe,
  Search,
  Presentation,
  FileSpreadsheet,
  Code,
  Shield,
  LayoutGrid,
  QrCode,
  Calculator,
  CaseSensitive,
} from "lucide-react";

type Category = "All" | "PDF Tools" | "Image Studio" | "Converters" | "Calculators & Utilities";

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
  // --- Image Studio ---
  {
    id: "image-resizer",
    name: "Govt Form Image Resizer",
    description: "Resize photos by KB/MB limits and dimensions (PX, CM, MM, IN) for Govt exam forms.",
    icon: Maximize2,
    href: "/tools/image-resizer",
    category: ["All", "Image Studio"],
    badge: "Featured",
  },
  {
    id: "image-crop",
    name: "Photo Editor & Crop",
    description: "Crop photos, adjust aspect ratio, apply filters, or edit passport photos.",
    icon: Crop,
    href: "/tools/image-crop",
    category: ["All", "Image Studio"],
    badge: "Featured",
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
    id: "png-to-jpg",
    name: "PNG to JPG Converter",
    description: "Convert transparent or heavy PNG files into lightweight JPG format.",
    icon: ImageIcon,
    href: "/tools/png-to-jpg",
    category: ["All", "Converters", "Image Studio"],
  },

  // --- PDF Tools & Utilities ---
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
    badge: "Popular",
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
    id: "pdf-organize",
    name: "Organize PDF Pages",
    description: "Rotate, reorder, or delete specific pages from your PDF documents.",
    icon: LayoutGrid,
    href: "/tools/pdf-organize",
    category: ["All", "PDF Tools"],
  },
  {
    id: "pdf-protect",
    name: "Protect PDF",
    description: "Encrypt and lock your sensitive PDF documents with custom passwords.",
    icon: Lock,
    href: "/tools/pdf-protect",
    category: ["All", "PDF Tools"],
  },

  // --- Converters: To PDF ---
  {
    id: "jpg-to-pdf",
    name: "JPG to PDF",
    description: "Turn your photos, scans, and images into formatted PDF files.",
    icon: FileType,
    href: "/tools/jpg-to-pdf",
    category: ["All", "Converters"],
  },
  {
    id: "word-to-pdf",
    name: "Word to PDF",
    description: "Convert Microsoft Word (.docx) documents into clean PDF files.",
    icon: FileText,
    href: "/tools/word-to-pdf",
    category: ["All", "Converters"],
  },
  {
    id: "powerpoint-to-pdf",
    name: "PowerPoint to PDF",
    description: "Turn PPTX presentation slides into formatted PDF files.",
    icon: Presentation,
    href: "/tools/powerpoint-to-pdf",
    category: ["All", "Converters"],
  },
  {
    id: "excel-to-pdf",
    name: "Excel to PDF",
    description: "Convert Excel spreadsheets (.xlsx) to readable PDF tables.",
    icon: FileSpreadsheet,
    href: "/tools/excel-to-pdf",
    category: ["All", "Converters"],
  },
  {
    id: "html-to-pdf",
    name: "HTML to PDF",
    description: "Render web pages or raw HTML code into standard PDF files.",
    icon: Code,
    href: "/tools/html-to-pdf",
    category: ["All", "Converters"],
  },

  // --- Converters: From PDF ---
  {
    id: "pdf-to-image",
    name: "PDF to Image",
    description: "Render and download PDF pages as sharp PNG or JPG images.",
    icon: ImageIcon,
    href: "/tools/pdf-to-image",
    category: ["All", "Converters"],
  },
  {
    id: "pdf-to-word",
    name: "PDF to Word",
    description: "Extract text and tables from PDFs into editable Word (.docx) files.",
    icon: FileText,
    href: "/tools/pdf-to-word",
    category: ["All", "Converters"],
  },
  {
    id: "pdf-to-powerpoint",
    name: "PDF to PowerPoint",
    description: "Convert PDF documents into editable presentation slides.",
    icon: Presentation,
    href: "/tools/pdf-to-powerpoint",
    category: ["All", "Converters"],
  },
  {
    id: "pdf-to-excel",
    name: "PDF to Excel",
    description: "Extract tabular data from PDF files directly into Excel spreadsheets.",
    icon: FileSpreadsheet,
    href: "/tools/pdf-to-excel",
    category: ["All", "Converters"],
  },
  {
    id: "pdf-to-pdfa",
    name: "PDF to PDF/A",
    description: "Convert standard PDF files into ISO-compliant long-term archival format.",
    icon: Shield,
    href: "/tools/pdf-to-pdfa",
    category: ["All", "Converters", "PDF Tools"],
  },

  // --- Calculators & Utilities ---
  {
    id: "qr-code-generator",
    name: "QR Code Generator",
    description: "Create custom downloadable high-resolution QR codes instantly.",
    icon: QrCode,
    href: "/tools/qr-code-generator",
    category: ["All", "Calculators & Utilities"],
  },
  {
    id: "sip-calculator",
    name: "SIP Return Calculator",
    description: "Calculate expected mutual fund returns and total wealth growth.",
    icon: Calculator,
    href: "/tools/sip-calculator",
    category: ["All", "Calculators & Utilities"],
  },
  {
    id: "percentage-calculator",
    name: "Percentage Calculator",
    description: "Quick calculations for marks, percentage differences, and discounts.",
    icon: Calculator,
    href: "/tools/percentage-calculator",
    category: ["All", "Calculators & Utilities"],
  },
  {
    id: "text-case-converter",
    name: "Text Case Converter",
    description: "Convert text into UPPERCASE, lowercase, Title Case, camelCase, and more.",
    icon: CaseSensitive,
    href: "/tools/text-case-converter",
    category: ["All", "Calculators & Utilities"],
  },
];

const categories: Category[] = [
  "All",
  "PDF Tools",
  "Image Studio",
  "Converters",
  "Calculators & Utilities",
];

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
            <Link href="#privacy" className="hover:text-emerald-400 transition-colors">Security</Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Hero Section */}
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
              placeholder="Search tools (e.g. photo editor, compress pdf, word to pdf, resize image)..."
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

        {/* Layout Grid */}
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

      </main>

      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500 bg-[#070a11]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} ToolKraft. Client-side browser utilities.</p>
        </div>
      </footer>
    </div>
  );
}