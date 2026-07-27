"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { ToolCard } from "@/components/ui/ToolCard";
import { CATEGORIES, ALL_TOOLS } from "@/lib/tools-registry";
import {
  Search,
  ShieldCheck,
  Zap,
  Cpu,
  Lock,
  Globe2,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function BillionDollarHomePage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTools = ALL_TOOLS.filter((tool) => {
    const matchesCategory = selectedCategory === "all" || tool.category === selectedCategory;
    const matchesSearch =
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white dark:bg-[#030712] text-slate-900 dark:text-slate-100 font-sans tracking-tight antialiased selection:bg-blue-600 selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 overflow-hidden">
        {/* Background Glow Orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-b from-blue-500/10 via-purple-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-center">
          
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-blue-600 dark:text-blue-400 shadow-xs"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            100% Client-Side Privacy • Zero Server Uploads
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.08] text-slate-900 dark:text-white max-w-4xl mx-auto"
          >
            Every digital tool you need. <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Built for speed & privacy.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed"
          >
            Professional-grade PDF, Image, AI, and Developer utilities. Process files instantly in your browser without latency or privacy compromises.
          </motion.p>

          {/* Search Bar Input */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-xl mx-auto pt-4"
          >
            <div className="relative group">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5 group-focus-within:text-blue-600 transition-colors" />
              <input
                type="text"
                placeholder="Search 100+ utilities (e.g. compress pdf, passport maker, ocr)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 text-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 shadow-lg shadow-slate-200/50 dark:shadow-none transition-all"
              />
            </div>
          </motion.div>

        </div>
      </section>

      {/* Main Workspace Section */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pb-28 space-y-8">
        
        {/* Category Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200/80 dark:border-slate-800">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                    : "bg-slate-100 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Tools Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredTools.map((tool, idx) => (
            <ToolCard key={tool.id} tool={tool} index={idx} />
          ))}
        </div>

        {filteredTools.length === 0 && (
          <div className="text-center py-16 space-y-3">
            <p className="text-base font-bold text-slate-700 dark:text-slate-300">No utility found matching "{searchQuery}"</p>
            <p className="text-xs text-slate-500">Try searching for "PDF", "Compress", or "Image Studio".</p>
          </div>
        )}

      </section>

      {/* Feature Highlights Section */}
      <section className="border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 py-20">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Why Engineers & Professionals Choose ToolNova
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Architecture engineered for privacy, zero latency, and production reliability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-xs">
              <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 w-fit">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">100% Local Browser Engine</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Your PDF and image files never leave your device. All calculations, compression, and image rendering happen client-side.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-xs">
              <div className="p-3 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 w-fit">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Zero Latency Executions</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                No server queues or upload delays. Enjoy instant output rendering powered by WebAssembly and client-side workers.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-xs">
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 w-fit">
                <Globe2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Unlimited Free Access</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                No subscription traps, no hidden file limits, and no intrusive watermarks. Built to remain genuinely free forever.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#030712] py-8 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} ToolNova Engineering. Built with Next.js 16 & Tailwind v4.</p>
          <div className="flex items-center gap-6 font-semibold">
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" /> Systems Operational
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}