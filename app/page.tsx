"use client";

import React, { useState } from "react";
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
  Crop,
  FileText,
  Presentation,
  FileSpreadsheet,
  Edit3,
} from "lucide-react";

const allTools = [
  // PDF Suite - Optimize / Organize / Convert
  {
    id: "pdf-compressor",
    title: "PDF Compressor",
    description: "Shrink PDF size to custom KB/MB limits for official portals.",
    icon: FileArchive,
    href: "/tools/pdf-compressor",
    category: "Optimize PDF",
    badge: "Popular",
    color: "blue",
  },
  {
    id: "pdf-merge",
    title: "Merge PDF",
    description: "Combine multiple PDF documents into a single organized file.",
    icon: Combine,
    href: "/tools/pdf-merge",
    category: "Organize PDF",
    badge: "Essential",
    color: "blue",
  },
  {
    id: "pdf-split",
    title: "Split PDF",
    description: "Extract specific pages or page ranges from your PDF.",
    icon: Scissors,
    href: "/tools/pdf-split",
    category: "Organize PDF",
    badge: "Useful",
    color: "blue",
  },
  {
    id: "jpg-to-pdf",
    title: "JPG to PDF",
    description: "Convert JPG, PNG, and WebP images into a clean PDF document.",
    icon: ImageIcon,
    href: "/tools/jpg-to-pdf",
    category: "Convert PDF",
    badge: "New",
    color: "blue",
  },
  {
    id: "pdf-to-word",
    title: "PDF to Word",
    description: "Easily convert your PDF files into editable DOCX documents.",
    icon: FileText,
    href: "/tools/pdf-to-word",
    category: "Convert PDF",
    badge: "Pro",
    color: "blue",
  },
  {
    id: "pdf-to-excel",
    title: "PDF to Excel",
    description: "Pull data straight from PDFs into Excel spreadsheets.",
    icon: FileSpreadsheet,
    href: "/tools/pdf-to-excel",
    category: "Convert PDF",
    badge: "New",
    color: "blue",
  },
  {
    id: "pdf-to-ppt",
    title: "PDF to PowerPoint",
    description: "Turn your PDF files into easy to edit PPT slideshows.",
    icon: Presentation,
    href: "/tools/pdf-to-ppt",
    category: "Convert PDF",
    badge: "Useful",
    color: "blue",
  },
  {
    id: "edit-pdf",
    title: "Edit PDF",
    description: "Add text, images, shapes or freehand annotations to a PDF.",
    icon: Edit3,
    href: "/tools/edit-pdf",
    category: "Organize PDF",
    badge: "Hot",
    color: "blue",
  },

  // Image Studio
  {
    id: "image-crop",
    title: "Image Crop & Passport Photo",
    description: "Crop documents, make official passport photos, and adjust colors.",
    icon: Crop,
    href: "/tools/image-crop",
    category: "Image Studio",
    badge: "Pro",
    color: "emerald",
  },
  {
    id: "image-compressor",
    title: "Image Compressor",
    description: "Compress images to exact target KB size without quality loss.",
    icon: Sparkles,
    href: "/tools/image-compressor",
    category: "Image Studio",
    badge: "Hot",
    color: "emerald",
  },
  {
    id: "image-resizer",
    title: "Image Resizer",
    description: "Resize image dimensions in pixels or percentage for forms.",
    icon: Maximize2,
    href: "/tools/image-resizer",
    category: "Image Studio",
    badge: "Useful",
    color: "emerald",
  },
  {
    id: "png-to-jpg",
    title: "PNG to JPG",
    description: "Convert PNG images directly into crisp JPG files.",
    icon: FileImage,
    href: "/tools/png-to-jpg",
    category: "Image Studio",
    badge: "Fast",
    color: "emerald",
  },
  {
    id: "pdf-to-image",
    title: "PDF to Image",
    description: "Extract high-resolution JPG images page-by-page from any PDF.",
    icon: Layers,
    href: "/tools/pdf-to-image",
    category: "Image Studio",
    badge: "New",
    color: "emerald",
  },
];

const categories = ["All", "Organize PDF", "Optimize PDF", "Convert PDF", "Image Studio"];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredTools =
    selectedCategory === "All"
      ? allTools
      : allTools.filter((t) => t.category === selectedCategory);

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-[#030712] text-slate-900 dark:text-slate-100 font-sans tracking-tight antialiased">
      <Navbar />

      <main className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        
        {/* Hero Banner */}
        <div className="text-center space-y-4 max-w-3xl mx-auto pt-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <Zap className="w-3.5 h-3.5 fill-current" /> Every tool you need in one place
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
            Fast, Private & Powerful <br />
            <span className="text-blue-600 dark:text-blue-500">Web Utility Tools</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            Merge, split, compress, convert, crop and edit PDFs and images with just a few clicks. 100% free with zero server logs.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-1 text-xs font-bold text-slate-600 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> 100% Secure
            </span>
            <span className="flex items-center gap-1.5">
              <ServerOff className="w-4 h-4 text-blue-500" /> Zero Server Logs
            </span>
          </div>
        </div>

        {/* Filter Category Tabs (iLovePDF Style) */}
        <div className="flex items-center justify-center gap-2 flex-wrap pt-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full text-xs font-extrabold transition-all duration-200 border ${
                selectedCategory === cat
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent shadow-md scale-105"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-blue-500/40"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
          {filteredTools.map((tool) => {
            const Icon = tool.icon;
            const isEmerald = tool.color === "emerald";

            return (
              <Link
                key={tool.id}
                href={tool.href}
                className={`group relative bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 transition-all duration-300 hover:shadow-xl ${
                  isEmerald ? "hover:border-emerald-500/50" : "hover:border-blue-500/50"
                } flex flex-col justify-between space-y-6`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform ${
                        isEmerald
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {tool.badge}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h3
                      className={`text-lg font-bold text-slate-900 dark:text-white transition-colors ${
                        isEmerald
                          ? "group-hover:text-emerald-600 dark:group-hover:text-emerald-400"
                          : "group-hover:text-blue-600 dark:group-hover:text-blue-400"
                      }`}
                    >
                      {tool.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {tool.description}
                    </p>
                  </div>
                </div>

                <div
                  className={`flex items-center gap-1 text-xs font-bold group-hover:translate-x-1 transition-transform ${
                    isEmerald
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-blue-600 dark:text-blue-400"
                  }`}
                >
                  <span>Open Tool</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            );
          })}
        </div>

      </main>
    </div>
  );
}