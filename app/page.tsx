import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import {
  FileArchive,
  Combine,
  Scissors,
  Image as ImageIcon,
  ArrowRight,
  Zap,
  ShieldCheck,
  ServerOff,
  Maximize2,
  FileImage,
  Layers,
  Sparkles,
} from "lucide-react";

const pdfTools = [
  {
    id: "pdf-compressor",
    title: "PDF Compressor",
    description:
      "Shrink PDF size to custom KB/MB limits for official portals and uploads.",
    icon: FileArchive,
    href: "/tools/pdf-compressor",
    badge: "Popular",
  },
  {
    id: "pdf-merge",
    title: "Merge PDF",
    description:
      "Combine multiple PDF documents into a single organized file.",
    icon: Combine,
    href: "/tools/pdf-merge",
    badge: "Essential",
  },
  {
    id: "pdf-split",
    title: "Split PDF",
    description:
      "Extract specific pages or page ranges from your large PDF file.",
    icon: Scissors,
    href: "/tools/pdf-split",
    badge: "Useful",
  },
  {
    id: "jpg-to-pdf",
    title: "JPG to PDF",
    description:
      "Convert JPG, PNG, and WebP images into a single clean PDF document.",
    icon: ImageIcon,
    href: "/tools/jpg-to-pdf",
    badge: "New",
  },
];

const imageTools = [
  {
    id: "image-compressor",
    title: "Image Compressor",
    description:
      "Compress JPG, PNG, and WebP images to exact target KB size without quality loss.",
    icon: Sparkles,
    href: "/tools/image-compressor",
    badge: "Hot",
  },
  {
    id: "image-resizer",
    title: "Image Resizer",
    description:
      "Resize image dimensions in pixels, percentage, or centimeters for forms.",
    icon: Maximize2,
    href: "/tools/image-resizer",
    badge: "Useful",
  },
  {
    id: "png-to-jpg",
    title: "PNG to JPG",
    description:
      "Convert PNG images with transparent backgrounds directly into crisp JPGs.",
    icon: FileImage,
    href: "/tools/png-to-jpg",
    badge: "Fast",
  },
  {
    id: "pdf-to-image",
    title: "PDF to Image",
    description:
      "Extract high-resolution JPG/PNG images page-by-page from any PDF file.",
    icon: Layers,
    href: "/tools/pdf-to-image",
    badge: "New",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-[#030712] text-slate-900 dark:text-slate-100 font-sans tracking-tight antialiased">
      <Navbar />

      <main className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* Hero Banner */}
        <div className="text-center space-y-4 max-w-3xl mx-auto pt-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <Zap className="w-3.5 h-3.5 fill-current" /> 100% Free Client-Side Utilities
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
            Fast, Private & Powerful <br />
            <span className="text-blue-600 dark:text-blue-500">Web Utility Tools</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Process your PDF and image files directly inside your browser. No file uploads to external servers, maximum privacy, and zero fees.
          </p>

          {/* Privacy Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-xs font-bold text-slate-600 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> 100% Secure
            </span>
            <span className="flex items-center gap-1.5">
              <ServerOff className="w-4 h-4 text-blue-500" /> Zero Server Logs
            </span>
          </div>
        </div>

        {/* Section 1: PDF Utilities */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <FileArchive className="w-5 h-5 text-blue-600" /> PDF Suite
              </h2>
              <p className="text-xs text-slate-500">Compress, merge, split, and convert PDF documents in seconds.</p>
            </div>
            <span className="text-xs font-bold text-slate-400 font-mono">4 Tools</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pdfTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.id}
                  href={tool.href}
                  className="group relative bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 transition-all duration-300 hover:shadow-xl hover:border-blue-500/50 flex flex-col justify-between space-y-6"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {tool.badge}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {tool.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        {tool.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
                    <span>Open Tool</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Section 2: Image Studio Utilities */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-emerald-600" /> Image Studio
              </h2>
              <p className="text-xs text-slate-500">Resize, compress, and reformat image files easily.</p>
            </div>
            <span className="text-xs font-bold text-slate-400 font-mono">4 Tools</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {imageTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.id}
                  href={tool.href}
                  className="group relative bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 transition-all duration-300 hover:shadow-xl hover:border-emerald-500/50 flex flex-col justify-between space-y-6"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {tool.badge}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {tool.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        {tool.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform">
                    <span>Open Tool</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

      </main>
    </div>
  );
}